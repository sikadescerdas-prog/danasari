// modules/dashboard/hooks/useUMKM.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";

/**
 * =========================
 * VIEW MODEL TYPES (UMKM)
 * =========================
 */

type Store = {
  ownerUid: string;
  nameStore?: string;
  addressStore?: {
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  logo?: { url?: string };
};

export type UMKMProduct = {
  id: string;
  ownerUid: string;
  name?: string;
  category?:string;
  price?: number;
  image?: { url?: string };
};

export function useUMKM() {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<UMKMProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // ======================
      // 🏪 STORES
      // ======================
      const storeSnap = await get(ref(db, "stores"));
      const storeData = storeSnap.val() || {};

      const storeList: Store[] = Object.values(storeData);

      // ======================
      // 📦 PRODUCTS (flatten)
      // ======================
      const productSnap = await get(ref(db, "products"));
      const productData = productSnap.val() || {};

      const productList: UMKMProduct[] = [];

      Object.entries(productData).forEach(([ownerUid, items]: any) => {
        if (!items) return;

        Object.entries(items).forEach(([id, item]: any) => {
          productList.push({
            id,
            ownerUid,
            ...(item as any),
          });
        });
      });

      setStores(storeList);
      setProducts(productList);
    } catch (err) {
      console.error("useUMKM error:", err);
      setStores([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stores,
    products,
    loading,
    refetch: fetchData,
  };
}