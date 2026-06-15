// core/auth/hooks/useRegister.ts

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/core/auth/services/auth.service";
import { sweet } from "@/shared/utils/sweet";
import { validateUsername, isUsernameExists } from "@/core/auth/helpers/username";
import { validateEmail } from "@/core/auth/helpers/email";
import { getPasswordStrength } from "@/core/auth/helpers/password";
import type { FieldErrors } from "@/core/auth/types/user.types";

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  username: "",
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

/* =========================
   CLEAR ERROR HELPER
   ========================= */
function clearError(prev: FieldErrors, key: keyof FieldErrors): FieldErrors {
  return { ...prev, [key]: "" as any };
}

export function useRegister() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [strength, setStrength] = useState({ score: 0, label: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  /* =========================
     CHANGE HANDLER
  ========================= */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setForm((prev) => ({ ...prev, [name]: val }));

    if (name === "password") {
      setStrength(getPasswordStrength(val as string));
    }

    if (name && errors[name as keyof FieldErrors]) {
      setErrors((prev) => clearError(prev, name as keyof FieldErrors));
    }
  };

  /* =========================
     VALIDATE FULLNAME
  ========================= */
  const validateFieldFullname = (fullname: string) => {
    if (!fullname.trim()) {
      setErrors((prev) => ({ ...prev, fullname: "Nama lengkap wajib diisi" }));
    } else if (fullname.trim().length < 3) {
      setErrors((prev) => ({ ...prev, fullname: "Nama minimal 3 karakter" }));
    } else if (fullname.trim().length > 100) {
      setErrors((prev) => ({ ...prev, fullname: "Nama maksimal 100 karakter" }));
    } else {
      setErrors((prev) => clearError(prev, "fullname"));
    }
  };

  /* =========================
     VALIDATE EMAIL
  ========================= */
  const validateFieldEmail = (email: string) => {
    const res = validateEmail(email);
    if (!res.ok) {
      setErrors((prev) => ({ ...prev, email: res.error! }));
    } else {
      setErrors((prev) => clearError(prev, "email"));
    }
  };

  /* =========================
     VALIDATE USERNAME
  ========================= */
  const validateFieldUsername = async (username: string) => {
    const res = validateUsername(username);
    if (!res.ok) {
      setErrors((prev) => ({ ...prev, username: res.error! }));
      return;
    }

    setIsCheckingUsername(true);
    try {
      const exists = await isUsernameExists(username);
      setIsCheckingUsername(false);

      if (exists) {
        setErrors((prev) => ({ ...prev, username: "Username sudah dipakai" }));
      } else {
        setErrors((prev) => clearError(prev, "username"));
      }
    } catch {
      setIsCheckingUsername(false);
    }
  };

  /* =========================
     VALIDATE PASSWORD
  ========================= */
  const validateFieldPassword = (password: string) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password wajib diisi" }));
    } else if (password.length < 8) {
      setErrors((prev) => ({ ...prev, password: "Password minimal 8 karakter" }));
    } else {
      setErrors((prev) => clearError(prev, "password"));
    }
  };

  /* =========================
     VALIDATE CONFIRM PASSWORD
  ========================= */
  const validateFieldConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Konfirmasi password wajib diisi" }));
    } else if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Password tidak sama" }));
    } else {
      setErrors((prev) => clearError(prev, "confirmPassword"));
    }
  };

  /* =========================
     SUBMIT EMAIL -> REDIRECT KE LOGIN
  ========================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.agree) {
      setErrors((prev) => ({ ...prev, agree: "Anda harus menyetujui Terms & Conditions" }));
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.registerWithEmail({
        username: form.username,
        fullname: form.fullname,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      // SUCCESS + REDIRECT
      sweet.success({
        title: "Berhasil!",
        text: "Akun berhasil dibuat, redirect ke login...",
        timer: 2000,
      });

      setForm(initialState);
      setErrors({});
      
      // Redirect ke /login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error: any) {
      if (error.code === "VALIDATION_ERROR") {
        sweet.warning({ title: "Peringatan", text: error.message });
      } else {
        sweet.error({ title: "Gagal", text: error.message || "Terjadi kesalahan" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     SUBMIT GOOGLE -> REDIRECT KE HOME/DASHBOARD
  ========================= */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      await authService.loginWithGoogle();

      sweet.success({
        title: "Berhasil!",
        text: "Login dengan Google berhasil",
        timer: 2000,
      });

      // Redirect ke home/dashboard
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (error: any) {
      if (error.code === "VALIDATION_ERROR") {
        sweet.warning({ title: "Peringatan", text: error.message });
      } else {
        sweet.error({ title: "Gagal", text: error.message || "Login Google gagal" });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return {
    form,
    errors,
    strength,
    isSubmitting,
    isCheckingUsername,
    isGoogleLoading,
    handleChange,
    validateFieldFullname,
    validateFieldEmail,
    validateFieldUsername,
    validateFieldPassword,
    validateFieldConfirmPassword,
    handleSubmit,
    handleGoogleLogin,
  };
}