// components/auth/HeroAuth.tsx

import Image from "next/image";

interface HeroAuthProps {
  title?: string;
  description?: string;
  reverse?: boolean; // true = wave di kiri (form kanan)
}

export default function HeroAuth({
  title = "Desa Danasari",
  description = "Bergabunglah bersama kami dan mulai perjalanan terbaikmu.",
  reverse = false,
}: HeroAuthProps) {
  return (
    <>
      {/* ================= MOBILE ================= */}
      <section className="relative h-[300px] overflow-hidden lg:hidden">

        {/* Background: Green Soft Original */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#84F1AE] via-[#56E383] to-[#25C95F]" />

        {/* Premium Glows */}
        <div className="absolute -right-32 top-0 h-[300px] w-[300px] rounded-full bg-white/10 blur-[100px]" />
        <div className="absolute -right-10 top-10 h-32 w-32 rounded-full bg-white/30 blur-[40px]" />
        <div className="absolute -right-24 top-32 h-20 w-20 rounded-full bg-white/20 blur-[30px]" />
        <div className="absolute -left-20 bottom-32 h-40 w-40 rounded-full bg-white/15 blur-[50px]" />
        <div className="absolute left-10 bottom-20 h-16 w-16 rounded-full bg-white/20 blur-[25px]" />

        {/* Decorative Dots */}
        <div className="absolute right-6 bottom-24 h-2 w-2 rounded-full bg-white/50" />
        <div className="absolute right-12 bottom-32 h-1.5 w-1.5 rounded-full bg-white/40" />
        <div className="absolute right-20 bottom-20 h-1 w-1 rounded-full bg-white/30" />
        <div className="absolute right-2 bottom-28 h-1.5 w-1.5 rounded-full bg-white/20" />
        <div className="absolute left-8 top-16 h-2 w-2 rounded-full bg-white/30" />
        <div className="absolute left-16 top-10 h-1.5 w-1.5 rounded-full bg-white/20" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-28 text-white z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 blur-xl" />
            <Image
              src="/logo-desa.png"
              alt="Logo Desa"
              width={100}
              height={100}
              priority
              className="relative z-10 drop-shadow-2xl"
            />
          </div>

          <h1
            className="mt-3 text-4xl font-bold tracking-wide drop-shadow-lg"
            style={{ fontFamily: "sans-serif" }}
          >
            {title}
          </h1>
        </div>

        {/* Secondary Wave (Bottom) */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 430 160"
          preserveAspectRatio="none"
        >
          <path
            d="
              M0,160
              L0,50
              C70,90 110,70 150,95
              C180,115 220,70 260,90
              C300,110 340,60 380,85
              C410,105 430,70 430,90
              L430,160
              Z
            "
            fill="white"
            fillOpacity="0.2"
          />
        </svg>

        {/* Primary Wave (Bottom) */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 430 160"
          preserveAspectRatio="none"
        >
          <path
            d="
              M0,85
              C120,25 180,150 300,95
              C360,65 400,120 430,105
              L430,160
              L0,160
              Z
            "
            fill="white"
          />
        </svg>
      </section>

      {/* ================= DESKTOP ================= */}
      <section className="hidden lg:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#84F1AE] via-[#56E383] to-[#25C95F]">

        {/* Primary Glow - Left (Normal) / Right (Reverse) */}
        {!reverse && (
          <>
            <div className="absolute -left-40 top-0 h-[700px] w-[700px] rounded-full bg-white/10 blur-[120px]" />
            <div className="absolute left-1/3 top-1/4 h-48 w-48 rounded-full bg-white/20 blur-[60px]" />
            <div className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-white/10 blur-[50px]" />
            <div className="absolute right-1/3 bottom-1/4 h-24 w-24 rounded-full bg-white/15 blur-[40px]" />
          </>
        )}
        {reverse && (
          <>
            <div className="absolute -right-40 top-0 h-[700px] w-[700px] rounded-full bg-white/10 blur-[120px]" />
            <div className="absolute right-1/3 top-1/4 h-48 w-48 rounded-full bg-white/20 blur-[60px]" />
            <div className="absolute bottom-0 left-20 h-40 w-40 rounded-full bg-white/10 blur-[50px]" />
            <div className="absolute left-1/3 bottom-1/4 h-24 w-24 rounded-full bg-white/15 blur-[40px]" />
          </>
        )}

        {/* Decorative Dots - Left (Normal) / Right (Reverse) */}
        {!reverse && (
          <>
            <div className="absolute right-32 top-32 h-2 w-2 rounded-full bg-white/40" />
            <div className="absolute right-40 top-40 h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="absolute right-24 top-36 h-1 w-1 rounded-full bg-white/35" />
            <div className="absolute right-16 bottom-32 h-2 w-2 rounded-full bg-white/40" />
            <div className="absolute right-24 bottom-40 h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="absolute right-48 bottom-24 h-1.5 w-1.5 rounded-full bg-white/20" />
            <div className="absolute right-8 top-24 h-1.5 w-1.5 rounded-full bg-white/20" />
          </>
        )}
        {reverse && (
          <>
            <div className="absolute left-32 top-32 h-2 w-2 rounded-full bg-white/40" />
            <div className="absolute left-40 top-40 h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="absolute left-24 top-36 h-1 w-1 rounded-full bg-white/35" />
            <div className="absolute left-16 bottom-32 h-2 w-2 rounded-full bg-white/40" />
            <div className="absolute left-24 bottom-40 h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="absolute left-48 bottom-24 h-1.5 w-1.5 rounded-full bg-white/20" />
            <div className="absolute left-8 top-24 h-1.5 w-1.5 rounded-full bg-white/20" />
          </>
        )}

        {/* Content */}
        <div className="z-10 flex max-w-md flex-col items-center text-center text-white">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 blur-2xl" />
            <Image
              src="/logo-desa.png"
              alt="Logo Desa"
              width={140}
              height={140}
              priority
              className="relative z-10 drop-shadow-2xl"
            />
          </div>

          <h1
            className="mt-5 text-5xl font-bold tracking-wide drop-shadow-lg"
            style={{ fontFamily: "sans-serif" }}
          >
            {title}
          </h1>

          <p className="mt-3 leading-relaxed text-white/90 text-base">
            {description}
          </p>

          {/* CTA Button */}
          <button className="mt-6 group relative px-7 py-2.5 bg-white text-emerald-600 font-semibold text-base rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-50" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </span>
            <span className="relative flex items-center gap-2">
              <span>Mulai</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Waves - Right (Normal) / Left (Reverse) */}
        {!reverse && (
          <>
            {/* Third Wave (Back) */}
            <svg
              className="absolute right-0 top-0 h-full w-20"
              viewBox="0 0 80 800"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M80,200
                  C60,150 40,300 20,400
                  C10,500 30,600 25,800
                  L80,800
                  L80,200
                  Z
                "
                fill="white"
                fillOpacity="0.1"
              />
            </svg>

            {/* Secondary Wave (Middle) */}
            <svg
              className="absolute right-0 top-0 h-full w-20"
              viewBox="0 0 80 800"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M80,100
                  C40,200 50,350 30,500
                  C15,650 35,750 40,800
                  L80,800
                  L80,100
                  Z
                "
                fill="white"
                fillOpacity="0.2"
              />
            </svg>

            {/* Primary Wave (Front) */}
            <svg
              className="absolute right-0 top-0 h-full w-20"
              viewBox="0 0 80 800"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M80,0
                  C60,170 40,340 55,490
                  C70,640 50,790 40,800
                  L80,800
                  L80,0
                  Z
                "
                fill="white"
              />
            </svg>
          </>
        )}
        {reverse && (
          <>
            {/* Third Wave (Back) - Di Kiri */}
            <svg
              className="absolute left-0 top-0 h-full w-20"
              viewBox="0 0 80 800"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M0,200
                  C20,150 40,300 60,400
                  C70,500 50,600 55,800
                  L0,800
                  L0,200
                  Z
                "
                fill="white"
                fillOpacity="0.1"
              />
            </svg>

            {/* Secondary Wave (Middle) - Di Kiri */}
            <svg
              className="absolute left-0 top-0 h-full w-20"
              viewBox="0 0 80 800"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M0,100
                  C40,200 30,350 50,500
                  C65,650 45,750 40,800
                  L0,800
                  L0,100
                  Z
                "
                fill="white"
                fillOpacity="0.2"
              />
            </svg>

            {/* Primary Wave (Front) - Di Kiri */}
            <svg
              className="absolute left-0 top-0 h-full w-20"
              viewBox="0 0 80 800"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M0,0
                  C20,170 40,340 25,490
                  C10,640 30,790 40,800
                  L0,800
                  L0,0
                  Z
                "
                fill="white"
              />
            </svg>
          </>
        )}

      </section>
    </>
  );
}