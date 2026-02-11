import axios from "axios";

const API = axios.create({
  baseURL: "https://rbac-backend-project.onrender.com/api/v1"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;