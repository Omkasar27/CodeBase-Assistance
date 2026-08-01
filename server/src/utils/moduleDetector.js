const SOURCE_ROOTS = ["src", "app", "lib"];
const EXCLUDED_SEGMENTS = [
  "node_modules/", ".git/", "dist/", "build/", "vendor/",
  "venv/", ".venv/", "__pycache__/", "coverage/", ".next/", "test/", "tests/",
];
const MAX_FILES_PER_MODULE = 15;
const MAX_MODULES = 12;

function isExcluded(path) {
  return EXCLUDED_SEGMENTS.some((seg) => path.includes(seg));
}

export function detectModules(allFilePaths) {
  const validPaths = allFilePaths.filter((p) => !isExcluded(p));

  let root = "";
  for (const candidate of SOURCE_ROOTS) {
    if (validPaths.some((p) => p.startsWith(`${candidate}/`))) {
      root = candidate;
      break;
    }
  }

  const scopedPaths = root
    ? validPaths.filter((p) => p.startsWith(`${root}/`))
    : validPaths;

  const moduleMap = new Map();

  for (const path of scopedPaths) {
    const relative = root ? path.slice(root.length + 1) : path;
    const segments = relative.split("/");

    if (segments.length < 2) continue; // a top-level file, not inside a folder

    const moduleName = segments[0];
    const modulePath = root ? `${root}/${moduleName}` : moduleName;

    if (!moduleMap.has(modulePath)) {
      moduleMap.set(modulePath, { name: moduleName, path: modulePath, files: [] });
    }
    moduleMap.get(modulePath).files.push(path);
  }

  const modules = Array.from(moduleMap.values())
    .sort((a, b) => b.files.length - a.files.length)
    .slice(0, MAX_MODULES)
    .map((mod) => ({
      ...mod,
      files: mod.files
        .sort((a, b) => a.split("/").length - b.split("/").length) // shallowest first
        .slice(0, MAX_FILES_PER_MODULE),
    }));

  return modules;
}