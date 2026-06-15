// modules/marketplace/services/product.service.ts

import { get, ref, set, push, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { cloudinaryService } from "@/core/cloudinary/cloudinary.service";
import { slugProduct } from "@/modules/marketplace/utils/slugProduct";
import type { Product, ProductFormData, ProductPayload } from "@/modules/marketplace/types/product.types";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

export const productImageService = {
  upload: async (file: File, uid: string): Promise<CloudinaryImage> => {
    const result = await cloudinaryService.upload(file, { 
      folder: `stores/${uid}`,
      cropType: "16:9",
    });
    return { publicId: result.publicId, url: result.url };
  },

  delete: async (publicId: string): Promise<void> => {
    if (!publicId) return;
    await cloudinaryService.delete(publicId);
  },

  deleteMultiple: async (publicIds: string[]): Promise<void> => {
    const validIds = publicIds.filter(id => id);
    if (validIds.length === 0) return;
    await Promise.all(validIds.map((id) => cloudinaryService.delete(id)));
  },
};

export const productService = {
  // =========================
  // CREATE
  // =========================
  create: async (
    storeId: string,
    storeSlug: string,
    ownerUid: string,
    data: ProductFormData
  ): Promise<Product> => {
    const PRODUCTS_REF = ref(db, `products/${storeId}`);
    const now = Date.now();
    
    const name = data.name || "";
    const slug = slugProduct(name);  // ✅ Pakai helper
    
    const newRef = push(PRODUCTS_REF);
    const productId = newRef.key!;

    let uploadedImages: CloudinaryImage[] = [];
    if (data.imageFiles && data.imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        data.imageFiles.map(async (file) => {
          return await productImageService.upload(file, ownerUid);
        })
      );
    }

    const allImages = [...(data.images || []), ...uploadedImages];

    const product: ProductPayload = {
      storeId,
      storeSlug,
      ownerUid,
      name,
      slug,
      description: data.description || "",
      price: Number(data.price) || 0,
      category: data.category || "",
      stock: Number(data.stock) || 0,
      images: allImages,
      isActive: true,
      createdAt: now,
    };

    await set(newRef, product);
    return { id: productId, ...product };
  },

  // =========================
  // UPDATE
  // =========================
  update: async (
    storeId: string,
    productId: string,
    ownerUid: string,
    data: ProductFormData
  ): Promise<Product> => {
    const name = data.name || "";
    const slug = slugProduct(name);  // ✅ Pakai helper

    let uploadedImages: CloudinaryImage[] = [];
    if (data.imageFiles && data.imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        data.imageFiles.map(async (file) => {
          return await productImageService.upload(file, ownerUid);
        })
      );
    }

    const allImages = [...(data.images || []), ...uploadedImages];

    await update(ref(db, `products/${storeId}/${productId}`), {
      name,
      slug,
      description: data.description || "",
      price: Number(data.price) || 0,
      category: data.category || "",
      stock: Number(data.stock) || 0,
      images: allImages,
      updatedAt: Date.now(),
    });

    const snapshot = await get(ref(db, `products/${storeId}/${productId}`));
    return { id: productId, ...snapshot.val() } as Product;
  },

  // =========================
  // GET BY ID
  // =========================
  getById: async (storeId: string, productId: string): Promise<Product | null> => {
    const snapshot = await get(ref(db, `products/${storeId}/${productId}`));
    if (!snapshot.exists()) return null;
    return { id: productId, ...snapshot.val() } as Product;
  },

  // =========================
  // GET BY STORE
  // =========================
  getByStore: async (storeId: string): Promise<Product[]> => {
    const snapshot = await get(ref(db, `products/${storeId}`));
    if (!snapshot.exists()) return [];

    const result: Product[] = [];
    snapshot.forEach((child: any) => {
      const data = child.val();
      if (data.isActive) {
        result.push({
          id: child.key!,
          ...data,
        });
      }
    });
    return result;
  },

  // =========================
  // DELETE (Soft)
  // =========================
  delete: async (storeId: string, productId: string): Promise<void> => {
    await update(ref(db, `products/${storeId}/${productId}`), {
      isActive: false,
      updatedAt: Date.now(),
    });
  },

  // =========================
  // REMOVE (Hard) - Hapus folder Cloudinary + Firebase
  // =========================
  // product.service.ts

  remove: async (storeId: string, productId: string, ownerUid: string) => {
    const snapshot = await get(ref(db, `products/${storeId}/${productId}`));
    const product = snapshot.val();
    
    // Hapus image berdasarkan publicId
    if (product.images) {
      for (const img of product.images) {
        if (img.publicId) {
          await cloudinaryService.delete(img.publicId);
        }
      }
    }
    
    // Firebase
    await remove(ref(db, `products/${storeId}/${productId}`));
  },
};