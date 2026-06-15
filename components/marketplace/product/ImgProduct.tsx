// core/shared/components/ImgProduct.tsx

"use client";

import { useRef } from "react";
import { FaImage, FaTimes, FaSpinner, FaLock } from "react-icons/fa";
import { ImageForm } from "@/modules/marketplace/types/product.types";

interface ImgProductProps {
  images: ImageForm[];
  canUpload: boolean;
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
  onReplace?: (index: number, file: File) => void;
  isUploading?: boolean;
}

export function ImgProduct({
  images,
  canUpload,
  onUpload,
  onRemove,
  onReplace,
  isUploading = false,
}: ImgProductProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && canUpload) {
      onUpload(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplaceClick = (index: number) => {
    if (!onReplace) return;
    replaceIndexRef.current = index;
    replaceInputRef.current?.click();
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = replaceIndexRef.current;

    if (file && index !== null && onReplace) {
      onReplace(index, file);
    }

    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
    }
    replaceIndexRef.current = null;
  };

  return (
    <div>
      {/* LABEL */}
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Gambar (max. 5 gambar) <span className="text-red-500">*</span>
      </label>

      {/* GRID */}
      <div className="grid grid-cols-5 gap-2">
        {/* EXISTING IMAGES */}
        {images.map((img, index) => (
          <div
            key={img.id}
            className="rounded-lg bg-slate-100 overflow-hidden flex flex-col"
          >
            {/* IMAGE 1:1 */}
            <div className="aspect-square relative">
              <img
                src={img.url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <FaTimes size={8} />
              </button>

              {/* INDEX LABEL */}
              <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
                {index + 1}
              </span>
            </div>

            {/* REPLACE BUTTON */}
            <button
              type="button"
              onClick={() => handleReplaceClick(index)}
              className="h-6 text-xs border-t bg-slate-50 hover:bg-slate-100 text-slate-600"
            >
              Ubah
            </button>
          </div>
        ))}

        {/* ADD IMAGE BUTTON - Tampilkan jika belum max */}
        {images.length < 5 && (
          <label
            className={`relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
              canUpload
                ? "border-slate-300 hover:border-slate-400 cursor-pointer"
                : "border-slate-200 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <FaSpinner className="animate-spin text-green-500" size={20} />
            ) : canUpload ? (
              <FaImage size={20} className="text-slate-300" />
            ) : (
              <FaLock size={16} className="text-slate-300" />
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={!canUpload}
            />
          </label>
        )}
      </div>

      {/* HIDDEN REPLACE INPUT */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceChange}
      />

      {/* HELP TEXT */}
      {!canUpload && (
        <p className="text-xs text-slate-400 mt-1">
          Isi nama produk terlebih dahulu
        </p>
      )}
    </div>
  );
}