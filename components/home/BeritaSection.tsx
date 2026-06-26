"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Newspaper } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  date: number;
  type: string;
  image?: { url?: string; publicId?: string } | null;
};

export default function BeritaSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news?limit=20");
      const data = await res.json();

      const sorted = (data?.data || [])
        .slice()
        .sort((a: NewsItem, b: NewsItem) => b.date - a.date);

      setNews(sorted);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (ts?: number) => {
    if (!ts) return "-";
    return new Date(ts).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getImage = (item: NewsItem) =>
    item.image?.url || "/placeholder.jpg";

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "berita":
        return "bg-blue-600";
      case "pengumuman":
        return "bg-amber-500";
      case "event":
        return "bg-emerald-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-100/60 p-5 xl:p-8 shadow-xl">

      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-lg">
            <Newspaper className="h-5 w-5 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Berita Desa
            </h3>
            <p className="hidden text-xs text-gray-500 md:inline">
              Informasi terbaru, pengumuman, dan kegiatan desa
            </p>
          </div>
        </div>

        <a
          href="/berita"
          className="text-sm font-semibold text-emerald-600 hover:underline"
        >
          Lihat Semua →
        </a>
      </div>

      {/* CONTENT */}
      {loading ? (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={14}
          slidesPerView={1.2}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.3 },
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <SwiperSlide key={i}>
              <div className="h-64 animate-pulse rounded-2xl border border-blue-100 bg-white" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : news.length === 0 ? (
        /* ================= EMPTY STATE PREMIUM ================= */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-white/60 py-12 text-center backdrop-blur">

          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Newspaper className="h-6 w-6 text-blue-600" />
          </div>

          <h3 className="text-base font-semibold text-slate-800">
            Belum Ada Berita
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Informasi dan kegiatan desa akan segera ditampilkan di sini.
          </p>
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={14}
          slidesPerView={1.2}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.3 },
          }}
        >
          {news.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="h-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:shadow-lg">

                {/* IMAGE */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={getImage(item)}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <div className="absolute bottom-2 left-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase text-white ${getTypeColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-3">
                  <h4 className="line-clamp-2 text-sm font-semibold text-gray-900">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(item.date)}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
    </div>
  );
}