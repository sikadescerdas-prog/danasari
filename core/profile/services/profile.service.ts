// core/profile/services/profile.service.ts
// =========================
// PROFILE SERVICE (FIREBASE)
// =========================

import {
  get,
  ref,
  runTransaction,
  update,
} from "firebase/database";

import { db } from "@/lib/firebase";

import { usernameToIndex } from "@/core/auth/helpers/username";
import { phoneToSave } from "@/shared/helpers/phone";

import type { Profile, UserData } from "../types/profile.types";

/* =========================
   PROFILE SERVICE
========================= */
export const profileService = {
  // =========================
  // GET PROFILE (COMBINED)
  // =========================
  async getProfile(uid: string): Promise<UserData> {
    const [userSnap, profileSnap, storeSnap] = await Promise.all([
      get(ref(db, `users/${uid}`)),
      get(ref(db, `profiles/${uid}`)),
      get(ref(db, `stores/${uid}`)),
    ]);

    return {
      user: userSnap.val(),
      profile: profileSnap.val(),
      store: storeSnap.val(),
    };
  },

  // =========================
  // LOCK USERNAME
  // =========================
  async lockUsername(username: string, uid: string) {
    const key = usernameToIndex(username);
    const usernameRef = ref(db, `usernameIndex/${key}`);

    return runTransaction(usernameRef, (current) => {
      if (current === null) return uid;
      if (current === uid) return current;
      return;
    });
  },

  // =========================
  // SAVE PROFILE
  // =========================
  async saveProfile({
    uid,
    currentUsername,
    newUsername,
    profile,
  }: {
    uid: string;
    currentUsername: string;
    newUsername: string;
    profile: Partial<Profile>;
  }) {
    const updates: Record<string, any> = {};

    let finalUsername = currentUsername;

    // USERNAME UPDATE
    const usernameChanged = currentUsername !== newUsername;

    if (usernameChanged) {
      const tx = await this.lockUsername(newUsername, uid);

      if (!tx.committed) {
        throw new Error("Username already taken");
      }

      const oldKey = usernameToIndex(currentUsername);
      const newKey = usernameToIndex(newUsername);

      updates[`users/${uid}/username`] = newUsername;
      updates[`usernameIndex/${oldKey}`] = null;
      updates[`usernameIndex/${newKey}`] = uid;

      finalUsername = newUsername;
    }

    // STORE SLUG SYNC
    if (usernameChanged) {
      const storeSnap = await get(ref(db, `stores/${uid}`));

      if (storeSnap.exists()) {
        updates[`stores/${uid}/slug`] = finalUsername;
      }
    }

    // PROFILE COMPLETE
    const isProfileComplete =
      !!profile.fullname &&
      !!profile.phone &&
      !!profile.bio &&
      !!profile.gender &&
      !!profile.birthDate &&
      !!profile.address?.detailAddress &&
      !!profile.address?.city;

    // CLEAN PROFILE
    const cleanProfile: Partial<Profile> = {
      uid,

      ...(profile.fullname !== undefined && {
        fullname: profile.fullname,
      }),

      ...(profile.phone !== undefined && {
        phone: profile.phone ? phoneToSave(profile.phone) : undefined,
      }),

      ...(profile.bio !== undefined && {
        bio: profile.bio,
      }),

      ...(profile.gender !== undefined && {
        gender: profile.gender,
      }),

      ...(profile.birthDate !== undefined && {
        birthDate: profile.birthDate,
      }),

      ...(profile.address !== undefined && {
        address: profile.address,
      }),

      ...(profile.avatar !== undefined &&
        profile.avatar !== null && {
          avatar: {
            url: profile.avatar.url,
            publicId: profile.avatar.publicId,
          },
        }),

      ...(profile.hasStore !== undefined && {
        hasStore: profile.hasStore,
      }),

      isProfileComplete,

      updatedAt: Date.now(),
    };

    // PARTIAL UPDATE
    Object.entries(cleanProfile).forEach(([key, value]) => {
      updates[`profiles/${uid}/${key}`] = value;
    });

    // SAVE FIREBASE
    await update(ref(db), updates);
  },
};