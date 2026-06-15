// core/auth/validators/auth.validator.ts

import { z } from "zod";

import { validateUsername } from "@/core/auth/helpers/username";
import { validateEmail } from "@/core/auth/helpers/email";
import { validatePassword } from "@/core/auth/helpers/password";

/* =========================
   LOGIN SCHEMA
========================= */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email atau username wajib diisi")
    .min(3, "Minimal 3 karakter"),
  password: z.string().min(1, "Password wajib diisi").min(6, "Minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/* =========================
   REGISTER SCHEMA
========================= */
export const registerSchema = z
  .object({
    username: z.string().superRefine((val, ctx) => {
      const res = validateUsername(val);
      if (!res.ok) {
        ctx.addIssue({
          code: "custom",
          message: res.error || "Username tidak valid",
        });
      }
    }),

    fullname: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),

    email: z.string().superRefine((val, ctx) => {
      const res = validateEmail(val);
      if (!res.ok) {
        ctx.addIssue({
          code: "custom",
          message: res.error || "Email tidak valid",
        });
      }
    }),

    password: z.string().superRefine((val, ctx) => {
      const res = validatePassword(val);
      if (!res.ok) {
        ctx.addIssue({
          code: "custom",
          message: res.error || "Password tidak valid",
        });
      }
    }),

    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),

    agree: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })
  .refine((data) => data.agree === true, {
    message: "Harus menyetujui syarat & ketentuan",
    path: ["agree"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
