  // modules/marketplace/store/types/store.types.ts
  // =========================
  // STORE TYPES
  // =========================

  import { CloudinaryImage } from "@/shared/types/cloudinary.type";
  import { Address } from "@/shared/types/address.type";

  export type Marketplace = {
    shopee?: string;
    tiktokShop?: string;
    waBusiness?: string;
  };

  export interface IStore {
    id: string;
    ownerUid: string;
    nameStore: string;
    slug: string;
    description?: string;
    logo?: CloudinaryImage | null;
    banner?: CloudinaryImage | null;
    addressStore?: Address | null;
    isActive: boolean;
    isStoreComplete: boolean;
    marketplace?: Marketplace;
    createdAt: number;
    updatedAt: number;
  }