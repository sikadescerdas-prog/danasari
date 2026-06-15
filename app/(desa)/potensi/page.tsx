"use client";

import { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

import VillageHeader from "@/components/home/DesaHeader";
import { motion } from "framer-motion";

import {
  FaStore,
  FaLeaf,
  FaBox,
  FaFish,
  FaHands,
  FaLandmark,
  FaUtensils,
  FaMountain,
  FaMapMarkerAlt,
} from "react-icons/fa";

/* =======================
   TYPES
======================= */

interface Potential {
  id: string;
  name: string;
  category:
    | "umkm"
    | "pertanian"
    | "peternakan"
    | "perikanan"
    | "kerajinan"
    | "budaya"
    | "sejarah"
    | "kuliner"
    | "objek_wisata";
  description?: string;
  address?: string;
  locationUrl?: string;
  image?: { url: string };
}

/* =======================
   CATEGORY CONFIG
======================= */

const categories = [
  { key: "umkm", label: "UMKM", icon: FaStore, color: "from-blue-500 to-blue-600" },
  { key: "pertanian", label: "Pertanian", icon: FaLeaf, color: "from-green-500 to-green-600" },
  { key: "peternakan", label: "Peternakan", icon: FaBox, color: "from-amber-500 to-amber-600" },
  { key: "perikanan", label: "Perikanan", icon: FaFish, color: "from-cyan-500 to-cyan-600" },
  { key: "kerajinan", label: "Kerajinan", icon: FaHands, color: "from-purple-500 to-purple-600" },
  { key: "budaya", label: "Budaya", icon: FaLandmark, color: "from-yellow-500 to-yellow-600" },
  { key: "sejarah", label: "Sejarah", icon: FaLandmark, color: "from-orange-500 to-orange-600" },
  { key: "kuliner", label: "Kuliner", icon: FaUtensils, color: "from-red-500 to-red-600" },
  { key: "objek_wisata", label: "Objek Wisata", icon: FaMountain, color: "from-teal-500 to-teal-600" },
];

const getCategory = (key: string) =>
  categories.find((c) => c.key === key);

/* =======================
   ANIMATION VARIANTS
======================= */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* =======================
   PAGE
======================= */

export default function PotensiPage() {
  const [data, setData] = useState<Potential[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "village/potential"), (snap) => {
      const val = snap.val();
      if (!val) return;
      setData(Object.values(val) as Potential[]);
    });

    return () => unsub();
  }, []);

  const potensiDesa = useMemo(
    () => data.filter((i) => i.category !== "objek_wisata"),
    [data]
  );

  const wisata = useMemo(
    () => data.filter((i) => i.category === "objek_wisata"),
    [data]
  );

  /* =======================
     CARD COMPONENT
  ======================= */

  const Card = ({ item }: { item: Potential }) => {
    const cat = getCategory(item.category);
    const Icon = cat?.icon;

    return (
      <motion.div
        variants={itemAnim}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="group bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      >
        {/* IMAGE */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={item.image?.url || "/placeholder.jpg"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* CATEGORY BADGE */}
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] text-white flex items-center gap-1 bg-gradient-to-r ${cat?.color}`}
          >
            {Icon && <Icon className="w-3 h-3" />}
            {cat?.label || "Lainnya"}
          </div>

          {/* MAP ICON */}
          {item.locationUrl && (
            <a
              href={item.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full text-emerald-600 hover:scale-110 transition"
              title="Buka Maps"
            >
              <FaMapMarkerAlt className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-sm text-slate-800 line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1">
            {item.address || "Alamat belum tersedia"}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-14 pb-12">

      <VillageHeader title="Potensi Desa" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-800">
          Potensi dan Wisata Desa
          </h2>
          <p className="text-sm text-slate-500 mt-1">
          Jelajahi kekayaan UMKM, pertanian, budaya, dan destinasi wisata desa
          </p>
        </motion.div>

        {/* POTENSI DESA */}
        <section className="space-y-4">
          <h2 className="text-md font-bold text-slate-800">
            Potensi Desa
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {potensiDesa.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </motion.div>
        </section>

        {/* WISATA */}
        <section className="space-y-4">
          <h2 className="text-md font-bold text-slate-800">
            Objek Wisata
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {wisata.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </motion.div>
        </section>

      </div>
    </main>
  );
}