import axiosInstance from "./axiosInstance.js";

export async function getInsights(repoId) {
  const response = await axiosInstance.get(`/repos/${repoId}/insights`);
  return response.data.data.insight;
}

export async function triggerAnalysis(repoId) {
  const response = await axiosInstance.post(`/repos/${repoId}/analyze`);
  return response.data.data.insight;
}