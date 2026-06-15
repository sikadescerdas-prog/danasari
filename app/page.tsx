// app/page.tsx
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import WeatherSection from "@/components/home/WeatherSection";
import LiteracySection from "@/components/home/LiteracySection";
import UmkmSection from "@/components/home/UMKMSection";
import BeritaSection from "@/components/home/BeritaSection";
import LayananSection from "@/components/home/LayananSection";
import CTASection from "@/components/home/CTASection";

export default function Page() {
  return (
    <main className="mt-16 min-h-screen bg-[#f5f7f5] py-6 text-gray-800 md:py-8">
      <div className="mx-auto max-w-[1500px] px-4 md:px-6 xl:px-8">
        {/* HERO */}
        <HeroSection />

        {/* STATISTIK */}
        <StatsSection />

        {/* CUACA & LITERASI */}
        <section className="mt-6 grid gap-5 lg:grid-cols-12 xl:mt-8 lg:px-8">
          {/* WEATHER (4/12) */}
          <div className="lg:col-span-5">
            <WeatherSection />
          </div>
          {/* LITERASI (8/12 atau ~7 feel lebih besar) */}
          <div className="lg:col-span-7">
            <LiteracySection />
          </div>
        </section>

        {/* UMKM */}
        <div className="lg:px-8">
          <UmkmSection />
        </div>

        {/* BERITA & LAYANAN */}
        <section className="mt-6 flex flex-col gap-5 lg:grid lg:grid-cols-12 xl:mt-8 lg:px-8">
          <div className="lg:col-span-8 w-full">
            <BeritaSection />
          </div>

          <div className="lg:col-span-4 w-full">
            <LayananSection />
          </div>
        </section>

        {/* CTA */}
        <div className="lg:px-8">
          <CTASection />
        </div>
      </div>
    </main>
  );
}