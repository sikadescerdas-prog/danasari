// modules/marketplace/store/hooks/useStore.ts
// =========================
// USE STORE - ALL IN ONE
// =========================

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";  // ✅ ADD

import { storeService } from "../services/store.service";
import { cloudinaryService } from "@/core/cloudinary/cloudinary.service";

import { validatePhone, phoneToSave, phoneToDisplay } from "@/shared/helpers/phone";
import { sweet } from "@/shared/utils/sweet";

import type { IStore, Marketplace } from "../types/store.types";
import type { Address } from "@/shared/types/address.type";

type OpenStoreResult = {
  success: boolean;
  redirect?: string;
  message?: string;
};

type ProfileData = {
  address?: { 
    detailAddress?: string; 
    city?: string; 
    latitude?: number; 
    longitude?: number 
  };
};

type UseStoreReturn = {
  loading: boolean;
  saving: boolean;
  store: IStore | null;
  refetch: () => Promise<void>;
  isActive: boolean;
  toggleStatus: () => Promise<void>;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  location: { lat: number; lng: number };
  setLocation: (v: { lat: number; lng: number }) => void;
  shopee: string;
  setShopee: (v: string) => void;
  tiktokShop: string;
  setTiktokShop: (v: string) => void;
  waBusiness: string;
  waBusinessInput: string;
  waError: string;
  setWaBusiness: (v: string) => void;
  onWaBusinessFocus: () => void;
  validateWaBusiness: () => boolean;
  copyFromProfile: boolean;
  setCopyFromProfile: (v: boolean) => void;
  logoFile: File | null;
  logoPreview: string;
  handleLogoUpload: (file: File) => void;
  bannerFile: File | null;
  bannerPreview: string;
  handleBannerUpload: (file: File) => void;
  progress: number;
  isStoreComplete: boolean;
  handleSave: () => Promise<void>;
  openStore: (uid: string, nameStore: string) => Promise<OpenStoreResult>;
};

