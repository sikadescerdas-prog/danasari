// components/dashboard/facility/FacilityTable.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaGraduationCap, FaMosque, FaHospital, FaStore, FaBuilding } from "react-icons/fa";
import { sweet } from "@/shared/utils/sweet";

import type { Facility, FacilityCategory } from "@/modules/desa/types/villageFacility.type";

type Props = {
  data: Facility[];
  onEdit: (facility: Facility) => void;
  onDelete: (facility: Facility) => Promise<void>;
};

const NO_IMAGE = "/img/no-image.webp";

const CATEGORIES = [
  { key: "pendidikan", label: "Pendidikan", icon: FaGraduationCap, color: "text-blue-600" },
  { key: "ibadah", label: "Ibadah", icon: FaMosque, color: "text-green-600" },
  { key: "kesehatan", label: "Kesehatan", icon: FaHospital, color: "text-red-600" },
  { key: "ekonomi", label: "Ekonomi", icon: FaStore, color: "text-yellow-600" },
];

const TH_STYLE = "text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase";

export default function FacilityTable({ data, onEdit, onDelete }: Props) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const getCategoryIcon = (category: FacilityCategory) => {
    const icons = {
      pendidikan: FaGraduationCap,
      ibadah: FaMosque,
      kesehatan: FaHospital,
      ekonomi: FaStore,
      umum: FaBuilding,
    };
    const Icon = icons[category] || FaBuilding;
    return <Icon className="w-3 h-3" />;
  };

  const handleView = (id: string) => {
    const item = data.find((f) => f.id === id);
    if (item) setSelectedFacility(item);
  };

  const handleDelete = async (id: string) => {
    const item = data.find((f) => f.id === id);
    
    const confirmed = await sweet.confirmDanger({
      title: "Hapus?",
      text: `Yakin hapus "${item?.name}"?`,
    });

    if (confirmed) {
      await onDelete(item!);
    }
  };

  const getPhotoSrc = (photo?: Facility["photo"]) => {
    return photo?.url || NO_IMAGE;
  };

  const getDataByCategory = (category: string) => {
    return data.filter((item) => item.category === category);
  };

  // Render satu tabel
  const renderTable = (cat: typeof CATEGORIES[0]) => {
    const categoryData = getDataByCategory(cat.key);
    const isEmpty = categoryData.length === 0;
    const Icon = cat.icon;

    return (
      <div key={cat.key} className="rounded-2xl p-4 md:p-6 bg-white">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <Icon className={`w-5 h-5 ${cat.color}`} />
          <h3 className="text-lg font-bold text-gray-900">{cat.label}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {categoryData.length}
          </span>
        </div>

        {/* TABLE */}
        {!isEmpty ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={`${TH_STYLE} w-56`}>Tempat</th>
                  <th className={TH_STYLE}>Alamat</th>
                  <th className={`${TH_STYLE} w-20 text-right`}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoryData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* KOLOM 1: Gambar + Nama */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={getPhotoSrc(item.photo)}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-900">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* KOLOM 2: Alamat - TANPA ICON MAPS */}
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {item.address || "-"}
                      </div>
                    </td>

                    {/* KOLOM 3: Aksi - TANPA ICON VIEW */}
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        {item.locationUrl && (
                          <a
                            href={item.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                            title="Buka Maps"
                          >
                            <FaMapMarkerAlt className="w-4 h-4" />
                          </a>
                        )}
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
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Belum ada {cat.label.toLowerCase()}</p>
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-4">{CATEGORIES.map(renderTable)}</div>;
}