"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, PlusCircle } from "lucide-react";
import Logo from "./navbar/Logo";
import NavLink from "./navbar/NavLink";
import SearchBar from "./navbar/SearchBar";
import UserMenu from "./navbar/UserMenu";
import NavList from "./navbar/NavList";
import { useSessionStore } from "@/core/auth/store/session.store";


export default function Navbar() {
  const pathname = usePathname();
  const session = useSessionStore((state) => state.session);
  const [navListOpen, setNavListOpen] = useState(false);

  // ✅ PENTING: useEffect dipanggil TERLEBIH DAHULU sebelum semua conditional
  useEffect(() => {
    setNavListOpen(false);
  }, [pathname]);

  // Hide navbar di login, register, dan SEMUA dashboard pages
  const hideNavbarPaths = [
    "/login", 
    "/register", 
  ];
  
  const shouldHideNavbar = hideNavbarPaths.some(path => pathname === path) ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/village");
  
  if (shouldHideNavbar) {
    return null;
  }
  
  // Tunggu hydrated
  if (!session.hydrated) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm" />
        <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Logo />
          </div>
        </nav>
      </header>
    );
  }
  
  const isLoggedIn = !!session.uid;
  const role = session?.role || "";
  const isSeller = role === "seller";
  const isAdmin = role === "admin" || role === "superadmin";
  
  const isSearchPage = ["/store", "/literasi"].some(p => pathname.startsWith(p));
  const isLiterasiPage = pathname.startsWith("/literasi");
  const isStorePage = pathname.startsWith("/store");
  const isBeritaPage = pathname.startsWith("/berita");

  // navLinks dengan dropdown lengkap
  const navLinks = [
    { href: "/", label: "Beranda" },
    { 
      href: "/desa", 
      label: "Profile Desa", 
      hasDropdown: true,
      dropdownItems: [
        { href: "/desa", label: "Profile" },
        { href: "/visi-misi", label: "Visi & Misi" },
        { href: "/struktur", label: "Struktur Organisasi" },
        { href: "/populasi", label: "Infografis" },
        { href: "/potensi", label: "Potensi Desa" },
      ]
    },
    { 
      href: "/store", 
      label: "UMKM", 
    },
    { 
      href: "/literasi", 
      label: "Literasi", 
    },
    { 
      href: "/berita", 
      label: "Berita",
    },
    { 
      href: "/layanan", 
      label: "Layanan", 
    },
    { href: "/tentang", 
      label: "Tentang" 
    },
  ];

  const additionalLinks = [];
  
  if (isLoggedIn) {
    if (isAdmin) {
      additionalLinks.push({ href: "/dashboard", label: "Dashboard" });
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm" />
        
        <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* LEFT - Logo + Burger */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setNavListOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>

          {/* CENTER - NavLinks */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.href} 
                  href={link.href} 
                  label={link.label}
                  hasDropdown={link.hasDropdown}
                  dropdownItems={link.dropdownItems}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {additionalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden lg:flex px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#25C95F] hover:bg-slate-100 rounded-full transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}

            {/* Contextual Buttons (Tambah) */}
            {isLoggedIn && (
              <>
                {isLiterasiPage && (
                  <Link
                    href="/literasi/form"
                    className="text-sm font-medium flex md:flex items-center gap-2 group p-2.5 rounded-full hover:bg-slate-100 transition-all duration-300 shadow-sm"
                  >
                    <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-[#25C95F] transition-all duration-300" />
                    <span className="hidden lg:inline text-slate-400 group-hover:text-[#25C95F] transition-all duration-300">Tulis Artikel</span>
                  </Link>
                )}

                {isStorePage && isSeller && (
                  <Link
                    href="/store/form"
                    className="text-sm font-medium flex md:flex items-center gap-2 group p-2.5 rounded-full hover:bg-slate-100 transition-all duration-300 shadow-sm"
                  >
                    <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-[#25C95F] transition-all duration-300" />
                    <span className="hidden lg:inline text-slate-400 group-hover:text-[#25C95F] transition-all duration-300">Tambah Produk</span>
                  </Link>
                )}

                {isBeritaPage && isAdmin && (
                  <Link
                    href="/berita/form"
                    className="text-sm font-medium flex md:flex items-center gap-2 group p-2.5 rounded-full hover:bg-slate-100 transition-all duration-300 shadow-sm"
                  >
                    <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-[#25C95F] transition-all duration-300" />
                    <span className="hidden lg:inline text-slate-400 group-hover:text-[#25C95F] transition-all duration-300">Tulis Berita</span>
                  </Link>
                )}

              </>
            )}
            
            {isSearchPage && <SearchBar />}
            
            {isLoggedIn ? (
              <div className="hidden md:flex">
                <UserMenu />
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-green-500/20"
              >
                Login
              </Link>
            )}
          </div>

        </nav>
      </header>

      {/* Nav List Drawer */}
      <NavList 
        isOpen={navListOpen} 
        onClose={() => setNavListOpen(false)} 
      />
    </>
  );
}