export function useStore(uid: string, profileData?: ProfileData): UseStoreReturn {
  // STATE - LOADING
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // STATE - STORE
  const [store, setStore] = useState<IStore | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  // STATE - FORM
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  
  // STATE - MARKETPLACE
  const [shopee, setShopee] = useState("");
  const [tiktokShop, setTiktokShop] = useState("");
  const [waBusiness, setWaBusiness] = useState("");
  const [waBusinessInput, setWaBusinessInput] = useState("");
  const [waError, setWaError] = useState("");
  
  // STATE - COPY PROFILE
  const [copyFromProfile, setCopyFromProfile] = useState(false);
  
  // STATE - FILES
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [progress, setProgress] = useState(0);

  // ✅ ADD ROUTER
  const router = useRouter();

  // =========================
  // LOAD STORE
  // =========================
  const loadStore = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    const data = await storeService.getStore(uid);

    if (data) {
      setStore(data);
      setIsActive(data.isActive ?? false);
      setName(data.nameStore || "");
      setDescription(data.description || "");
      setAddress(data.addressStore?.detailAddress || "");
      setCity(data.addressStore?.city || "");
      setLocation({
        lat: data.addressStore?.latitude || 0,
        lng: data.addressStore?.longitude || 0,
      });

      setShopee(data.marketplace?.shopee || "");
      setTiktokShop(data.marketplace?.tiktokShop || "");

      const wa = data.marketplace?.waBusiness || "";
      setWaBusiness(wa);
      setWaBusinessInput(phoneToDisplay(wa));

      setLogoPreview(data.logo?.url || "");
      setBannerPreview(data.banner?.url || "");
    }

    setLoading(false);
  }, [uid]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleStatus = async () => {
    if (!uid) return;

    try {
      const newStatus = !isActive;
      setIsActive(newStatus);
      
      sweet.toast({
        title: newStatus ? "Toko aktif!" : "Toko ditutup!",
        icon: "info",
      });
      
      await storeService.updateStore(uid, { isActive: newStatus });
      loadStore();
    } catch (err: any) {
      sweet.error({
        title: "Error",
        text: err.message,
      });
    }
  };

  // =========================
  // COPY PROFILE HANDLER
  // =========================
  const handleCopyFromProfileChange = (checked: boolean) => {
    setCopyFromProfile(checked);
    
    if (checked && profileData?.address) {
      const addr = profileData.address;
      setAddress(addr.detailAddress || "");
      setCity(addr.city || "");
      setLocation({ 
        lat: addr.latitude || 0, 
        lng: addr.longitude || 0 
      });
    } else if (!checked) {
      setAddress("");
      setCity("");
      setLocation({ lat: 0, lng: 0 });
    }
  };

  // =========================
  // UPLOAD HANDLERS
  // =========================
  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (file: File) => {
    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // =========================
  // WA HANDLERS
  // =========================
  const handleWaBusinessChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setWaBusiness(cleaned);
    setWaBusinessInput(cleaned);
    setWaError("");
  };

  const handleWaBusinessFocus = () => {
    setWaError("");
  };

  const validateWaBusiness = () => {
    const phone = waBusinessInput.trim();
    
    if (!phone) return true;
    
    if (!phone.startsWith("08") && !phone.startsWith("62")) {
      setWaError("Nomor harus mulai dari 08 atau 62");
      return false;
    }
    
    const validation = validatePhone("62", phone);
    if (!validation.ok) {
      setWaError(validation.error || "Nomor tidak valid");
      return false;
    }

    return true;
  };

  // =========================
  // IS COMPLETE
  // =========================
  const isStoreComplete = 
    !!name.trim() &&
    !!description.trim() &&
    !!address.trim() &&
    !!city.trim() &&
    location.lat !== 0 &&
    (!!logoFile || !!store?.logo?.url) &&
    (!!bannerFile || !!store?.banner?.url);

  // =========================
  // SAVE STORE
  // =========================
  const handleSave = async () => {
    if (!uid) return;
    
    if (!name.trim()) {
      sweet.error({ title: "Error", text: "Nama toko wajib diisi" });
      return;
    }
    if (!logoFile && !store?.logo?.url) {
      sweet.error({ title: "Error", text: "Logo wajib diisi" });
      return;
    }
    if (!bannerFile && !store?.banner?.url) {
      sweet.error({ title: "Error", text: "Banner wajib diisi" });
      return;
    }
    if (!address.trim()) {
      sweet.error({ title: "Error", text: "Alamat wajib diisi" });
      return;
    }
    if (!city.trim()) {
      sweet.error({ title: "Error", text: "Kota wajib diisi" });
      return;
    }
    if (location.lat === 0 || location.lng === 0) {
      sweet.error({ title: "Error", text: "Pilih lokasi" });
      return;
    }

    setSaving(true);
    try {
      // Upload logo
      let logo = store?.logo || { publicId: "", url: "" };
      if (logoFile) {
        setProgress(0);
        logo = await cloudinaryService.upload(logoFile, {
          folder: `stores/${uid}`,
          customPublicId: "logo",
          cropType: "1:1",
        }, (percent) => setProgress(percent));
      }

      // Upload banner
      let banner = store?.banner || { publicId: "", url: "" };
      if (bannerFile) {
        setProgress(0);
        banner = await cloudinaryService.upload(bannerFile, {
          folder: `stores/${uid}`,
          customPublicId: "banner",
          cropType: "16:9",
        }, (percent) => setProgress(percent));
      }

      const addressData: Address = { 
        detailAddress: address, 
        city, 
        latitude: location.lat, 
        longitude: location.lng 
      };
      
      const marketplaceData: Marketplace = {
        shopee: shopee.trim(),
        tiktokShop: tiktokShop.trim(),
        waBusiness: phoneToSave(waBusiness),
      };

      const shouldBeActive = 
        !!name.trim() &&
        !!description.trim() &&
        !!address.trim() &&
        !!city.trim() &&
        location.lat !== 0 &&
        (!!logoFile || !!store?.logo?.url) &&
        (!!bannerFile || !!store?.banner?.url);

      await storeService.updateStore(uid, {
        nameStore: name.trim(),
        description: description.trim(),
        logo,
        banner,
        addressStore: addressData,
        marketplace: marketplaceData,
        isStoreComplete: shouldBeActive,
        isActive: shouldBeActive,
      });

      if (shouldBeActive) {
        setIsActive(true);
        sweet.success({
          title: "Berhasil",
          text: "Toko lengkap & aktif!",
        });
        
        // ✅ Redirect with STORE.SLUG (dari DB)
        router.push(`/store/${store?.slug}`);
      } else {
        sweet.success({
          title: "Berhasil",
          text: "Disimpan!",
        });
        router.refresh();
      }
      
      loadStore();
    } catch (err: any) {
      sweet.error({
        title: "Gagal",
        text: err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // OPEN STORE
  // =========================
  const openStore = async (uid: string, nameStore: string): Promise<OpenStoreResult> => {
    if (!uid || !nameStore) {
      return { success: false, message: "UID atau nama toko kosong" };
    }

    try {
      const result = await storeService.openStore(uid, nameStore);
      return result;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // =========================
  // RETURN
  // =========================
  return {
    loading,
    saving,
    store,
    refetch: loadStore,
    isActive,
    toggleStatus,
    name,
    setName,
    description,
    setDescription,
    address,
    setAddress,
    city,
    setCity,
    location,
    setLocation,
    shopee,
    setShopee,
    tiktokShop,
    setTiktokShop,
    waBusiness,
    waBusinessInput,
    waError,
    setWaBusiness: handleWaBusinessChange,
    onWaBusinessFocus: handleWaBusinessFocus,
    validateWaBusiness,
    copyFromProfile,
    setCopyFromProfile: handleCopyFromProfileChange,
    logoFile,
    logoPreview,
    handleLogoUpload,
    bannerFile,
    bannerPreview,
    handleBannerUpload,
    progress,
    isStoreComplete,
    handleSave,
    openStore,
  };
}