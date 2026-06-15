// components/marketplace/settings/MapsStore.tsx
// =========================
// MAPS STORE
// =========================

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";

const Maps = dynamic(() => import("@/components/ui/Maps"), { ssr: false, loading: () => <div className="h-14 border rounded-xl flex items-center justify-center"><span className="text-gray-400 text-sm">Loading...</span></div> });

interface Props {
  location: { lat: number; lng: number };
  setLocation: (val: { lat: number; lng: number }) => void;
  copyFromProfile: boolean;
  setCopyFromProfile: (val: boolean) => void;
  mapDisabled?: boolean;
}

export default function MapsStore({ location, setLocation, copyFromProfile, setCopyFromProfile, mapDisabled = false }: Props) {
  const [showMaps, setShowMaps] = useState(false);

  // Reset
  const handleReset = () => {
    setLocation({ lat: 0, lng: 0 });
  };

  // Close
  const handlePilih = () => {
    setShowMaps(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Lokasi Maps <span className="text-red-500">*</span>
      </label>

      {/* DROPDOWN TOGGLE */}
      <button type="button" onClick={() => setShowMaps(!showMaps)} className="w-full px-4 py-2 border rounded-xl flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50">
        {location.lat !== 0 && location.lng !== 0 ? (
          <span className="text-green-600">Lokasi sudah dipilih</span>
        ) : (
          <span>Pilih lokasi di maps</span>
        )}
        {showMaps ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* MAPS DROPDOWN */}
      {showMaps && (
        <div className="mt-2 p-2">
          <Maps value={location} onSelect={setLocation} disabled={mapDisabled} onClose={handlePilih} />

          {location.lat !== 0 && location.lng !== 0 && (
            <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline mt-1 flex items-center gap-1">
              <MapPin size={12} /> Lihat di Maps
            </a>
          )}
        </div>
      )}

      {/* COPY FROM PROFILE */}
      <div className="mt-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
          <input type="checkbox" checked={copyFromProfile} onChange={(e) => setCopyFromProfile(e.target.checked)} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
          <span>Alamat sama dengan rumah (profil)</span>
        </label>
      </div>
    </div>
  );
}