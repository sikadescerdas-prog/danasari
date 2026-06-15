// core/auth/helpers/password.ts

const COMMON_PASSWORDS = new Set([
  "password",
  "admin",
  "qwerty",
  "123456",
  "12345678",
]);

/* =========================
   VALIDATE
========================= */
export function validatePassword(password: string): {
  ok: boolean;
  score: number;
  label?: string;
  error?: string;
} {
  if (!password) {
    return { ok: false, score: 0, label: "", error: "Password wajib diisi" };
  }

  if (password.length < 8) {
    return {
      ok: false,
      score: 0,
      label: "Password minimal 8 karakter",
      error: "Password minimal 8 karakter",
    };
  }

  const lower = password.toLowerCase();

  const isCommon = COMMON_PASSWORDS.has(lower);
  const isRepeated = /^(.)\1+$/.test(password);

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const typesCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  let score = typesCount;
  if (isCommon) score = Math.min(score, 2);
  if (isRepeated) score = 1;
  if (typesCount === 4 && password.length >= 12) score = 5;

  const labels: Record<number, string> = {
    0: "Terlalu pendek",
    1: "Sangat lemah",
    2: "Lemah",
    3: "Cukup",
    4: "Kuat",
    5: "Sangat kuat",
  };

  return {
    ok: score >= 3,
    score,
    label: labels[score],
    error: score < 3 ? labels[score] : undefined,
  };
}

/* =========================
   GET STRENGTH
========================= */
export function getPasswordStrength(password: string | null): {
  score: number;
  label: string;
} {
  if (!password) return { score: 0, label: "" };

  const result = validatePassword(password);
  return { score: result.score, label: result.label || "" };
}

// core/auth/helpers/redirectByRole.ts

import type { UserRole } from "@/core/auth/types/user.types";

export function redirectByRole(role: UserRole | null, storeSlug?: string | null): string {
  if (!role) return "/login";

  switch (role) {
    case "seller":
      return storeSlug ? `/toko/${storeSlug}` : "/";

    case "admin":
    case "superadmin":
      return "/dashboard";

    case "user":
    default:
      return "/";
  }
}
