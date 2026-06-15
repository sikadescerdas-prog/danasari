// components/dashboard/news/NewsForm.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import InputGoogle from "@/components/ui/InputGoogle";
import SelectGoogle from "@/components/ui/SelectGoogle";
import TextareaGoogle from "@/components/ui/TextareaGoogle";
import { FaUpload, FaTimes } from "react-icons/fa";

import { NEWS_TYPE_OPTIONS } from "@/modules/dashboard/hooks/useVillageNews";

import type {
  News,
  FormNews,
  NewsType,
} from "@/modules/desa/types/villageNews.type";

type Props = {
  news?: News;
  onSave: (form: FormNews) => void;
  onCancel: () => void;
  isSaving: boolean;
};

const NO_IMAGE = "/img/no-image.webp";

export default function NewsForm({
  news,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteImage, setDeleteImage] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<NewsType>("berita");
  const [date, setDate] = useState<string>("");

  /* ======================
     SYNC EDIT DATA
  =======================*/
  useEffect(() => {
    if (news) {
      setTitle(news.title || "");
      setContent(news.content || "");
      setType(news.type || "berita");
      setDate(formatDateForInput(news.date));
      setImagePreview(news.image?.url || NO_IMAGE);
      setImageFile(undefined);
      setDeleteImage(false);
    } else {
      resetForm();
    }
  }, [news]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("berita");
    setDate("");
    setImageFile(undefined);
    setImagePreview("");
    setDeleteImage(false);
  };

  /* ======================
     HELPERS
  =======================*/
  const formatDateForInput = (timestamp?: number) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    return d.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  /* ======================
     HANDLER
  =======================*/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setDeleteImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = () => {
    setImageFile(undefined);
    setImagePreview("");
    setDeleteImage(true);
  };

  const isEdit = !!news;

  const imageSrc = imagePreview || NO_IMAGE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = date ? new Date(date).getTime() : Date.now();

    onSave({
      title,
      content,
      type,
      date: timestamp,
      imageFile,
      deleteImage,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 rounded-2xl p-4 md:p-6 space-y-4 md:space-y-5"
    >
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-bold text-gray-900">
          {isEdit ? "Edit Berita" : "Tambah Berita"}
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* IMAGE */}
        <div className="w-full md:w-1/4 flex-shrink-0 mb-3 md:mt-0">
          <p className="text-xs text-gray-500 mb-2">Gambar (16:9)</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imagePreview ? (
            <div className="w-full max-w-[400px]">
              <div className="w-full aspect-video rounded-lg md:rounded-2xl overflow-hidden bg-gray-100 relative">
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 w-6 h-6 md:w-7 md:h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                >
                  <FaTimes className="w-3 h-3" />
                </button>

                <Image
                  src={imageSrc}
                  alt="Gambar"
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 text-xs font-medium text-[#25C95F] border border-t-0 border-gray-200 rounded-b-lg hover:bg-[#25C95F] hover:text-white"
              >
                Ubah Gambar
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-[400px] aspect-video rounded-lg md:rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:shadow-xl border-2 border-dashed border-gray-200 group flex flex-col items-center justify-center"
            >
              <FaUpload className="w-8 h-8 text-gray-300 group-hover:text-[#25C95F]" />
              <p className="text-xs text-gray-400 mt-2">Klik upload</p>
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="flex-1 space-y-3 md:space-y-4">
          {/* ROW 1: Tanggal | Jenis */}
          <div className="grid grid-cols-2 gap-4">
            <InputGoogle
              name="date"
              label="Tanggal"
              type="date"
              value={date}
              onChange={handleDateChange}
              placeholder="Pilih tanggal"
            />

            <SelectGoogle
              name="type"
              label="Jenis"
              value={type}
              options={NEWS_TYPE_OPTIONS}
              onChange={(e) => setType(e.target.value as NewsType)}
            />
          </div>

          {/* ROW 2: Judul */}
          <InputGoogle
            name="title"
            label="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Pemilihan Kepala Desa"
          />

          {/* ROW 3: Konten */}
          <TextareaGoogle
            name="content"
            label="Konten"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis konten berita..."
            rows={5}
          />
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 md:px-5 py-2 border-2 border-gray-200 text-gray-600 rounded-lg md:rounded-xl text-sm font-semibold hover:bg-gray-50"
        >
          <FaTimes className="w-4 h-4" />
          Batal
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 md:px-6 py-2 bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] text-white rounded-lg md:rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}