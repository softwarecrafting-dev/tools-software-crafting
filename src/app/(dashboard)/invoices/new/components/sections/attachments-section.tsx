"use client";

import { Progress } from "@/components/ui/progress";
import { useUpload } from "@/hooks/use-upload";
import { ACCEPTED_DROPZONE_TYPES, MAX_FILE_SIZE } from "@/lib/validators/file";
import { FileIcon, ImageIcon, UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { InvoiceFormValues } from "../invoice-form";
import type { UploadedFile } from "@/lib/db/schema";

interface UploadingFile {
  id: string;
  file: File;
}

export function AttachmentsSection() {
  const { control, setValue } = useFormContext<InvoiceFormValues>();
  const watchedAttachments = useWatch({ control, name: "attachments" });
  const attachments = useMemo(() => watchedAttachments || [], [watchedAttachments]);
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
    accept: ACCEPTED_DROPZONE_TYPES,
    onDropRejected: (rejections) => {
      rejections.forEach(({ file, errors }) => {
        const error = errors[0];
        toast.error(`${file.name}: ${error.code === "file-too-large" ? "Too large (max 10MB)" : error.message}`);
      });
    },
  });

  const handleUploadComplete = useCallback(
    (id: string, fileRecord: UploadedFile) => {
      setValue("attachments", [...attachments, fileRecord], { shouldDirty: true });
      setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    },
    [attachments, setValue],
  );

  const handleUploadError = useCallback((id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

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
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Click or drag files to upload</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (max. 10MB)</p>
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
            {attachments.map((file, index) => (
              <FileBadge
                key={file.id}
                file={file}
                onRemove={() => {
                  const copy = [...attachments];
                  copy.splice(index, 1);
                  setValue("attachments", copy, { shouldDirty: true });
                }}
              />
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

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

function FileBadge({
  file,
  onRemove,
}: {
  file: Attachment;
  onRemove: () => void;
}) {
  const isImage = file.type.startsWith("image/");
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group flex items-center gap-2 rounded-full border bg-background pl-3 pr-1 py-1 text-xs font-medium hover:border-primary/30"
    >
      {isImage ? <ImageIcon className="size-3 text-blue-500" /> : <FileIcon className="size-3 text-red-500" />}
      <span className="max-w-[120px] truncate">{file.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex size-5 items-center justify-center rounded-full text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="size-2.5" />
      </button>
    </motion.div>
  );
}

function UploadingFileItem({
  upload,
  onComplete,
  onError,
}: {
  upload: UploadingFile;
  onComplete: (id: string, record: UploadedFile) => void;
  onError: (id: string) => void;
}) {
  const { progress, upload: startUpload } = useUpload({
    onSuccess: (data) => onComplete(upload.id, data),
    onError: () => onError(upload.id),
  });

  useEffect(() => {
    startUpload(upload.file);
  }, [startUpload, upload.file]);

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 p-3">
      <div className="size-8 flex items-center justify-center rounded-lg bg-background">
        <UploadCloud className="size-4 text-muted-foreground animate-pulse" />
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="truncate">{upload.file.name}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
}
