import { AppError } from "./AppError.js";

/**
 * Parses a GitHub repository URL and extracts owner + repo name.
 * Accepts formats like:
 *   https://github.com/owner/repo
 *   https://github.com/owner/repo.git
 *   github.com/owner/repo
 */
export function parseGithubUrl(rawUrl) {
  const trimmed = rawUrl.trim();

  const githubUrlPattern =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+?)(?:\.git)?\/?$/;

  const match = trimmed.match(githubUrlPattern);

  if (!match) {
    throw new AppError(
      "Invalid GitHub repository URL. Expected format: https://github.com/owner/repo",
      400
    );
  }

  const [, owner, repo] = match;

  return { owner, repo };
}