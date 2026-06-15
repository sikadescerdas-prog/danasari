// components/dashboard/VillageHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

interface VillageHeaderProps {
  title: string;
  showStats?: { label: string; value: string | number }[];
  showBackButton?: boolean;
}

export default function VillageHeader({ 
  title, 
  showStats, 
  showBackButton = true 
}: VillageHeaderProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "village/profile"), (snap) => {
      setData(snap.val());
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
      }
    };
    const header = headerRef.current;
    if (header) header.addEventListener("mousemove", handleMouseMove);
    return () => { if (header) header.removeEventListener("mousemove", handleMouseMove); };
  }, []);

  const getLogoUrl = () => {
    if (!data?.logo) return null;
    return typeof data.logo === "string" ? data.logo : data.logo?.url;
  };

  const logoUrl = getLogoUrl();

  if (loading) return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 px-6 pt-12 pb-32 md:pb-36">
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    </section>
  );

  return (
    <section ref={headerRef} className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 px-4 sm:px-6 pt-10 pb-28 lg:pb-40" style={{ transform: `perspective(1000px) rotateX(${-mousePos.y*2}deg) rotateY(${mousePos.x*2}deg)`, transition:'transform 0.1s ease-out' }}>
      <style jsx global>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes scaleIn { 0%{opacity:0;transform:scale(0.3)} 100%{opacity:1;transform:scale(1)} }
        @keyframes spinSlow { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes pulseGlow { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.15)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .floating { animation:float 6s ease-in-out infinite }
        .floatingDelay { animation:float 6s ease-in-out infinite;animation-delay:1s }
        .floatingFast { animation:float 4s ease-in-out infinite;animation-delay:0.5s }
        .animateScaleIn { animation:scaleIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards;opacity:0 }
        .animateSpinSlow { animation:spinSlow 20s linear infinite }
        .animatePulseGlow { animation:pulseGlow 2s ease-in-out infinite }
        .shimmer { background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4) 50%,transparent);background-size:200% 100%;animation:shimmer 2s infinite }
      `}</style>

      {showBackButton && (
        <Link href="/" className="fixed top-8 left-4 z-50">
          <div className="group flex items-center gap-1.5 px-4 py-2.5 bg-white/90 backdrop-blur-md text-slate-600 text-xs font-semibold rounded-full shadow-lg border border-white/60 hover:bg-green-500 hover:text-white hover:scale-110 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Beranda</span>
          </div>
        </Link>
      )}

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',backgroundSize:'40px 40px' }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 -left-10 w-24 h-24 bg-white/20 rounded-full floating"></div>
        <div className="absolute top-1/4 -right-16 w-20 h-20 bg-white/15 rounded-full floatingDelay"></div>
        <div className="absolute bottom-24 left-1/4 w-28 h-28 bg-white/10 rounded-full floatingDelay"></div>
        <div className="absolute -bottom-12 -right-14 w-40 h-40 border border-white/10 rounded-full animateSpinSlow"></div>
        <div className="absolute top-1/2 left-1/3 w-14 h-14 bg-white/25 rounded-full floatingFast"></div>
        
        <div className="absolute top-1/5 left-1/4 w-3 h-3 bg-white/70 rounded-full animate-ping"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white/60 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-white/50 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-white/70 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full animate-ping delay-200"></div>
        <div className="absolute top-1/3 left-1/5 w-1.5 h-1.5 bg-white/60 rounded-full animate-ping delay-400"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10 max-w-4xl mx-auto relative z-10 px-2">
        <div className="relative animateScaleIn">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-white/30 animatePulseGlow"></div>
            <div className="w-28 h-28 rounded-full border-2 border-white/20 animatePulseGlow delay-200"></div>
          </div>
          <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full transform scale-110 animate-pulse"></div>
          <div className="relative w-28 h-28 sm:w-44 sm:h-44 bg-white/40 backdrop-blur-md rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-white/50 group hover:ring-white/80 transition-all duration-500 hover:scale-110">
            {logoUrl ? <Image src={logoUrl} alt={data?.name||"Logo"} width={128} height={128} className="w-full h-full object-cover" unoptimized /> : <span className="text-6xl">🏘️</span>}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 shimmer"></div>
            </div>
          </div>
        </div>

        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> {title}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {data?.name || "Nama Desa"}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-white/90 text-sm">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" />{data?.address.district || "Kecamatan"}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full">
              {data?.address?.regency || "Kabupaten"}
            </span>
          </div>

          {showStats && showStats.length > 0 && (
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
              {showStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                  <span className="font-bold text-white text-lg">{stat.value}</span>
                  <span className="text-xs text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-3">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none"><path fill="white" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,101.3C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex items-center gap-1 h-1">{[...Array(12)].map((_,i)=><div key={i} className="flex-1 h-full bg-white/30 shimmer" style={{animationDelay:`${i*0.15}s`}}></div>)}</div>
        <div className="h-1.5 bg-white"></div>
      </div>
    </section>
  );
}