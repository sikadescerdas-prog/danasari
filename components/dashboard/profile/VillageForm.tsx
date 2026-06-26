// components/dashboard/profile/Village.tsx
"use client";

import React, { useRef } from "react";
import { phoneToDisplay } from "@/shared/helpers/phone";
import { formatRibuan, parseRibuan } from "@/shared/utils/formatRibuan";
import InputGoogle from "@/components/ui/InputGoogle";
import TextareaGoogle from "@/components/ui/TextareaGoogle";
import { FaUpload, FaTrash, FaSave } from "react-icons/fa";

type Props = {
  formData: any;
  isUploading?: boolean;
  isSaving?: boolean;
  isFirstTime?: boolean;
  previewUrl?: string | null;
  onChange: (field: string, value: any) => void;
  onAddressChange: (field: string, value: any) => void;
  onSosmedChange: (field: string, value: any) => void;
  onFileSelect: (file: File) => void;
  onDeleteLogo: () => void;
  onSave: () => void;
};

export default function VillageForm({ 
  formData, 
  isUploading,
  isSaving,
  isFirstTime,
  previewUrl,
  onChange, 
  onAddressChange, 
  onSosmedChange,
  onFileSelect, 
  onDeleteLogo,
  onSave,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addr = formData.address || {};
  const sosmed = formData.socialMedia || {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasLogo = !!formData.logo?.url && formData.logo.url !== "";
  const showPreview = !!previewUrl;
  
  // ✅ Logo yang ditampilkan: preview dulu, baru dari DB
  const logoToShow = previewUrl || formData.logo?.url;
  const hasLogoToShow = hasLogo || showPreview;

  // Phone: DB (62xx) → Display (08xx)
  const phoneDisplay = formData.phone ? phoneToDisplay(formData.phone) : "";

  const styles = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; opacity: 0; }
  `;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
      <h3 className="text-base font-bold text-gray-800">{children}</h3>
    </div>
  );

  return (
    <div className="space-y-6">
      <style>{styles}</style>

      {/* ===== IDENTITAS DESA ===== */}
      <div className="animate-fade-up mb-4">
        <SectionLabel>Identitas Desa</SectionLabel>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Logo */}
          <div className="col-span-12 md:col-span-3 flex flex-col items-start md:items-center">
            <div className="flex items-center mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Logo</p>
                <span className="text-xs text-red-500 font-bold">*</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {hasLogoToShow ? (
              <div className="w-40 lg:w-48 group">
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-lg group-hover:shadow-xl transition-shadow">
                  {(isUploading || isSaving) && (
                    <div className="absolute inset-0 bg-white/90 z-10 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="aspect-square w-full bg-gray-50">
                    <img src={logoToShow} alt="Logo" className="w-full h-full object-contain p-2" />
                  </div>
                  <button 
                    type="button" 
                    onClick={onDeleteLogo} 
                    className="absolute top-2 right-2 w-7 h-7 bg-white text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow disabled:opacity-0"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full py-2.5 mt-3 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                >
                  {showPreview ? "Ganti Logo" : "Ubah Logo"}
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full md:w-36 lg:w-44 h-32 md:h-36 lg:h-44 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:shadow-lg cursor-pointer transition-all group"
              >
                {isUploading || isSaving ? (
                  <div className="w-8 h-8 border-2 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaUpload className="w-6 h-6 text-gray-300 group-hover:text-emerald-500" />
                    <p className="text-xs text-gray-400 mt-2 group-hover:text-emerald-500">Upload</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="col-span-12 md:col-span-9 space-y-5">
              <InputGoogle name="name" label="Nama Desa" value={formData.name} placeholder="Nama Desa" onChange={(e) => onChange("name", e.target.value)} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <InputGoogle 
                name="foundedYear" 
                label="Tahun Berdiri" 
                value={formData.foundedYear} 
                placeholder="1990"
                onChange={(e) => onChange("foundedYear", e.target.value.replace(/\D/g, ""))}
                maxLength={4} 
              />
              <InputGoogle 
                name="areaSize" 
                label="Luas (ha)" 
                value={formData.areaSize} 
                placeholder="62,5"
                onChange={(e) => onChange("areaSize", e.target.value)}
              />
              <InputGoogle 
                name="phone" 
                label="Telepon" 
                value={phoneDisplay} 
                placeholder="0812 3456 7890"
                onChange={(e) => onChange("phone", e.target.value)}
                maxLength={15} 
              />
              <InputGoogle name="email" label="E-mail" value={formData.email} placeholder="desa@email.com" onChange={(e) => onChange("email", e.target.value)} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TextareaGoogle
                name="history"
                rows={6}
                label="Sejarah Desa"
                value={formData.history}
                placeholder="Sejarah singkat desa..."
                onChange={(e) => onChange("history", e.target.value)}
              />

              <TextareaGoogle
                name="welcomeMessage"
                rows={6}
                label="Sambutan"
                value={formData.welcomeMessage}
                placeholder="Sambutan kepala desa..."
                onChange={(e) => onChange("welcomeMessage", e.target.value)}
              />
            </div>
            
          </div>
        </div>
      </div>

      {/* ===== VISI & MISI ===== */}
      <div className="animate-fade-up delay-1">
        <SectionLabel>Visi & Misi</SectionLabel>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TextareaGoogle name="vision" label="Visi" value={formData.vision} placeholder="Visi desa..." onChange={(e) => onChange("vision", e.target.value)} rows={4} />
          <TextareaGoogle name="mission" label="Misi" value={formData.mission} placeholder="Misi desa..." onChange={(e) => onChange("mission", e.target.value)} rows={4} />
        </div>
      </div>

      {/* ===== ALAMAT & WILAYAH ===== */}
      <div className="animate-fade-up delay-2">
        <SectionLabel>Alamat & Wilayah</SectionLabel>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-2 space-y-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Alamat</p>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <InputGoogle name="detailAddress" label="Alamat Lengkap" value={addr.detailAddress} placeholder="Jl. Desa No x" onChange={(e) => onAddressChange("detailAddress", e.target.value)} />
              </div>
              <InputGoogle 
                name="rt" 
                label="RT" 
                value={addr.rt} 
                placeholder="001"
                onChange={(e) => onAddressChange("rt", e.target.value.replace(/\D/g, ""))}
                maxLength={3} 
              />
              <InputGoogle 
                name="rw" 
                label="RW" 
                value={addr.rw} 
                placeholder="001"
                onChange={(e) => onAddressChange("rw", e.target.value.replace(/\D/g, ""))}
                maxLength={3} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGoogle name="village" label="Desa" value={addr.village} placeholder="Desa" onChange={(e) => onAddressChange("village", e.target.value)} />
              <InputGoogle name="district" label="Kecamatan" value={addr.district} placeholder="Kecamatan" onChange={(e) => onAddressChange("district", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <InputGoogle name="regency" label="Kabupaten" value={addr.regency} placeholder="Kabupaten" onChange={(e) => onAddressChange("regency", e.target.value)} />
              <InputGoogle name="province" label="Provinsi" value={addr.province} placeholder="Provinsi" onChange={(e) => onAddressChange("province", e.target.value)} />
              <InputGoogle 
                name="postalCode" 
                label="Kode Pos" 
                value={addr.postalCode} 
                placeholder="5000"
                onChange={(e) => onAddressChange("postalCode", e.target.value.replace(/\D/g, ""))}
                maxLength={5} 
              />
            </div>
            <InputGoogle name="locationUrl" label="Link Peta" value={formData.locationUrl} placeholder="https://maps.google.com/..." onChange={(e) => onChange("locationUrl", e.target.value)} />
          </div>
          
          <div className="col-span-12 lg:col-span-1 space-y-5 w-full">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Batas</p>
            <InputGoogle name="north" label="Utara" value={addr.north} placeholder="Desa X" onChange={(e) => onAddressChange("north", e.target.value)} />
            <InputGoogle name="south" label="Selatan" value={addr.south} placeholder="Desa Y" onChange={(e) => onAddressChange("south", e.target.value)} />
            <InputGoogle name="east" label="Timur" value={addr.east} placeholder="Desa Z" onChange={(e) => onAddressChange("east", e.target.value)} />
            <InputGoogle name="west" label="Barat" value={addr.west} placeholder="Desa W" onChange={(e) => onAddressChange("west", e.target.value)} />
          </div>
          
          <div className="col-span-12 lg:col-span-1 space-y-5 w-full">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Sosmed</p>
            <InputGoogle name="facebook" label="Facebook" value={sosmed.facebook} placeholder="https://facebook.com/..." onChange={(e) => onSosmedChange("facebook", e.target.value)} />
            <InputGoogle name="instagram" label="Instagram" value={sosmed.instagram} placeholder="https://instagram.com/..." onChange={(e) => onSosmedChange("instagram", e.target.value)} />
            <InputGoogle name="tiktok" label="TikTok" value={sosmed.tiktok} placeholder="https://tiktok.com/..." onChange={(e) => onSosmedChange("tiktok", e.target.value)} />
            <InputGoogle name="youtube" label="Youtube" value={sosmed.youtube} placeholder="https://youtube.com/..." onChange={(e) => onSosmedChange("youtube", e.target.value)} />
          </div>
        </div>
      </div>

      {/* ===== SAVE BUTTON ===== */}
      <div className="animate-fade-up delay-3">
        <div className="flex justify-end pt-3 gap-3">
          <button 
            type="button" 
            onClick={onSave} 
            disabled={isSaving} 
            className="relative flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-semibold transition-all bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg active:scale-[0.98] disabled:bg-emerald-300"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </span>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}