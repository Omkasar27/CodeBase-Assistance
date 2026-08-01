import RepositoryInsight from "../models/repositoryInsight.model.js";
import User from "../models/user.model.js";
import { getRepositoryById } from "./repo.service.js";
import { fetchRepoFileTree, fetchFileContent } from "./github.service.js";
import { generateSummary } from "./aiServiceClient.js";
import { detectTechStack } from "../utils/techStackDetector.js";
import { decrypt } from "../utils/encryption.js";
import { getIO } from "../sockets/socketManager.js";
import { AppError } from "../utils/AppError.js";
import { detectModules } from "../utils/moduleDetector.js";
import { generateArchitecture } from "./aiServiceClient.js";
import { selectRouteFiles, detectApiRoutes } from "../utils/apiRouteDetector.js";
import { generateRouteDescriptions } from "./aiServiceClient.js";
import { generateRoadmap } from "./aiServiceClient.js";
import { detectConfigFiles, countTodos, computeLargestModules, computeComplexityHotspots } from "../utils/healthAnalyzer.js";


const ENTRY_POINT_NAMES = [
  "index.js", "index.ts", "main.py", "app.js", "app.py",
  "server.js", "main.go", "main.rs", "Program.cs",
];


const MANIFEST_FILENAMES = [
  "package.json",
  "requirements.txt",
  "pom.xml",
  "go.mod",
  "Gemfile",
  "Cargo.toml",
];

async function getDecryptedTokenForUser(userId) {
  const user = await User.findById(userId).select("+githubToken");
  if (!user?.githubToken) return null;
  return decrypt(user.githubToken);
}

function emitProgress(repoId, event, payload) {
  getIO().to(`repo:${repoId}`).emit(event, payload);
}

export async function triggerAnalysis(userId, repoId) {
  const repository = await getRepositoryById(userId, repoId);

  const insight = await RepositoryInsight.findOneAndUpdate(
    { repository: repoId },
    { repository: repoId, owner: userId, status: "analyzing", error: null },
    { upsert: true, new: true }
  );

  // Fire-and-forget: don't await this. The HTTP response returns immediately;
  // progress is reported over WebSockets, and errors are caught internally.
  runAnalysis(userId, repoId, repository).catch((err) => {
    console.error(`Analysis pipeline crashed for repo ${repoId}:`, err);
  });

  return insight;
}

