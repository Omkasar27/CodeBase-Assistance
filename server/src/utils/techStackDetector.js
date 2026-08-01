const EXTENSION_LANGUAGE_MAP = {
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".py": "Python",
  ".java": "Java",
  ".go": "Go",
  ".rb": "Ruby",
  ".php": "PHP",
  ".cs": "C#",
  ".cpp": "C++",
  ".c": "C",
  ".rs": "Rust",
  ".kt": "Kotlin",
};

const FRAMEWORK_SIGNALS = {
  "package.json": (content) => {
    const frameworks = [];
    try {
      const pkg = JSON.parse(content);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.react) frameworks.push("React");
      if (deps.vue) frameworks.push("Vue");
      if (deps.express) frameworks.push("Express");
      if (deps.next) frameworks.push("Next.js");
      if (deps["@nestjs/core"]) frameworks.push("NestJS");
      if (deps.fastify) frameworks.push("Fastify");
    } catch {
      // malformed package.json — skip framework detection for this file
    }
    return frameworks;
  },
  "requirements.txt": (content) => {
    const frameworks = [];
    const lower = content.toLowerCase();
    if (lower.includes("django")) frameworks.push("Django");
    if (lower.includes("flask")) frameworks.push("Flask");
    if (lower.includes("fastapi")) frameworks.push("FastAPI");
    return frameworks;
  },
};

export function detectTechStack(allFilePaths, manifestFiles) {
  const languageCounts = {};

  for (const path of allFilePaths) {
    const ext = path.slice(path.lastIndexOf("."));
    const lang = EXTENSION_LANGUAGE_MAP[ext];
    if (lang) {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    }
  }

  const languages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  const frameworks = new Set();
  const packageManagers = new Set();

  for (const { path, content } of manifestFiles) {
    if (!content) continue;
    const fileName = path.split("/").pop();

    if (fileName === "package.json") packageManagers.add("npm");
    if (fileName === "requirements.txt") packageManagers.add("pip");
    if (fileName === "Gemfile") packageManagers.add("bundler");
    if (fileName === "Cargo.toml") packageManagers.add("cargo");
    if (fileName === "go.mod") packageManagers.add("go modules");

    const detector = FRAMEWORK_SIGNALS[fileName];
    if (detector) {
      detector(content).forEach((f) => frameworks.add(f));
    }
  }

  return {
    languages,
    frameworks: Array.from(frameworks),
    packageManagers: Array.from(packageManagers),
  };
}