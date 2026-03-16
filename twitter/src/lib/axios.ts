// src/lib/axios.ts
import axios from "axios";

const API_BASE = "https://twitter-clone-app-6.onrender.com"; // your Render backend

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // needed if backend uses cookies
});

export default axiosInstance;
// src/lib/axios.ts
