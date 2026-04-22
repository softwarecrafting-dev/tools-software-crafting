"use client";

import { Progress } from "@/components/ui/progress";
import { useUpload } from "@/hooks/use-upload";
import { FileIcon, ImageIcon, UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { InvoiceFormValues } from "../invoice-form";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/validators/file";

interface UploadingFile {
  id: string;
  file: File;
}

export function AttachmentsSection() {
  const { control, setValue } = useFormContext<InvoiceFormValues>();
  const watchedAttachments = useWatch({ control, name: "attachments" });
  const attachments = useMemo(
    () => watchedAttachments || [],
    [watchedAttachments],
  );
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploads]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: ALLOWED_FILE_TYPES.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        const error = errors[0];
        if (error.code === "file-too-large") {
          toast.error(`${file.name} is too large (max 10MB)`);
        } else if (error.code === "file-invalid-type") {
          toast.error(`${file.name} is not a supported file type`);
        } else {
          toast.error(`${file.name} could not be uploaded: ${error.message}`);
        }
      });
    },
  });

  const handleUploadComplete = useCallback(
    (id: string, url: string) => {
      setValue("attachments", [...attachments, url], { shouldDirty: true });
      setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    },
    [attachments, setValue],
  );

  const handleUploadError = useCallback((id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleRemove = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);

    setValue("attachments", newAttachments, { shouldDirty: true });
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const parts = url.split("/");

      return decodeURIComponent(parts[parts.length - 1]);
    } catch {
      return url;
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png)$/i.test(url);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
            : "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/5"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-tight">
              {isDragActive
                ? "Drop files here"
                : "Click or drag files to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              Support PNG, JPG, or PDF (max. 10MB)
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {(attachments.length > 0 || uploadingFiles.length > 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-wrap gap-2"
          >
            {attachments.map((url: string, index: number) => (
              <motion.div
                key={`${url}-${index}`}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group flex items-center gap-2 rounded-full border bg-background pl-3 pr-1 py-1 text-sm font-medium transition-all hover:border-primary/30 hover:shadow-sm"
              >
                {isImage(url) ? (
                  <ImageIcon className="size-3.5 text-blue-500" />
                ) : (
                  <FileIcon className="size-3.5 text-red-500" />
                )}
                <span className="max-w-[150px] truncate text-xs">
                  {getFileNameFromUrl(url)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex size-6 items-center justify-center rounded-full text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </motion.div>
            ))}

            {uploadingFiles.map((upload) => (
              <UploadingFileItem
                key={upload.id}
                upload={upload}
                onComplete={handleUploadComplete}
                onError={handleUploadError}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadingFileItem({
  upload,
  onComplete,
  onError,
}: {
  upload: UploadingFile;
  onComplete: (id: string, url: string) => void;
  onError: (id: string) => void;
}) {
  const { progress, upload: startUpload } = useUpload({
    onSuccess: (data) => onComplete(upload.id, data.url),
    onError: () => onError(upload.id),
  });

  useEffect(() => {
    startUpload(upload.file);
  }, [startUpload, upload.file]);

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 p-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-background shadow-sm">
        <UploadCloud className="size-4 text-muted-foreground animate-pulse" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="truncate">{upload.file.name}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>
  );
}
