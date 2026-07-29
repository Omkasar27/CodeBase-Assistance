import {
  saveGithubToken,
  removeGithubToken,
  hasGithubToken,
} from "../services/user.service.js";

export async function addGithubToken(req, res, next) {
  try {
    const { token } = req.body;
    const result = await saveGithubToken(req.user.id, token);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteGithubToken(req, res, next) {
  try {
    const result = await removeGithubToken(req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function getGithubTokenStatus(req, res, next) {
  try {
    const result = await hasGithubToken(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}