// components/dashboard/potential/PotentialHeader.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaMapMarker, FaPlus } from "react-icons/fa";

export default function PotentialHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // FIX: Samakan logic dengan NewsHeader
  const isFormMode = searchParams.get("add") === "" || searchParams.get("edit") === "" || !!searchParams.get("add") || !!searchParams.get("edit");

  const handleAdd = () => {
    router.push("?add");
  };

  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-8 pt-8 pb-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-8 w-32 h-32 bg-white/30 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-16 left-1/3 w-48 h-48 bg-white/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/40">
              <FaMapMarker className="w-7 h-7 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Potensi Desa
              </h2>
              <p className="text-sm text-white/80 mt-1">
                Kelola potensi umkm, pertanian, kerajinan, dan objek wisata
              </p>
            </div>
          </div>

          {!isFormMode && (
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-3 py-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/30 transition-all active:scale-95"
            >
              <FaPlus className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white hidden md:inline">Tambah</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex items-center gap-1 h-1">
          <div className="flex-1 h-full bg-white/30"></div>
          <div className="flex-1 h-full bg-white/40"></div>
          <div className="flex-1 h-full bg-white/30"></div>
          <div className="flex-1 h-full bg-white/50"></div>
          <div className="flex-1 h-full bg-white/30"></div>
          <div className="flex-1 h-full bg-white/40"></div>
          <div className="flex-1 h-full bg-white/30"></div>
          <div className="flex-1 h-full bg-white/60"></div>
          <div className="flex-1 h-full bg-white/30"></div>
          <div className="flex-1 h-full bg-white/40"></div>
        </div>
        <div className="h-1 bg-white"></div>
      </div>
    </div>
  );
}