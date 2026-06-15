// components/NavBottom.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Building, Store, FileText, LogIn } from "lucide-react";
import { Unsubscribe, ref, onValue } from "firebase/database";
import { useSessionStore } from "@/core/auth/store/session.store";
import { getInitials } from "@/core/profile/utils/getInitials";
import { db } from "@/lib/firebase";

interface UserData {
  username: string;
  fullname: string;
  email: string;
  avatar: { url: string; publicId: string } | null;
}

export default function NavBottom() {
  const pathname = usePathname();
  const session = useSessionStore((state) => state.session);
  const isLoggedIn = !!session.uid;
  const uid = session?.uid || "";
  
  // Ambil data user dari Firebase
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
      if (unsub) unsub();
    };
  }, [uid]);

  // Get initials
  const fullname = userData?.fullname || "";
  const username = userData?.username || "";
  const email = userData?.email || session?.email || "";
  const avatar = userData?.avatar?.url || null;
  
  const initial = getInitials(fullname || username || email);
  const displayName = fullname || username || "User";

  // Hide di pages tertentu
  const hidePaths = ["/login", "/register", "/dashboard", "/profile", "/settings"];
  if (hidePaths.some(p => pathname === p || pathname.startsWith(p))) {
    return null;
  }

  // Items: Home | Desa | Produk | Literasi | Avatar (tanpa label)
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "/" },
    { icon: <Building className="w-5 h-5" />, label: "Desa", href: "/desa" },
    { icon: <Store className="w-5 h-5" />, label: "UMKM", href: "/store" },
    { icon: <FileText className="w-5 h-5" />, label: "Literasi", href: "/literasi" },
    isLoggedIn 
      ? { 
          // Avatar dengan desain sama seperti UserMenu
          icon: avatar ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7AF3AE] to-[#25C95F] flex items-center justify-center shadow-md shadow-green-500/20 overflow-hidden">
              <Image 
                src={avatar} 
                alt={displayName} 
                width={28} 
                height={28} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7AF3AE] to-[#25C95F] flex items-center justify-center shadow-md shadow-green-500/20 overflow-hidden">
              <span className="text-white text-[14px] font-medium">
                {initial}
              </span>
            </div>
          ), 
          label: undefined,
          href: "/profile" 
        }
      : { icon: <LogIn className="w-5 h-5" />, label: "Login", href: "/login" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item, index) => {
          const active = isActive(item.href || "");
          const hasLabel = item.label !== undefined;
          
          return (
            <Link
              key={index}
              href={item.href || "/"}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-[56px] ${
                active ? "text-green-600" : "text-slate-500"
              }`}
            >
              {item.icon}
              {hasLabel && (
                <span className={`text-[10px] font-medium truncate max-w-[60px] ${active ? "text-green-600" : "text-slate-500"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}