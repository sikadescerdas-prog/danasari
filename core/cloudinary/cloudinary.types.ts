// core/cloudinary/cloudinary.types.ts

export type CropType = "1:1" | "16:9" | "none";

export interface UploadOptions {
  folder: string;
  customPublicId?: string;
  cropType?: CropType;
}

export interface UploadResult {
  url: string;
  publicId: string;
}
