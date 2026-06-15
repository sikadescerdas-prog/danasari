// components/StatsSection.tsx
"use client";

import { Users, Store, Home, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { desaService } from "@/modules/desa/services/desa.service";
import type { VillagePopulation } from "@/modules/desa/types/villagePopulation.type";
import type { potential } from "@/modules/desa/types/villagePotential.type";

export default function StatsSection() {
  const [currentPop, setCurrentPop] = useState<VillagePopulation | null>(null);
  const [previousPop, setPreviousPop] = useState<VillagePopulation | null>(null);
  const [potential, setPotential] = useState<potential[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await desaService.getHomeData();

        if (data.population && data.population.length > 0) {
          const sortedPop = [...data.population].sort((a, b) => 
            (b.year || "").localeCompare(a.year || "")
          );
          setCurrentPop(sortedPop[0]);
          if (sortedPop[1]) setPreviousPop(sortedPop[1]);
        }

        setPotential(data.potential || []);
        setStores(data.stores || []);
        setProducts(data.products || []); // ← TAMBAH
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ===== HITUNG TOTAL =====
  const currentTotal = (currentPop?.male || 0) + (currentPop?.female || 0);
  const previousTotal = (previousPop?.male || 0) + (previousPop?.female || 0);
  const totalRT = currentPop?.rt || 0;
  const totalRW = currentPop?.rw || 0;
  
  // ===== POTENSI =====
  const tourismCount = potential.filter(p => p.category === "objek_wisata").length;
  const otherPotential = potential.filter(p => p.category !== "objek_wisata").length;
  const totalAllPotential = potential.length;
  
  // ===== UMKM & PRODUK =====
  const umkmCount = stores.length; // jumlah toko
  const productCount = products.length; // jumlah produk (7)

  // Hitung percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return null;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const populationChange = calculateChange(currentTotal, previousTotal);

  const statsData = [
    {
      title: "Penduduk",
      value: loading ? "..." : currentTotal.toLocaleString("id-ID"),
      label: "Jiwa",
      icon: <Users className="h-5 w-5 lg:h-8 w-8" />,
      color: "blue",
      href: "/penduduk",
      change: populationChange,
      changeLabel: "dari tahun lalu",
      hasComparison: true,
      year: currentPop?.year,
    },
    {
      title: "UMKM",
      value: loading ? "..." : String(umkmCount),
      subValue: loading ? "..." : `${productCount} Produk`, // ← ubah ke produk
      label: "Pelaku Usaha",
      icon: <Store className="h-5 w-5 lg:h-8 w-8" />,
      color: "orange",
      href: "/umkm",
      hasComparison: false,
    },
    {
      title: "RT / RW",
      value: loading ? "..." : `${totalRT} / ${totalRW}`,
      subValue: loading ? "..." : `Total ${totalRT + totalRW} Wilayah`,
      label: "Wilayah",
      icon: <Home className="h-5 w-5 lg:h-8 w-8" />,
      color: "purple",
      href: "/wilayah",
      hasComparison: false,
    },
    {
      title: "Jumlah",
      value: loading ? "..." : String(totalAllPotential),
      subValue: loading ? "..." : `${tourismCount} Wisata / ${otherPotential} Potensi`,
      label: "Potensi",
      icon: <MapPin className="h-5 w-5 lg:h-8 w-8" />,
      color: "green",
      href: "/potential",
      hasComparison: false,
    },
  ];

  const colors = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
  };

  return (
    <section className="mt-4 grid gap-4 px-0 lg:px-8 grid-cols-2 lg:grid-cols-4">
      {statsData.map((item, index) => {
        const style = colors[item.color as keyof typeof colors];
        const isPositive = item.change ? Number(item.change) >= 0 : true;
        
        return (
          <Link key={item.title} href={item.href} className="group block cursor-pointer">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-green-300 xl:rounded-[28px] xl:p-5"
            >
              {/* ===== ATAS ===== */}
              <div className="flex items-center gap-5">
                <div className={`flex h-8 w-8 lg:h-16 w-16 flex-shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}>
                  {item.icon}
                </div>

                <div className="flex flex-col">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">{item.title}</p>
                  <h3 className="text-lg lg:text-2xl font-black text-gray-900 lg:text-3xl">
                    {loading ? "..." : item.value}
                  </h3>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              </div>

              {/* ===== SEPARATOR ===== */}
              <div className="w-full border-t border-gray-200 my-2" />

              {/* ===== BAWAH ===== */}
              {!loading && (
                <div className="flex flex-col items-center">
                  {item.hasComparison ? (
                    <>
                      {item.change ? (
                        <div className={`flex items-center gap-2 text-xs lg:text-sm font-semibold ${
                          isPositive ? "text-green-600" : "text-red-500"
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>{item.change}% {item.changeLabel}</span>
                        </div>
                      ) : (
                        <p className="text-xs lg:text-sm font-medium text-gray-500">
                          Total Tahun {item.year}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-xs lg:text-sm font-semibold text-gray-700">
                        {item.subValue}
                      </p>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </Link>
        );
      })}
    </section>
  );
}