async function runAnalysis(userId, repoId, repository) {
  try {
    const token = await getDecryptedTokenForUser(userId);

    // --- Step 1: Tech Stack ---
    emitProgress(repoId, "insight:progress", { step: "tech_stack", status: "running" });

    const fileList = await fetchRepoFileTree({
      owner: repository.githubOwner,
      repo: repository.githubRepoName,
      branch: repository.defaultBranch,
      token,
    });

    const manifestFiles = fileList.filter((f) =>
      MANIFEST_FILENAMES.some((name) => f.path.endsWith(name))
    );

    const manifestContents = await Promise.all(
      manifestFiles.map(async (file) => ({
        path: file.path,
        content: await fetchFileContent({
          owner: repository.githubOwner,
          repo: repository.githubRepoName,
          sha: file.sha,
          token,
        }),
      }))
    );

    const techStack = detectTechStack(
      fileList.map((f) => f.path),
      manifestContents
    );

    await RepositoryInsight.findOneAndUpdate({ repository: repoId }, { techStack });
    emitProgress(repoId, "insight:progress", {
      step: "tech_stack",
      status: "completed",
      data: techStack,
    });

    // --- Step 2: Summary ---
    emitProgress(repoId, "insight:progress", { step: "summary", status: "running" });

    const readmeFile = fileList.find((f) => f.path.toLowerCase().includes("readme"));
    let readmeContent = "";
    if (readmeFile) {
      readmeContent =
        (await fetchFileContent({
          owner: repository.githubOwner,
          repo: repository.githubRepoName,
          sha: readmeFile.sha,
          token,
        })) || "";
    }

    const summary = await generateSummary({
      repoName: repository.fullName,
      description: repository.description,
      readmeContent,
      techStack,
    });

    await RepositoryInsight.findOneAndUpdate({ repository: repoId }, { summary });
    emitProgress(repoId, "insight:progress", {
      step: "summary",
      status: "completed",
      data: { summary },
    });

    // --- Step 3: Architecture + Modules ---
    emitProgress(repoId, "insight:progress", { step: "architecture", status: "running" });

    const modules = detectModules(fileList.map((f) => f.path));
    const entryPoints = fileList
      .map((f) => f.path)
      .filter((p) => ENTRY_POINT_NAMES.some((name) => p.endsWith(name)));

    const architectureResult = await generateArchitecture({
      repoName: repository.fullName,
      techStack,
      entryPoints,
      modules,
    });

    await RepositoryInsight.findOneAndUpdate(
      { repository: repoId },
      {
        architectureOverview: architectureResult.architecture_overview,
        modules: architectureResult.modules,
      }
    );
    emitProgress(repoId, "insight:progress", {
      step: "architecture",
      status: "completed",
      data: architectureResult,
    });

    // --- Step 4: API Routes ---
    emitProgress(repoId, "insight:progress", { step: "api_routes", status: "running" });

    const routeFilePaths = selectRouteFiles(fileList.map((f) => f.path));
    const routeFileEntries = fileList.filter((f) => routeFilePaths.includes(f.path));

    const routeFileContents = await Promise.all(
      routeFileEntries.map(async (file) => ({
        path: file.path,
        content: await fetchFileContent({
          owner: repository.githubOwner,
          repo: repository.githubRepoName,
          sha: file.sha,
          token,
        }),
      }))
    );

    const detectedRoutes = detectApiRoutes(routeFileContents);
    let apiRoutes = detectedRoutes.map((r) => ({ ...r, description: "" }));

    if (detectedRoutes.length > 0) {
      try {
        const descriptions = await generateRouteDescriptions({
          repoName: repository.fullName,
          routes: detectedRoutes,
        });
        apiRoutes = detectedRoutes.map((route, i) => ({
          ...route,
          description: descriptions[i] || "",
        }));
      } catch {
        // Descriptions are a nice-to-have on top of verified route data —
        // if the LLM call fails, we still keep the accurate, factual route list.
      }
    }

    await RepositoryInsight.findOneAndUpdate({ repository: repoId }, { apiRoutes });
    emitProgress(repoId, "insight:progress", {
      step: "api_routes",
      status: "completed",
      data: { apiRoutes },
    });

    // --- Step 5: Learning Roadmap (needs apiRoutes + architectureResult.modules, now available) ---
    emitProgress(repoId, "insight:progress", { step: "roadmap", status: "running" });

    let learningRoadmap = [];
    try {
      learningRoadmap = await generateRoadmap({
        repoName: repository.fullName,
        summary,
        techStack,
        modules: architectureResult.modules,
        apiRoutes,
        entryPoints,
      });
    } catch (err) {
      console.error("Roadmap generation failed:", err.message);
    }

    await RepositoryInsight.findOneAndUpdate({ repository: repoId }, { learningRoadmap });
    emitProgress(repoId, "insight:progress", {
      step: "roadmap",
      status: "completed",
      data: { learningRoadmap },
    });

    emitProgress(repoId, "insight:progress", { step: "health", status: "running" });

    const scannedContents = [
      ...manifestContents.map((f) => f.content),
      ...routeFileContents.map((f) => f.content),
      readmeContent,
    ];

    const healthMetrics = {
      largestModules: computeLargestModules(modules),
      complexityHotspots: computeComplexityHotspots(modules),
      configFiles: detectConfigFiles(fileList.map((f) => f.path)),
      todoCount: countTodos(scannedContents),
      hasReadme: Boolean(readmeFile),
    };

    await RepositoryInsight.findOneAndUpdate({ repository: repoId }, { healthMetrics });
    emitProgress(repoId, "insight:progress", {
      step: "health",
      status: "completed",
      data: { healthMetrics },
    });

    // --- All steps done ---
    await RepositoryInsight.findOneAndUpdate({ repository: repoId }, { status: "completed" });
    emitProgress(repoId, "insight:completed", {});
  } catch (error) {
    await RepositoryInsight.findOneAndUpdate(
      { repository: repoId },
      { status: "failed", error: error.message || "Analysis failed unexpectedly." }
    );
    emitProgress(repoId, "insight:failed", { message: error.message });
  }
}

export async function getInsights(userId, repoId) {
  await getRepositoryById(userId, repoId);

  const insight = await RepositoryInsight.findOne({ repository: repoId });
  if (!insight) {
    throw new AppError("No analysis has been run for this repository yet.", 404);
  }
  return insight;
}