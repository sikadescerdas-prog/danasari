"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import InputGoogle from "@/components/ui/InputGoogle";
import SelectGoogle from "@/components/ui/SelectGoogle";
import TextareaGoogle from "@/components/ui/TextareaGoogle";
import { FaUpload, FaTimes } from "react-icons/fa";

import { FACILITY_CATEGORY_OPTIONS, getTypeOptions } from "@/modules/dashboard/hooks/useVillageFacility";

import type { Facility, FacilityType, FacilityCategory, FormFacility } from "@/modules/desa/types/villageFacility.type";

type Props = {
  facility?: Facility;
  onSave: (form: FormFacility) => void;
  onCancel: () => void;
  isSaving: boolean;
};

const NO_IMAGE = "/img/no-image.webp";

export default function FacilityForm({
  facility,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [deletePhoto, setDeletePhoto] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState<FacilityCategory>("pendidikan");
  const [type, setType] = useState<FacilityType>("sd");
  const [locationUrl, setLocationUrl] = useState("");

  useEffect(() => {
    if (facility) {
      setName(facility.name || "");
      setAddress(facility.address || "");
      setCategory(facility.category || "pendidikan");
      setType(facility.type || "sd");
      setLocationUrl(facility.locationUrl || "");
      setPhotoPreview(facility.photo?.url || NO_IMAGE);
      setPhotoFile(undefined);
      setDeletePhoto(false);
    } else {
      resetForm();
    }
  }, [facility]);

  const resetForm = () => {
    setName("");
    setAddress("");
    setCategory("pendidikan");
    setType("sd");
    setLocationUrl("");
    setPhotoFile(undefined);
    setPhotoPreview("");
    setDeletePhoto(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setDeletePhoto(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = () => {
    setPhotoFile(undefined);
    setPhotoPreview("");
    setDeletePhoto(true);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as FacilityCategory;
    setCategory(newCategory);
    const options = getTypeOptions(newCategory);
    if (options.length > 0) {
      setType(options[0].value as FacilityType);
    }
  };

  const isEdit = !!facility;
  const photoSrc = photoPreview || NO_IMAGE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name,
      address,
      category,
      type,
      locationUrl,
      photoFile,
      deletePhoto,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 rounded-2xl p-4 md:p-6 space-y-4 md:space-y-5"
    >
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-bold text-gray-900">
          {isEdit ? "Edit Fasilitas" : "Tambah Fasilitas"}
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* PHOTO */}
        <div className="w-full md:w-1/4 flex-shrink-0 mb-3 md:mt-0">
          <p className="text-xs text-gray-500 mb-2">Foto (16:9)</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {photoPreview ? (
            <div className="w-full max-w-[300px]">
              <div className="w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden bg-gray-100 relative">
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="absolute top-2 right-2 w-6 h-6 md:w-7 md:h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                >
                  <FaTimes className="w-3 h-3" />
                </button>

                <Image
                  src={photoSrc}
                  alt="Foto"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 text-xs font-medium text-[#25C95F] border border-t-0 border-gray-200 rounded-b-lg hover:bg-[#25C95F] hover:text-white"
              >
                Ubah Foto
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-[300px] aspect-square rounded-lg md:rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:shadow-xl border-2 border-dashed border-gray-200 group flex flex-col items-center justify-center"
            >
              <FaUpload className="w-8 h-8 text-gray-300 group-hover:text-[#25C95F]" />
              <p className="text-xs text-gray-400 mt-2">Klik upload</p>
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="flex-1 space-y-3 md:space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectGoogle
              name="category"
              label="Kategori"
              value={category}
              options={FACILITY_CATEGORY_OPTIONS}
              onChange={handleCategoryChange}
            />

            <SelectGoogle
              name="type"
              label="Jenis"
              value={type}
              options={getTypeOptions(category)}
              onChange={(e) => setType(e.target.value as FacilityType)}
            />
          </div>

          <InputGoogle
            name="name"
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: SD Negeri 1 Sukajadi"
          />

          <TextareaGoogle
            name="address"
            label="Alamat"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Contoh: Jl. Raya Desa No.1"
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