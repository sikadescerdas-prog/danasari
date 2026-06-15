// components/auth/hooks/useLogin.ts

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { authService } from "@/core/auth/services/auth.service";
import { sweet } from "@/shared/utils/sweet";
import type { FieldErrors } from "@/core/auth/types/user.types";

export type LoginState = {
  identifier: string;
  password: string;
};

const initialState: LoginState = {
  identifier: "",
  password: "",
};

function clearError(prev: FieldErrors, key: keyof FieldErrors): FieldErrors {
  return { ...prev, [key]: "" as any };
}

// Helper function untuk get uid dari Firebase Auth
const getCurrentUid = (): Promise<string> => {
  return new Promise((resolve) => {
    const auth = getAuth();
    
    if (auth.currentUser) {
      resolve(auth.currentUser.uid);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        resolve("");
      }
    });
  });
};

// Helper function untuk redirect sesuai role
const handleRedirect = async (uid: string, router: any) => {
  if (!uid) {
    router.push("/");
    return;
  }

  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const role = data.role || "user";
      
      if (role === "admin" || role === "superadmin") {
        router.push("/dashboard");
      } else if (role === "seller") {
        router.push("/kelola-toko");
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  } catch (error) {
    router.push("/");
  }
};

export function useLogin() {
  const router = useRouter();
  const [form, setForm] = useState<LoginState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name && errors[name as keyof FieldErrors]) {
      setErrors((prev) => clearError(prev, name as keyof FieldErrors));
    }
  };

  const validateFieldIdentifier = (identifier: string) => {
    if (!identifier.trim()) {
      setErrors((prev) => ({ ...prev, identifier: "Email atau Username wajib diisi" }));
    } else {
      setErrors((prev) => clearError(prev, "identifier"));
    }
  };

  const validateFieldPassword = (password: string) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password wajib diisi" }));
    } else {
      setErrors((prev) => clearError(prev, "password"));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.identifier.trim()) {
      setErrors((prev) => ({ ...prev, identifier: "Email atau Username wajib diisi" }));
      return;
    }
    
    if (!form.password) {
      setErrors((prev) => ({ ...prev, password: "Password wajib diisi" }));
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.loginWithIdentifier(form.identifier, form.password);
      const uid = await getCurrentUid();

      sweet.success({
        title: "Berhasil!",
        text: "Login berhasil",
        timer: 1500,
      });

      setForm(initialState);
      setErrors({});
      
      await handleRedirect(uid, router);

    } catch (error: any) {
      setErrors({});

      if (error.code === "AUTH_ERROR") {
        const message = error.message.toLowerCase();
        
        if (
          message.includes("tidak ditemukan") || 
          message.includes("tidak ada") ||
          message.includes("tidak valid")
        ) {
          sweet.error({
            title: "Gagal Login",
            text: error.message,
          });
        } else if (
          message.includes("password") || 
          message.includes("salah") ||
          message.includes("credential") ||
          message.includes("invalid")
        ) {
          sweet.error({
            title: "Gagal Login",
            text: "Username/Email atau Password salah",
          });
        } else {
          sweet.error({
            title: "Gagal Login",
            text: error.message,
          });
        }
      } else if (error.code === "VALIDATION_ERROR") {
        sweet.warning({
          title: "Peringatan",
          text: error.message,
        });
      } else {
        sweet.error({
          title: "Gagal",
          text: error.message || "Terjadi kesalahan",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      await authService.loginWithGoogle();
      const uid = await getCurrentUid();

      sweet.success({
        title: "Berhasil!",
        text: "Login dengan Google berhasil",
      });

      await handleRedirect(uid, router);

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
    isSubmitting,
    isGoogleLoading,
    handleChange,
    validateFieldIdentifier,
    validateFieldPassword,
    handleSubmit,
    handleGoogleLogin,
  };
}