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

export function useUpload(defaultOptions?: UseUploadOptions) {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationKey: ["upload"],

    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (p: number) => void;
    }) => {
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
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || progressEvent.loaded;
            const percent = Math.round((progressEvent.loaded * 100) / total);
            setProgress(percent);
            onProgress?.(percent);
            defaultOptions?.onProgress?.(percent);
          },
        },
      );

      return res.data;
    },

    onSuccess: (data) => {
      defaultOptions?.onSuccess?.(data);
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

      defaultOptions?.onError?.(
        error instanceof Error ? error : new Error(message),
      );

      setProgress(0);
    },
  });

  return {
    ...mutation,
    progress,
    upload: (file: File, options?: { onProgress?: (p: number) => void }) =>
      mutation.mutateAsync({ file, onProgress: options?.onProgress }),
  };
}
