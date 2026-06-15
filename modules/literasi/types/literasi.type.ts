// modules/literasi/types/literasi.types.ts

import { CloudinaryImage, CloudinaryPDF } from '@/shared/types/cloudinary.type';

export type LiterasiType = 'artikel' | 'buku';

export type LiterasiCategory = 
  | '' 
  | 'pendidikan' 
  | 'kesehatan' 
  | 'usaha' 
  | 'finansial' 
  | 'lingkungan' 
  | 'teknologi'
  | 'tips'  
  | 'lainnya';

export interface Literasi {
  id: string;
  title: string;
  slug: string;
  type: LiterasiType;
  category: LiterasiCategory;
  description: string;
  content?: string;
  thumbnail: CloudinaryImage;
  pdf?: CloudinaryPDF;
  linkpdf?: string;
  tiktokLink?: string;
  youtubeLink?: string;
  instagramLink?: string;
  authorName: string;
  uid: string;
  status: 'active';
  createdAt: number;
}

export interface FormLiterasi {
  type: LiterasiType;
  title: string;
  category: LiterasiCategory;
  description: string;
  content?: string;
  thumbnail?: CloudinaryImage;
  pdf?: CloudinaryPDF;
  linkpdf?: string;
  tiktokLink?: string;
  youtubeLink?: string;
  instagramLink?: string;
}

/* =========================
   📌 OPTIONS
========================= */
export const LITERASI_CATEGORIES: { value: LiterasiCategory; label: string }[] = [
  { value: '' as LiterasiCategory, label: 'Pilih Kategori' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'usaha', label: 'Usaha' },
  { value: 'finansial', label: 'Finansial' },
  { value: 'lingkungan', label: 'Lingkungan' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'tips', label: 'Tips & Trik' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const LITERASI_TYPES: { value: LiterasiType; label: string }[] = [
  { value: 'artikel', label: 'Artikel' },
  { value: 'buku', label: 'Buku (E-Book)' },
];