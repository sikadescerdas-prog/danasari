// components/dashboard/potential/PotentialTable.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaStore, 
  FaLeaf, 
  FaBox, 
  FaFish, 
  FaHands, 
  FaLandmark, 
  FaUtensils, 
  FaMountain,
  FaTimes
} from "react-icons/fa";
import { sweet } from "@/shared/utils/sweet";

import type { potential, potentialCategory } from "@/modules/desa/types/villagePotential.type";

type Props = {
  data: potential[];
  onEdit: (potential: potential) => void;
  onDelete: (potential: potential) => Promise<void>;
};

type TabType = potentialCategory;

const tabs = [
  { key: "umkm", label: "UMKM", icon: FaStore, color: "bg-blue-500" },
  { key: "pertanian", label: "Pertanian", icon: FaLeaf, color: "bg-green-500" },
  { key: "peternakan", label: "Peternakan", icon: FaBox, color: "bg-amber-600" },
  { key: "perikanan", label: "Perikanan", icon: FaFish, color: "bg-cyan-500" },
  { key: "kerajinan", label: "Kerajinan", icon: FaHands, color: "bg-purple-500" },
  { key: "budaya", label: "Budaya", icon: FaLandmark, color: "bg-yellow-500" },
  { key: "sejarah", label: "Sejarah", icon: FaLandmark, color: "bg-orange-600" },
  { key: "kuliner", label: "Kuliner", icon: FaUtensils, color: "bg-red-500" },
  { key: "objek_wisata", label: "Objek Wisata", icon: FaMountain, color: "bg-teal-500" },
] as const;

const NO_IMAGE = "/img/no-image.webp";

export default function PotentialTable({ data, onEdit, onDelete }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("umkm");

  const filteredData = data.filter((item) => item.category === activeTab);
  const isEmpty = filteredData.length === 0;

  const getCount = (type: TabType) => {
    return data.filter((item) => item.category === type).length;
  };

  const getEmptyMessage = () => {
    const messages: Record<string, string> = {
      umkm: "Belum ada data UMKM",
      pertanian: "Belum ada data Pertanian",
      peternakan: "Belum ada data Peternakan",
      perikanan: "Belum ada data Perkinsitaan",
      kerajinan: "Belum ada data Kerajinan",
      budaya: "Belum ada data Budaya",
      sejarah: "Belum ada data Sejarah",
      kuliner: "Belum ada data Kuliner",
      objek_wisata: "Belum ada data Objek Wisata",
    };
    return messages[activeTab] || "Belum ada data";
  };

  const handleDelete = async (id: string) => {
    const item = data.find((p) => p.id === id);
    if (!item) return;
    
    const confirmed = await sweet.confirmDanger({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus "${item.name}"?`,
    });

    if (confirmed) {
      await onDelete(item);
    }
  };

  const getImageSrc = (image?: potential["image"]) => {
    return image?.url || NO_IMAGE;
  };

  const getActiveColor = () => {
    const tab = tabs.find(t => t.key === activeTab);
    return tab?.color || "bg-orange-500";
  };

  return (
    <div className="rounded-2xl p-2 md:p-6 bg-white md:bg-transparent">
      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = getCount(tab.key);

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl border transition-all whitespace-nowrap flex-shrink-0
                ${isActive
                  ? `${tab.color} border-transparent text-white shadow-md`
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
              <span className="text-sm font-semibold hidden sm:inline">{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* CONTENT: MOBILE CARD VIEW VS DESKTOP TABLE VIEW */}
      {!isEmpty ? (
        <div className="w-full">
          
          {/* 1. DESKTOP TABLE VIEW (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase w-48">Nama</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Deskripsi</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Alamat</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                          <Image src={getImageSrc(item.image)} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 line-clamp-1">{item.description || "-"}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 line-clamp-1">{item.address || "-"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {item.locationUrl && (
                          <a href={item.locationUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Buka Maps">
                            <FaMapMarkerAlt className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. MOBILE CARD VIEW (Visible on Mobile only) */}
          <div className="md:hidden space-y-3">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3">
                {/* Card Header */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                    <Image src={getImageSrc(item.image)} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description || "-"}</p>
                  </div>
                </div>

                {/* Card Details */}
                {item.address && (
                   <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                     <FaMapMarkerAlt className="w-3 h-3 mt-0.5 text-red-400" />
                     <span className="line-clamp-2">{item.address}</span>
                   </div>
                )}

                {/* Card Actions */}
                <div className="flex justify-between items-center border-t pt-3 mt-1">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(item)} 
                      className="text-xs font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                  {item.locationUrl && (
                    <a 
                      href={item.locationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-red-500 hover:underline flex items-center gap-1"
                    >
                      <FaMapMarkerAlt className="w-3 h-3" /> Maps
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className={`w-20 h-20 ${getActiveColor()} rounded-full flex items-center justify-center mb-4 opacity-40`}>
             {(() => {
                const tab = tabs.find(t => t.key === activeTab);
                const Icon = tab ? tab.icon : FaBox;
                return <Icon className="w-8 h-8 text-white" />;
             })()}
          </div>
          <p className="text-gray-500 font-medium text-sm">{getEmptyMessage()}</p>
        </div>
      )}
    </div>
  );
}