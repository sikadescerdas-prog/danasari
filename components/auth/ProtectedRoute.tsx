// components/auth/ProtectedRoute.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Langsung cek Firebase Auth (paling reliable)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
      setIsReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Redirect setelah ready dan tidak auth
  useEffect(() => {
    if (isReady && !isAuth) {
      router.push("/login");
    }
  }, [isReady, isAuth, router]);

  if (!isReady || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}