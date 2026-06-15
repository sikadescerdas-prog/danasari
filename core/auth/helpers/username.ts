// core/auth/helpers/username.ts

import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

const RESERVED = new Set([
  "admin",
  "root",
  "system",
  "api",
  "auth",
  "login",
  "register",
  "dashboard",
  "settings",
  "profile",
  "user",
  "null",
  "",
]);

/* =========================
   VALIDATE (manual input)
========================= */
export function validateUsername(username: string | null): {
  ok: boolean;
  error?: string;
} {
  if (!username) {
    return { ok: false, error: "Username wajib diisi" };
  }

  const value = username.trim();

  if (value.length < 3 || value.length > 20) {
    return { ok: false, error: "Username harus 3-20 karakter" };
  }

  if (/[A-Z]/.test(value)) {
    return { ok: false, error: "Username hanya boleh huruf kecil" };
  }

  if (!/^[a-z0-9._]+$/.test(value)) {
    return { ok: false, error: "Username hanya boleh huruf, angka, titik, underscore" };
  }

  if (
    value.startsWith(".") ||
    value.endsWith(".") ||
    value.startsWith("_") ||
    value.endsWith("_")
  ) {
    return {
      ok: false,
      error: "Username tidak boleh dimulai/diakhiri titik/underscore",
    };
  }

  if (
    value.includes("..") ||
    value.includes("__") ||
    value.includes("._") ||
    value.includes("_.")
  ) {
    return { ok: false, error: "Username mengandung kombinasi karakter tidak valid" };
  }

  if (value.includes(".") && value.includes("_")) {
    return { ok: false, error: "Username tidak boleh kombinasi titik dan underscore" };
  }

  if (RESERVED.has(value.toLowerCase())) {
    return { ok: false, error: "Username tidak tersedia" };
  }

  return { ok: true };
}

/* =========================
   SANITIZE
========================= */
export function sanitizeUsername(username: string): string {
  return username.toLowerCase()
  .trim()
  .replace(/[^a-z0-9._]/g, "");
}

/* =========================
   INDEX FORMAT
========================= */
export function usernameToIndex(username: string): string {
  return username.toLowerCase().trim().replace(/\./g, "_dot_");
}

/* =========================
   CHECK USERNAME EXIST (OPSIONAL CURRENT UID)
========================= */
export async function isUsernameExists(
  username: string,
  currentUid?: string
): Promise<boolean> {
  const usernameIdx = usernameToIndex(username);
  const idxRef = ref(db, `usernameIndex/${usernameIdx}`);
  const snap = await get(idxRef);
  
  if (!snap.exists()) {
    return false;
  }
  
  const ownerUid = snap.val();
  if (currentUid && ownerUid === currentUid) {
    return false;
  }
  
  return true;
}

/* =========================
   GOOGLE: AMBIL BASE USERNAME DARI EMAIL
========================= */
export function emailToBaseUsername(email: string): string {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "");
}

/* =========================
   GOOGLE: GENERATE UNIQUE USERNAME
========================= */
function generateSuffix(length = 4) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function generateGoogleUsername(email: string): Promise<string> {
  // Langsung dari email, JANGAN sanitize (titik tetap ada)
  const base = emailToBaseUsername(email);

  if (!base) {
    return `user${generateSuffix(4)}`;
  }

  // Cek base availability (isUsernameExists auto convert ke index)
  if (!(await isUsernameExists(base))) {
    return base;
  }

  // Kalau base sudah ada, generate dengan suffix
  let username = "";
  let exists = true;

  while (exists) {
    username = `${base}${generateSuffix(4)}`;
    exists = await isUsernameExists(username);
  }

  return username;
}