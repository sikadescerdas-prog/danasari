"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useSessionStore } from "@/core/auth/store/session.store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSessionStore((state) => state.session);

  const [isSlim, setIsSlim] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdmin =
    session?.role === "admin" || session?.role === "superadmin";

  const isHydrated = session?.hydrated;

  // INIT
  useEffect(() => {
    setIsMounted(true);

    const saved = localStorage.getItem("sidebar-slim");
    if (saved === "true") setIsSlim(true);
  }, []);

  // AUTO SLIM (desktop behavior only)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSlim(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // PROTECT ROUTE
  useEffect(() => {
    if (isHydrated && !isAdmin) {
      router.push("/");
    }
  }, [isHydrated, isAdmin, router]);

  const handleToggle = () => {
    const newSlim = !isSlim;
    setIsSlim(newSlim);
    localStorage.setItem("sidebar-slim", String(newSlim));
  };

  // LOADING
  if (!isMounted || !isHydrated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white border-r" />
        <div className="flex-1 bg-gray-50" />
      </div>
    );
  }

  // ACCESS DENIED
  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">
          Access Denied
        </h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* =========================
          DESKTOP SIDEBAR
      ========================= */}
      <div className="hidden lg:block">
        <Sidebar
          isSlim={isSlim}
          onToggle={handleToggle}
          variant="desktop"
        />
      </div>

      {/* =========================
          MOBILE SIDEBAR (FULL DRAWER FIXED)
      ========================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* SIDEBAR */}
          <div className="w-62 h-full bg-white shadow-xl">
            <Sidebar
              isSlim={false}
              variant="mobile"
              onToggle={() => setIsMobileOpen(false)}
            />
          </div>

          {/* BACKDROP AREA */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        </div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          isSlim={isSlim}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}