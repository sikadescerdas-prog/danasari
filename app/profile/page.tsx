"use client";

import { useRouter } from "next/navigation";

import { useSessionStore } from "@/core/auth/store/session.store";
import { useProfile } from "@/core/profile/hooks/useProfile";
import { useStore } from "@/modules/marketplace/hooks/useStore";

import { sweet } from "@/shared/utils/sweet";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { HeaderProfile } from "@/components/profile/HeaderProfile";
import { MenuProfile } from "@/components/profile/MenuProfile";
import type { MenuItem } from "@/components/profile/MenuProfile";

import {
  User,
  Store,
  Settings,
  LogOut,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const session = useSessionStore((state) => state.session);
  const { clearSession, setSession } = useSessionStore();

  const uid = session.uid ?? "";
  const email = session.email ?? "";
  const role = session.role;

  const { profile, loading: profileLoading } = useProfile(uid);
  const { loading: openingStore, openStore } = useStore(uid);

  const isLoading = session.loading || profileLoading || openingStore;

  const isSeller = role === "seller";
  const isAdmin = role === "admin";

  const fullname = profile?.fullname ?? "";
  const username = email.split("@")[0] ?? "";
  const avatarUrl = profile?.avatar?.url ?? null;

  const handleBukaToko = async () => {
    if (!uid) return;

    const confirm = await sweet.confirm({
      title: "Buka Toko?",
      text: "Yakin ingin membuka toko?",
      confirmButtonText: "Ya",
      cancelText: "Tidak",
    });

    if (!confirm) return;

    const nameStore = await sweet.input({
      title: "Nama Toko",
      inputLabel: "Masukkan nama toko Anda",
      inputPlaceholder: "Contoh: Toko Saya",
      inputValidator: (value) => {
        if (!value?.trim()) return "Nama toko wajib diisi!";
        if (value.trim().length < 3)
          return "Nama toko minimal 3 karakter!";
        return null;
      },
    });

    if (!nameStore?.trim()) return;

    const result = await openStore(uid, nameStore.trim());

    if (result.success) {
      setSession({ uid, email, role: "seller" });

      sweet.success({
        title: "Berhasil!",
        text: "Toko berhasil dibuat!",
      });

      router.push("/store/settings");
      return;
    }

    if (result.redirect) {
      sweet.error({
        title: "Profil Belum Lengkap",
        text: result.message,
      });

      router.push("/profile/settings");
      return;
    }

    sweet.error({
      title: "Gagal",
      text: result.message,
    });
  };

  const handleLogout = async () => {
    const confirm = await sweet.confirm({
      title: "Logout?",
      text: "Yakin ingin keluar?",
      confirmButtonText: "Ya",
      cancelText: "Tidak",
    });

    if (!confirm) return;

    try {
      await signOut(auth);
      clearSession();
      router.replace("/login");
    } catch {
      sweet.error({
        title: "Error",
        text: "Gagal logout",
      });
    }
  };

  const menuItems: MenuItem[] = [];

  if (isAdmin) {
    menuItems.push({
      label: "Dashboard",
      icon: <LayoutDashboard size={18} className="text-blue-600" />,
      onClick: () => router.push("/dashboard"),
    });
  }

  menuItems.push(
    {
      label: "Ubah Profile",
      icon: <User size={18} className="text-gray-600" />,
      onClick: () => router.push("/profile/settings"),
    },
    {
      label: isSeller ? "Kelola Toko" : "Buka Toko",
      icon: (
        <Store
          size={18}
          className={isSeller ? "text-emerald-600" : "text-green-600"}
        />
      ),
      onClick: isSeller
        ? () => router.push("/store/settings")
        : handleBukaToko,
    },
    {
      label: "Settings",
      icon: <Settings size={18} className="text-gray-600" />,
      onClick: () => router.push("/profile/security"),
    }
  );

  if (!uid || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-2">
        <Loader2 className="animate-spin" size={32} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <HeaderProfile
          fullname={fullname}
          username={username}
          avatarUrl={avatarUrl}
          email={email}
        />

        <div className="my-6 border-t border-gray-100" />

        <MenuProfile items={menuItems} />

        <div className="my-6 border-t border-gray-100" />

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}