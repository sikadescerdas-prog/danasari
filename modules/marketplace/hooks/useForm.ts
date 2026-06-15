// app/hooks/useForm.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/core/auth/store/session.store";
import { storeService } from "@/modules/marketplace/services/store.service";
import { productService } from "@/modules/marketplace/services/product.service";
import type { IStore } from "@/modules/marketplace/types/store.types";
import type { Product } from "@/modules/marketplace/types/product.types";

interface UseSellerProductFormProps {
  editId: string;
}

export function useSellerProductForm({ editId }: UseSellerProductFormProps) {
  const router = useRouter();
  const { session } = useSessionStore();
  const { uid, loading: authLoading, hydrated, role } = session;

  const [store, setStore] = useState<IStore | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      // 1. CEK: Auth - TUNGGU HYDRATED dulu
      if (!hydrated) {
        setLoading(true);
        return;
      }

      // 2. CEK: Login
      if (!uid) {
        router.push("/login");
        return;
      }

      // 3. CEK: Auth Loading
      if (authLoading) {
        setLoading(true);
        return;
      }

      // 4. CEK: Role SELLER
      if (role !== "seller") {
        setError("Anda harus memiliki toko untuk mengakses halaman ini");
        setLoading(false);
        return;
      }

      // 5. Load store
      try {
        const currentStore = await storeService.getStore(uid);
        
        // TIDAK ADA STORE = harus buat toko dulu
        if (!currentStore) {
          router.push("/store/create");
          return;
        }

        setStore(currentStore);

        // 6. Load product jika EDIT MODE
        if (editId) {
          const prod = await productService.getById(currentStore.id, editId);
          
          if (!prod) {
            router.push("/store");
            return;
          }

          // CEK: Bukan produk sendiri
          if (prod.ownerUid !== uid) {
            router.push("/store");
            return;
          }

          setProduct(prod);
        }
      } catch (err) {
        console.error("Error:", err);
        router.push("/store");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, editId, hydrated, authLoading, role, router]);

  // Logic Hapus Produk
  const handleDelete = async () => {
    if (!product || !store) return;

    const isConfirmed = confirm("Yakin hapus produk?");
    if (!isConfirmed) return;
    
    if (product.ownerUid !== uid) {
      router.push("/store");
      return;
    }
    
    try {
      await productService.remove(store.id, product.id, uid);
      router.push("/store");
    } catch (err) {
      console.error(err);
    }
  };

  return {
    store,
    product,
    loading,
    error,
    handleDelete
  };
}