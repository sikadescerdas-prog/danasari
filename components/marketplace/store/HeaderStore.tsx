"use client";

import { useState } from "react";
import {
  FaWhatsapp,
  FaTiktok,
  FaStore,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { SiShopee, SiGooglemaps } from "react-icons/si";

import { IStore } from "@/modules/marketplace/types/store.types";

interface HeaderStoreProps {
  toko: IStore;
  isStoreOpen?: boolean;
  onToggleStore?: () => void;
  isOwner?: boolean;
}

export default function HeaderStore({ 
  toko, 
  isStoreOpen, 
  onToggleStore,
  isOwner = false,
}: HeaderStoreProps) {
  
  const isActive = isStoreOpen ?? toko.isActive ?? false;

  const waLink = toko.marketplace?.waBusiness
    ? `https://wa.me/${toko.marketplace.waBusiness}?text=Halo ${toko.nameStore}`
    : "#";

  const mapsLink =
    toko.addressStore?.latitude && toko.addressStore?.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${toko.addressStore.latitude},${toko.addressStore.longitude}`
      : toko.addressStore?.city
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          toko.addressStore.city
        )}`
      : "#";

  const shopeeLink = toko.marketplace?.shopee
    ? `https://shopee.co.id/${toko.marketplace.shopee}`
    : "#";

  const tiktokLink = toko.marketplace?.tiktokShop
    ? `https://shop.tiktok.com/store/${toko.marketplace.tiktokShop}`
    : "#";

  const handleToggleClick = () => {
    if (onToggleStore) {
      onToggleStore();
    }
  };

  return (
    <div className="pb-20 bg-white border-b">
      {/* Banner */}
      <div className="relative w-full" style={{ paddingBottom: "32%" }}>
        {toko.banner?.url ? (
          <img
            src={toko.banner.url}
            alt={toko.nameStore}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-400 to-slate-500" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* ✅ STATUS TOGGLE */}
        <div className="absolute top-3 right-3">
          {isOwner && onToggleStore && (
            <button
              type="button"
              onClick={handleToggleClick}
              className={`relative w-20 h-8 rounded-full transition-all duration-300 shadow-inner
                ${isActive ? "bg-green-500" : "bg-red-500"}`}
            >
              <span
                className={`absolute left-8 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-white transition-opacity
                  ${isActive ? "opacity-0" : "opacity-100"}`}
              >
                CLOSED
              </span>

              <span
                className={`absolute right-9 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-white transition-opacity
                  ${isActive ? "opacity-100" : "opacity-0"}`}
              >
                OPEN
              </span>

              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300
                  ${isActive ? "right-1" : "left-1"}`}
              />
            </button>
          )}
        </div>

        {/* CARD */}
        <div className="absolute left-4 right-4 -bottom-14 z-20">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* HEADER */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center bg-white/80">
                {toko.logo?.url ? (
                  <img
                    src={toko.logo.url}
                    alt={toko.nameStore}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaStore size={20} className="text-slate-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-lg text-white truncate drop-shadow-md">
                  {toko.nameStore}
                </h1>

                {toko.addressStore?.city && (
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 flex items-center gap-1 hover:text-white"
                  >
                    <SiGooglemaps size={12} />
                    {toko.addressStore.city}
                  </a>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            {toko.description && (
              <p className="text-sm text-white/90 leading-relaxed mt-3">
                {toko.description}
              </p>
            )}

            {/* MARKETPLACE */}
            <div className="flex flex-wrap gap-2 mt-4">
              {toko.marketplace?.waBusiness && (
                <a
                  href={waLink}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium"
                >
                  <FaWhatsapp size={14} />
                  WhatsApp
                  <FaExternalLinkAlt size={10} />
                </a>
              )}

              {toko.marketplace?.shopee && (
                <a
                  href={shopeeLink}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium"
                >
                  <SiShopee size={14} />
                  Shopee
                  <FaExternalLinkAlt size={10} />
                </a>
              )}

              {toko.marketplace?.tiktokShop && (
                <a
                  href={tiktokLink}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-sm font-medium"
                >
                  <FaTiktok size={14} />
                  TikTok
                  <FaExternalLinkAlt size={10} />
                </a>
              )}
            </div>

            {!toko.marketplace && (
              <p className="mt-4 text-sm text-white/60">
                Belum ada marketplace
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="h-2 bg-slate-50" />
    </div>
  );
}