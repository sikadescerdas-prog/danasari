"use client";

import { useState, useEffect, useRef } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";


export type ProductCategory =
  | "makanan"
  | "minuman"
  | "snack"
  | "kerajinan"
  | "pakaian"
  | "elektronik"
  | "lainnya";

type SortOption = "terbaru" | "harga_asc" | "harga_desc" | "default";

interface CategoryStoreProps {
  totalProduk: number;
  onSort: (value: SortOption) => void;
  onCategoryChange?: (category: ProductCategory | "semua") => void;
}

const CATEGORIES: { key: ProductCategory | "semua"; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "makanan", label: "Makanan" },
  { key: "minuman", label: "Minuman" },
  { key: "snack", label: "Snack" },
  { key: "kerajinan", label: "Kerajinan" },
  { key: "pakaian", label: "Pakaian" },
  { key: "elektronik", label: "Elektronik" },
  { key: "lainnya", label: "Lainnya" },
];

function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      scrollLeft = el.scrollLeft;
    };

    const onUp = () => {
      isDown = false;
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();

      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const walk = (startX - x) * 1.5;
      el.scrollLeft = scrollLeft + walk;
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("touchend", onUp);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove);

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

export default function CategoryStore({
  totalProduk,
  onSort,
  onCategoryChange,
}: CategoryStoreProps) {
  const [activeCategory, setActiveCategory] = useState<
    ProductCategory | "semua"
  >("semua");

  const [sort, setSort] = useState<SortOption>("default");
  const scrollRef = useHorizontalScroll();

  const handleCategoryClick = (key: ProductCategory | "semua") => {
    const newCategory = activeCategory === key ? "semua" : key;
    setActiveCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  const handleTerbaruClick = () => {
    if (sort === "terbaru") {
      setSort("default");
      onSort("default");
    } else {
      setSort("terbaru");
      onSort("terbaru");
    }
  };

  const handleHargaClick = () => {
    if (sort === "harga_asc") {
      setSort("harga_desc");
      onSort("harga_desc");
    } else if (sort === "harga_desc") {
      setSort("default");
      onSort("default");
    } else {
      setSort("harga_asc");
      onSort("harga_asc");
    }
  };

  const isActive = (key: string) => activeCategory === key;
  const isTerbaruActive = sort === "terbaru";
  const isHargaActive = sort === "harga_asc" || sort === "harga_desc";

  return (
    <div className="sticky top-[60px] bg-white border-b border-emerald-100 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        {/* CATEGORY */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center gap-1.5 w-max">
            {CATEGORIES.map((cat, index) => (
              <div key={cat.key} className="flex items-center shrink-0">
                <button
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`text-sm whitespace-nowrap transition-all rounded-full px-3 py-1 ${
                    isActive(cat.key)
                      ? "bg-emerald-500 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>

                {index < CATEGORIES.length - 1 && (
                  <span className="text-slate-300 text-xs mx-1">|</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SORT */}
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            onClick={handleTerbaruClick}
            className={`text-sm ${
              isTerbaruActive
                ? "text-emerald-600 underline underline-offset-4 decoration-2 decoration-emerald-500"
                : "text-slate-500"
            }`}
          >
            Terbaru
          </button>

          <span className="text-slate-300 text-xs">|</span>

          <button
            onClick={handleHargaClick}
            className={`flex items-center gap-1 text-sm ${
              isHargaActive
                ? "text-emerald-600 underline underline-offset-4 decoration-2 decoration-emerald-500"
                : "text-slate-500"
            }`}
          >
            Harga
            {sort === "harga_asc" && <FaSortUp size={14} />}
            {sort === "harga_desc" && <FaSortDown size={14} />}
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-400 px-4 pb-3">
        {totalProduk} produk
      </p>
    </div>
  );
}