// components/Sidebar.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight, ChevronDown, Home, Building, Store, FileText, Newspaper, Sparkles, Settings, LogOut, User, LogIn } from "lucide-react";
import { ref, onValue, Unsubscribe } from "firebase/database";
import { useSessionStore } from "@/core/auth/store/session.store";
import { useLogout } from "@/core/auth/hooks/useLogout";
import { db } from "@/lib/firebase";

interface NavListItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  subItems?: { href: string; label: string }[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  username: string;
  fullname: string;
  email: string;
  avatar: { url: string; publicId: string } | null;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { handleLogout } = useLogout();
  const session = useSessionStore((state) => state.session);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!session.uid) {
      setUserData(null);
      return;
    }

    const userRef = ref(db, `users/${session.uid}`);
    const unsub = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        setUserData(null);
      }
    });

    unsubRef.current = unsub;
    return () => {
      if (unsub) unsub();
    };
  }, [session.uid]);
  
  const isLoggedIn = !!session.uid;
  
  const username = userData?.username || "";
  const email = userData?.email || session?.email || "";
  const name = userData?.fullname || "";
  const avatar = userData?.avatar?.url || null;

  const navList: NavListItem[] = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { 
      href: "/desa", 
      label: "Profile Desa", 
      icon: <Building className="w-5 h-5" />,
      subItems: [
        { href: "/desa", label: "Profile" },
        { href: "/visi-misi", label: "Visi & Misi" },
        { href: "/struktur", label: "Struktur Organisasi" },
        { href: "/populasi", label: "Infografis" },
        { href: "/potensi", label: "Potensi Desa" },
      ]
    },
    { href: "/store", label: "UMKM", icon: <Store className="w-5 h-5" /> },
    { href: "/literasi", label: "Literasi", icon: <FileText className="w-5 h-5" /> },
    { href: "/berita", label: "Berita", icon: <Newspaper className="w-5 h-5" /> },
    { href: "/layanan", label: "Layanan", icon: <Sparkles className="w-5 h-5" /> },
    { href: "/tentang", label: "Tentang", icon: <Sparkles className="w-5 h-5" /> },
  ];

  const userMenuItems: NavListItem[] = isLoggedIn 
    ? [
        { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
        { href: "/settings", label: "Pengaturan", icon: <Settings className="w-5 h-5" /> },
      ]
    : [];

  const handleLinkClick = (href: string) => {
    router.push(href);
    onClose();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      <div className="fixed top-0 left-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl z-50 md:hidden overflow-y-auto animate-in slide-in-from-right duration-300 border-r border-slate-200 pb-16">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-xl">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo-desa.png"
                alt="Logo Desa"
                width={40}
                height={40}
                sizes="40px"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">
                <span className="text-slate-800">Desa </span>
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Danasari</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wide">SIKADES Cerdas</span>
            </div>
          </Link>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-2">
          {navList.map((item) => (
            <div key={item.href}>
              <button
                onClick={() => {
                  if (item.subItems) {
                    setExpandedItem(expandedItem === item.href ? null : item.href);
                  } else {
                    handleLinkClick(item.href);
                  }
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm ${
                  isActive(item.href) 
                    ? "text-green-600 bg-green-50" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                {item.subItems ? (
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedItem === item.href ? "rotate-180" : ""}`} />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-40" />
                )}
              </button>
              
              {item.subItems && expandedItem === item.href && (
                <div className="bg-slate-50">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.href}
                      onClick={() => handleLinkClick(sub.href)}
                      className={`flex items-center w-full px-8 py-2.5 text-sm ${
                        pathname === sub.href 
                          ? "text-green-600 font-medium" 
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-px bg-slate-200 mx-4" />

        <div className="py-1">
          {userMenuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleLinkClick(item.href)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
          ))}
        </div>

        <div className="h-px bg-slate-200 mx-4" />

        <div className="py-1">
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => handleLinkClick("/login")}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-green-600 hover:bg-green-50"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}