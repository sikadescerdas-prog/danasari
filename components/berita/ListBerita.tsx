'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import type { News } from '@/modules/desa/types/villageNews.type';

interface ListBeritaProps {
  filteredList: News[];
  filterType?: string;
}

const TYPE_LABEL: Record<string, string> = {
  berita: '📰 BERITA',
  pengumuman: '📢 PENGUMUMAN',
  event: '📅 EVENT',
};

const TYPE_COLOR: Record<string, string> = {
  berita: 'bg-blue-600',
  pengumuman: 'bg-amber-500',
  event: 'bg-green-600',
};

export default function ListBerita({
  filteredList,
  filterType,
}: ListBeritaProps) {
  const [selectedItem, setSelectedItem] = useState<News | null>(null);

  const openModal = (item: News) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getEmptyMessage = () => {
    if (filterType === 'berita') return 'Belum ada berita';
    if (filterType === 'pengumuman') return 'Belum ada pengumuman';
    if (filterType === 'event') return 'Belum ada event';
    return 'Belum ada data';
  };

  if (!filteredList.length) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        {getEmptyMessage()}
      </div>
    );
  }

  return (
    <>
      {/* LIST */}
      <div className="pb-8 grid gap-4 px-4 pt-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            onClick={() => openModal(item)}
            className="cursor-pointer rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative h-40 w-full bg-gray-100">
              {item.image?.url ? (
                <Image
                  src={item.image.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-gray-400">
                  📰
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block px-2 py-1 text-[10px] font-semibold text-white rounded-full ${
                    TYPE_COLOR[item.type]
                  }`}
                >
                  {TYPE_LABEL[item.type]}
                </span>

                <p className="text-[10px] text-gray-400">
                  {formatDate(item.date)}
                </p>
              </div>

              <h2 className="mt-2 text-sm font-semibold text-gray-800 line-clamp-2">
                {item.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          {/* MODAL BOX */}
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
            {/* IMAGE */}
            <div className="relative h-48 bg-gray-100">
              {selectedItem.image?.url ? (
                <Image
                  src={selectedItem.image.url}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">
                  📰
                </div>
              )}

              <button
                onClick={closeModal}
                className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <FaTimes />
              </button>

              <div
                className={`absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${
                  TYPE_COLOR[selectedItem.type]
                }`}
              >
                {TYPE_LABEL[selectedItem.type]}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5">
              <p className="mt-2 text-xs text-gray-500">
                {formatDate(selectedItem.date)}
              </p>
              <h1 className="text-base font-semibold text-gray-800">
                {selectedItem.title}
              </h1>

              <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">
                {selectedItem.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}