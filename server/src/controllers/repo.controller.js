import {
  connectRepository,
  getUserRepositories,
  getRepositoryById,
  deleteRepository,
  indexRepository,
  getChatHistory,
} from "../services/repo.service.js";

export async function createRepository(req, res, next) {
  try {
    const { repoUrl } = req.body;
    const repository = await connectRepository(req.user.id, repoUrl);
    res.status(201).json({
      success: true,
      message: "Repository connected successfully",
      data: { repository },
    });
  } catch (error) {
    next(error);
  }
}

export async function listRepositories(req, res, next) {
  try {
    const repositories = await getUserRepositories(req.user.id);
    res.status(200).json({ success: true, data: { repositories } });
  } catch (error) {
    next(error);
  }
}

export async function getRepository(req, res, next) {
  try {
    const repository = await getRepositoryById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: { repository } });
  } catch (error) {
    next(error);
  }
}

export async function removeRepository(req, res, next) {
  try {
    const result = await deleteRepository(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
}

export async function triggerIndexing(req, res, next) {
  try {
    const result = await indexRepository(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Repository indexed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req, res, next) {
  try {
    const messages = await getChatHistory(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
}