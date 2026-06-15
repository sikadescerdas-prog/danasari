// core/auth/helpers/email.ts

const ALLOWED_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
]);

/* =========================
   VALIDATE
========================= */
export function validateEmail(email: string | null): {
  ok: boolean;
  error?: string;
} {
  if (!email) {
    return { ok: false, error: "Email wajib diisi" };
  }

  const value = email.trim().toLowerCase();
  const parts = value.split("@");

  if (parts.length !== 2) {
    return { ok: false, error: "Format email tidak valid" };
  }

  const [local, domain] = parts;

  if (!local || !domain) {
    return { ok: false, error: "Format email tidak valid" };
  }

  if (!ALLOWED_DOMAINS.has(domain)) {
    return { ok: false, error: "Gunakan Gmail, Yahoo, atau Outlook" };
  }

  if (!/^[a-z0-9.]+$/.test(local)) {
    return { ok: false, error: "Email hanya huruf kecil dan angka" };
  }

  if (local.includes("..")) {
    return { ok: false, error: "Titik tidak boleh berurutan" };
  }

  return { ok: true };
}

/* =========================
   TO INDEX
========================= */
export function emailToIndex(email: string): string {
  return email.toLowerCase().trim().replace(/\./g, "_").replace(/@/g, "_at_");
}

/* =========================
   SANITIZE
========================= */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
