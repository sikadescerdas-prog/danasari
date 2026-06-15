//app/dashboard/umkm/page.tsx
"use client";

import UMKMHeader from "@/components/dashboard/umkm/UMKMHeader";
import UMKMList from "@/components/dashboard/umkm/UMKMList";
import ProductList from "@/components/dashboard/umkm/ProductList";
import { useUMKM } from "@/modules/dashboard/hooks/useUMKM";
import { useSearchParams } from "next/navigation";

export default function UMKMPage() {
  const { stores, products } = useUMKM();

  const params = useSearchParams();
  const activeId = params.get("id");

  // ======================
  // DERIVED DATA
  // ======================
  const store = stores.find(
    (s) => s.ownerUid === activeId
  );

  const storeProducts = activeId
    ? products.filter((p) => p.ownerUid === activeId)
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

      {/* HEADER */}
      <UMKMHeader stores={stores} products={products} />

      <div className="p-4">

        {/* =========================
            MODE LIST TOKO
        ========================= */}
        {!activeId && (
          <UMKMList
            stores={stores}
            products={products}
          />
        )}

        {/* =========================
            MODE PRODUCT LIST
        ========================= */}
        {activeId && (
          <div>
            {/* PRODUCT LIST */}
            <ProductList products={storeProducts} />

          </div>
        )}

      </div>
    </div>
  );
}