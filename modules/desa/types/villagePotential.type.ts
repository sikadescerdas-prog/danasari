// villagepotential.type.ts

import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

export type potentialCategory =
  | "umkm"
  | "pertanian"
  | "peternakan"
  | "perikanan"
  | "kerajinan"
  | "budaya"
  | "sejarah"
  | "kuliner"
  | "objek_wisata";

export interface potential {
  id: string;
  name: string;
  category: potentialCategory;
  description?: string;
  image?: CloudinaryImage;
  address?: string;
  locationUrl?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Formpotential {
  name?: string;
  category?: potentialCategory;
  description?: string;
  imageFile?: File;
  address?: string;
  locationUrl?: string;
  deleteImage?: boolean;
}