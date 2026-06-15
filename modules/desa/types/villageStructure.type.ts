// modules/desa/types/villageStructure.type.ts

import type { CloudinaryImage } from '@/shared/types/cloudinary.type';

export type StructureGender = "laki_laki" | "perempuan";

export type StructureTitle = 
  | "kepala_desa" 
  | "sekretaris_desa"
  | "bendahara"
  | "kaur_keuangan" 
  | "kaur_umum" 
  | "kasi_kesejahteraan" 
  | "kasi_pemerintah" 
  | "kasi_pembangunan" 
  | "kadus" 
  | "rw" 
  | "rt"
  | "bpd"
  | "karang_taruna"
  | "kader_posyandu"
  | "lainnya";

export interface StructurePosition {
  id: string;
  name: string;
  title?: StructureTitle;
  gender?: StructureGender;
  photo?: CloudinaryImage;
  phone?: string;
  yearJoined?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface FormStructure {
  name?: string;
  title?: StructureTitle;
  gender?: StructureGender;
  photoFile?: File;
  phone?: string;
  yearJoined?: number;
  deletePhoto?: boolean;
}