"use client";

import Link from "next/link";
import { FaBox } from "react-icons/fa";

import { Product } from "@/modules/marketplace/types/product.types";
import { formatRibuan } from "@/shared/utils/formatRibuan";

interface ProductDetailNewsProps {
  products: Product[];
  slug: string;
}

export default function ProductDetailNews({ products, slug }: ProductDetailNewsProps) {
  if (products.length === 0) return null;

  const formatPrice = (price: number) => `Rp ${formatRibuan(price)}`;

  return (
    <div className="px-4 py-6 mt-6 lg:mt-10 border-t border-slate-200">
      <p className="text-base font-semibold text-slate-800 mb-4">Produk Terbaru</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((prod) => (
          <Link 
            key={prod.id} 
            href={`/store/${slug}/${prod.slug}`}
            className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all"
          >
            <div className="aspect-square bg-slate-50 overflow-hidden">
              {prod.images?.[0]?.url ? (
                <img 
                  src={prod.images[0].url} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaBox className="text-slate-300" size={40} />
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">{prod.name}</p>
              <p className="text-sm font-bold text-emerald-600 mt-2">{formatPrice(prod.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}