// components/dashboard/potential/PotentialForm.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import InputGoogle from "@/components/ui/InputGoogle";
import SelectGoogle from "@/components/ui/SelectGoogle";
import TextareaGoogle from "@/components/ui/TextareaGoogle";
import { FaUpload, FaTimes } from "react-icons/fa";

import { POTENTIAL_CATEGORY_OPTIONS } from "@/modules/dashboard/hooks/useVillagePotential";

import type { potential, potentialCategory, Formpotential } from "@/modules/desa/types/villagePotential.type";

type Props = {
  potential?: potential;
  onSave: (form: Formpotential) => void;
  onCancel: () => void;
  isSaving: boolean;
};

const NO_IMAGE = "/img/no-image.webp";

export default function PotentialForm({
  potential,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteImage, setDeleteImage] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<potentialCategory>("umkm");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [locationUrl, setLocationUrl] = useState("");

  useEffect(() => {
    if (potential) {
      setName(potential.name || "");
      setCategory(potential.category || "umkm");
      setDescription(potential.description || "");
      setAddress(potential.address || "");
      setLocationUrl(potential.locationUrl || "");
      setImagePreview(potential.image?.url || NO_IMAGE);
      setImageFile(undefined);
      setDeleteImage(false);
    } else {
      resetForm();
    }
  }, [potential]);

  const resetForm = () => {
    setName("");
    setCategory("umkm");
    setDescription("");
    setAddress("");
    setLocationUrl("");
    setImageFile(undefined);
    setImagePreview("");
    setDeleteImage(false);
  };

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

  const isEdit = !!potential;
  const imageSrc = imagePreview || NO_IMAGE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name,
      category,
      description,
      address,
      locationUrl,
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
          {isEdit ? "Edit Potential" : "Tambah Potential"}
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
            <div className="w-full max-w-[300px]">
              <div className="w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden bg-gray-100 relative">
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
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 text-xs font-medium text-orange-600 border border-t-0 border-gray-200 rounded-b-lg hover:bg-orange-600 hover:text-white"
              >
                Ubah Gambar
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-[300px] aspect-square rounded-lg md:rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:shadow-xl border-2 border-dashed border-gray-200 group flex flex-col items-center justify-center"
            >
              <FaUpload className="w-8 h-8 text-gray-300 group-hover:text-orange-500" />
              <p className="text-xs text-gray-400 mt-2">Klik upload</p>
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="flex-1 space-y-3 md:space-y-4">
          <SelectGoogle
            name="category"
            label="Kategori"
            value={category}
            options={POTENTIAL_CATEGORY_OPTIONS}
            onChange={(e) => setCategory(e.target.value as potentialCategory)}
          />

          <InputGoogle
            name="name"
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Kopi Robusta Desa..."
          />

          <TextareaGoogle
            name="description"
            label="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi potensi..."
            rows={3}
          />

          <TextareaGoogle
            name="address"
            label="Alamat"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lokasi..."
            rows={2}
          />

          <InputGoogle
            name="locationUrl"
            label="Link Lokasi (Google Maps)"
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      {/* BUTTONS */}
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
          className="flex items-center gap-2 px-5 md:px-6 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg md:rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}