// app/(desa)/struktur/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Crown, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import VillageHeader from "@/components/home/DesaHeader";

const STRUCTURE_POSITIONS = [
  { titles: ["kepala_desa"], level: 1, label: "PIMPINAN" },
  { titles: ["sekretaris_desa", "bendahara"], level: 2, label: "SEKRETARIS & BENDAHARA" },
  { titles: ["kaur_keuangan", "kaur_umum"], level: 3, label: "KAUR" },
  { titles: ["kasi_kesejahteraan", "kasi_pemerintah", "kasi_pembangunan"], level: 4, label: "KASI" },
  { titles: ["kadus"], level: 5, label: "KADUS" },
  { titles: ["rw"], level: 6, label: "RW" },
  { titles: ["rt"], level: 7, label: "RT" },
  { titles: ["bpd"], level: 8, label: "BPD" },
  { titles: ["karang_taruna", "kader_posyandu", "lainnya"], level: 9, label: "ORGANISASI DESA" },
];

const TITLE_LABELS: Record<string, string> = {
  kepala_desa: "Kepala Desa",
  sekretaris_desa: "Sekretaris",
  bendahara: "Bendahara",
  kaur_keuangan: "Kaur Keuangan",
  kaur_umum: "Kaur Umum",
  kasi_kesejahteraan: "Kasi Kesejahteraan",
  kasi_pemerintah: "Kasi Pemerintahan",
  kasi_pembangunan: "Kasi Pembangunan",
  kadus: "Kadus",
  rw: "RW",
  rt: "RT",
  bpd: "BPD",
  karang_taruna: "Karang Taruna",
  kader_posyandu: "Kader Posyandu",
  lainnya: "Lainnya",
};

export default function StructurePage() {
  const [structureData, setStructureData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "village/structure"), (snap) => {
      setStructureData(snap.val() || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getPrefix = (gender?: string) => {
    if (gender === "perempuan") return "Bu";
    if (gender === "laki_laki") return "Pak";
    return "";
  };

  const formatName = (item: any) => {
    if (!item.name?.trim()) {
      return TITLE_LABELS[item.title] || item.title || "-";
    }
    const prefix = getPrefix(item.gender);
    return prefix ? `${prefix} ${item.name}` : item.name;
  };

  const getPersonByTitle = (title: string) => {
    const list = Object.values(structureData);
    return (list as any[]).find((p: any) => p.title === title);
  };

  const allPositions = STRUCTURE_POSITIONS.map(levelConfig => {
    const items = levelConfig.titles.map(title => {
      const person = getPersonByTitle(title);
      return { title, person };
    });
    return { ...levelConfig, items };
  });

  const totalPersonel = Object.keys(structureData).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white-50 pt-14 pb-8">
      <VillageHeader 
        title="Struktur Desa"
      />
      
      {/* Cards Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:-mt-28 relative z-10 space-y-10">
        {allPositions.map((levelConfig, levelIndex) => (
          <div key={levelConfig.level} className="relative">
            <div className="text-center mb-6">
              <span className="inline-block px-5 py-2 bg-white text-green-600 text-sm font-bold rounded-2xl shadow-lg border border-green-100">
                {levelConfig.label}
              </span>
            </div>

            {levelIndex > 0 && (
              <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-green-300 -translate-x-1/2" />
            )}

            <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
              {levelConfig.items.map((item: any, itemIndex: number) => (
                <div 
                  key={item.title} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${itemIndex * 0.1}s` }}
                >
                  <div className="w-48 sm:w-52">
                    {item.person ? (
                      <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
                        <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />
                        <div className="p-5">
                          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                            {item.person.photo?.url ? (
                              <Image 
                                src={item.person.photo.url} 
                                alt={item.person.name} 
                                width={80} 
                                height={80} 
                                className="w-full h-full object-cover rounded-2xl" 
                                unoptimized
                              />
                            ) : (
                              <Crown className="w-10 h-10 text-green-600" />
                            )}
                          </div>
                          <div className="text-center mt-4">
                            <h3 className="font-bold text-slate-800 text-sm truncate">
                              {formatName(item.person)}
                            </h3>
                            <p className="text-sm text-green-600 font-medium mt-0.5">
                              {TITLE_LABELS[item.title]}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-[1.5rem] shadow-sm border-2 border-dashed border-slate-200 overflow-hidden opacity-60">
                        <div className="h-1.5 bg-slate-200" />
                        <div className="p-5">
                          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
                            <Plus className="w-10 h-10 text-slate-300" />
                          </div>
                          <div className="text-center mt-4">
                            <h3 className="font-medium text-slate-400 text-sm">
                              {TITLE_LABELS[item.title]}
                            </h3>
                            <p className="text-xs text-slate-300 mt-1">Vacant</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="font-bold text-white text-lg">Daftar Personel</h2>
            <p className="text-green-100 text-xs mt-0.5">Semua struktur organisasi desa</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Jabatan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase hidden sm:table-cell">JK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {totalPersonel > 0 ? (
                  Object.values(structureData).map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-green-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.photo?.url ? (
                              <Image src={item.photo.url} alt={item.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                            ) : (
                              <Crown className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <span className="font-medium text-slate-800 text-xs sm:text-sm">{formatName(item)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full inline-block">
                          {TITLE_LABELS[item.title] || item.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs hidden sm:table-cell">
                        {item.gender === 'perempuan' ? 'Perempuan' : item.gender === 'laki_laki' ? 'Laki-laki' : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                      Belum ada data struktur
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}