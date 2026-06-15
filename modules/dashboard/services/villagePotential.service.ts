// modules/dashboard/services/villagePotential.service.ts

import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import type { potential, potentialCategory } from "@/modules/desa/types/villagePotential.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

const POTENTIAL_REF = ref(db, "village/potential");

interface PotentialItem extends potential {
  createdAt?: number;
  updatedAt?: number;
}

// Type untuk form
interface PotentialForm {
  name: string;
  category: potentialCategory;
  description?: string;
  image?: CloudinaryImage;
  imageFile?: File;
  address?: string;
  locationUrl?: string;
  deleteImage?: boolean;
}

export const potentialService = {

  get: async (): Promise<PotentialItem[]> => {
    const snapshot = await get(POTENTIAL_REF);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    
    if (data && typeof data === 'object') {
      return Object.values(data);
    }
    
    return [];
  },

  addPotential: async (form: PotentialForm): Promise<PotentialItem> => {
    const snapshot = await get(POTENTIAL_REF);
    const potentialObj: Record<string, PotentialItem> = snapshot.exists() ? snapshot.val() : {};

    const now = Date.now();
    const category = form.category || "umkm";
    const id = `${category}-${now}`;
    
    const newItem: PotentialItem = {
      id,
      name: form.name || "",
      category: form.category,
      description: form.description || "",
      address: form.address || "",
      locationUrl: form.locationUrl || "",
      image: form.image,
      createdAt: now,
      updatedAt: now,
    };

    potentialObj[id] = newItem;
    await set(POTENTIAL_REF, potentialObj);
    return newItem;
  },

  updatePotential: async (potentialId: string, form: Partial<potential>): Promise<PotentialItem> => {
    const snapshot = await get(POTENTIAL_REF);
    const potentialObj: Record<string, PotentialItem> = snapshot.exists() ? snapshot.val() : {};

    if (!potentialObj[potentialId]) throw new Error("Potensi tidak ditemukan");

    const updateData: Partial<PotentialItem> = {};
    
    if (form.name !== undefined) updateData.name = form.name;
    if (form.category !== undefined) updateData.category = form.category;
    if (form.description !== undefined) updateData.description = form.description;
    if (form.address !== undefined) updateData.address = form.address;
    if (form.locationUrl !== undefined) updateData.locationUrl = form.locationUrl;
    
    // Image: null = hapus, undefined = abaikan (pakai image lama)
    if ('image' in form) {
      updateData.image = form.image;
    }

    const updated: PotentialItem = {
      ...potentialObj[potentialId],
      ...updateData,
      id: potentialId,
      updatedAt: Date.now(),
    };

    potentialObj[potentialId] = updated;
    await set(POTENTIAL_REF, potentialObj);
    return updated;
  },

  deletePotential: async (potentialId: string): Promise<void> => {
    const snapshot = await get(POTENTIAL_REF);
    const potentialObj: Record<string, PotentialItem> = snapshot.exists() ? snapshot.val() : {};

    delete potentialObj[potentialId];
    await set(POTENTIAL_REF, potentialObj);
  },
};