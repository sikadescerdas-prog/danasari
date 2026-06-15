"use client";

import { useState, useEffect, useMemo } from "react";
import { get, ref, update } from "firebase/database";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

import { useSessionStore } from "@/core/auth/store/session.store";
import { sweet } from "@/shared/utils/sweet";
import { productService } from "@/modules/marketplace/services/product.service";

import { Product } from "@/modules/marketplace/types/product.types";
import { IStore } from "@/modules/marketplace/types/store.types";

export const useStoreDetail = (slug: string) => {
  const router = useRouter();
  
  const session = useSessionStore((state) => state.session);
  const uid = session?.uid || "";
  const role = session?.role || "";
  const hydrated = session?.hydrated;

  const [toko, setToko] = useState<IStore | null>(null);
  const [storeId, setStoreId] = useState<string>("");
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"default" | "terbaru" | "harga_asc" | "harga_desc">("default");
  const [category, setCategory] = useState("semua");

  const BATAS_PRODUK_PER_HALAMAN = 12;

  // Ownership Check
  const isOwner = hydrated && uid === toko?.ownerUid && role === "seller";

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);

      const storeSnap = await get(ref(db, "stores"));
      if (!storeSnap.exists()) return;

      const storeData = storeSnap.val() as Record<string, any>;
      const found = Object.entries(storeData).find(([, s]) => s.slug === slug);

      if (!found) return;

      const [id, store] = found;
      setStoreId(id);
      setToko({ ...store, id });
      setIsStoreOpen(store.isActive === true);

      const productSnap = await get(ref(db, `products/${id}`));
      if (!productSnap.exists()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const raw = productSnap.val() as Record<string, any>;
      const isUserOwner = hydrated && uid === store.ownerUid && role === "seller";

      const list: Product[] = Object.entries(raw)
        .map(([pid, p]: [string, any]) => ({
          id: pid, storeId: id, ...p,
        }))
        .filter((p) => isUserOwner ? true : p.isActive !== false);

      setProducts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) loadData();
  }, [slug]);

  // Owner Actions
  const handleEdit = (product: Product) => {
    router.push(`/store/form?id=${product.id}`);
  };

  const handleToggleProduct = async (product: Product) => {
    try {
      await update(ref(db, `products/${storeId}/${product.id}`), {
        isActive: !product.isActive,
        updatedAt: Date.now(),
      });
      loadData();
    } catch (err) {
      sweet.error({ title: "Gagal", text: "Terjadi kesalahan" });
    }
  };

  const handleToggleStoreStatus = async () => {
    if (isStoreOpen) {
      const isConfirmed = await sweet.confirmWarning({
        title: "Tutup toko?",
        text: "Produk tidak dapat dilihat",
        confirmButtonText: "Ya, Tutup",
      });
      if (!isConfirmed) return;
    } else {
      const isConfirmed = await sweet.confirm({
        title: "Buka toko?",
        text: "Produk akan ditampilkan kembali",
        confirmButtonText: "Ya, Buka",
      });
      if (!isConfirmed) return;
    }

    try {
      await update(ref(db, `stores/${storeId}`), {
        isActive: !isStoreOpen,
        updatedAt: Date.now(),
      });
      setIsStoreOpen(!isStoreOpen);
      sweet.success({ title: "Berhasil", text: `Toko ${!isStoreOpen ? 'dibuka' : 'ditutup'}` });
    } catch (err) {
      sweet.error({ title: "Gagal", text: "Terjadi kesalahan" });
    }
  };

  const handleDelete = async (product: Product) => {
    const isConfirmed = await sweet.confirm({
      title: "Hapus produk?",
      text: "Data & gambar akan dihapus permanen",
      icon: "warning",
      confirmButtonText: "Hapus",
    });
    if (!isConfirmed) return;

    try {
      await productService.remove(storeId, product.id, uid);
      sweet.success({ title: "Berhasil", text: "Produk dihapus" });
      loadData();
    } catch (err) {
      console.error("Delete failed:", err);
      sweet.error({ title: "Gagal", text: "Terjadi kesalahan" });
    }
  };

  // Filter + Sort Logic
  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== "semua") {
      result = result.filter((p) => p.category === category);
    }

    switch (sort) {
      case "terbaru":
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case "harga_asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "harga_desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [products, category, sort]);

  const paginated = useMemo(() => {
    const start = (page - 1) * BATAS_PRODUK_PER_HALAMAN;
    const slice = filtered.slice(start, start + BATAS_PRODUK_PER_HALAMAN);
    return slice;
  }, [filtered, page]);

  const hasMore = filtered.length > page * BATAS_PRODUK_PER_HALAMAN;

  return {
    toko,
    isOwner,
    loading,
    isStoreOpen,
    filtered,
    paginated,
    hasMore,
    setPage,
    setCategory,
    setSort,
    handleEdit,
    handleToggleProduct,
    handleToggleStoreStatus,
    handleDelete,
  };
};