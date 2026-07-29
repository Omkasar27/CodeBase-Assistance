import axiosInstance from "./axiosInstance.js";

export async function getGithubTokenStatus() {
  const response = await axiosInstance.get("/users/github-token/status");
  return response.data.data;
}

export async function saveGithubToken(token) {
  const response = await axiosInstance.post("/users/github-token", { token });
  return response.data;
}

export async function deleteGithubToken() {
  const response = await axiosInstance.delete("/users/github-token");
  return response.data;
}