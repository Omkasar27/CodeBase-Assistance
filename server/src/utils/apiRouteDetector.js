const ROUTE_FOLDER_NAMES = [
  "routes", "route", "controllers", "controller",
  "api", "apis", "endpoints", "endpoint",
];
const ROUTE_FILENAME_HINTS = ["route", "api", "controller", "endpoint"];

const AUTH_MIDDLEWARE_PATTERNS = [
  "protect", "auth", "authenticate", "requireauth", "isauthenticated",
  "authmiddleware", "verifytoken", "login_required", "jwt_required",
];

const MAX_ROUTE_FILES = 15;
const MAX_ROUTES = 40;

export function isLikelyRouteFile(path) {
  const segments = path.toLowerCase().split("/");
  const fileName = segments[segments.length - 1];

  // Match if any folder in the path is a known route-folder name
  const folderMatch = segments
    .slice(0, -1)
    .some((segment) => ROUTE_FOLDER_NAMES.includes(segment));

  // Or if the filename itself hints at routing (e.g. authApi.js, userRoutes.js)
  const fileNameMatch = ROUTE_FILENAME_HINTS.some((hint) => fileName.includes(hint));

  return folderMatch || fileNameMatch;
}

export function selectRouteFiles(allFilePaths) {
  return allFilePaths.filter(isLikelyRouteFile).slice(0, MAX_ROUTE_FILES);
}

function hasAuthMiddleware(argsText) {
  const lower = argsText.toLowerCase();
  return AUTH_MIDDLEWARE_PATTERNS.some((pattern) => lower.includes(pattern));
}

// Matches: router.get("/path", ...), app.post('/path', ...)
const EXPRESS_ROUTE_REGEX =
  /(?:router|app)\.(get|post|put|patch|delete)\(\s*["'`]([^"'`]+)["'`]\s*,?\s*([^)]*)\)/gi;

// Matches: @router.get("/path"), @app.route("/path", methods=["GET"])
const FASTAPI_ROUTE_REGEX =
  /@(?:router|app)\.(get|post|put|patch|delete)\(\s*["']([^"']+)["']/gi;

const FLASK_ROUTE_REGEX =
  /@(?:app|bp)\.route\(\s*["']([^"']+)["'](?:.*?methods\s*=\s*\[([^\]]*)\])?/gi;

function extractExpressRoutes(content, filePath) {
  const routes = [];
  let match;
  while ((match = EXPRESS_ROUTE_REGEX.exec(content)) !== null) {
    const [, method, path, args] = match;
    routes.push({
      method: method.toUpperCase(),
      path,
      controller: filePath,
      authRequired: hasAuthMiddleware(args),
    });
  }
  return routes;
}

function extractFastApiRoutes(content, filePath) {
  const routes = [];
  let match;
  while ((match = FASTAPI_ROUTE_REGEX.exec(content)) !== null) {
    const [, method, path] = match;
    // Look at the following ~3 lines for a Depends(...) auth dependency
    const nearbyText = content.slice(match.index, match.index + 300);
    routes.push({
      method: method.toUpperCase(),
      path,
      controller: filePath,
      authRequired: hasAuthMiddleware(nearbyText),
    });
  }
  return routes;
}

function extractFlaskRoutes(content, filePath) {
  const routes = [];
  let match;
  while ((match = FLASK_ROUTE_REGEX.exec(content)) !== null) {
    const [, path, methodsGroup] = match;
    const methods = methodsGroup
      ? methodsGroup.split(",").map((m) => m.trim().replace(/["']/g, ""))
      : ["GET"];
    for (const method of methods) {
      routes.push({
        method: method.toUpperCase(),
        path,
        controller: filePath,
        authRequired: hasAuthMiddleware(content.slice(match.index, match.index + 300)),
      });
    }
  }
  return routes;
}

export function extractRoutesFromFile(content, filePath) {
  const ext = filePath.slice(filePath.lastIndexOf("."));

  if ([".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
    return extractExpressRoutes(content, filePath);
  }
  if (ext === ".py") {
    return [
      ...extractFastApiRoutes(content, filePath),
      ...extractFlaskRoutes(content, filePath),
    ];
  }
  return [];
}

export function detectApiRoutes(fileContents) {
  const allRoutes = [];

  for (const { path, content } of fileContents) {
    if (!content) continue;
    allRoutes.push(...extractRoutesFromFile(content, path));
  }

  // De-duplicate identical method+path pairs (e.g., re-exported or re-registered routes)
  const seen = new Set();
  const unique = allRoutes.filter((route) => {
    const key = `${route.method} ${route.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, MAX_ROUTES);
}