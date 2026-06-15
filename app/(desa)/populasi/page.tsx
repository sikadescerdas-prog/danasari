// app/(desa)/populasi/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Mars,
  Venus,
  Home,
  TrendingUp,
  TrendingDown,
  Landmark,
  Cross,
  Church,
  Star,
  Orbit,
  Building2,
  BookOpen,
  School,
  BookMarked,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import VillageHeader from "@/components/home/DesaHeader";
import { motion } from "framer-motion";

interface PopulationData {
  total?: number;
  male?: number;
  female?: number;
  rt?: number;
  rw?: number;
  totalKK?: number;
  year?: string;
  belumSekolah?: number;
  sd?: number;
  smp?: number;
  sma?: number;
  diploma?: number;
  sarjana?: number;
  pascasarjana?: number;
  islam?: number;
  kristen?: number;
  katolik?: number;
  hindu?: number;
  buddha?: number;
  konghucu?: number;
  student?: number;
  employee?: number;
  government?: number;
  farmer?: number;
  entrepreneur?: number;
  worker?: number;
  pekerjaanLain?: number;
}

const PopulasiCard = ({
  label,
  value,
  prevValue,
  icon: Icon,
  color,
  prefix = "",
}: {
  label: string;
  value?: number;
  prevValue?: number;
  icon: any;
  color: string;
  prefix?: string;
}) => {
  const diff =
    prevValue !== undefined ? (value || 0) - prevValue : undefined;
  const percent =
    diff && prevValue ? Math.round((diff / prevValue) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <div className="p-5">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg mb-4`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-800">
              {prefix}
              {(value || 0).toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>

          {diff !== undefined && diff !== 0 && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                diff > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {diff > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">
                {Math.abs(percent)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChartBar = ({
  label,
  value,
  prevValue,
  total,
  color1,
  color2,
  icon: Icon,
  showPercent = true,
}: {
  label: string;
  value?: number;
  prevValue?: number;
  total: number;
  color1: string;
  color2: string;
  icon: any;
  showPercent?: boolean;
}) => {
  const percent =
    total > 0 ? Math.round(((value || 0) / total) * 100) : 0;

  const prevPercent =
    prevValue !== undefined && prevValue > 0 && total > 0
      ? Math.round((prevValue / total) * 100)
      : 0;

  const diff = prevValue !== undefined ? percent - prevPercent : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color1} flex items-center justify-center`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-slate-800">{label}</p>
            {prevValue !== undefined && (
              <p className="text-xs text-slate-500">
                vs {prevValue.toLocaleString("id-ID")} ({prevPercent}%)
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-slate-800">
            {(value || 0).toLocaleString("id-ID")}
          </p>
          <div className="flex items-center gap-1 justify-end">
            {showPercent && (
              <span className="text-xs text-slate-500">{percent}%</span>
            )}
            {diff !== 0 && (
              <span
                className={`text-xs ${
                  diff > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {diff > 0 ? "↑" : "↓"} {Math.abs(diff)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color2} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default function PopulationPage() {
  const [populationData, setPopulationData] = useState<
    Record<string, PopulationData>
  >({});
  const [sortedYears, setSortedYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "village/population"), (snap) => {
      const data = snap.val();
      if (data) {
        const years = Object.keys(data);
        const sorted = years.sort(
          (a, b) => Number(b) - Number(a)
        );
        setSortedYears(sorted);
        setPopulationData(data);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );

  const currentYear = sortedYears[0];
  const comparisonYear = sortedYears[1];

  const currentData = currentYear
    ? populationData[currentYear]
    : null;

  const prevData = comparisonYear
    ? populationData[comparisonYear]
    : null;

  const male = currentData?.male || 0;
  const female = currentData?.female || 0;
  const total = male + female;
  const totalKK = currentData?.totalKK || 0;

  return (
    <main className="min-h-screen bg-slate-50 pt-14 pb-8">
      <VillageHeader title="Populasi Desa" />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 lg:-mt-28 relative z-10">
        <div className="p-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-emerald-600">
            DATA PENDUDUK
          </h2>
          <p className="text-green-500 text-sm mt-1">
            {currentData?.year || currentYear || "Tidak Ada Data"} •{" "}
            {comparisonYear && (
              <span className="ml-2">
                Bandingkan {comparisonYear}
              </span>
            )}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">

          <PopulasiCard
            label="Total Penduduk"
            value={total}
            prevValue={
              prevData
                ? (prevData.male || 0) + (prevData.female || 0)
                : undefined
            }
            icon={Users}
            color="from-green-400 to-emerald-500"
          />

          <PopulasiCard
            label="Laki-laki"
            value={male}
            prevValue={prevData?.male}
            icon={Mars}
            color="from-blue-400 to-blue-600"
          />

          <PopulasiCard
            label="Perempuan"
            value={female}
            prevValue={prevData?.female}
            icon={Venus}
            color="from-pink-400 to-pink-600"
          />
        </div>
      </div>

      {/* PIE + CHART (unchanged UI, only icons fixed) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

    {/* ===================== PENDUDUK ===================== */}
    <div className="col-span-2 lg:col-span-1">
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

      <div className="px-6 py-4 bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-between">
        <h3 className="font-bold text-white">Penduduk</h3>
        {comparisonYear && (
          <span className="text-white/70 text-xs">vs {comparisonYear}</span>
        )}
      </div>

      <div className="p-6 space-y-4">

        {/* TOTAL + PIE */}
        <div className="text-center">
          <div className="relative w-40 h-40 mx-auto">
            <div
              className="w-full h-full rounded-full shadow-xl"
              style={{
                background: `conic-gradient(
                  #3b82f6 0% ${(male / total) * 100}%,
                  #ec4899 ${(male / total) * 100}% 100%
                )`,
              }}
            />

            <div className="absolute inset-4 bg-white/70 backdrop-blur-xl rounded-full flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-slate-800">
                {total.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-slate-500">Total Penduduk</p>
            </div>
          </div>
        </div>

        <ChartBar
          label="Laki-laki"
          value={male}
          prevValue={prevData?.male}
          total={total}
          color1="from-blue-400 to-blue-600"
          color2="from-blue-400 to-blue-600"
          icon={Mars}
        />

        <ChartBar
          label="Perempuan"
          value={female}
          prevValue={prevData?.female}
          total={total}
          color1="from-pink-400 to-pink-600"
          color2="from-pink-400 to-pink-600"
          icon={Venus}
        />

        {/* KK RT RW */}
        <div className="pt-4 space-y-3">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-600">Jumlah KK</span>
            </div>
            <span className="font-bold">{totalKK?.toLocaleString("id-ID") || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
            <span className="text-sm text-slate-600">Jumlah RT</span>
            </div>
            <span className="font-bold">{currentData?.rt || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
            <span className="text-sm text-slate-600">Jumlah RW</span>
            </div>
            <span className="font-bold">{currentData?.rw || 0}</span>
          </div>

        </div>

      </div>
    </div>
    </div>

    {/* ===================== AGAMA ===================== */}
    <div className="col-span-1 lg:col-span-1">
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

      <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-between">
        <h3 className="font-bold text-white">Agama</h3>
        <span className="text-white/70 text-xs">Data Kepercayaan</span>
      </div>

      <div className="p-6 space-y-3">

        {[
          { key: "islam", label: "Islam", icon: Landmark, color: "from-emerald-400 to-green-600" },
          { key: "kristen", label: "Kristen", icon: Cross, color: "from-red-400 to-red-600" },
          { key: "katolik", label: "Katolik", icon: Church, color: "from-blue-400 to-blue-600" },
          { key: "hindu", label: "Hindu", icon: Star, color: "from-orange-400 to-orange-600" },
          { key: "buddha", label: "Buddha", icon: Orbit, color: "from-yellow-400 to-yellow-600" },
          { key: "konghucu", label: "Konghucu", icon: Building2, color: "from-amber-400 to-amber-600" },
        ].map((a) => {
          const val = (currentData?.[a.key as keyof PopulationData] as number) || 0;
          const Icon = a.icon;

          return (
            <div key={a.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 group">

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${a.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">{a.label}</p>
                  <p className="text-xs text-slate-400">Pemeluk</p>
                </div>
              </div>

              <span className="font-bold text-slate-800">
                {val.toLocaleString("id-ID")}
              </span>

            </div>
          );
        })}

      </div>
    </div>
    </div>

    {/* ===================== PENDIDIKAN ===================== */}
    <div className="col-span-1">
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-between">
        <h3 className="font-bold text-white">Pendidikan</h3>
        <span className="text-white/70 text-xs">Tingkat Pendidikan</span>
      </div>

      <div className="p-6 space-y-3">

        {[
          { key: "belumSekolah", label: "Belum Sekolah", icon: BookOpen, color: "from-slate-400 to-slate-600" },
          { key: "sd", label: "SD", icon: School, color: "from-red-400 to-red-600" },
          { key: "smp", label: "SMP", icon: School, color: "from-blue-400 to-blue-600" },
          { key: "sma", label: "SMA", icon: School, color: "from-green-400 to-green-600" },
          { key: "diploma", label: "Diploma", icon: GraduationCap, color: "from-purple-400 to-purple-600" },
          { key: "sarjana", label: "Sarjana", icon: GraduationCap, color: "from-pink-400 to-pink-600" },
          { key: "pascasarjana", label: "Pascasarjana", icon: GraduationCap, color: "from-amber-400 to-orange-500" },
        ].map((p) => {
          const val = (currentData?.[p.key as keyof PopulationData] as number) || 0;
          const Icon = p.icon;

          return (
            <div key={p.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 group">

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${p.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">{p.label}</p>
                  <p className="text-xs text-slate-400">Jumlah</p>
                </div>
              </div>

              <span className="font-bold text-slate-800">
                {val.toLocaleString("id-ID")}
              </span>

            </div>
          );
        })}

      </div>
    </div>
    </div>

  </div>
</div>
    </main>
  );
}