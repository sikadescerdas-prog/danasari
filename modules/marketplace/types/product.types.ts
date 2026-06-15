// modules/marketplace/types/product.types.ts

import { CloudinaryImage } from "@/shared/types/cloudinary.type";

export type Product = {
  id: string;
  storeId: string;
  storeSlug: string;
  ownerUid: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: CloudinaryImage[];
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: number;
  updatedAt?: number;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  // Gunakan optional (?) agar tidak wajib diisi saat inisialisasi awal
  imageFiles?: File[]; 
  images?: CloudinaryImage[];
};

export type ProductPayload = Omit<Product, "id">;

// Untuk ImgProduct component
export type ImageForm = {
  id: string;
  url: string;
};