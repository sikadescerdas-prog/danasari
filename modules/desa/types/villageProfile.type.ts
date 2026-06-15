  import type { VillageAddress} from './address.type';
  import type { CloudinaryImage } from '@/shared/types/cloudinary.type';

  export interface SocialMedia {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  }

  export interface VillageProfile {
    id: string;
    uid: string;
    name: string;
    address: VillageAddress;
    phone: string;
    email?: string;
    logo?: CloudinaryImage | null;
    foundedYear?: string;
    areaSize?: string;
    vision?: string;
    mission?: string;
    welcomeMessage?: string;
    history?: string;
    locationUrl?: string;
    socialMedia?: SocialMedia;
    
    createdAt: number;
    updatedAt: number;
  }

  export interface FormVillageProfile {
    name?: string;
    address?: VillageAddress;
    phone?: string;
    email?: string;
    logo?: File;
    currentLogo?: CloudinaryImage | null;
    foundedYear?: string;
    areaSize?: string;
    vision?: string;
    mission?: string;
    welcomeMessage?: string;
    history?: string;
    locationUrl?: string;
    socialMedia?: SocialMedia;
  }