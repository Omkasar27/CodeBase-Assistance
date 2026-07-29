import ChatSession from "../models/chatSession.model.js";
import ChatMessage from "../models/chatMessage.model.js";
import { getRepositoryById } from "./repo.service.js";
import { streamQuery } from "./aiServiceClient.js";
import { AppError } from "../utils/AppError.js";

const MAX_HISTORY_MESSAGES = 6;
const TITLE_MAX_LENGTH = 50;

export async function createSession(userId, repoId) {
  const repository = await getRepositoryById(userId, repoId);

  if (repository.indexingStatus !== "completed") {
    throw new AppError(
      "This repository hasn't been indexed yet. Please index it first.",
      400
    );
  }

  return ChatSession.create({
    repository: repoId,
    owner: userId,
    title: null,
  });
}

export async function listSessions(userId, repoId) {
  await getRepositoryById(userId, repoId); // ensures ownership

  return ChatSession.find({ repository: repoId, owner: userId }).sort({
    updatedAt: -1,
  });
}

export async function getSessionById(userId, sessionId) {
  const session = await ChatSession.findOne({ _id: sessionId, owner: userId });
  if (!session) {
    throw new AppError("Conversation not found.", 404);
  }
  return session;
}

export async function renameSession(userId, sessionId, title) {
  const session = await getSessionById(userId, sessionId);
  session.title = title;
  await session.save();
  return session;
}

export async function deleteSession(userId, sessionId) {
  const session = await getSessionById(userId, sessionId);
  await ChatMessage.deleteMany({ session: sessionId });
  await session.deleteOne();
  return { message: "Conversation deleted successfully" };
}

export async function getSessionMessages(userId, sessionId) {
  await getSessionById(userId, sessionId);
  return ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });
}

async function buildHistoryExcluding(sessionId, excludeMessageIds = []) {
  const messages = await ChatMessage.find({
    session: sessionId,
    _id: { $nin: excludeMessageIds },
  })
    .sort({ createdAt: -1 })
    .limit(MAX_HISTORY_MESSAGES);

  return messages.reverse().map((msg) => ({ role: msg.role, content: msg.content }));
}

export async function startSessionQuery(userId, sessionId, question) {
  const session = await getSessionById(userId, sessionId);
  const repository = await getRepositoryById(userId, session.repository);

  if (repository.indexingStatus !== "completed") {
    throw new AppError(
      "This repository hasn't been indexed yet. Please index it first.",
      400
    );
  }

  const chatHistory = await buildHistoryExcluding(sessionId);

  const userMessage = await ChatMessage.create({
    session: sessionId,
    role: "user",
    content: question,
  });

  const pythonStream = await streamQuery({
    repoId: session.repository.toString(),
    question,
    chatHistory,
  });

  return { pythonStream, session };
}

export async function regenerateLastAnswer(userId, sessionId) {
  const session = await getSessionById(userId, sessionId);
  const repository = await getRepositoryById(userId, session.repository);

  if (repository.indexingStatus !== "completed") {
    throw new AppError(
      "This repository hasn't been indexed yet. Please index it first.",
      400
    );
  }

  const lastTwo = await ChatMessage.find({ session: sessionId })
    .sort({ createdAt: -1 })
    .limit(2);

  if (lastTwo.length === 0) {
    throw new AppError("There is nothing to regenerate yet.", 400);
  }

  let questionMessage;
  const excludeIds = [];

  if (lastTwo[0].role === "assistant") {
    // Most recent exchange has a completed answer — discard it and redo it.
    excludeIds.push(lastTwo[0]._id);
    await ChatMessage.deleteOne({ _id: lastTwo[0]._id });

    const previous = lastTwo[1];
    if (!previous || previous.role !== "user") {
      throw new AppError("Could not find the question to regenerate.", 400);
    }
    questionMessage = previous;
  } else {
    // Last message is a user question with no assistant reply (a prior failure).
    questionMessage = lastTwo[0];
  }

  excludeIds.push(questionMessage._id);

  const chatHistory = await buildHistoryExcluding(sessionId, excludeIds);

  const pythonStream = await streamQuery({
    repoId: session.repository.toString(),
    question: questionMessage.content,
    chatHistory,
  });

  return { pythonStream, session };
}

export async function saveAssistantMessage(sessionId, content, sources) {
  if (!content.trim()) return;

  await ChatMessage.create({
    session: sessionId,
    role: "assistant",
    content,
    sources: sources.map((s) => ({ filePath: s.file_path })),
  });

  const session = await ChatSession.findById(sessionId);
  if (session && !session.title) {
    const firstUserMessage = await ChatMessage.findOne({
      session: sessionId,
      role: "user",
    }).sort({ createdAt: 1 });

    if (firstUserMessage) {
      session.title = firstUserMessage.content.slice(0, TITLE_MAX_LENGTH);
      await session.save();
    }
  }

  session.updatedAt = new Date();
  await session.save();
}