// components/marketplace/settings/LogoStore.tsx
// =========================
// LOGO STORE
// =========================

"use client";

interface Props {
  logoPreview: string;
  handleLogoUpload: (file: File) => void;
  bannerPreview: string;
  handleBannerUpload: (file: File) => void;
}

export default function LogoStore({ logoPreview, handleLogoUpload, bannerPreview, handleBannerUpload }: Props) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo (1:1) <span className="text-red-500">*</span>
        </label>
        <div className="w-full aspect-video rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
          {logoPreview ? (
            <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" />
          ) : (
            <span className="text-gray-400 text-sm">Pilih Logo</span>
          )}
        </div>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0]!)} className="mt-1 w-full text-xs text-gray-500" />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Banner (16:9) <span className="text-red-500">*</span>
        </label>
        <div className="w-full aspect-video rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
          {bannerPreview ? (
            <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner" />
          ) : (
            <span className="text-gray-400 text-sm">Pilih Banner</span>
          )}
        </div>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0]!)} className="mt-1 w-full text-xs text-gray-500" />
      </div>
    </div>
  );
}