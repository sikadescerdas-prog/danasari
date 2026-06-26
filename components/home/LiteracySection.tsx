"use client";

import { BookOpen, GraduationCap, ArrowRight, LibraryBig, Smartphone, Newspaper } from "lucide-react";

export default function LiteracySection() {
  const literacyData = [
    {
      title: "UMP BACA",
      subtitle: "Aplikasi Perpustakaan Digital",
      href:
        "https://play.google.com/store/apps/details?id=id.kubuku.kbk1986375&hl=id",
      icon: <Smartphone className="h-5 w-5 lg:h-7 lg:w-7" />,
      gradient: "from-emerald-400 via-green-500 to-teal-400",
    },
    {
      title: "Smart Library",
      subtitle: "Koleksi Buku Digital",
      href: "/literasi",
      icon: <LibraryBig className="h-5 w-5 lg:h-7 lg:w-7" />,
      gradient: "from-violet-400 via-fuchsia-500 to-pink-400",
    },
    {
      title: "Edukasi Desa",
      subtitle: "Artikel & Pembelajaran",
      href: "/literasi",
      icon: <Newspaper className="h-5 w-5 lg:h-7 lg:w-7" />,
      gradient: "from-sky-400 via-blue-500 to-indigo-400",
    },
  ];

  return (
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-50 via-white to-yellow-100/60 border border-amber-100 shadow-xl p-5 overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 text-white shadow-lg">
          <BookOpen className="h-5 w-5 animate-pulse" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Literasi Digital
          </h3>
          <p className="text-xs text-gray-500">
            Akses buku, aplikasi, dan edukasi desa
          </p>
        </div>
      </div>

      {/* ================= MOBILE (CARD STACK STYLE) ================= */}
      <div className="mt-5 flex flex-col gap-3 md:hidden">
        {literacyData.map((item, i) => (
          <a
            key={item.title}
            href={item.href}
            className="group relative flex items-center gap-4 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-md backdrop-blur-xl transition-all active:scale-[0.98]"
          >
            {/* glow */}
            <div
              className={`absolute inset-0 opacity-0 blur-2xl transition group-hover:opacity-20 bg-gradient-to-r ${item.gradient}`}
            />

            {/* ICON LEFT */}
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition group-hover:scale-110`}
            >
              {item.icon}
            </div>

            {/* TEXT */}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500">
                {item.subtitle}
              </p>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  Explore
                </span>

                <span className="flex items-center gap-1 text-xs font-medium text-gray-900">
                  Buka
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ================= DESKTOP (GRID ORIGINAL STYLE) ================= */}
      <div className="relative mt-7 hidden grid-cols-3 gap-4 md:grid">
        {literacyData.map((item, i) => (
          <a
            key={item.title}
            href={item.href}
            className="group relative flex flex-col items-center text-center overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-5 shadow-md backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]"
          >
            {/* glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 blur-2xl transition group-hover:opacity-20`}
            />

            {/* ICON (CENTER PERFECT) */}
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl transition group-hover:scale-110`}
            >
              {item.icon}
            </div>

            <h4 className="mt-4 text-sm font-bold text-gray-900">
              {item.title}
            </h4>

            <p className="mt-1 text-[10px] text-gray-500 leading-tight">
              {item.subtitle}
            </p>

            <div className="mt-5 flex items-center gap-1 text-xs font-medium text-gray-700">
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}