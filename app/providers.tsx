"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ✅ Auto refresh saat back/forward/visible
  useEffect(() => {
    const refresh = () => router.refresh();

    // Initial
    refresh();

    // Back/Forward button
    window.addEventListener("popstate", refresh);

    // Tab become visible
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    });

    return () => {
      window.removeEventListener("popstate", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  useEffect(() => {
    setLoading(true);

    const t = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AuthProvider>
      {loading ? (
        <Splash />
      ) : (
        <>
          <Navbar />
          {children}
        </>
      )}
    </AuthProvider>
  );
}

function Splash() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 overflow-hidden">

      {/* Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-[#7AF3AE]/30 to-[#25C95F]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-300/20 to-green-300/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#25C95F]/30 animate-ping" />

          <div className="relative w-32 h-32 rounded-full bg-white shadow-2xl shadow-green-500/20 flex items-center justify-center overflow-hidden">
            <img
              src="/logo-desa.png"
              alt="Logo"
              className="w-[100px] h-[100px] object-contain"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <h2 className="text-xl font-bold text-green-500">
            Desa Danasari
          </h2>

          <p className="text-sm text-gray-400 mt-1 tracking-wide">
            Kec. Karangjambu
          </p>
        </div>
      </div>
    </div>
  );
}