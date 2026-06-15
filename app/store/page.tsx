// app/store/page.tsx

"use client";

import { useState } from "react";
import { FaSpinner, FaStore } from "react-icons/fa";

import { useProductList } from "@/modules/marketplace/hooks/useProductList";
import ProductCard from "@/components/marketplace/store/ProductCard";
import StoreListItem from "@/components/marketplace/store/StoreListItem";

export default function StorePage() {
  const { stores, loading } = useProductList();
  const [activeTab, setActiveTab] = useState<"produk" | "toko">("produk");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabChange = (tab: "produk" | "toko") => {
    if (tab !== activeTab) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-pulse"></div>
          <FaSpinner className="animate-spin text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={24} />
        </div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Memuat Koleksi...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <div 
        className="relative bg-slate-900 rounded-b-[3.5rem] md:rounded-b-[5rem] overflow-hidden shadow-2xl mb-12"
        style={{ 
          backgroundImage: 'url(/img/bg-desa.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay Gradient (Agar teks terlihat jelas) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>

        {/* Decorative Blur Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]"></div>

        <div className="container mx-auto px-4 md:px-12 relative z-10 pt-16 md:pt-24 pb-16 md:pb-24">
          
          {/* Banner Text Content (Centered) */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase">
              # Trusted Marketplace
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Temukan Produk <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Berkualitas Tinggi
              </span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 font-light md:font-normal max-w-xl mx-auto">
              Eksplorasi koleksi terbaik langsung dari produsen. 
              Jaminan harga transparan dan kualitas terjamin.
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 md:px-12 -mt-10 relative z-20">
        
        {/* Tab Container: Floating style */}
        <div className="bg-white rounded-full p-1.5 shadow-lg border border-slate-100 inline-flex mb-10 w-full md:w-auto mx-auto md:mx-0">
          <button
            onClick={() => handleTabChange("produk")}
            className={`flex-1 md:flex-none w-1/2 md:w-44 py-3.5 px-8 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === "produk"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            Semua Produk
          </button>
          
          <button
            onClick={() => handleTabChange("toko")}
            className={`flex-1 md:flex-none w-1/2 md:w-44 py-3.5 px-8 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === "toko"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            Jelajahi Toko
          </button>
        </div>

        {/* Content Render */}
        <div 
          className={`transition-all duration-500 ease-out transform ${
            isAnimating 
              ? "opacity-0 translate-y-4 scale-95" 
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          {activeTab === "produk" ? (
            stores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <FaStore size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak Ada Produk</h3>
                <p className="text-slate-500 text-center max-w-sm">
                  Sepertinya produk belum tersedia nih. Silakan datang kembali lain kali.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {stores.map((store) =>
                  store.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      storeSlug={store.slug}
                      showStoreName={true}
                      storeName={store.nameStore}
                      storeCity={store.addressStore?.city}
                    />
                  ))
                )}
              </div>
            )
          ) : (
            stores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <FaStore size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Toko</h3>
                <p className="text-slate-500 text-center max-w-sm">
                  Saat ini belum ada toko yang terdaftar di platform ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stores.map((store) => (
                  <StoreListItem key={store.id} store={store} />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}