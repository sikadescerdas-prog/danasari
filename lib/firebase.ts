// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

/* =========================
   🔥 FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

/* =========================
   🚀 INIT APP (SAFE NEXT.JS)
========================= */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/* =========================
   🔐 SERVICES
========================= */
export const auth = getAuth(app);
export const db = getDatabase(app);

/* =========================
   🌐 GOOGLE PROVIDER
========================= */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;