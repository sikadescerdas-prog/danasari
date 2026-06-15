// app/store/settings/page.tsx
// =========================
// STORE SETTINGS PAGE
// =========================

"use client";

import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useSessionStore } from "@/core/auth/store/session.store";
import { useStore } from "@/modules/marketplace/hooks/useStore";

import LogoStore from "@/components/marketplace/store/settings/LogoStore";
import FormStore from "@/components/marketplace/store/settings/FormStore";
import MapsStore from "@/components/marketplace/store/settings/MapsStore";
import MarketStore from "@/components/marketplace/store/settings/MarketStore";

import { Loader2 } from "lucide-react";

type ProfileData = {
  phone?: string;
  address?: { 
    detailAddress?: string; 
    city?: string; 
    latitude?: number; 
    longitude?: number 
  };
};

export default function TokoSettingsPage() {
  const { session } = useSessionStore();
  const uid = session?.uid || "";
  
  const [profileData, setProfileData] = useState<ProfileData>({});

  // Load profile data for copy
  useEffect(() => {
    if (!uid) return;
    get(ref(db, `profiles/${uid}`)).then((snap) => {
      setProfileData(snap.val() || {});
    });
  }, [uid]);

  // ✅ Pakai useStore WITH profileData
  const {
    loading,
    saving,
    name, setName,
    description, setDescription,
    address, setAddress,
    city, setCity,
    location, setLocation,
    shopee, setShopee,
    tiktokShop, setTiktokShop,
    waBusinessInput,
    waError,
    setWaBusiness,
    onWaBusinessFocus,
    validateWaBusiness,
    copyFromProfile, setCopyFromProfile,
    logoPreview, handleLogoUpload,
    bannerPreview, handleBannerUpload,
    isStoreComplete,
    handleSave,
  } = useStore(uid, profileData);  // ← PASS profileData

  // Handle WA change
  const handleWaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaBusiness(e.target.value);
  };

  // Loading check
  if (!uid) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please login to access store settings
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border overflow-hidden p-6">
        <h1 className="text-xl font-bold text-center mb-6">Pengaturan Toko</h1>

        <LogoStore
          logoPreview={logoPreview}
          handleLogoUpload={handleLogoUpload}
          bannerPreview={bannerPreview}
          handleBannerUpload={handleBannerUpload}
        />

        <FormStore
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
        />

        <MapsStore
          location={location}
          setLocation={setLocation}
          copyFromProfile={copyFromProfile}
          setCopyFromProfile={setCopyFromProfile}
          mapDisabled={copyFromProfile}
        />

        <MarketStore
          waBusinessInput={waBusinessInput}
          waError={waError}
          handleWaChange={handleWaChange}
          onWaFocus={onWaBusinessFocus}
          validateWaBusiness={validateWaBusiness}
          shopee={shopee}
          setShopee={setShopee}
          tiktokShop={tiktokShop}
          setTiktokShop={setTiktokShop}
          isStoreComplete={isStoreComplete}
          loading={saving}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
}