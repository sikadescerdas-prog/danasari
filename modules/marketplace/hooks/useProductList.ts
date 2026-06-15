// hooks/marketplace/useProductList.ts

import { useEffect, useState } from "react";
import { storeService } from "@/modules/marketplace/services/store.service";
import { productService } from "@/modules/marketplace/services/product.service";
import { IStore } from "@/modules/marketplace/types/store.types";
import { Product } from "@/modules/marketplace/types/product.types";

export interface StoreWithProducts extends IStore {
  products: Product[];
}

export function useProductList() {
  const [stores, setStores] = useState<StoreWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const allStores = await storeService.getAllActive();

        const storesWithProducts = await Promise.all(
          allStores.map(async (store) => {
            const products = await productService.getByStore(store.id);
            return { ...store, products };
          })
        );

        setStores(storesWithProducts);
      } catch (err) {
        console.error("Error fetching store data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { stores, loading };
}