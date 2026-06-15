"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Package } from "lucide-react";

import ProductCard from "@/components/marketplace/store/ProductCard";

type Product = any;

export default function UmkmSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?limit=10");
      const data = await res.json();
      setProducts(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="relative mt-6 xl:mt-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-green-100/60 backdrop-blur-xl border border-emerald-100 shadow-2xl p-4 xl:p-6 overflow-hidden">

      {/* HEADER */}
            <div className="flex items-center justify-between gap-3 mb-5">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg">
            <Package className="md:h-5 w-5 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Store UMKM
            </h3>
            <p className="text-xs text-gray-500">
              Produk unggulan masyarakat desa
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <a
          href="/store"
          className="text-sm font-semibold text-emerald-600 hover:underline whitespace-nowrap"
        >
          Lihat Semua →
        </a>

      </div>

      {/* SWIPER WRAPPER (BIAR CENTER) */}
      <div className="relative mx-auto max-w-6xl">
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation
          freeMode
          centeredSlides={false}
          grabCursor
          spaceBetween={10}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 2.5 },   // ✅ mobile 4 item
            480: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 4.5 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 5.5 },
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="h-[180px] rounded-2xl bg-gray-100 animate-pulse" />
                </SwiperSlide>
              ))
            : products.map((product) => (
                <SwiperSlide key={product.id} className="!h-auto">
                  <div className="scale-[0.92] origin-center">
                    <ProductCard
                      product={product}
                      storeSlug={product.storeSlug}
                      storeName={product.storeName}
                      showMinimal={true}
                    />
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      {/* glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/20 blur-3xl rounded-full" />
    </section>
  );
}