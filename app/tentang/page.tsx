"use client";

import { motion } from "framer-motion";
import {
  Database,
  Globe,
  ShieldCheck,
  Users,
  Rocket,
  Building2,
  Sparkles,
  GraduationCap,
  MapPin,
} from "lucide-react";

/* ================= ANIMATION ================= */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

/* ================= PAGE ================= */

export default function TentangPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-green-50">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-300/30 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-green-300/30 blur-3xl rounded-full" />
      </div>

      {/* HERO */}
      <section className="relative py-28 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-emerald-100 text-emerald-700 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4" />
            Smart Village System
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
            SIKADES CERDAS
          </h1>

          <p className="mt-4 text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Sistem Informasi Desa modern untuk digitalisasi data, pelayanan, dan transparansi publik berbasis teknologi web.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            🚀 Developed by SIKADES Cerdas UMP
          </div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-lg hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Apa itu SIKADES CERDAS?
          </h2>

          <p className="text-slate-600 leading-relaxed">
            SIKADES Cerdas adalah platform digital berbasis web yang digunakan
            untuk mengelola data desa secara terintegrasi, mulai dari profil desa,
            data penduduk, struktur pemerintahan, potensi desa, hingga informasi
            publik. Sistem ini dirancang untuk meningkatkan efisiensi, transparansi,
            dan pelayanan masyarakat berbasis teknologi modern.
          </p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Stat icon={<Database />} label="Data Terintegrasi" />
          <Stat icon={<Users />} label="Pelayanan Publik" />
          <Stat icon={<Globe />} label="Akses Online" />
          <Stat icon={<ShieldCheck />} label="Keamanan Sistem" />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Fitur Utama
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
        >
          <Feature icon={<Database />} title="Manajemen Data Desa" />
          <Feature icon={<Globe />} title="Website Transparan Publik" />
          <Feature icon={<Users />} title="Layanan Masyarakat Digital" />
          <Feature icon={<ShieldCheck />} title="Keamanan Data Tinggi" />
          <Feature icon={<Rocket />} title="Performa Cepat & Modern" />
          <Feature icon={<Building2 />} title="Smart Governance System" />
        </motion.div>
      </section>

      {/* VISION */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          whileInView={{ scale: [0.98, 1] }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 blur-2xl opacity-30" />
          <h2 className="text-xl font-bold mb-2">Visi Sistem</h2>
          <p className="text-white/90 leading-relaxed">
            Mewujudkan desa digital yang modern, transparan, dan efisien
            berbasis teknologi untuk meningkatkan kualitas pelayanan publik
            dan kesejahteraan masyarakat.
          </p>
        </motion.div>
      </section>

      {/* TEAM */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur-xl border rounded-3xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Pengembang Sistem
          </h2>

          <div className="space-y-2 text-slate-700">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-emerald-600 w-4 h-4" />
              SIKADES Cerdas UMP Development Team
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="text-emerald-600 w-4 h-4" />
              Universitas Muhammadiyah Purwokerto (UMP)
            </div>
          </div>

          <p className="text-slate-600 mt-4 leading-relaxed">
            Sistem ini dikembangkan untuk mendukung transformasi digital desa
            di Indonesia melalui teknologi web modern, scalable, dan aman.
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <section className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur border shadow-md text-emerald-700 font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          SIKADES CERDAS • Smart Village System
        </motion.div>
      </section>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ icon, title }: any) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.05 }}
      className="bg-white/70 backdrop-blur border border-white/60 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
    >
      <div className="text-emerald-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </motion.div>
  );
}

function Stat({ icon, label }: any) {
  return (
    <motion.div
      variants={item}
      className="bg-white/70 backdrop-blur border border-white/60 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition"
    >
      <div className="text-emerald-600 flex justify-center mb-2">
        {icon}
      </div>
      <p className="text-sm text-slate-700 font-medium">{label}</p>
    </motion.div>
  );
}