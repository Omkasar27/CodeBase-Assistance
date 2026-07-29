import User from "../models/user.model.js";
import { encrypt } from "../utils/encryption.js";
import { fetchRepoMetadata } from "./github.service.js";
import { AppError } from "../utils/AppError.js";

export async function saveGithubToken(userId, token) {
  // Validate the token actually works before saving it, by making a
  // lightweight real request to GitHub with it.
  try {
    await fetchRepoMetadata({ owner: "octocat", repo: "Hello-World", token });
  } catch (error) {
    if (error.statusCode === 401) {
      throw new AppError("This GitHub token appears to be invalid.", 400);
    }
    // If it's a different error (e.g. rate limit), we still allow saving —
    // the token itself might be fine.
  }

  const encryptedToken = encrypt(token);

  await User.findByIdAndUpdate(userId, { githubToken: encryptedToken });

  return { message: "GitHub token saved successfully" };
}

export async function removeGithubToken(userId) {
  await User.findByIdAndUpdate(userId, { $unset: { githubToken: "" } });
  return { message: "GitHub token removed successfully" };
}

export async function hasGithubToken(userId) {
  const user = await User.findById(userId).select("+githubToken");
  return { hasToken: Boolean(user?.githubToken) };
}