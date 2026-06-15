// app/visi-misi/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Eye, Target } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import VillageHeader from "@/components/home/DesaHeader";

export default function VisiMisiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "village/profile"), (snap) => {
      setData(snap.val());
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500">Data tidak ditemukan.</p>
    </div>
  );

  const missionItems = (data?.mission || "").split("\n").map((i: string) => i.trim()).filter((i: string) => i);

  return (
    <main className="min-h-screen bg-white-50 pt-14 pb-20">
      <style jsx global>{`
        @keyframes fadeInUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
        .animateFadeInUp { animation:fadeInUp 0.6s ease-out forwards;opacity:0 }
      `}</style>

      {/* PAKAI VillageHeader */}
      <VillageHeader 
        title="Visi dan Misi"
      />

      {/* Cards Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-20 space-y-4">
        
        {/* Visi Card */}
        <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-100 overflow-hidden animateFadeInUp delay-200 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"></div>
          <div className="p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <Eye className="w-5 h-5 text-white"/>
              </div>
              <h2 className="font-bold text-slate-800 text-base">Visi</h2>
            </div>
            {data.vision ? (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
                <p className="text-sm font-medium leading-relaxed">{data.vision}</p>
              </div>
            ) : (
              <div className="py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                <p className="text-sm text-slate-400">Visi belum tersedia</p>
              </div>
            )}
          </div>
        </div>

        {/* Misi Card */}
        <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-100 overflow-hidden animateFadeInUp delay-300 hover:shadow-xl hover:border-amber-200 hover:-translate-y-1 transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-green-400"></div>
          <div className="p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                <Target className="w-5 h-5 text-white"/>
              </div>
              <h2 className="font-bold text-slate-800 text-base">Misi</h2>
            </div>
            {missionItems.length > 0 ? (
              <div className="space-y-3">
                {missionItems.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-green-300 hover:bg-green-50/50 hover:scale-[1.02] transition-all duration-300">
                    <span className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed pt-0.5">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                <p className="text-sm text-slate-400">Misi belum tersedia</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}