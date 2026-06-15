// components/home/HeroSection.tsx
"use client";

import Image from "next/image";
import { MapPin, Building2, ShieldCheck, Globe, Users, HandHeart, Zap, ArrowRight } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { villageProfileService } from "@/modules/dashboard/services/villageProfile.service";
import type { VillageProfile } from "@/modules/desa/types/villageProfile.type";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.25, 0.25, 0.75] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [villageData, setVillageData] = useState<VillageProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await villageProfileService.get();
        setVillageData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const features = [
    { title: "Transparan", desc: "Informasi Terbuka", icon: ShieldCheck },
    { title: "Modern", desc: "Berbasis Teknologi", icon: Globe },
    { title: "Partisipatif", desc: "Warga Terlibat Aktif", icon: Users },
    { title: "Sejahtera", desc: "Desa Untuk Semua", icon: HandHeart },
  ];

  const getVillageName = () => villageData?.name || "Nama Desa";
  const getVillage = () => villageData?.address?.village || "Desa";
  const getDistrict = () => villageData?.address?.district || "Kecamatan";
  const getRegency = () => villageData?.address?.regency || "Kabupaten";

  return (
    <section ref={ref} className="relative overflow-hidden pb-0 lg:pb-8">

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ==================== MOBILE VIEW ==================== */}
        <div className="w-full lg:hidden">

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="relative w-full overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="relative min-h-[300px]">
              <Image
                src="/img/bg-desa.jpeg"
                alt={getVillageName()}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/img/bg-desa.jpg";
                }}
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-white/0" />

            <div className="absolute inset-0 p-4 pb-12 flex flex-col justify-between min-h-[300px]">
              
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/50 bg-green-600/80 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold text-white shadow-lg">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-300"></span>
                  </span>
                  Smart Village
                </span>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex gap-2">
                <h1 className="text-[2.5rem] leading-[0.95] font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                   Desa
                </h1>
                <h1 className="text-[2.5rem] leading-[0.95] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]">
                   {loading ? "Danasari" : getVillage()}
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2.5">
                <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                  {loading ? "Karangjambu" : getDistrict()}
                </span>
                <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                  {loading ? "Purbalingga" : getRegency()}
                </span>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/desa'}
                  className="w-[50%] flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-green-400 to-emerald-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/30"
                >
                  <span>Profile Desa</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: -10 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative -mt-4 mx-3 rounded-xl border border-white/30 bg-white shadow-lg backdrop-blur-xl"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />
            
            <div className="p-2">
              <div className="grid grid-cols-4 gap-0.5">
                {features.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg hover:bg-green-50/50 transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-sm">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-[8px] font-bold text-slate-800">{item.title}</span>
                      <span className="text-[6px] text-slate-500 text-center">{item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ==================== DESKTOP ==================== */}
        <div className="hidden lg:grid gap-8 lg:grid-cols-12 lg:items-center">
          
          <div className="lg:col-span-5">
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="mb-6 inline-flex">
                <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 rounded-full border border-green-200/60 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-700 shadow-sm backdrop-blur-sm">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span></span>Smart Village
                </motion.span>
              </motion.div>

              <motion.div variants={fadeInUp} className="mb-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Desa</h1>
                <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"><span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">{loading ? "Desa" : getVillage()}</span></h1>
              </motion.div>

              <motion.div variants={fadeInUp} className="mb-6 flex flex-wrap items-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200/50 shadow-sm backdrop-blur-sm"><MapPin className="h-3 w-3 text-green-600" /> <span>{loading ? "Karangjambu" : getDistrict()}</span></motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200/50 shadow-sm backdrop-blur-sm"><Building2 className="h-3 w-3 text-green-600" /> <span>{loading ? "Purbalingga" : getRegency()}</span></motion.div>
              </motion.div>

              <motion.p variants={fadeInUp} className="mb-8 text-lg leading-relaxed text-slate-500"> Mengubah wajah desa dengan teknologi untuk <span className="text-green-600 font-medium">transparansi</span>, <span className="text-emerald-600 font-medium">partisipasi</span>, dan <span className="text-teal-600 font-medium">kesejahteraan</span> bersama membangun masa depan.</motion.p>

              <motion.div onClick={() => window.location.href = '/desa'} variants={fadeInUp} className="flex flex-wrap gap-4">
                <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:shadow-green-600/40">
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">Profile Desa<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 relative perspective-1000">
            <motion.div initial={{ opacity: 0, scale: 0.95, rotateX: 15, y: 30 }} animate={isInView ? { opacity: 1, scale: 1, rotateX: 0, y: 0 } : { opacity: 0 }} transition={{ duration: 1 }} className="relative">
              <div className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] lg:aspect-[16/9]">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <Image 
                  src="/img/bg-desa.jpeg" 
                  alt={getVillageName()} 
                  fill 
                  className="object-cover transition-all duration-700 group-hover:scale-110" 
                  priority 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/img/bg-desa.jpg";
                  }}
                />
                
                <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0 }} transition={{ delay: 0.4 }} className="absolute right-5 top-5 z-20">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-700 shadow-md backdrop-blur-md ring-1 ring-white/20">
                    <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span></span>Aktif<Zap className="h-3.5 w-3.5 text-amber-500" />
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ delay: 0.8 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/90"><Globe className="h-3 w-3" /> Digital Village</div>
                </motion.div>

                <div className="absolute left-0 top-0 z-20 h-20 w-20 pointer-events-none"><div className="absolute left-4 top-4 h-3 w-3 border-l-2 border-t-2 border-white/50" /></div>
                <div className="absolute right-0 top-0 z-20 h-20 w-20 pointer-events-none"><div className="absolute right-4 top-4 h-3 w-3 border-r-2 border-t-2 border-white/50" /></div>
              </div>

              <motion.div initial={{ opacity: 0, y: 60, scale: 0.85 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }} transition={{ delay: 0.7 }} className="absolute -bottom-7 left-3 right-3 z-30 lg:left-10 lg:right-10">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/90 shadow-xl backdrop-blur-xl">
                  <div className="absolute inset-0 rounded-[1.5rem] p-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"><div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-green-400/20 via-emerald-400/10 to-teal-400/20 blur-xl opacity-50" /></div>
                  <div className="relative z-10 p-5">
                    <div className="grid grid-cols-4 gap-4">
                      {features.map((item, i) => (<motion.div key={i} whileHover={{ scale: 1.08, y: -4 }} className="flex flex-col items-center text-center gap-2">
                        <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 text-green-500 shadow-lg shadow-green-500/30"><item.icon className="h-5 w-5" /></motion.div>
                        <div className="space-y-0.5"><span className="block text-sm font-bold text-slate-800">{item.title}</span><span className="block text-[11px] font-medium text-slate-500">{item.desc}</span></div>
                      </motion.div>))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}