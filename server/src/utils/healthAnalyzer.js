const CONFIG_FILE_SIGNALS = [
  "docker-compose.yml", "Dockerfile", "tsconfig.json", "babel.config.js",
  ".eslintrc", ".eslintrc.json", ".eslintrc.js", ".prettierrc",
  "webpack.config.js", "vite.config.js", "jest.config.js", ".env.example",
];

const TODO_PATTERN = /\b(TODO|FIXME)\b/g;
const HOTSPOT_FILE_THRESHOLD = 8;

export function detectConfigFiles(allFilePaths) {
  const found = new Set();

  for (const path of allFilePaths) {
    const fileName = path.split("/").pop();
    if (CONFIG_FILE_SIGNALS.includes(fileName)) {
      found.add(fileName);
    }
    if (path.includes(".github/workflows/")) {
      found.add("CI workflow (.github/workflows)");
    }
  }

  return Array.from(found);
}

export function countTodos(scannedContents) {
  let count = 0;
  for (const content of scannedContents) {
    if (!content) continue;
    const matches = content.match(TODO_PATTERN);
    if (matches) count += matches.length;
  }
  return count;
}

export function computeLargestModules(modules, limit = 5) {
  return modules
    .slice()
    .sort((a, b) => b.files.length - a.files.length)
    .slice(0, limit)
    .map((m) => ({ path: m.path, fileCount: m.files.length }));
}

export function computeComplexityHotspots(modules, threshold = HOTSPOT_FILE_THRESHOLD) {
  return modules
    .filter((m) => m.files.length >= threshold)
    .map((m) => ({ path: m.path, fileCount: m.files.length }));
}