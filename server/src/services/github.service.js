import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

function buildGithubClient(token) {
  return axios.create({
    baseURL: env.githubApiBaseUrl,
    headers: {
      Accept: "application/vnd.github+json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

export async function fetchRepoMetadata({ owner, repo, token }) {
  const client = buildGithubClient(token);

  try {
    const response = await client.get(`/repos/${owner}/${repo}`);
    const data = response.data;

    return {
      fullName: data.full_name,
      description: data.description || "",
      defaultBranch: data.default_branch,
      language: data.language,
      stars: data.stargazers_count,
      isPrivate: data.private,
      url: data.html_url,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new AppError(
        "Repository not found. It may be private, misspelled, or you may need to add a GitHub token to access it.",
        404
      );
    }
    if (error.response?.status === 403) {
      throw new AppError(
        "GitHub API rate limit exceeded. Add a GitHub token to increase your limit, or try again later.",
        403
      );
    }
    if (error.response?.status === 401) {
      throw new AppError(
        "Your saved GitHub token is invalid or expired. Please update it in settings.",
        401
      );
    }
    throw new AppError("Failed to fetch repository from GitHub.", 502);
  }
}

const INDEXABLE_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".go", ".rb",
  ".php", ".c", ".cpp", ".h", ".hpp", ".cs", ".rs", ".swift",
  ".kt", ".md", ".json", ".yaml", ".yml",
]);

const EXCLUDED_PATH_SEGMENTS = [
  "node_modules/", ".git/", "dist/", "build/", "vendor/",
  "venv/", ".venv/", "__pycache__/", "coverage/", ".next/",
];

const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500KB
const MAX_FILES_TO_INDEX = 100;

function isIndexableFile(path, sizeBytes) {
  const extension = path.slice(path.lastIndexOf("."));
  if (!INDEXABLE_EXTENSIONS.has(extension)) return false;
  if (sizeBytes > MAX_FILE_SIZE_BYTES) return false;
  if (EXCLUDED_PATH_SEGMENTS.some((segment) => path.includes(segment))) {
    return false;
  }
  return true;
}

export async function fetchRepoFileTree({ owner, repo, branch, token }) {
  const client = buildGithubClient(token);

  try {
    const response = await client.get(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    const allFiles = response.data.tree.filter((item) => item.type === "blob");

    const indexableFiles = allFiles.filter((item) =>
      isIndexableFile(item.path, item.size || 0)
    );

    return indexableFiles.slice(0, MAX_FILES_TO_INDEX).map((item) => ({
      path: item.path,
      sha: item.sha,
    }));
  } catch (error) {
    if (error.response?.status === 404) {
      throw new AppError("Could not fetch repository file tree.", 404);
    }
    throw new AppError("Failed to fetch repository structure from GitHub.", 502);
  }
}

export async function fetchFileContent({ owner, repo, sha, token }) {
  const client = buildGithubClient(token);

  try {
    const response = await client.get(
      `/repos/${owner}/${repo}/git/blobs/${sha}`
    );

    const { content, encoding } = response.data;

    if (encoding !== "base64") {
      return null;
    }

    return Buffer.from(content, "base64").toString("utf-8");
  } catch (error) {
    return null;
  }
}