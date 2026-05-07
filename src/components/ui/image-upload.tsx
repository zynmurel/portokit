"use client";

import { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ImageUploadProps = {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  previewClassName?: string;
  maxSizeMB?: number;
  variant?: "square" | "icon" | "full";
  defaultPreview?: string | null;
  isError?: boolean;
};

export function ImageUpload({
  value,
  onChange,
  className,
  previewClassName,
  maxSizeMB = 5,
  variant = "square",
  defaultPreview,
  isError = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(() => {
    if (!value) return null;
    if (typeof value === "string") return value;
    return URL.createObjectURL(value);
  });

  // sync external value (edit mode)
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === "string") {
      setPreview(value);
      return;
    }

    const nextPreview = URL.createObjectURL(value);
    setPreview(nextPreview);
    return () => URL.revokeObjectURL(nextPreview);
  }, [value]);

  useEffect(() => {
    if (defaultPreview) {
      setPreview(defaultPreview);
    }
  }, [defaultPreview]);

  // cleanup object URL (prevent memory leak)
  useEffect(() => {
    return () => {
      if (typeof preview === "string" && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large (max ${maxSizeMB}MB)`);
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
    onChange(file);
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  // 📦 Upload box styles
  const uploadBoxStyle =
    variant === "square"
      ? "h-40 w-40"
      : variant === "icon"
        ? "h-12 w-12"
        : "h-48 w-full";

  // 🖼️ Preview container
  const previewContainerStyle =
    variant === "square"
      ? "relative h-40 w-40"
      : variant === "icon"
        ? "relative h-12 w-12"
        : "relative w-full";

  // 🖼️ Preview image
  const previewImageStyle =
    variant === "square"
      ? "h-40 w-40 rounded-lg overflow-hidden"
      : variant === "icon"
        ? "h-12 w-12 rounded-lg overflow-hidden"
        : "w-full h-48 rounded-lg";

  // ❌ Remove button position
  const removeButtonStyle =
    variant === "square"
      ? "absolute -right-2 -top-2"
      : variant === "icon"
        ? "absolute -right-2 -top-2"
        : "absolute right-2 top-2";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        variant === "square" && "",
        className,
      )}
    >
      {/* Upload Area */}
      {!preview && (
        <label
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition",
            "hover:border-primary hover:bg-muted/50",
            uploadBoxStyle,
            isError && "border-destructive",
          )}
        >
          <UploadCloud
            className={cn(
              "text-muted-foreground mb-2 h-6 w-6",
              variant === "icon" && "mb-0",
              isError && "text-destructive",
            )}
          />

          <p
            className={cn(
              "text-muted-foreground/80 px-2 text-center text-sm",
              variant === "icon" && "text-[10px]",
            )}
          >
            {variant === "icon" ? "" : "Upload image"}
          </p>

          {variant !== "icon" && (
            <p className="text-muted-foreground/50 mt-2 text-xs">
              PNG, JPG (max {maxSizeMB}MB)
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              handleFile(file);
            }}
          />
        </label>
      )}

      {/* Preview */}
      {preview && (
        <div
          className={cn(
            previewContainerStyle,
            "rounded-lg border-2 border-dashed",
            variant === "full" && "bg-muted/30 rounded-xl p-2",
            isError && "border-destructive",
          )}
        >
          <Image
            src={preview}
            alt="Preview"
            width={100}
            height={100}
            className={cn(
              "border object-cover",
              previewImageStyle,
              previewClassName,
            )}
          />

          <button
            type="button"
            onClick={removeImage}
            className={cn(
              removeButtonStyle,
              "bg-destructive rounded-full p-1 text-white shadow",
            )}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
