"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useSessionStore } from "@/core/auth/store/session.store";
import { clsx } from "clsx";

import {
  LayoutDashboard,
  Home,
  Building2,
  Users,
  Map,
  Trees,
  Store,
  Newspaper,
  Settings,
  Puzzle,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  ChevronDown,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isSlim: boolean;
  onToggle: () => void;
  variant?: "desktop" | "mobile";
}

interface UserData {
  username?: string;
  fullname?: string;
  email?: string;
  avatar?: { url?: string };
}

export function Sidebar({
  isSlim,
  onToggle,
  variant = "desktop",
}: SidebarProps) {
  const pathname = usePathname();
  const session = useSessionStore((s) => s.session);

  const uid = session?.uid || "";
  const role = session?.role || "";
  const isAdmin = role === "admin" || role === "superadmin";

  // =========================
  // DEVICE MODE
  // =========================
  const isMobile = variant === "mobile";
  const slim = isMobile ? false : isSlim;

  // =========================
  // REALTIME USER
  // =========================
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const userRef = ref(db, `users/${uid}`);

    const unsub = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  const username = userData?.username || "";
  const fullname = userData?.fullname || "";
  const email = userData?.email || "";
  const avatar = userData?.avatar?.url || null;

  const displayName = fullname || username || "Admin";

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const isGroupActive = (items: any[]) =>
    items?.some((i) => pathname === i.href);

  // =========================
  // MENU
  // =========================
  const menuItems = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },

    {
      title: "Profile Desa",
      icon: Building2,
      submenu: [
        { title: "Struktur Desa", href: "/dashboard/structure", icon: Users },
        { title: "Data Desa", href: "/dashboard/population", icon: Map },
        { title: "Fasilitas Desa", href: "/dashboard/facility", icon: Building2 },
        { title: "Potensi Desa", href: "/dashboard/potential", icon: Trees },
      ],
    },

    {
      title: "UMKM Desa",
      icon: Store,
      href: "/dashboard/umkm",
    },

    {
      title: "Berita",
      icon: Newspaper,
      href: "/dashboard/news",
    },

    ...(isAdmin
      ? [
          {
            title: "Settings",
            icon: Settings,
            submenu: [
              { title: "Users", href: "/dashboard/users", icon: Users },
              { title: "Module", href: "/dashboard/module", icon: Puzzle },
            ],
          },
        ]
      : []),

    {
      title: "Pengaduan",
      icon: MessageSquare,
      href: "/dashboard/complaints",
    },
  ];

  return (
    <aside
      className={clsx(
        "h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative",
        slim ? "w-20" : "w-60"
      )}
    >
      {/* CLOSE BUTTON (MOBILE) */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="absolute right-3 top-3 z-50 p-2 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* TOGGLE (ONLY DESKTOP EFFECTIVE) */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className={clsx(
            "absolute z-40 flex items-center justify-center bg-white border rounded-lg shadow-sm",
            slim ? "w-8 h-8 -right-3 top-4" : "w-8 h-8 -right-4 top-4"
          )}
        >
          {slim ? (
            <PanelLeft className="w-3 h-3" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      )}

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo-desa.png"
                alt="Logo Desa"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>

            {!slim && (
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">
                  <span className="text-slate-800">Desa </span>
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Danasari
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wide">
                  SIKADES Cerdas
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* USER */}
      {!slim && (
        <div className="p-4 border-b flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-green-700 font-bold">
                {displayName.charAt(0)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm font-semibold text-gray-900">
            {displayName}
          </p>

          <p className="text-xs text-gray-500">@{username}</p>
          <p className="text-[11px] text-gray-400">{email}</p>
        </div>
      )}

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            {!item.submenu ? (
              <Link
                href={item.href!}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                  pathname === item.href
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50",
                  slim && "justify-center"
                )}
              >
                <item.icon className="w-5 h-5" />
                {!slim && <span>{item.title}</span>}
              </Link>
            ) : (
              <div>
                {!slim ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={clsx(
                        "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium",
                        isGroupActive(item.submenu)
                          ? "text-green-700"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </div>

                      <ChevronDown
                        className={clsx(
                          "w-4 h-4 transition-transform",
                          openDropdown === index && "rotate-180"
                        )}
                      />
                    </button>

                    {openDropdown === index && (
                      <div className="ml-9 mt-1 space-y-1">
                        {item.submenu.map((sub, i) => (
                          <Link
                            key={i}
                            href={sub.href}
                            className={clsx(
                              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                              pathname === sub.href
                                ? "text-green-700 bg-green-50"
                                : "text-gray-500 hover:bg-gray-50"
                            )}
                          >
                            <sub.icon className="w-4 h-4" />
                            <span>{sub.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    {item.submenu.map((sub, i) => (
                      <Link
                        key={i}
                        href={sub.href}
                        title={sub.title}
                        className={clsx(
                          "flex justify-center items-center py-2.5 rounded-xl transition",
                          pathname === sub.href
                            ? "bg-green-50 text-green-700"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <sub.icon className="w-5 h-5" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="p-3 border-t">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full">
          <LogOut className="w-5 h-5" />
          {!slim && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}