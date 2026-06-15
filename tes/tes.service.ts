// tes/tes.service.ts

import { ref, push, set, get, update, remove, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { cloudinaryService } from "@/core/cloudinary/cloudinary.service";
import { Product, CloudinaryImage } from "./tes.types";

/* =========================
   📦 IMAGE SERVICE
========================= */

export const tesImageService = {
  upload: async (file: File, folder: string = "products") => {
    return cloudinaryService.upload(file, { folder });
  },

  uploadImage: async (file: File) => {
    const result = await cloudinaryService.upload(file, { folder: "products" });
    return { publicId: result.publicId, url: result.url };
  },

  delete: async (publicId: string) => {
    return cloudinaryService.delete(publicId);
  },

  deleteMultiple: async (publicIds: string[]) => {
    await Promise.all(publicIds.map((id) => cloudinaryService.delete(id)));
  },
};

/* =========================
   📦 PRODUCT SERVICE
========================= */

const PRODUCTS_REF = ref(db, "products");

export const tesProductService = {
  getAll: async (): Promise<Product[]> => {
    const snapshot = await get(PRODUCTS_REF);
    if (!snapshot.exists()) return [];
    
    const data = snapshot.val() as Record<string, Product>;
    return Object.entries(data).map(([id, value]) => ({
      id,
      name: value.name,
      images: value.images,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    }));
  },

  getById: async (id: string): Promise<Product | null> => {
    const snapshot = await get(ref(db, `products/${id}`));
    if (!snapshot.exists()) return null;
    
    const value = snapshot.val() as Product;
    return {
      id,
      name: value.name,
      images: value.images,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    };
  },

  watchAll: (callback: (products: Product[]) => void) => {
    return onValue(PRODUCTS_REF, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      
      const data = snapshot.val() as Record<string, Product>;
      const products = Object.entries(data).map(([id, value]) => ({
        id,
        name: value.name,
        images: value.images,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
      }));
      callback(products);
    });
  },

  create: async (product: Omit<Product, "id" | "createdAt">): Promise<Product> => {
    const newRef = push(PRODUCTS_REF);
    const newProduct = {
      ...product,
      createdAt: Date.now(),
    };
    await set(newRef, newProduct);
    return { 
      id: newRef.key!, 
      name: newProduct.name,
      images: newProduct.images,
      createdAt: newProduct.createdAt,
    };
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const updated = { ...product, updatedAt: Date.now() };
    await update(ref(db, `products/${id}`), updated);
    
    const snapshot = await get(ref(db, `products/${id}`));
    const value = snapshot.val() as Product;
    return {
      id,
      name: value.name,
      images: value.images,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    };
  },

  delete: async (id: string): Promise<void> => {
    await remove(ref(db, `products/${id}`));
  },
};