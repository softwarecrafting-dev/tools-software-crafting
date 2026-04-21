import axios from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ?? error.message ?? "Something went wrong";
    const status = error.response?.status ?? 0;
    const code = error.response?.data?.code ?? "UNKNOWN_ERROR";
    const details = error.response?.data?.details;

    return Promise.reject(new ApiError(message, status, code, details));
  },
);
