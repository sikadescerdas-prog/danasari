// modules/marketplace/store/services/store.service.ts

import { get, ref, set, update } from "firebase/database";
import { db } from "@/lib/firebase";

import type { IStore } from "../types/store.types";

type OpenStoreResult = {
  success: boolean;
  redirect?: string;
  message?: string;
};

export const storeService = {
  // ← TAMBAH INI
  getAllActive: async (): Promise<IStore[]> => {
    const snapshot = await get(ref(db, "stores"));
    if (!snapshot.exists()) return [];

    const raw = snapshot.val();
    const data = raw as Record<string, any>;

    return Object.entries(data)
      .map(([id, value]) => ({ id, ...value } as IStore))
      .filter((s) => s.isActive === true);
  },

  async openStore(uid: string, nameStore: string): Promise<OpenStoreResult> {
    if (!uid || !nameStore) {
      return { success: false, message: "UID atau nama toko kosong" };
    }

    try {
      const profileSnap = await get(ref(db, `profiles/${uid}`));
      const profile = profileSnap.val();

      const userSnap = await get(ref(db, `users/${uid}`));
      const user = userSnap.val();

      const isProfileComplete = profile?.isProfileComplete === true;

      if (!isProfileComplete) {
        return { 
          success: false, 
          redirect: "/profile/settings", 
          message: "Lengkapi data diri Anda" 
        };
      }

      const now = Date.now();

      const storeData: IStore = {
        id: uid,
        ownerUid: uid,
        nameStore: nameStore,
        slug: user?.username || uid,
        description: "",
        logo: { publicId: "", url: "" },
        banner: { publicId: "", url: "" },
        addressStore: {
          detailAddress: "",
          city: "",
          latitude: 0,
          longitude: 0,
        },
        isActive: false,
        isStoreComplete: false,
        marketplace: {
          shopee: "",
          tiktokShop: "",
          waBusiness: profile?.phone || "",
        },
        createdAt: now,
        updatedAt: now,
      };

      await set(ref(db, `stores/${uid}`), storeData);

      const updates: Record<string, any> = {};
      updates[`users/${uid}/role`] = "seller";
      updates[`profiles/${uid}/hasStore`] = true;
      await update(ref(db), updates);

      return { 
        success: true, 
        redirect: "/toko/settings", 
        message: "Toko berhasil dibuat!" 
      };

    } catch (err: any) {
      console.error("Error opening store:", err);
      return { success: false, message: err.message };
    }
  },

  async getStore(uid: string): Promise<IStore | null> {
    try {
      const snapshot = await get(ref(db, `stores/${uid}`));
      return snapshot.val() || null;
    } catch (error) {
      return null;
    }
  },

  async hasStore(uid: string): Promise<boolean> {
    try {
      const snapshot = await get(ref(db, `profiles/${uid}/hasStore`));
      return snapshot.val() === true;
    } catch (error) {
      return false;
    }
  },

  async updateStore(uid: string, data: Partial<IStore>): Promise<boolean> {
    try {
      await update(ref(db, `stores/${uid}`), data);
      return true;
    } catch (error) {
      return false;
    }
  },
};