"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaUsers, FaPlus, FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  years: string[];
  onDelete: (year: string) => void; // 👈 ADD FROM HOOK
};

export default function PopulationHeader({ years, onDelete }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const yearParam = searchParams.get("year");
  const editYear = searchParams.get("edit");
  const isAdd = searchParams.get("add");
  const isFormMode = isAdd !== null || editYear !== null;

  const sortedYears = [...years].sort((a, b) => b.localeCompare(a));

  const [selectedYear, setSelectedYear] = useState(yearParam || "");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;

    if (year) {
      router.push(`?year=${year}`);
    } else {
      router.push("/dashboard/population");
    }
  };

  const handleEdit = () => {
    const year = selectedYear || yearParam;
    if (year) {
      router.push(`?edit=${year}`);
    }
  };

  const handleDelete = () => {
    const year = selectedYear || yearParam;
    if (!year) return;

    // 🔥 delegate to hook (sweet alert inside hook)
    onDelete(year);
  };

  const handleAdd = () => {
    router.push("?add");
  };

  const handleClear = () => {
    setSelectedYear("");
    router.push("/dashboard/population");
  };

  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 px-4 sm:px-8 pr-4 sm:pr-8 pt-6 sm:pt-8 pb-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-8 w-32 h-32 bg-white/30 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-16 left-1/3 w-48 h-48 bg-white/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/40">
              <FaUsers className="w-7 h-7 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Populasi
              </h2>
              <p className="text-sm text-white/80 mt-1">
                Data kependudukan desa
              </p>
            </div>
          </div>

          {!isFormMode && (
            <div className="flex items-center gap-2">
              {years.length === 0 ? (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-3 py-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/30 shrink-0"
                >
                  <FaPlus className="w-4 h-4 text-white" />
                  <span className="hidden md:inline text-sm font-semibold text-white">
                    Tambah
                  </span>
                </button>
              ) : yearParam || selectedYear ? (
                <>
                  <button
                    onClick={handleClear}
                    className="px-3 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 hover:bg-white/40"
                  >
                    <span className="text-sm font-semibold text-white">
                      {selectedYear || yearParam}
                    </span>
                  </button>

                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-3 py-2.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 hover:bg-white/30"
                  >
                    <FaEdit className="w-4 h-4 text-white" />
                    <span className="hidden md:inline text-sm font-semibold text-white">
                      Edit
                    </span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-2.5 bg-red-500/30 backdrop-blur-md rounded-lg border border-white/30 hover:bg-red-500/50"
                  >
                    <FaTrash className="w-4 h-4 text-white" />
                    <span className="hidden md:inline text-sm font-semibold text-white">
                      Hapus
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <select
                      onChange={handleSelectChange}
                      value={selectedYear || yearParam || ""}
                      className="appearance-none bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-4 py-2 pr-10 text-sm font-medium cursor-pointer"
                      style={{ color: "white" }}
                    >
                      <option value="" style={{ color: "black" }}>
                        Pilih tahun
                      </option>
                      {sortedYears.map((year) => (
                        <option
                          key={year}
                          value={year}
                          style={{ color: "black" }}
                        >
                          {year}
                        </option>
                      ))}
                    </select>

                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-3 py-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/30"
                  >
                    <FaPlus className="w-4 h-4 text-white" />
                    <span className="hidden md:inline text-sm font-semibold text-white">
                      Tambah
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex items-center gap-1 h-1">
          <div className="flex-1 h-full bg-white/30"></div>
          <div className="flex-1 h-full bg-white/40"></div>
          <div className="flex-1 h-full bg-white/30"></div>
          <div className="flex-1 h-full bg-white/50"></div>
          <div className="flex-1 h-full bg-white/30"></div>
        </div>
        <div className="h-1 bg-white"></div>
      </div>
    </div>
  );
}