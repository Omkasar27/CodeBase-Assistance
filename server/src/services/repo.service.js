import Repository from "../models/repository.model.js";
import User from "../models/user.model.js";
import ChatSession from "../models/chatSession.model.js";
import ChatMessage from "../models/chatMessage.model.js";
import { parseGithubUrl } from "../utils/githubUrlParser.js";
import {
  fetchRepoMetadata,
  fetchRepoFileTree,
  fetchFileContent,
} from "./github.service.js";
import { indexRepositoryChunks, streamQuery } from "./aiServiceClient.js";
import { decrypt } from "../utils/encryption.js";
import { AppError } from "../utils/AppError.js";

const MAX_HISTORY_MESSAGES = 6;

async function getDecryptedTokenForUser(userId) {
  const user = await User.findById(userId).select("+githubToken");
  if (!user?.githubToken) return null;
  return decrypt(user.githubToken);
}

export async function connectRepository(userId, repoUrl) {
  const { owner, repo } = parseGithubUrl(repoUrl);
  const token = await getDecryptedTokenForUser(userId);
  const metadata = await fetchRepoMetadata({ owner, repo, token });

  const existing = await Repository.findOne({
    owner: userId,
    fullName: metadata.fullName,
  });

  if (existing) {
    throw new AppError("You have already connected this repository.", 409);
  }

  const repository = await Repository.create({
    owner: userId,
    githubOwner: owner,
    githubRepoName: repo,
    fullName: metadata.fullName,
    url: metadata.url,
    description: metadata.description,
    defaultBranch: metadata.defaultBranch,
    language: metadata.language,
    stars: metadata.stars,
    isPrivate: metadata.isPrivate,
  });

  return repository;
}

export async function getUserRepositories(userId) {
  return Repository.find({ owner: userId }).sort({ createdAt: -1 });
}

export async function getRepositoryById(userId, repoId) {
  const repository = await Repository.findOne({ _id: repoId, owner: userId });
  if (!repository) {
    throw new AppError("Repository not found.", 404);
  }
  return repository;
}



export async function indexRepository(userId, repoId) {
  const repository = await getRepositoryById(userId, repoId);

  repository.indexingStatus = "indexing";
  repository.indexingError = null;
  await repository.save();

  try {
    const token = await getDecryptedTokenForUser(userId);

    const fileList = await fetchRepoFileTree({
      owner: repository.githubOwner,
      repo: repository.githubRepoName,
      branch: repository.defaultBranch,
      token,
    });

    if (fileList.length === 0) {
      throw new AppError(
        "No indexable source files were found in this repository.",
        400
      );
    }

    const fileContents = await Promise.all(
      fileList.map(async (file) => {
        const content = await fetchFileContent({
          owner: repository.githubOwner,
          repo: repository.githubRepoName,
          sha: file.sha,
          token,
        });
        return content ? { path: file.path, content } : null;
      })
    );

    const validFiles = fileContents.filter(Boolean);

    if (validFiles.length === 0) {
      throw new AppError("Failed to fetch any file contents from GitHub.", 502);
    }

    const result = await indexRepositoryChunks(repoId, validFiles);

    repository.indexingStatus = "completed";
    repository.indexingError = null;
    repository.filesIndexed = result.files_indexed;
    repository.chunksIndexed = result.chunks_indexed;
    await repository.save();

    return {
      filesIndexed: result.files_indexed,
      chunksIndexed: result.chunks_indexed,
      status: repository.indexingStatus,
    };
  } catch (error) {
    repository.indexingStatus = "failed";
    repository.indexingError = error.message || "Indexing failed unexpectedly.";
    await repository.save();

    throw error;
  }
}

export async function getChatHistory(userId, repoId) {
  await getRepositoryById(userId, repoId); // ensures ownership, throws 404 otherwise

  const messages = await ChatMessage.find({ repository: repoId }).sort({
    createdAt: 1,
  });

  return messages;
}

export async function startRepositoryQuery(userId, repoId, question) {
  const repository = await getRepositoryById(userId, repoId);

  if (repository.indexingStatus !== "completed") {
    throw new AppError(
      "This repository hasn't been indexed yet. Please index it first.",
      400
    );
  }

  const recentMessages = await ChatMessage.find({ repository: repoId })
    .sort({ createdAt: -1 })
    .limit(MAX_HISTORY_MESSAGES);

  const chatHistory = recentMessages
    .reverse()
    .map((msg) => ({ role: msg.role, content: msg.content }));

  await ChatMessage.create({
    repository: repoId,
    role: "user",
    content: question,
  });

  const pythonStream = await streamQuery({ repoId, question, chatHistory });

  return pythonStream;
}

export async function deleteRepository(userId, repoId) {
  const repository = await Repository.findOneAndDelete({
    _id: repoId,
    owner: userId,
  });
  if (!repository) {
    throw new AppError("Repository not found.", 404);
  }

  const sessions = await ChatSession.find({ repository: repoId });
  const sessionIds = sessions.map((s) => s._id);

  await ChatMessage.deleteMany({ session: { $in: sessionIds } });
  await ChatSession.deleteMany({ repository: repoId });

  return { message: "Repository removed successfully" };
}

export async function saveAssistantMessage(repoId, content, sources) {
  if (!content.trim()) return; // don't save empty/failed answers

  await ChatMessage.create({
    repository: repoId,
    role: "assistant",
    content,
    sources: sources.map((s) => ({ filePath: s.file_path })),
  });
}