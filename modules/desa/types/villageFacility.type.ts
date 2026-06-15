// modules/desa/types/villageFacility.type.ts
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

export type FacilityCategory = 
  | "pendidikan" 
  | "ibadah" 
  | "umum" 
  | "kesehatan" 
  | "ekonomi";

export type FacilityType = 
  // Pendidikan
  | "paud" | "tk" | "sd" | "smp" | "sma" | "smk" | "pt" | "ponpes"
  // Ibadah
  | "masjid" | "mushola" | "gereja" | "pura" | "vihara" | "klenteng"
  // Umum
  | "kantor_desa" | "balai_desa" | "bal_rw" | "poskamling" | "lapangan"
  // Kesehatan
  | "puskesmas" | "pustu" | "klinik" | "posyandu"
  // Ekonomi
  | "pasar" | "toko" | "koperasi" | "bumdes";

export interface Facility {
  id: string;
  name: string;
  address?: string;
  photo?: CloudinaryImage;
  category: FacilityCategory;
  type?: FacilityType;  // ← Optional
  locationUrl?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Interface untuk form - SAMA KONSEP dengan News
export interface FormFacility {
  name?: string;  // ← Optional di form (bisa tambah default)
  address?: string;
  photoFile?: File;
  category?: FacilityCategory;  // ← Optional dg default
  type?: FacilityType;
  locationUrl?: string;
  deletePhoto?: boolean;
}