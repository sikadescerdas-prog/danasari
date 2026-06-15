"use client";

import { useState, useEffect } from "react";
import { get, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { Product } from "@/modules/marketplace/types/product.types";
import { IStore } from "@/modules/marketplace/types/store.types";

export const useProductDetail = (slug: string, productSlug: string) => {
  const router = useRouter();
  
  const [store, setStore] = useState<IStore | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const storeSnap = await get(ref(db, "stores"));
        if (!storeSnap.exists()) return;

        const storeData = storeSnap.val() as Record<string, any>;
        const foundStore = Object.entries(storeData).find(
          ([, s]) => s.slug === slug
        );
        if (!foundStore) return;

        const [storeId, storeVal] = foundStore;
        setStore({ ...storeVal, id: storeId } as IStore);

        const productSnap = await get(ref(db, `products/${storeId}`));
        if (!productSnap.exists()) {
          router.push(`/store/${slug}`);
          return;
        }

        const allProducts = productSnap.val() as Record<string, any>;
        
        const foundProduct = Object.entries(allProducts).find(
          ([, p]: [string, any]) => p.slug === productSlug
        );

        if (!foundProduct) {
          router.push(`/store/${slug}`);
          return;
        }

        const [productId, productVal] = foundProduct;
        setProduct({ id: productId, storeId, ...productVal } as Product);

        const otherProds: Product[] = [];
        Object.entries(allProducts).forEach(([id, p]: [string, any]) => {
          if (p.slug !== productSlug) {
            otherProds.push({ 
              id, 
              storeId, 
              createdAt: p.createdAt || 0,
              ...p 
            } as Product);
          }
        });
        
        otherProds.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOtherProducts(otherProds.slice(0, 4));
      } catch (err) {
        console.error(err);
        router.push(`/store/${slug}`);
      } finally {
        setLoading(false);
      }
    }

    if (slug && productSlug) loadData();
  }, [slug, productSlug, router]);

  return { store, product, loading, otherProducts };
};