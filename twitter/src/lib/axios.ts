// src/lib/axios.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;