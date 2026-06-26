// components/navbar/UserMenu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ref, onValue } from "firebase/database";
import { Unsubscribe } from "firebase/database";

import { useSessionStore } from "@/core/auth/store/session.store";
import { useProfile } from "@/core/profile/hooks/useProfile";
import { useLogout } from "@/core/auth/hooks/useLogout";
import { getInitials } from "@/core/profile/utils/getInitials";
import { db } from "@/lib/firebase";

interface UserData {
  username: string;
  fullname: string;
  email: string;
  avatar: { url: string; publicId: string } | null;
}

export default function UserMenu() {
  const { handleLogout, isLoading: isLoggingOut } = useLogout();
  const session = useSessionStore((state) => state.session);
  const uid = session?.uid || "";

  // Avatar dari useProfile
  const { profile, loading: isLoadingProfile } = useProfile(uid);

  // Username dari Firebase users/{uid}
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!uid) {
      setUserData(null);
      setIsLoadingUser(false);
      return;
    }

    setIsLoadingUser(true);
    const userRef = ref(db, `users/${uid}`);

    const unsub = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        setUserData(null);
      }
      setIsLoadingUser(false);
    });

    unsubRef.current = unsub;

    return () => {
      unsub();
    };
  }, [uid]);

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = session?.role || "";
  const isSeller = role === "seller";
  const isAdmin = role === "admin" || role === "superadmin";

  // Data
  const username = userData?.username || "";
  const fullname = userData?.fullname || profile?.fullname || "";
  const avatar = userData?.avatar?.url || profile?.avatar?.url || null;
  const email = userData?.email || session?.email || "";
  const storeSlug = username;

  // Get initials
  const initial = getInitials(fullname || username || email);

  // Display name
  const displayName = fullname || username || "User";

  const isLoading = isLoadingProfile || isLoadingUser;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-1.5 py-1.5 rounded-full hover:bg-slate-100 transition-all duration-300 disabled:opacity-50"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7AF3AE] to-[#25C95F] flex items-center justify-center shadow-md shadow-green-500/20 overflow-hidden">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : avatar ? (
            <Image
              src={avatar}
              alt={displayName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-xs font-medium">
              {initial}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-black/[0.08] border border-slate-100/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7AF3AE] to-[#25C95F] flex items-center justify-center shadow-md shadow-green-500/20 overflow-hidden shrink-0">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {initial}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
              {username && <p className="text-xs text-[#25C95F] truncate">@{username}</p>}
              {email && <p className="text-xs text-slate-400 truncate">{email}</p>}
            </div>
          </div>
          
          <div className="border-t border-slate-100" />
          
          {/* Menu Items */}
          <div className="py-1.5">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#25C95F] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>

            {isSeller && (
              <Link
                href={storeSlug ? `/store/${storeSlug}` : "/store"}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#25C95F] transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4M4 10l1 10h14l1-10" />
                </svg>
                Toko Saya
              </Link>
            )}

          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#25C95F] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"
                />
              </svg>
              Dashboard
            </Link>
          )}
          {/* Settings
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#25C95F] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
            */}

          </div>
          
          {/* Logout */}
          <div className="border-t border-slate-100 py-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              disabled={isLoggingOut || isLoading}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isLoggingOut ? "Loading..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}