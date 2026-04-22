"use client";

import { apiClient, ApiError } from "@/lib/api-client";
import type { UploadedFile } from "@/lib/db/schema";
import { FileUploadSchema } from "@/lib/validators/file";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface UploadResponse {
  success: boolean;
  data: UploadedFile;
}

interface UseUploadOptions {
  onSuccess?: (data: UploadedFile) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export function useUpload(options?: UseUploadOptions) {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationKey: ["upload"],

    mutationFn: async (file: File) => {
      const validation = FileUploadSchema.safeParse({ file });
      if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post<unknown, UploadResponse>(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || progressEvent.loaded;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / total,
            );
            setProgress(percentCompleted);
            options?.onProgress?.(percentCompleted);
          },
        },
      );

      return res.data;
    },

    retry: false,

    onSuccess: (data) => {
      options?.onSuccess?.(data);
      setTimeout(() => setProgress(0), 1000);
    },

    onError: (error: unknown) => {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to upload file";

      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
      setProgress(0);
    },
  });

  return {
    ...mutation,
    progress,
    upload: mutation.mutateAsync,
  };
}
