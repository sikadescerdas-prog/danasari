// core/auth/services/auth.service.ts

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, db, googleProvider } from "@/lib/firebase";

import type { User } from "../types/user.types";
import type { RegisterState } from "../types/user.types";

import { validateEmail, emailToIndex } from "../helpers/email";
import { 
  validateUsername, 
  isUsernameExists, 
  usernameToIndex,
  generateGoogleUsername,
} from "../helpers/username";

/* =========================
   AUTH SERVICE
========================= */
export const authService = {
  /* =========================
     REGISTER (EMAIL & PASSWORD)
     ========================= */
  async registerWithEmail(data: RegisterState): Promise<void> {
    const emailCheck = validateEmail(data.email);
    if (!emailCheck.ok) throw { code: "VALIDATION_ERROR", message: emailCheck.error };

    const usernameCheck = validateUsername(data.username);
    if (!usernameCheck.ok) throw { code: "VALIDATION_ERROR", message: usernameCheck.error };

    if (data.password !== data.confirmPassword) {
      throw { code: "VALIDATION_ERROR", message: "Konfirmasi password tidak cocok" };
    }

    if (await isUsernameExists(data.username)) {
      throw { code: "VALIDATION_ERROR", message: "Username sudah digunakan" };
    }

    let userCred;
    try {
      userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCred.user;

      await updateProfile(user, { displayName: data.username });

      const emailIdx = emailToIndex(user.email!);
      const usernameIdx = usernameToIndex(data.username);

      // Cek index sebelum tulis (race condition)
      await this.createUserNode(user.uid, {
        username: data.username,
        email: user.email!,
        role: "user",
        isActive: true,
      }, usernameIdx, emailIdx);

      await this.createProfileNode(user.uid, { fullname: data.fullname });

    } catch (error: any) {
      await this.cleanupFailedRegistration(userCred?.user?.uid);
      
      if (error.code === "auth/email-already-in-use") {
        throw { code: "VALIDATION_ERROR", message: "Email sudah terdaftar" };
      }
      if (error.code === "USERNAME_TAKEN") {
        throw { code: "VALIDATION_ERROR", message: "Username sudah digunakan" };
      }
      throw error;
    }
  },

  /* =========================
     LOGIN / REGISTER (GOOGLE)
     ========================= */
  async loginWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        const emailCheck = validateEmail(user.email);
        if (!emailCheck.ok) {
          await signOut(auth);
          throw { code: "VALIDATION_ERROR", message: emailCheck.error };
        }

        const newUsername = await generateGoogleUsername(user.email!);
        const displayName = user.displayName || "User";

        const emailIdx = emailToIndex(user.email!);
        const usernameIdx = usernameToIndex(newUsername);

        await this.createUserNode(user.uid, {
          username: newUsername,
          email: user.email!,
          role: "user",
          isActive: true,
        }, usernameIdx, emailIdx);

        await this.createProfileNode(user.uid, { fullname: displayName });
      }
    } catch (error: any) {
      console.error("Google Auth Error", error);
      throw error;
    }
  },

  /* =========================
     LOGIN (EMAIL & USERNAME)
     ========================= */
  async loginWithIdentifier(identifier: string, password: string): Promise<void> {
    // Cek apakah identifier adalah email atau username
    const isEmail = identifier.includes("@");
    
    if (isEmail) {
      // Login dengan Email
      return this.loginWithEmail(identifier, password);
    } else {
      // Login dengan Username
      return this.loginWithUsername(identifier, password);
    }
  },

  /* =========================
     LOGIN (EMAIL & PASSWORD)
     ========================= */
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === "auth/invalid-login-credentials") {
        throw { code: "AUTH_ERROR", message: "Email atau password salah" };
      }
      if (error.code === "auth/user-disabled") {
        throw { code: "AUTH_ERROR", message: "Akun ini dinonaktifkan" };
      }
      throw error;
    }
  },

  /* =========================
     LOGIN (USERNAME & PASSWORD)
     ========================= */
  async loginWithUsername(username: string, password: string): Promise<void> {
    try {
      // Ambil UID dari username index
      const usernameIdx = usernameToIndex(username);
      const usernameRef = ref(db, `usernameIndex/${usernameIdx}`);
      const usernameSnap = await get(usernameRef);

      if (!usernameSnap.exists()) {
        throw { code: "AUTH_ERROR", message: "Username tidak ditemukan" };
      }

      const uid = usernameSnap.val();

      // Ambil email dari user node
      const userRef = ref(db, `users/${uid}`);
      const userSnap = await get(userRef);

      if (!userSnap.exists()) {
        throw { code: "AUTH_ERROR", message: "Akun tidak ditemukan" };
      }

      const userData = userSnap.val() as User;

      if (!userData.isActive) {
        throw { code: "AUTH_ERROR", message: "Akun ini dinonaktifkan" };
      }

      // Login dengan email dari user node
      return this.loginWithEmail(userData.email, password);
    } catch (error: any) {
      if (error.code === "AUTH_ERROR") {
        throw error;
      }
      throw { code: "AUTH_ERROR", message: "Username atau password salah" };
    }
  },

  /* =========================
     LOGOUT
     ========================= */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /* =========================
     CREATE USER NODE + INDEX
     ========================= */
  async createUserNode(uid: string, data: Omit<User, "uid" | "createdAt">, usernameIdx: string, emailIdx: string) {
    // Cek username index
    const usernameRef = ref(db, `usernameIndex/${usernameIdx}`);
    const usernameSnap = await get(usernameRef);
    if (usernameSnap.exists()) {
      throw { code: "USERNAME_TAKEN", message: "Username sudah digunakan" };
    }

    // Cek email index
    const emailRef = ref(db, `emailIndex/${emailIdx}`);
    const emailSnap = await get(emailRef);
    if (emailSnap.exists()) {
      throw { code: "EMAIL_TAKEN", message: "Email sudah digunakan" };
    }

    // Tulis ke /users
    const userRef = ref(db, `users/${uid}`);
    await set(userRef, {
      ...data,
      createdAt: Date.now(),
    });

    // Tulis index
    await set(usernameRef, uid);
    await set(emailRef, uid);
  },

  /* =========================
     CREATE PROFILE NODE
     ========================= */
  async createProfileNode(uid: string, data: { fullname: string }) {
    const profileRef = ref(db, `profiles/${uid}`);
    await set(profileRef, {
      uid,
      fullname: data.fullname,
      phone: "",
      birthDate: "",
      gender: "",
      bio: "",
      hasStore: false,
      isProfileComplete: false,
      avatar: {
        publicId: "",
        url: "",
      },
      address: {
        city: "",
        detailAddress: "",
        latitude: 0,
        longitude: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },

  /* =========================
     CLEANUP JIKA GAGAL
     ========================= */
  async cleanupFailedRegistration(uid?: string) {
    if (!uid) return;
    try {
      const userRef = ref(db, `users/${uid}`);
      const profileRef = ref(db, `profiles/${uid}`);
      await set(userRef, null);
      await set(profileRef, null);
    } catch (e) {
      // Abaikan
    }
  },
};