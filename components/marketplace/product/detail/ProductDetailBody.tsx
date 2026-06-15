"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaStore, FaMapMarkerAlt, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";

import { Product } from "@/modules/marketplace/types/product.types";
import { IStore } from "@/modules/marketplace/types/store.types";
import { formatRibuan } from "@/shared/utils/formatRibuan";
import ProductDetailHeader from "./ProductDetailHeader";

function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      scrollLeft = el.scrollLeft;
    };
    const onUp = () => { isDown = false; };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      el.scrollLeft = scrollLeft + (startX - x) * 1.5;
    };
    el.addEventListener("mousedown", onDown, { passive: false });
    el.addEventListener("touchstart", onDown, { passive: false });
    el.addEventListener("mouseup", onUp);
    el.addEventListener("touchend", onUp);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mousemove", onMove, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);
  return elRef;
}

interface ProductDetailBodyProps {
  product: Product;
  store: IStore;
  slug: string;
}

export default function ProductDetailBody({ product, store, slug }: ProductDetailBodyProps) {
  const [activeImage, setActiveImage] = useState(0);
  const mainScrollRef = useHorizontalScroll();
  
  const images = product.images || [];
  const storeUrl = `/store/${slug}`;
  const marketplace = (store as any).marketplace || {};
  const addressStore = (store as any).addressStore || {};

  const handleMainScroll = () => {
    const el = mainScrollRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const newIndex = Math.round(el.scrollLeft / width);
    if (newIndex !== activeImage && newIndex >= 0 && newIndex < images.length) {
      setActiveImage(newIndex);
    }
  };

  const scrollToImage = (index: number) => {
    if (mainScrollRef.current) {
      const width = mainScrollRef.current.clientWidth;
      mainScrollRef.current.scrollTo({ left: index * width, behavior: "smooth" });
      setActiveImage(index);
    }
  };

  const formatPrice = (price: number) => `Rp ${formatRibuan(price)}`;
  const categoryLabel = product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "";

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      {/* LEFT COL: Images */}
      <div className="lg:col-span-1">
        {/* Main Image */}
        <div ref={mainScrollRef} className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory cursor-grab active:cursor-grabbing lg:cursor-default" onScroll={handleMainScroll}>
          {images.length > 0 ? images.map((img, idx) => (
            <div key={idx} className="w-full flex-shrink-0 snap-start">
              <img src={img.url} alt={product.name} className="w-full aspect-video lg:aspect-[4/3] lg:object-contain object-cover select-none bg-white" draggable={false} />
            </div>
          )) : (
            <div className="w-full aspect-video bg-slate-100 flex items-center justify-center">
              <FaStore className="text-slate-300" size={56} />
            </div>
          )}
        </div>

        {/* Thumbnails Component */}
        <ProductDetailHeader images={images} activeImage={activeImage} onScrollToImage={scrollToImage} />

        <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-3 mt-4">
          <a href={marketplace.waBusiness ? `https://wa.me/${marketplace.waBusiness}?text=Halo, saya tertarik dengan produk ${product.name}` : "#"} className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-green-500/20">
            <FaWhatsapp size={18} />WhatsApp
          </a>
          <a href={marketplace.shopee || "#"} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/20">
            <SiShopee size={18} />Shopee
          </a>
          <a href={marketplace.tiktokShop || "#"} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-slate-800/20">
            <FaTiktok size={18} />TikTok
          </a>
        </div>
      </div>

      {/* RIGHT COL: Details */}
      <div className="lg:col-span-2 px-4 lg:px-0 py-4 lg:py-0">
        <div className="hidden lg:flex items-center gap-2 mt-4 mb-4 text-xs text-slate-400">
          <Link href="/store" className="hover:text-emerald-600">Beranda</Link>
          <span>/</span>
          <Link href={storeUrl} className="hover:text-emerald-600">{store.nameStore}</Link>
          <span>/</span>
          <span className="text-slate-600">{categoryLabel}</span>
        </div>

        <h1 className="text-lg lg:text-2xl font-bold text-slate-800 mb-2">{product.name}</h1>
        <div className="pb-2">
          <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{formatPrice(product.price)}</p>
        </div>

        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <span className="text-xs text-slate-400"><span className="font-medium text-slate-600">0</span> terjual</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className={`text-xs ${product.stock > 0 ? "text-slate-400" : "text-red-500"}`}>
            {product.stock > 0 ? `${product.stock} stok` : "Stok habis"}
          </span>
        </div>

        <div className="my-4">
          <Link href={storeUrl} className="block p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                {store.logo?.url ? <img src={store.logo.url} className="w-full h-full object-cover" /> : <FaStore className="text-orange-500" size={28} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{store.nameStore}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><FaMapMarkerAlt size={10} />{addressStore.city || "Kota"}</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-semibold">Kunjungi</span>
            </div>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-400">Kategori</span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-600">{categoryLabel}</span>
          </div>
          {product.description && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Deskripsi</p>
              <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}