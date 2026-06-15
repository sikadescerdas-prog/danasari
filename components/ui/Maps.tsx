// components/ui/Maps.tsx
// ========================
// MAPS
// ========================

"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { RotateCcw, MapPinned } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Location = { lat: number; lng: number };

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// DEFAULT = empty
const DEFAULT: Location = { lat: 0, lng: 0 };

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.flyTo(center, 14, { duration: 0.5 });
    }
  }, [center, map]);
  return null;
}

function ClickMarker({ position, onClick, readOnly }: { position: Location; onClick?: (loc: Location) => void; readOnly?: boolean }) {
  useMapEvents({
    click: (e) => {
      if (readOnly) return;
      if (onClick) onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  
  // Only show marker if has location
  if (position.lat === 0 && position.lng === 0) return null;
  
  return <Marker position={[position.lat, position.lng]} icon={redIcon} />;
}

export default function Maps({ 
  value, 
  onSelect, 
  height = "h-56",
  onClose,
  disabled = false,
}: { 
  value?: Location;
  onSelect: (loc: Location) => void; 
  height?: string;
  onClose?: () => void;
  disabled?: boolean;
}) {
  const [pos, setPos] = useState<Location>(() => {
    const hasValue = value && (value.lat !== 0 || value.lng !== 0);
    return hasValue ? value : DEFAULT;
  });

  useEffect(() => {
    const hasValue = value && (value.lat !== 0 || value.lng !== 0);
    setPos(hasValue ? value : DEFAULT);
  }, [value?.lat, value?.lng]);

  return (
    <div className="space-y-2">
      <div className={`${height} rounded-xl overflow-hidden border`}>
        <MapContainer center={[pos.lat || -7.3541, pos.lng || 109.3411]} zoom={14} className="h-full w-full" attributionControl={false}>
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater center={[pos.lat || -7.3541, pos.lng || 109.3411]} />
          <ClickMarker 
            position={pos} 
            onClick={(loc) => { 
              if (!disabled) { 
                setPos(loc); 
                onSelect(loc); 
              } 
            }} 
            readOnly={disabled} 
          />
        </MapContainer>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setPos(DEFAULT);
            onSelect(DEFAULT);
          }}
          disabled={disabled}
          className="flex flex-1 items-center justify-center gap-2 py-2 text-xs border rounded-xl text-gray-600 disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 py-2 text-xs bg-green-500 text-white rounded-xl"
          >
            <MapPinned size={14} />
            Pilih Maps
          </button>
        )}
      </div>
    </div>
  );
}