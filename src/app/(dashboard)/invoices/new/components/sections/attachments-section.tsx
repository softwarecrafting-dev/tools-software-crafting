"use client";

import { Progress } from "@/components/ui/progress";
import { useUpload } from "@/hooks/use-upload";
import { ACCEPTED_DROPZONE_TYPES, MAX_FILE_SIZE } from "@/lib/validators/file";
import { FileIcon, ImageIcon, UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { InvoiceFormValues } from "../invoice-form";

interface UploadingState {
  id: string;
  name: string;
  progress: number;
}

export function AttachmentsSection() {
  const { control, setValue } = useFormContext<InvoiceFormValues>();
  const watchedAttachments = useWatch({ control, name: "attachments" });
  const attachments = useMemo(
    () => watchedAttachments || [],
    [watchedAttachments],
  );
  const [uploadingFiles, setUploadingFiles] = useState<UploadingState[]>([]);

  const { upload } = useUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const id = crypto.randomUUID();

        setUploadingFiles((prev) => [
          ...prev,
          { id, name: file.name, progress: 0 },
        ]);

        try {
          const record = await upload(file, {
            onProgress: (p) => {
              setUploadingFiles((prev) =>
                prev.map((f) => (f.id === id ? { ...f, progress: p } : f)),
              );
            },
          });

          if (record) {
            setValue("attachments", [...attachments, record], {
              shouldDirty: true,
            });
          }
        } catch {
        } finally {
          setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
        }
      }
    },
    [attachments, setValue, upload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_DROPZONE_TYPES,
    onDropRejected: (rejections) => {
      rejections.forEach(({ file, errors }) => {
        const error = errors[0];

        toast.error(
          `${file.name}: ${error.code === "file-too-large" ? "Too large (max 10MB)" : error.message}`,
        );
      });
    },
  });

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
            <p className="text-sm font-semibold">
              Click or drag files to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, or PDF (max. 10MB)
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
              <UploadingItem key={upload.id} upload={upload} />
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
      {isImage ? (
        <ImageIcon className="size-3 text-blue-500" />
      ) : (
        <FileIcon className="size-3 text-red-500" />
      )}
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

function UploadingItem({ upload }: { upload: UploadingState }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 p-3">
      <div className="size-8 flex items-center justify-center rounded-lg bg-background">
        <UploadCloud className="size-4 text-muted-foreground animate-pulse" />
      </div>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="truncate">{upload.name}</span>
          <span>{Math.round(upload.progress)}%</span>
        </div>

        <Progress value={upload.progress} className="h-1" />
      </div>
    </div>
  );
}
