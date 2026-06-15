// components/dashboard/news/NewsModal.tsx
"use client";

import Image from "next/image";
import { FaTimes, FaCalendarAlt, FaNewspaper, FaBullhorn, FaCalendar } from "react-icons/fa";

import type { News, NewsType } from "@/modules/desa/types/villageNews.type";

type Props = {
  news: News;
  onClose: () => void;
};

// Placeholder image
const NO_IMAGE = "/img/no-image.webp";

export default function NewsModal({ news, onClose }: Props) {
  const typeIcons = {
    berita: FaNewspaper,
    pengumuman: FaBullhorn,
    event: FaCalendar,
  };

  const TypeIcon = typeIcons[news.type as NewsType] || FaNewspaper;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const imageSrc = news.image?.url || NO_IMAGE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal - Scrollable */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <TypeIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase">
              {news.type}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Image - Selalu ada */}
          <div className="w-full aspect-video bg-gray-100 relative">
            <Image
              src={imageSrc}
              alt={news.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <FaCalendarAlt className="w-4 h-4" />
              <span>{formatDate(news.date)}</span>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {news.title}
            </h2>
            
            <div className="text-sm text-gray-600 whitespace-pre-wrap">
              {news.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}