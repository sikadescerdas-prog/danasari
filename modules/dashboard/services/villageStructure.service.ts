// modules/dashboard/services/villageStructure.service.ts

import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import type { StructurePosition, StructureTitle, StructureGender } from "@/modules/desa/types/villageStructure.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

const STRUCTURE_REF = ref(db, "village/structure");

interface StructureItem extends StructurePosition {
  createdAt?: number;
  updatedAt?: number;
}

interface StructureForm {
  name?: string;
  title?: StructureTitle;
  gender?: StructureGender;
  photo?: CloudinaryImage | null;
  photoFile?: File;
  phone?: string;
  yearJoined?: number;
}

export const structureService = {

  get: async (): Promise<StructureItem[]> => {
    const snapshot = await get(STRUCTURE_REF);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    
    if (data && typeof data === 'object') {
      return Object.values(data);
    }
    
    return [];
  },

  addStructure: async (form: StructureForm): Promise<StructureItem> => {
    const snapshot = await get(STRUCTURE_REF);
    const structureObj: Record<string, StructureItem> = snapshot.exists() ? snapshot.val() : {};

    const now = Date.now();
    const id = `struktur-${now}`;
    
    const newItem: StructureItem = {
      id,
      name: form.name || "",
      title: form.title,
      gender: form.gender,
      phone: form.phone || "",
      yearJoined: form.yearJoined,
      // ✅ Hanya simpan photo jika ada nilai
      ...(form.photo && { photo: form.photo }),
      createdAt: now,
      updatedAt: now,
    };

    structureObj[id] = newItem;
    await set(STRUCTURE_REF, structureObj);
    return newItem;
  },

  updateStructure: async (structureId: string, form: Partial<StructurePosition & { photo?: CloudinaryImage | null }>): Promise<StructureItem> => {
    const snapshot = await get(STRUCTURE_REF);
    const structureObj: Record<string, StructureItem> = snapshot.exists() ? snapshot.val() : {};

    if (!structureObj[structureId]) throw new Error("Struktur tidak ditemukan");

    const updateData: Partial<StructureItem> = {};
    
    if (form.name !== undefined) updateData.name = form.name;
    if (form.title !== undefined) updateData.title = form.title;
    if (form.gender !== undefined) updateData.gender = form.gender;
    if (form.phone !== undefined) updateData.phone = form.phone;
    if (form.yearJoined !== undefined) updateData.yearJoined = form.yearJoined;
    
    // ✅ Photo: hanya jika ada nilai (bukan null/undefined)
    if (form.photo !== undefined) {
      if (form.photo === null) {
        // Jika null, hapus field photo
        updateData.photo = null as any;
      } else if (form.photo) {
        updateData.photo = form.photo;
      }
    }

    const updated: StructureItem = {
      ...structureObj[structureId],
      ...updateData,
      id: structureId,
      updatedAt: Date.now(),
    };

    structureObj[structureId] = updated;
    await set(STRUCTURE_REF, structureObj);
    return updated;
  },

  deleteStructure: async (structureId: string): Promise<void> => {
    const snapshot = await get(STRUCTURE_REF);
    const structureObj: Record<string, StructureItem> = snapshot.exists() ? snapshot.val() : {};

    delete structureObj[structureId];
    await set(STRUCTURE_REF, structureObj);
  },
};