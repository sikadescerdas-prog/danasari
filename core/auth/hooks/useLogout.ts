// components/auth/hooks/useLogout.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/core/auth/services/auth.service";
import { sweet } from "@/shared/utils/sweet";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();

      sweet.success({
        title: "Berhasil",
        text: "Logout berhasil",
        timer: 1500,
      });

      router.push("/login");
      
    } catch (error: any) {
      sweet.error({
        title: "Gagal",
        text: error.message || "Logout gagal",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
}