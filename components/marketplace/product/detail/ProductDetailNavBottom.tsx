"use client";

import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";

interface ProductDetailNavBottomProps {
  marketplace: {
    waBusiness?: string;
    shopee?: string;
    tiktokShop?: string;
  };
}

export default function ProductDetailNavBottom({ marketplace }: ProductDetailNavBottomProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex p-3 gap-2 z-50 lg:hidden">
      <a 
        href={marketplace.waBusiness ? `https://wa.me/${marketplace.waBusiness}` : "#"} 
        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-green-500/20"
      >
        <FaWhatsapp size={16} />Chat WhatsApp
      </a>
      <a 
        href={marketplace.shopee || "#"} 
        className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/20"
      >
        <SiShopee size={16} />Buka Shopee
      </a>
      <a 
        href={marketplace.tiktokShop || "#"} 
        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-slate-800/20"
      >
        <FaTiktok size={16} />Buka TikTok
      </a>
    </div>
  );
}