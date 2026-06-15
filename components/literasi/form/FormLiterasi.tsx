// components/literasi/form/FormLiterasi.tsx

'use client';

import { useState } from 'react';
import { Upload, X, FileDigit } from 'lucide-react';
import type { LiterasiType, LiterasiCategory } from '@/modules/literasi/types/literasi.type';
import { LITERASI_CATEGORIES } from '@/modules/literasi/types/literasi.type';
import InputGoogle from '@/components/ui/InputGoogle';
import TextareaGoogle from '@/components/ui/TextareaGoogle';
import SelectGoogle from '@/components/ui/SelectGoogle';

interface FormLiterasiProps {
  type: LiterasiType;
  isEditing?: boolean;
  title: string;
  description: string;
  content: string;
  category: LiterasiCategory;
  thumbnailPreview: string;
  pdfFile: File | null;
  linkpdf: string;
  tiktokLink: string;
  youtubeLink: string;
  instagramLink: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCategoryChange: (category: LiterasiCategory) => void;
  onThumbnailChange: (file: File) => void;
  onThumbnailRemove: () => void;
  onPdfFileChange: (file: File) => void;
  onPdfFileRemove: () => void;
  onLinkpdfChange: (value: string) => void;
  onTiktokChange: (value: string) => void;
  onYoutubeChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
}

export const FormLiterasi = ({
  type,
  isEditing = false,
  title,
  description,
  content,
  category,
  thumbnailPreview,
  pdfFile,
  linkpdf,
  tiktokLink,
  youtubeLink,
  instagramLink,
  onTitleChange,
  onDescriptionChange,
  onContentChange,
  onCategoryChange,
  onThumbnailChange,
  onThumbnailRemove,
  onPdfFileChange,
  onPdfFileRemove,
  onLinkpdfChange,
  onTiktokChange,
  onYoutubeChange,
  onInstagramChange,
}: FormLiterasiProps) => {
  const [localPdfFile, setLocalPdfFile] = useState<File | null>(null);

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onThumbnailChange(file);
  };

  const handlePdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setLocalPdfFile(file);
      onPdfFileChange(file);
      onLinkpdfChange('');
    }
  };

  const isArtikel = type === 'artikel';
  const isBuku = type === 'buku';

  const hasPdf = localPdfFile || pdfFile;
  const hasLink = !!linkpdf;

  return (
    <div className="space-y-4">
      <InputGoogle
        label="Judul"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={isArtikel ? 'Judul Artikel' : 'Judul Buku'}
        maxLength={200}
      />

      {/* Kategori - hanya untuk artikel dan bukan mode edit */}
      {isArtikel && !isEditing && (
        <SelectGoogle
          label="Pilih Kategori"
          value={category}
          onChange={(e: any) => onCategoryChange(e.target.value)}
          options={LITERASI_CATEGORIES}
        />
      )}

      <InputGoogle
        label="Deskripsi"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Deskripsi singkat..."
      />

      <div>
        <label className="block font-semibold text-gray-700 mb-2">Thumbnail (16:9)</label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
          {thumbnailPreview ? (
            <div className="relative inline-block">
              <img src={thumbnailPreview} alt="Preview" className="max-h-48 rounded-lg" />
              <button
                type="button"
                onClick={onThumbnailRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Klik untuk upload thumbnail</p>
              <p className="text-xs text-gray-400">PNG, JPG (max 5MB)</p>
              <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Detail Artikel */}
      {isArtikel && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-gray-700">Detail Artikel</h3>

          <TextareaGoogle
            label="Konten Artikel"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Tulis konten artikel..."
            rows={12}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InputGoogle
              label="TikTok"
              value={tiktokLink}
              onChange={(e) => onTiktokChange(e.target.value)}
              placeholder="https://tiktok.com/..."
            />
            <InputGoogle
              label="YouTube"
              value={youtubeLink}
              onChange={(e) => onYoutubeChange(e.target.value)}
              placeholder="https://youtube.com/..."
            />
            <InputGoogle
              label="Instagram"
              value={instagramLink}
              onChange={(e) => onInstagramChange(e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      )}

      {/* Detail Buku */}
      {isBuku && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-gray-700">Detail Buku (E-Book)</h3>

          {!hasLink && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Upload PDF {!hasPdf && <span className="text-red-500">*</span>}
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                {localPdfFile || pdfFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileDigit className="w-8 h-8 text-red-500" />
                    <span className="text-sm font-medium">{localPdfFile?.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLocalPdfFile(null);
                        onPdfFileRemove();
                      }}
                      className="bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk upload PDF</p>
                    <p className="text-xs text-gray-400">PDF (max 5MB)</p>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdf}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {!hasPdf && (
            <>
              {!hasLink && (
                <div className="text-center text-gray-400 text-sm">— ATAU —</div>
              )}
              <InputGoogle
                label="Link PDF"
                value={linkpdf}
                onChange={(e) => {
                  onLinkpdfChange(e.target.value);
                  if (e.target.value) {
                    setLocalPdfFile(null);
                    onPdfFileRemove();
                  }
                }}
                placeholder="https://docs.google.com/..."
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};