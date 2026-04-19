import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || "Something went wrong";
    const code = error.response?.data?.code || "UNKNOWN_ERROR";
    const details = error.response?.data?.details;

    return Promise.reject({ message, code, details });
  },
);
