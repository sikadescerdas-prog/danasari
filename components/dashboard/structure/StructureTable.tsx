// components/dashboard/structure/StructureTable.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { FaEdit, FaTrash, FaPhone, FaCalendarAlt, FaVenusMars, FaUsers } from "react-icons/fa";
import { sweet } from "@/shared/utils/sweet";

import type { StructurePosition, StructureTitle } from "@/modules/desa/types/villageStructure.type";

type Props = {
  data: StructurePosition[];
  onEdit: (structure: StructurePosition) => void;
  onDelete: (structure: StructurePosition) => Promise<void>;
};

const NO_IMAGE = "/img/no-image.webp";

const TH_STYLE = "text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase";

const getTitleLabel = (title?: StructureTitle) => {
  const labels: Record<string, string> = {
    kepala_desa: "Kepala Desa",
    sekretaris_desa: "Sekretaris Desa",
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
  return labels[title || ""] || title || "-";
};

const getGenderLabel = (gender?: string) => {
  if (gender === "laki_laki") return "Laki-laki";
  if (gender === "perempuan") return "Perempuan";
  return "-";
};

const formatPhone = (phone?: string) => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 12) {
    const front = cleaned.slice(0, 4);
    const middle = "xxxx";
    const back = cleaned.slice(-4);
    return `${front}${middle}${back}`;
  }
  if (cleaned.length > 4) {
    const front = cleaned.slice(0, 4);
    const rest = cleaned.slice(4);
    const hidden = "x".repeat(Math.min(rest.length, 4));
    return `${front}${hidden}`;
  }
  return phone;
};

export default function StructureTable({ data, onEdit, onDelete }: Props) {
  const isEmpty = data.length === 0;

  // Sort: tahun terbaru first
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => (b.yearJoined || 0) - (a.yearJoined || 0));
  }, [data]);

  const handleDelete = async (id: string) => {
    const item = data.find((s) => s.id === id);
    
    const confirmed = await sweet.confirmDanger({
      title: "Hapus?",
      text: `Yakin hapus "${item?.name}"?`,
    });

    if (confirmed) {
      await onDelete(item!);
    }
  };

  const getImageSrc = (photo?: StructurePosition["photo"]) => {
    return photo?.url || NO_IMAGE;
  };

  const formatYear = (year?: number) => {
    return year ? String(year) : "-";
  };

  return (
    <div className="rounded-2xl p-4 md:p-6 bg-white">
      {/* Header -全部 hidden kalau 0 */}
      {data.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Struktur Desa</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {data.length}
          </span>
        </div>
      )}

      {/* TABLE */}
      {!isEmpty ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className={`${TH_STYLE} w-16`}>Tahun</th>
                <th className={`${TH_STYLE} w-44`}>Nama</th>
                <th className={TH_STYLE}>Jabatan</th>
                <th className={`${TH_STYLE} hidden md:table-cell`}>Jenis Kelamin</th>
                <th className={`${TH_STYLE} w-28`}>No. HP</th>
                <th className={`${TH_STYLE} w-16 text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* 1. Tahun */}
                  <td className="px-3 py-3">
                    <span className="text-sm text-gray-500">{formatYear(item.yearJoined)}</span>
                  </td>

                  {/* 2. Nama */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={getImageSrc(item.photo)} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</span>
                    </div>
                  </td>

                  {/* 3. Jabatan */}
                  <td className="px-3 py-3">
                    <span className="text-sm text-gray-600">{getTitleLabel(item.title)}</span>
                  </td>

                  {/* 4. Gender - hide md */}
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{getGenderLabel(item.gender)}</span>
                  </td>

                  {/* 5. No. HP */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span className="line-clamp-1">{formatPhone(item.phone)}</span>
                    </div>
                  </td>

                  {/* 6. Aksi */}
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Hapus">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <FaUsers className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada struktur</p>
        </div>
      )}
    </div>
  );
}