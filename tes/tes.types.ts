// tes/tes.type.ts

export type CloudinaryImage = {
  publicId: string;
  url: string;
};

export interface Product {
  id: string;
  name: string;
  images: CloudinaryImage[];
  createdAt: number;
  updatedAt?: number;
}

export interface UploadImage {
  publicId: string;
  url: string;
}