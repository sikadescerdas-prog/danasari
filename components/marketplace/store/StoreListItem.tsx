// components/marketplace/store/StoreListItem.tsx

"use client";

import Link from "next/link";
import { FaStore, FaMapMarkerAlt } from "react-icons/fa";
import { StoreWithProducts } from "@/modules/marketplace/hooks/useProductList";

interface StoreListItemProps {
  store: StoreWithProducts;
}

export default function StoreListItem({ store }: StoreListItemProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
      {/* Header Toko */}
      <div className="p-4 flex items-start gap-4">
        {/* Logo Toko */}
        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border">
          {store.logo?.url ? (
            <img 
              src={store.logo.url} 
              alt={store.nameStore} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <FaStore />
            </div>
          )}
        </div>

        {/* Info Toko */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate">{store.nameStore}</h3>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <FaMapMarkerAlt size={10} />
            <span>{store.addressStore?.city || "Kota tidak diketahui"}</span>
          </div>
        </div>

        {/* Tombol Kunjungi */}
        <Link 
          href={`/store/${store.slug}`}
          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 text-xs font-medium rounded-lg transition-colors"
        >
          Kunjungi
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 mx-4"></div>

      {/* Daftar Produk Terbaru (Grid 3) */}
      <div className="p-4 bg-slate-50">
        <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
          Produk Terbaru
        </p>

        {store.products.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {store.products.slice(0, 3).map((product) => {
              const price = product.price || 0;
              
              return (
                <Link 
                  key={product.id} 
                  // ✅ Ubah: /store/{slug}/{productSlug}
                  href={`/store/${store.slug}/${product.slug}`}
                  className="block"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-white border border-slate-200 mb-1">
                    {product.images?.[0]?.url ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        -
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs font-bold text-emerald-600">
                    {formatPrice(price)}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-400 text-xs bg-white rounded border border-dashed border-slate-300">
            Toko belum memiliki produk
          </div>
        )}
      </div>
    </div>
  );
}