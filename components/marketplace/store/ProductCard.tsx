"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaBox,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEyeSlash,
  FaEye,
  FaMapMarkerAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { Product } from "@/modules/marketplace/types/product.types";

type ProductCardProps = {
  product: Product;
  storeSlug: string;
  showStoreName?: boolean;
  storeName?: string;
  storeCity?: string;
  showMinimal?:boolean;

  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
};

export default function ProductCard({
  product,
  storeSlug,
  showStoreName = false,
  storeName,
  storeCity,
  showMinimal = false,
  isOwner = false,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductCardProps) {
  const [openMenu, setOpenMenu] = useState(false);

  // ======================
  // SAFE VALUES
  // ======================
  const isOutOfStock = Number(product.stock || 0) === 0;
  const isHidden = product.isActive === false;

  const formatPrice = (price?: number | string) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price || 0));

  const categoryLabel = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : "Umum";

  const categoryColor = (cat?: string) => {
    switch ((cat || "").toLowerCase()) {
      case "makanan":
        return "bg-emerald-100/80 text-emerald-700 border border-emerald-200/50";
      case "minuman":
        return "bg-sky-100/80 text-sky-700 border border-sky-200/50";
      case "snack":
        return "bg-amber-100/80 text-amber-700 border border-amber-200/50";
      case "kerajinan":
        return "bg-violet-100/80 text-violet-700 border border-violet-200/50";
      case "pakaian":
        return "bg-rose-100/80 text-rose-700 border border-rose-200/50";
      case "elektronik":
        return "bg-slate-100/80 text-slate-700 border border-slate-200/50";
      default:
        return "bg-gray-100/80 text-gray-700 border border-gray-200/50";
    }
  };

  const detailUrl = `/store/${storeSlug}/${product.slug}`;
  const storeUrl = `/store/${storeSlug}`;

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out">

      {/* OWNER MENU */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-slate-100 text-slate-500 hover:text-slate-800"
          >
            <FaEllipsisV size={14} />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-xl text-sm z-30 py-1">
              <button
                onClick={() => {
                  setOpenMenu(false);
                  onEdit?.();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50"
              >
                <FaEdit size={12} /> Edit
              </button>

              <button
                onClick={() => {
                  setOpenMenu(false);
                  onToggleActive?.();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50"
              >
                {isHidden ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                {isHidden ? "Tampilkan" : "Sembunyikan"}
              </button>

              <button
                onClick={() => {
                  setOpenMenu(false);
                  onDelete?.();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50"
              >
                <FaTrash size={12} /> Hapus
              </button>
            </div>
          )}
        </div>
      )}

      {/* IMAGE */}
      <Link
        href={detailUrl}
        className={`block relative aspect-[4/3] bg-slate-50 overflow-hidden ${
          isHidden ? "opacity-60" : ""
        }`}
      >
        {product.images?.length > 0 && product.images[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaBox className="text-slate-200" size={48} />
          </div>
        )}

        {/* CATEGORY */}
        {!showMinimal && (
  <div
    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${categoryColor(
      product.category
    )}`}
  >
    {categoryLabel}
  </div>
)}

        {/* HIDDEN */}
        {isHidden && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-10">
            <FaEyeSlash className="text-white" size={24} />
          </div>
        )}
      </Link>

      {/* CONTENT */}
      {showMinimal ? (
  <div className="p-3 flex flex-col">
    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
      {product.name}
    </h3>

    <span className="text-sm font-bold text-emerald-600">
      {formatPrice(product.price)}
    </span>

    <p className="mt-2 text-[11px] text-slate-400 truncate">
      {storeName}
    </p>
  </div>
) : (
  <div className="p-4 flex flex-col gap-1.5">

    {/* PRODUCT NAME */}
    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
      {product.name}
    </h3>

    {/* PRICE */}
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold text-emerald-600">
        {formatPrice(product.price)}
      </span>
    </div>

    {/* STORE INFO */}
    {(showStoreName || storeName) && storeName && (
      <div className="mt-1 pt-3 border-t border-slate-100">
        <Link href={storeUrl} className="block group/link">

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-400">
              <FaShoppingBag size={11} />
            </div>

            <p className="text-xs font-medium text-slate-600 truncate group-hover/link:text-emerald-600 transition-colors">
              {storeName}
            </p>
          </div>

          {storeCity && (
            <div className="flex items-center gap-1 mt-1">
              <FaMapMarkerAlt size={11} className="text-slate-300" />
              <span className="text-[11px] text-slate-400">
                {storeCity}
              </span>
            </div>
          )}

        </Link>
      </div>
    )}
  </div>
)}
    </div>
  );
}