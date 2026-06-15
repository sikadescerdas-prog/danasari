// modules/dashboard/services/villageFacility.service.ts

import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import type { Facility, FacilityCategory, FacilityType } from "@/modules/desa/types/villageFacility.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

const FACILITY_REF = ref(db, "village/facility");

interface FacilityItem extends Facility {
  createdAt?: number;
  updatedAt?: number;
}

// Type untuk form - SAMA PERSIS dengan NewsForm
interface FacilityForm {
  name: string;
  address?: string;
  photo?: CloudinaryImage;
  photoFile?: File;
  category: FacilityCategory;
  type?: FacilityType;
  locationUrl?: string;
  deletePhoto?: boolean;
}

export const facilityService = {

  get: async (): Promise<FacilityItem[]> => {
    const snapshot = await get(FACILITY_REF);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    
    if (data && typeof data === 'object') {
      return Object.values(data);
    }
    
    return [];
  },

  addFacility: async (form: FacilityForm): Promise<FacilityItem> => {
    const snapshot = await get(FACILITY_REF);
    const facilityObj: Record<string, FacilityItem> = snapshot.exists() ? snapshot.val() : {};

    const now = Date.now();
    const category = form.category || "umum";
    const id = `${category}-${now}`;
    
    const newItem: FacilityItem = {
      id,
      name: form.name || "",
      address: form.address || "",
      category: form.category,
      type: form.type,
      locationUrl: form.locationUrl || "",
      photo: form.photo,
      createdAt: now,
      updatedAt: now,
    };

    facilityObj[id] = newItem;
    await set(FACILITY_REF, facilityObj);
    return newItem;
  },

  updateFacility: async (facilityId: string, form: Partial<Facility>): Promise<FacilityItem> => {
  const snapshot = await get(FACILITY_REF);
  const facilityObj: Record<string, FacilityItem> = snapshot.exists() ? snapshot.val() : {};

  if (!facilityObj[facilityId]) throw new Error("Fasilitas tidak ditemukan");

  const updateData: Partial<FacilityItem> = {};
  
  if (form.name !== undefined) updateData.name = form.name;
  if (form.address !== undefined) updateData.address = form.address;
  if (form.category !== undefined) updateData.category = form.category;
  if (form.type !== undefined) updateData.type = form.type;
  if (form.locationUrl !== undefined) updateData.locationUrl = form.locationUrl;
  
  // Photo: langsung gunakan form.photo (null = hapus, undefined = abaikan)
  if ('photo' in form) {
    updateData.photo = form.photo;
  }

  const updated: FacilityItem = {
    ...facilityObj[facilityId],
    ...updateData,
    id: facilityId,
    updatedAt: Date.now(),
  };

  facilityObj[facilityId] = updated;
  await set(FACILITY_REF, facilityObj);
  return updated;
},

  deleteFacility: async (facilityId: string): Promise<void> => {
    const snapshot = await get(FACILITY_REF);
    const facilityObj: Record<string, FacilityItem> = snapshot.exists() ? snapshot.val() : {};

    delete facilityObj[facilityId];
    await set(FACILITY_REF, facilityObj);
  },
};