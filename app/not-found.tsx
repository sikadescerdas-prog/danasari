// app/not-found.tsx

"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">

      {/* ================= BACKGROUND DECOR ================= */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#7AF3AE]/40 to-[#25C95F]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/30 to-green-300/20 rounded-full blur-3xl" />
      
      <div className="absolute inset-0" />

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative max-w-6xl mx-auto px-6 min-h-screen flex items-center">

        <div className="grid md:grid-cols-2 gap-12 items-center w-full">

          {/* RIGHT VISUAL - Mobile: First (order-1) */}
          <div className="order-1 md:order-2 flex justify-center">

            <div className="relative">

              {/* BIG NUMBER */}
              <div className="text-[140px] md:text-[180px] font-black text-[#7AF3AE]/80 select-none">
                404
              </div>

              {/* FLOAT ICON - Warning */}
              <div className="absolute top-10 left-10 w-16 h-16 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center animate-bounce">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* FLOAT ICON - Search */}
              <div className="absolute bottom-10 right-10 w-16 h-16 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-[#25C95F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

            </div>

          </div>

          {/* LEFT TEXT - Mobile: Second (order-2) */}
          <div className="order-2 md:order-1">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              404 Error
            </div>

            {/* TITLE */}
            <h1 className="mt-5 text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Halaman tidak{' '}
              <span className="bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] bg-clip-text text-transparent">
                ditemukan
              </span>
            </h1>

            {/* DESC */}
            <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-md">
              Link yang kamu buka tidak tersedia, sudah dipindahkan, atau mungkin salah ketik.
              Jangan khawatir, kamu masih bisa lanjut ke halaman utama.
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] shadow-lg shadow-green-500/25
                  hover:shadow-xl hover:shadow-green-500/35 hover:opacity-90 active:scale-[0.98]
                  transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Kembali ke Beranda
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}