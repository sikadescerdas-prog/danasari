// components/dashboard/news/NewsTable.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FaEdit, FaTrash, FaEye, FaNewspaper, FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import { sweet } from "@/shared/utils/sweet";

import type { News, NewsType } from "@/modules/desa/types/villageNews.type";
import NewsModal from "@/components/dashboard/news/NewsModal";

type Props = {
  data: News[];
  onEdit: (news: News) => void;
  onDelete: (news: News) => Promise<void>;  // ← Ubah: Terima object, bukan id + publicId
};

type TabType = NewsType;

const tabs = [
  { key: "berita" as TabType, label: "Berita", icon: FaNewspaper },
  { key: "pengumuman" as TabType, label: "Pengumuman", icon: FaBullhorn },
  { key: "event" as TabType, label: "Event", icon: FaCalendarAlt },
] as const;

const NO_IMAGE = "/img/no-image.webp";

export default function NewsTable({ data, onEdit, onDelete }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("berita");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const filteredData = data.filter((item) => item.type === activeTab);
  const isEmpty = filteredData.length === 0;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "/");
  };

  const getCount = (type: TabType) => {
    return data.filter((item) => item.type === type).length;
  };

  const getEmptyMessage = () => {
    const messages = {
      berita: "Belum ada berita",
      pengumuman: "Belum ada pengumuman",
      event: "Belum ada event",
    };
    return messages[activeTab] || "Belum ada data";
  };

  const getImageSrc = (image?: News["image"]) => {
    return image?.url || NO_IMAGE;
  };

  const handleView = (id: string) => {
    const item = data.find((n) => n.id === id);
    if (item) setSelectedNews(item);
  };

  const handleDelete = async (id: string) => {
    const item = data.find((n) => n.id === id);
    if (!item) return;
    
    const confirmed = await sweet.confirmDanger({
      title: "Hapus?",
      text: `Yakin hapus "${item.title}"?`,
    });

    if (confirmed) {
      await onDelete(item);
    }
  };

  return (
    <div className="rounded-2xl p-4 md:p-6">
      {/* TABS */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = getCount(tab.key);

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap
                ${isActive
                  ? "bg-white border-gray-200 shadow-sm text-gray-900"
                  : "border-transparent text-gray-500 hover:bg-white hover:border-gray-200 hover:shadow-sm"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive ? "bg-[#25C95F] text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TABLE */}
      {!isEmpty && (
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-32">
                Tanggal
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Judul
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(item.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getImageSrc(item.image)}
                        alt={item.title}
                        width={48}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleView(item.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Lihat"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Hapus"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* EMPTY STATE */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {activeTab === "berita" && <FaNewspaper className="w-6 h-6 text-gray-400" />}
            {activeTab === "pengumuman" && <FaBullhorn className="w-6 h-6 text-gray-400" />}
            {activeTab === "event" && <FaCalendarAlt className="w-6 h-6 text-gray-400" />}
          </div>
          <p className="text-gray-500 font-medium">{getEmptyMessage()}</p>
        </div>
      )}

      {/* MODAL */}
      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </div>
  );
}