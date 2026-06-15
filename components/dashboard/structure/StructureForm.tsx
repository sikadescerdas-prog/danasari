// components/dashboard/structure/StructureForm.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import InputGoogle from "@/components/ui/InputGoogle";
import SelectGoogle from "@/components/ui/SelectGoogle";
import { FaUpload, FaTimes } from "react-icons/fa";
import { phoneToDisplay } from "@/shared/helpers/phone";

import { STRUCTURE_GENDER_OPTIONS, STRUCTURE_TITLE_OPTIONS } from "@/modules/dashboard/hooks/useVillageStructure";

import type { StructurePosition, FormStructure, StructureGender, StructureTitle } from "@/modules/desa/types/villageStructure.type";

type Props = {
  structure?: StructurePosition;
  onSave: (form: FormStructure) => void;
  onCancel: () => void;
  isSaving: boolean;
};

const NO_IMAGE = "/img/no-image.webp";

export default function StructureForm({
  structure,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [deletePhoto, setDeletePhoto] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState<StructureTitle>("kepala_desa");
  const [gender, setGender] = useState<StructureGender>("laki_laki");
  const [phone, setPhone] = useState("");
  const [yearJoined, setYearJoined] = useState("");

  useEffect(() => {
    if (structure) {
      setName(structure.name || "");
      setTitle(structure.title || "kepala_desa");
      setGender(structure.gender || "laki_laki");
      // ✅ Phone: DB (62xx) → Display (08xx)
      setPhone(structure.phone ? phoneToDisplay(structure.phone) : "");
      setYearJoined(structure.yearJoined ? String(structure.yearJoined) : "");
      setPhotoPreview(structure.photo?.url || NO_IMAGE);
      setPhotoFile(undefined);
      setDeletePhoto(false);
    } else {
      resetForm();
    }
  }, [structure]);

  const resetForm = () => {
    setName("");
    setTitle("kepala_desa");
    setGender("laki_laki");
    setPhone("");
    setYearJoined("");
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

  const isEdit = !!structure;
  const photoSrc = photoPreview || NO_IMAGE;

  // ✅ Submit - biarkan parent handle phoneToSave()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name,
      title,
      gender,
      phone, // Langsung passed, parent yang convert
      yearJoined: yearJoined ? parseInt(yearJoined) : undefined,
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
          {isEdit ? "Edit Struktur" : "Tambah Struktur"}
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* PHOTO */}
        <div className="w-full md:w-1/4 flex-shrink-0 mb-3 md:mt-0">
          <p className="text-xs text-gray-500 mb-2">Foto (1:1)</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {photoPreview ? (
            <div className="w-full max-w-[200px]">
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
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 text-xs font-medium text-red-600 border border-t-0 border-gray-200 rounded-b-lg hover:bg-red-600 hover:text-white"
              >
                Ubah Foto
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-[200px] aspect-square rounded-lg md:rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:shadow-xl border-2 border-dashed border-gray-200 group flex flex-col items-center justify-center"
            >
              <FaUpload className="w-8 h-8 text-gray-300 group-hover:text-red-500" />
              <p className="text-xs text-gray-400 mt-2">Klik upload</p>
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="flex-1 space-y-3 md:space-y-4">
          <InputGoogle
            name="name"
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Ahmad Budiman"
          />

          <SelectGoogle
            name="title"
            label="Jabatan"
            value={title}
            options={STRUCTURE_TITLE_OPTIONS}
            onChange={(e) => setTitle(e.target.value as StructureTitle)}
          />

          <SelectGoogle
            name="gender"
            label="Jenis Kelamin"
            value={gender}
            options={STRUCTURE_GENDER_OPTIONS}
            onChange={(e) => setGender(e.target.value as StructureGender)}
          />

          <InputGoogle
            name="phone"
            label="No. HP"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0822 xxxx xxxx"
            maxLength={15}
          />

          <InputGoogle
            name="yearJoined"
            label="Tahun Masuk"
            value={yearJoined}
            onChange={(e) => setYearJoined(e.target.value)}
            placeholder="2020"
            maxLength={4}
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
          className="flex items-center gap-2 px-5 md:px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg md:rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}