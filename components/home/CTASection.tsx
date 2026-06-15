// components/CTASection.tsx
import Link from "next/link";
import { ChevronRight, Sparkles, Users, LogIn, BookOpen } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 px-6 py-8 text-white shadow-lg xl:px-10 xl:py-10">
      
      {/* softer glow */}
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        
        {/* LEFT */}
        <div className="max-w-xl">
          <div className="mb-2 flex items-center gap-2 justify-start">
            <Sparkles className="h-5 w-5 text-yellow-200" />
            <span className="text-sm font-medium text-green-100">
              Ayo Berpartisipasi
            </span>
          </div>

          <h3 className="text-left text-md font-semibold leading-snug md:text-2xl xl:text-3xl">
            Bersama Membangun Desa Danasari yang Lebih Maju & Digital
          </h3>

          <p className="hidden md:inline text-left mt-2 text-sm text-green-100/90 md:text-base">
            Wujudkan layanan desa yang lebih cepat, transparan, dan mudah diakses oleh seluruh masyarakat.
          </p>

          <div className="hidden md:inline">
            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-green-100/90 md:justify-start">
              <Users className="h-4 w-4" />
              <span>Warga • Pemerintah Desa • Layanan Terintegrasi</span>
            </div>
          </div>
        </div>

        {/* RIGHT ACTION */}
        <div className="flex flex-col gap-3 sm:flex-row">
          
          {/* LOGIN */}
          <Link
            href="/login"
            className="group flex items-center justify-center gap-2 rounded-2xl bg-white/95 px-6 py-3 font-semibold text-emerald-700 shadow-md transition-all duration-300 hover:scale-105 hover:bg-white"
          >
            Gabung Sekarang
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* ABOUT / DESA */}
          <Link
            href="/desa"
            className="hidden md:inline group flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md transition-all hover:bg-white/20"
          >
            <BookOpen className="h-5 w-5" />
            Pelajari
          </Link>
        </div>
      </div>
    </section>
  );
}