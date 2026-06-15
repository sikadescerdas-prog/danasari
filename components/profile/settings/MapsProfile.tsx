// components/profile/settings/ProfileMaps.tsx
// =========================
// MAPS PROFILE
// =========================

"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import Maps from "@/components/ui/Maps";
import type { Location } from "@/core/profile/types/profile.types";

type Props = {
  value?: Location;
  onSelect: (data: Location) => void;
};

const DEFAULT: Location = { lat: -7.3541, lng: 109.3411 };

export default function ProfileMaps({ value, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const isSelected = !!(value?.lat && value?.lng);

  const formatCoord = (val?: Location) => {
    if (!val?.lat || !val?.lng) return "Pilih lokasi";
    return `${val.lat.toFixed(4)}, ${val.lng.toFixed(4)}`;
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full px-6 mt-[-30px]">
      <div className="grid grid-cols-12 items-center py-4 border-b">
        <div className="col-span-4 text-sm font-medium text-gray-500">Maps</div>
        <div className="col-span-8">
          <div onClick={() => setOpen(!open)} className="flex items-center justify-between cursor-pointer hover:text-green-600 transition">
            {isSelected ? (
              <span className="text-sm text-green-600">Lokasi sudah dipilih</span>
            ) : (
              <span className={`text-sm ${isSelected ? "text-gray-900" : "text-gray-400"}`}>
                {formatCoord(value)}
              </span>
            )}
            <ChevronRight size={16} className={`text-gray-400 transition ${open ? "rotate-90" : ""}`} />
          </div>
        </div>
      </div>
      
      {open && (
        <div className="w-full pb-4">
          <Maps 
            value={value} 
            onSelect={onSelect} 
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  );
}