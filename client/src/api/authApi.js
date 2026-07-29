import axiosInstance from "./axiosInstance.js";

export async function registerRequest({ name, email, password }) {
  const response = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
  });
  return response.data.data;
}

export async function loginRequest({ email, password }) {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data.data;
}

export async function getMeRequest() {
  const response = await axiosInstance.get("/auth/me");
  return response.data.data;
}