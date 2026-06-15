"use client";

import React from "react";
import Image from "next/image";
import { Bell, Search, Menu } from "lucide-react";
import UserMenu from "@/components/navbar/UserMenu";

interface HeaderProps {
  isSlim: boolean;
  onOpenMobileSidebar: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* BURGER (MOBILE ONLY) */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* LOGO + SIKADES (MOBILE ONLY) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Image
            src="/logo-desa.png"
            alt="SIKADES"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-bold text-lg">
            <span className="text-slate-800">Desa </span>
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Danasari
            </span>
          </span>
        </div>

        {/* BREADCRUMB (DESKTOP ONLY) */}
        <div className="hidden lg:block text-sm text-gray-500">
          <span className="text-gray-400">Admin</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Dashboard</span>
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 lg:gap-4">

        {/* SEARCH DESKTOP */}
        <div className="hidden lg:block relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari menu..."
            className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* SEARCH MOBILE */}
        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Search className="w-5 h-5" />
        </button>

        {/* NOTIF */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        {/* PROFILE */}
        <UserMenu />

      </div>
    </header>
  );
}