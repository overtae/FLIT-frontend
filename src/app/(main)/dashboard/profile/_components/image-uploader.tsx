"use client";

import { useCallback, useState } from "react";

import Image from "next/image";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange?: (file: File | null) => void;
  className?: string;
  size?: number;
}

export function ImageUploader({ value, onChange, className, size = 200 }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange?.(file);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreview(null);
      onChange?.(null);
    },
    [onChange],
  );

  const handleClick = useCallback(() => {
    document.getElementById("profile-image-input")?.click();
  }, []);

  return (
    <div className={cn("relative flex justify-center", className)}>
      <div
        className={cn(
          "group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors",
          preview ? "border-transparent" : "border-border bg-muted",
          isDragging && "border-primary bg-primary/10",
        )}
        style={{ width: size, height: size }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {preview && (
          <Image
            src={preview}
            alt="Profile preview"
            width={size}
            height={size}
            className="h-full w-full object-cover"
            unoptimized
          />
        )}
        <div className="text-foreground absolute inset-0 m-auto flex h-fit w-fit items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-semibold opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:px-4 sm:py-1.5 sm:text-sm">
          {preview ? "Edit" : "Upload"}
        </div>
        <input
          id="profile-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="bg-muted-foreground text-background absolute top-[8%] right-[8%] z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-opacity hover:opacity-80 sm:h-8 sm:w-8"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}
    </div>
  );
}
