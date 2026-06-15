"use client";

import { useMemo } from "react";
import { FaUsers, FaHome, FaMale, FaFemale, FaGraduationCap, FaBriefcase } from "react-icons/fa";

import type { VillagePopulation } from "@/modules/desa/types/villagePopulation.type";

type Props = {
  data: VillagePopulation[];
  selectedYear?: string;
};

const formatNum = (val?: number) => {
  return val ? val.toLocaleString("id-ID") : "0";
};

const StatItem = ({ icon: Icon, label, value }: { icon: any; label: string; value?: number }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-emerald-500" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{formatNum(value)}</span>
  </div>
);

export default function PopulationTable({ data, selectedYear }: Props) {
  // Filter by selectedYear
  const filteredData = useMemo(() => {
    if (!selectedYear) {
      // If no selectedYear, get newest year
      const sorted = [...data].sort((a, b) => (b.year || "").localeCompare(a.year || ""));
      return sorted.slice(0, 1); // Take newest only
    }
    return data.filter(item => item.year === selectedYear).slice(0, 1);
  }, [data, selectedYear]);

  const item = filteredData[0];
  const isEmpty = !item;

  return (
    <div className="rounded-2xl p-4 md:p-6 bg-white">
      {!isEmpty ? (
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{item.year}</h3>
              <p className="text-sm text-gray-500">
                {formatNum(item.totalKK)} KK · {formatNum((item.male || 0) + (item.female || 0))} jiwa
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* KK & Penduduk */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaHome className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">KK & Penduduk</span>
              </div>
              <div className="space-y-1">
                <StatItem icon={FaHome} label="Total KK" value={item.totalKK} />
                <StatItem icon={FaMale} label="Laki-laki" value={item.male} />
                <StatItem icon={FaFemale} label="Perempuan" value={item.female} />
              </div>
            </div>

            {/* Pendidikan */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaGraduationCap className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">Pendidikan</span>
              </div>
              <div className="space-y-1">
                <StatItem icon={FaGraduationCap} label="SD" value={item.sd} />
                <StatItem icon={FaGraduationCap} label="SMP" value={item.smp} />
                <StatItem icon={FaGraduationCap} label="SMA" value={item.sma} />
                <StatItem icon={FaGraduationCap} label="D3" value={item.diploma} />
                <StatItem icon={FaGraduationCap} label="S1" value={item.sarjana} />
                <StatItem icon={FaGraduationCap} label="S2+" value={item.pascasarjana} />
              </div>
            </div>

            {/* Pekerjaan */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaBriefcase className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">Pekerjaan</span>
              </div>
              <div className="space-y-1">
                <StatItem icon={FaBriefcase} label="Petani" value={item.farmer} />
                <StatItem icon={FaBriefcase} label="Swasta" value={item.entrepreneur} />
                <StatItem icon={FaBriefcase} label="PNS" value={item.government} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <FaUsers className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">Pilih tahun untuk melihat data</p>
        </div>
      )}
    </div>
  );
}