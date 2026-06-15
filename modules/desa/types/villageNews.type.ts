// modules/desa/types/villageNews.type.ts
import type { CloudinaryImage } from '@/shared/types/cloudinary.type';

export type NewsType = 'berita' | 'pengumuman' | 'event';

export interface News {
  id: string;
  title: string;
  content: string;
  image?: CloudinaryImage;
  type: NewsType;
  date: number;
  createdAt?: number;
  updatedAt?: number;
}

// Form untuk add/update
export interface FormNews {
  title: string;
  content: string;
  imageFile?: File;
  type: NewsType;
  date: number;
  deleteImage?: boolean;
}