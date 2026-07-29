import axiosInstance from "./axiosInstance.js";

export async function getRepositories() {
  const response = await axiosInstance.get("/repos");
  return response.data.data.repositories;
}

export async function connectRepository(repoUrl) {
  const response = await axiosInstance.post("/repos", { repoUrl });
  return response.data.data.repository;
}

export async function deleteRepository(repoId) {
  const response = await axiosInstance.delete(`/repos/${repoId}`);
  return response.data;
}

export async function indexRepository(repoId) {
  // Indexing can genuinely take a while (up to ~60s for a full repo),
  // so this request needs a longer timeout than our default axios instance.
  const response = await axiosInstance.post(
    `/repos/${repoId}/index`,
    {},
    { timeout: 120000 }
  );
  return response.data.data;
}