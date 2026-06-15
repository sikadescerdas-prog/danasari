// core/profile/types/profile.types.ts

import type { CloudinaryImage } from "@/shared/types/cloudinary.type";
import type { Address } from "@/shared/types/address.type";

/* =========================
   GENDER
========================= */
export type Gender = "male" | "female" | "";

/* =========================
   PROFILE
========================= */
export type Profile = {
  uid: string;
  fullname: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender | null;
  bio?: string;

  avatar?: CloudinaryImage | null;
  address?: Address | null;

  isProfileComplete: boolean;
  hasStore: boolean;
  createdAt: number;
  updatedAt: number;
};

/* =========================
   PROFILE FORM (EDIT)
========================= */
export type ProfileForm = {
  username: string;
  fullname: string;
  phone: string;
  bio: string;
  gender: string;
  birthDate: string;
  addressFull: string;
  addressCity: string;
};

/* =========================
   LOCATION (FOR MAPS)
========================= */
export type Location = {
  lat: number;
  lng: number;
};

/* =========================
   USER DATA (COMBINED)
========================= */
export type UserData = {
  user: any;
  profile: Profile | null;
  store: any;
};