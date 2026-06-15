// core/auth/types/user.types.ts

export type UserRole = "user" | "seller" | "admin" | "superadmin";

export type User = {
  uid: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
};

/* =========================
   AUTH USER (untuk service)
========================= */
export type AuthUser = {
  uid: string;
  email: string;
  username: string;
  fullName: string;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
};

/* =========================
   LOGIN STATE
========================= */
export type LoginState = {
  identifier: string;
  password: string;
};

/* =========================
   REGISTER STATE
========================= */
export type RegisterState = {
  username: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/* =========================
   FIELD ERRORS
========================= */
export type FieldErrors = Record<string, string>;
