import {
  createSession,
  listSessions,
  renameSession,
  deleteSession,
  getSessionMessages,
} from "../services/chatSession.service.js";

export async function createNewSession(req, res, next) {
  try {
    const session = await createSession(req.user.id, req.params.repoId);
    res.status(201).json({ success: true, data: { session } });
  } catch (error) {
    next(error);
  }
}

export async function getSessions(req, res, next) {
  try {
    const sessions = await listSessions(req.user.id, req.params.repoId);
    res.status(200).json({ success: true, data: { sessions } });
  } catch (error) {
    next(error);
  }
}

export async function updateSessionTitle(req, res, next) {
  try {
    const session = await renameSession(
      req.user.id,
      req.params.sessionId,
      req.body.title
    );
    res.status(200).json({ success: true, data: { session } });
  } catch (error) {
    next(error);
  }
}

export async function removeSession(req, res, next) {
  try {
    const result = await deleteSession(req.user.id, req.params.sessionId);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req, res, next) {
  try {
    const messages = await getSessionMessages(req.user.id, req.params.sessionId);
    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
}