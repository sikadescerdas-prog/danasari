// modules/dashboard/services/villageProfile.service.ts

import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { phoneToSave } from "@/shared/helpers/phone";

import type { VillageProfile } from "@/modules/desa/types/villageProfile.type";

const VILLAGE_REF = ref(db, "village/profile");

export const villageProfileService = {
  get: async (): Promise<VillageProfile> => {
    const snapshot = await get(VILLAGE_REF);

    if (!snapshot.exists()) {
      const initialData: VillageProfile = {
        id: "village-profile",
        uid: "system",
        name: "",
        address: {},
        phone: "",
        email: "",
        logo: null,
        foundedYear: "",
        areaSize: "",
        vision: "",
        mission: "",
        welcomeMessage: "",
        history: "",
        locationUrl: "",
        socialMedia: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(VILLAGE_REF, initialData);
      return initialData;
    }

    return snapshot.val();
  },

  update: async (data: Partial<VillageProfile>): Promise<VillageProfile> => {
    const snapshot = await get(VILLAGE_REF);
    const existing = snapshot.exists() ? snapshot.val() : null;

    const logo =
      data.logo === undefined ? existing?.logo : data.logo;

    const phoneSave = data.phone
      ? phoneToSave(data.phone)
      : existing?.phone || "";

    const updateData: VillageProfile = {
      id: existing?.id || "village-profile",
      uid: existing?.uid || "system",

      name: data.name ?? existing?.name ?? "",
      address: data.address ?? existing?.address ?? {},

      phone: phoneSave,
      email: data.email ?? existing?.email ?? "",

      logo: logo,

      foundedYear: data.foundedYear ?? existing?.foundedYear ?? "",
      areaSize: data.areaSize ?? existing?.areaSize ?? "",

      vision: data.vision ?? existing?.vision ?? "",
      mission: data.mission ?? existing?.mission ?? "",

      welcomeMessage:
        data.welcomeMessage ?? existing?.welcomeMessage ?? "",

      history:
        data.history ?? existing?.history ?? "",

      locationUrl:
        data.locationUrl ?? existing?.locationUrl ?? "",

      socialMedia:
        data.socialMedia ?? existing?.socialMedia ?? {},

      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await set(VILLAGE_REF, updateData);
    return updateData;
  },
};