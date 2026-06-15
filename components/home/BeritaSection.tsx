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
  image?: {
    url?: string;
    publicId?: string;
  } | null;
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

  const getImage = (item: NewsItem) => {
    return item.image?.url || "/placeholder.jpg";
  };

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
    <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-100/60 border border-blue-100 shadow-xl p-5 xl:p-8 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 mb-5">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-lg">
            <Newspaper className="md:h-5 w-5 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Berita Desa
            </h3>
            <p className="hidden md:inline text-xs text-gray-500">
              Informasi terbaru, pengumuman, dan kegiatan desa
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <a
          href="/berita"
          className="text-sm font-semibold text-emerald-600 hover:underline whitespace-nowrap"
        >
          Lihat Semua →
        </a>

      </div>

      {/* SWIPER */}
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
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SwiperSlide key={i}>
                <div className="h-64 rounded-2xl bg-white animate-pulse border border-emerald-100" />
              </SwiperSlide>
            ))
          : news.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="rounded-2xl overflow-hidden border border-emerald-100 bg-white shadow-sm hover:shadow-lg transition h-full">

                  {/* IMAGE */}
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={getImage(item)}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* TYPE BADGE */}
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full text-white font-semibold uppercase ${getTypeColor(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>

      {/* glow effect */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/20 blur-3xl rounded-full" />
    </div>
  );
}