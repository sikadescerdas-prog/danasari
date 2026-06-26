// src/core/profile/hooks/useProfile.ts
// =========================
// USE PROFILE HOOK (ALL IN ONE)
// =========================

"use client";

import { useState, useEffect, useCallback } from "react";

import { profileService } from "../services/profile.service";
import { cloudinaryService } from "@/core/cloudinary/cloudinary.service";

import { validateUsername, usernameToIndex } from "@/core/auth/helpers/username";
import { validatePhone, phoneToSave, phoneToDisplay } from "@/shared/helpers/phone";

import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";

import { sweet } from "@/shared/utils/sweet";

import type { ProfileForm, Location, Gender, Profile, UserData } from "../types/profile.types";

// =========================
// TIPE BALIKAN
// =========================
type UseProfileReturn = {
  // Loading
  loading: boolean;
  saving: boolean;
  
  // Data
  profile: Profile | null;
  user: any;
  store: any;
  refetch: () => Promise<void>;
  
  // Form (untuk edit)
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  
  // Location
  location: Location;
  setLocation: (loc: Location) => void;
  
  // Validation Errors
  usernameError: string;
  fullnameError: string;
  phoneError: string;
  
  // Username Check
  usernameAvailable: boolean | undefined;
  checkingUsername: boolean;
  checkUsername: (username: string) => Promise<void>;
  setUsernameFocus: () => void;
  setUsernameBlur: () => void;
  
  // Phone Validation
  setPhoneFocus: () => void;
  setPhoneBlur: () => void;
  
  // Validate Form
  validateForm: () => boolean;
  
  // Actions
  handleAvatarUpload: (file: File) => Promise<void>;
  saveProfile: () => Promise<void>;
  
  // Avatar Preview
  avatarPreview: string;
  avatarFile: File | null;
  progress: number;
  
  // Current Data
  currentUser: any;
  currentProfile: any;
  currentStore: any;
};

// =========================
// HOOK
// =========================
export function useProfile(uid?: string): UseProfileReturn {
  // STATE - LOADING
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // STATE - DATA
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  
  // STATE - FORM
  const [form, setForm] = useState<ProfileForm>({
    username: "",
    fullname: "",
    phone: "",
    bio: "",
    gender: "",
    birthDate: "",
    addressFull: "",
    addressCity: "",
  });
  
  // STATE - LOCATION
  const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
  
  // STATE - VALIDATION ERRORS
  const [usernameError, setUsernameError] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  // STATE - USERNAME CHECK
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | undefined>();
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  // STATE - AVATAR
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [progress, setProgress] = useState(0);
  
  // STATE - CURRENT DATA
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [currentStore, setCurrentStore] = useState<any>(null);

  // =========================
  // LOAD PROFILE DATA
  // =========================
  const loadProfile = useCallback(async () => {
    if (!uid) return;

    try {
      setLoading(true);

      // Service returns { user, profile, store }
      const data: UserData = await profileService.getProfile(uid);

      setUser(data.user);
      setProfile(data.profile);
      setStore(data.store);
      
      setCurrentUser(data.user);
      setCurrentProfile(data.profile);
      setCurrentStore(data.store);

      // Set form values
      const dbPhone = data.profile?.phone || "";
      setForm({
        username: data.user?.username || "",
        fullname: data.profile?.fullname || "",
        phone: phoneToDisplay(dbPhone),
        bio: data.profile?.bio || "",
        gender: (data.profile?.gender || "") as Gender,
        birthDate: data.profile?.birthDate || "",
        addressFull: data.profile?.address?.detailAddress || "",
        addressCity: data.profile?.address?.city || "",
      });

      // Set location
      setLocation({
        lat: data.profile?.address?.latitude ?? 0,
        lng: data.profile?.address?.longitude ?? 0,
      });

      // Set avatar
      setAvatarPreview(data.profile?.avatar?.url || "");

    } catch (err: any) {
      sweet.error({
        title: "Error",
        text: err.message || "Gagal memuat profil",
      });
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // =========================
  // CHECK USERNAME
  // =========================
  const checkUsername = useCallback(async (username: string) => {
    if (username === currentUser?.username) {
      setUsernameAvailable(true);
      setUsernameError("");
      return;
    }
    
    const validation = validateUsername(username);
    if (!validation.ok) {
      setUsernameError(validation.error || "Invalid");
      setUsernameAvailable(false);
      return;
    }
    
    setCheckingUsername(true);
    try {
      const key = usernameToIndex(username);
      const snap = await get(ref(db, `usernameIndex/${key}`));
      
      if (snap.exists()) {
        const storedUid = snap.val();
        if (storedUid === uid) {
          setUsernameAvailable(true);
          setUsernameError("");
        } else {
          setUsernameAvailable(false);
          setUsernameError("Username sudah digunakan");
        }
      } else {
        setUsernameAvailable(true);
        setUsernameError("");
      }
    } catch (err) {
      setUsernameError("Gagal cek username");
    } finally {
      setCheckingUsername(false);
    }
  }, [uid, currentUser?.username]);

  // AUTO CHECK USERNAME
  useEffect(() => {
    if (!form.username || form.username.length < 3) return;

    if (form.username === currentUser?.username) {
      setUsernameAvailable(true);
      return;
    }

    const formatCheck = validateUsername(form.username);
    if (!formatCheck.ok) {
      setUsernameError(formatCheck.error!);
      setUsernameAvailable(false);
      return;
    }

    if (usernameError) {
      setUsernameError("");
    }

    const timer = setTimeout(() => {
      checkUsername(form.username);
    }, 400);

    return () => clearTimeout(timer);
  }, [form.username, currentUser?.username]);

  // =========================
  // USERNAME FOCUS/BLUR
  // =========================
  const setUsernameFocus = useCallback(() => {}, []);
  const setUsernameBlur = useCallback(() => {
    if (form.username) {
      checkUsername(form.username);
    }
  }, [form.username, checkUsername]);

  // =========================
  // PHONE FOCUS/BLUR
  // =========================
  const setPhoneFocus = useCallback(() => {}, []);
  const setPhoneBlur = useCallback(() => {
    if (form.phone.trim()) {
      const phone = form.phone.trim();
      
      if (!phone.startsWith("08") && !phone.startsWith("62")) {
        setPhoneError("Nomor harus mulai dari 08 atau 62");
      } else {
        const validation = validatePhone("62", phone);
        if (!validation.ok) {
          setPhoneError(validation.error || "Nomor tidak valid");
        } else {
          setPhoneError("");
        }
      }
    } else {
      setPhoneError("");
    }
  }, [form.phone]);

  // =========================
  // VALIDATE FORM
  // =========================
  const validateForm = useCallback(() => {
    let isValid = true;
    
    if (!form.username.trim()) {
      setUsernameError("Username wajib diisi");
      isValid = false;
    } else if (usernameAvailable === false) {
      setUsernameError("Username sudah digunakan");
      isValid = false;
    }
    
    if (!form.fullname.trim()) {
      setFullnameError("Nama lengkap wajib diisi");
      isValid = false;
    }
    
    if (form.phone.trim()) {
      const phone = form.phone.trim();
      
      if (!phone.startsWith("0") && !phone.startsWith("62")) {
        setPhoneError("Nomor harus mulai dari 0 atau 62");
        isValid = false;
      } else {
        const validation = validatePhone("62", phone);
        if (!validation.ok) {
          setPhoneError(validation.error || "Nomor tidak valid");
          isValid = false;
        }
      }
    }
    
    return isValid;
  }, [form, usernameAvailable]);

  // =========================
// AVATAR UPLOAD - PREVIEW SAJA
// =========================
const handleAvatarUpload = async (file: File) => {
  if (!uid) return;
  
  // Preview langsung dari file
  setAvatarFile(file);
  const reader = new FileReader();
  reader.onload = () => { setAvatarPreview(reader.result as string); };
  reader.readAsDataURL(file);
  
  // Ga perlu upload + ga perlu sweet alert!
};

// =========================
// SAVE PROFILE - 1x SWEET ALERT
// =========================
const saveProfile = useCallback(async () => {
  if (!uid) return;
  if (!validateForm()) {
    sweet.error({
      title: "Error",
      text: "Mohon lengkapi data dengan benar",
    });
    return;
  }
  
  setSaving(true);
  try {
    // Avatar - upload baru kalau ada
    let avatar = currentProfile?.avatar ?? null;
    
    if (avatarFile) {
      setProgress(0);
      const result = await cloudinaryService.upload(avatarFile, {
        folder: `avatar`,
        customPublicId: uid,
        cropType: "1:1",
      }, (percent) => setProgress(percent));
      avatar = { url: result.url, publicId: result.publicId };
      setAvatarPreview(result.url);
    }
    
    // Phone - convert ke format Indonesia
    const phoneForSave = form.phone.trim() ? phoneToSave(form.phone) : undefined;
    
    // Address
    const address = {
      detailAddress: form.addressFull.trim(),
      city: form.addressCity.trim(),
      latitude: location.lat,
      longitude: location.lng,
    };
    
    // Save
    await profileService.saveProfile({
      uid,
      currentUsername: currentUser?.username,
      newUsername: form.username,
      profile: {
        uid,
        fullname: form.fullname,
        phone: phoneForSave,
        bio: form.bio,
        gender: form.gender as Gender,
        birthDate: form.birthDate,
        avatar,
        address,
        hasStore: !!currentStore,
      },
    });
    
    // ✅ 1x Sweet Alert saja
    sweet.success({
      title: "Berhasil",
      text: "Profile disimpan",
    });
    
    // Reset dan reload
    setAvatarFile(null);
    loadProfile();
  } catch (err: any) {
    sweet.error({
      title: "Gagal",
      text: err.message,
    });
  } finally {
    setSaving(false);
  }
}, [uid, form, location, currentProfile, currentUser, currentStore, avatarFile, validateForm, loadProfile]);

  // =========================
  // RETURN
  // =========================
  return {
    loading,
    saving,
    profile,
    user,
    store,
    refetch: loadProfile,
    form,
    setForm,
    location,
    setLocation,
    usernameError,
    fullnameError,
    phoneError,
    usernameAvailable,
    checkingUsername,
    checkUsername,
    setUsernameFocus,
    setUsernameBlur,
    setPhoneFocus,
    setPhoneBlur,
    validateForm,
    handleAvatarUpload,
    saveProfile,
    avatarPreview,
    avatarFile,
    progress,
    currentUser,
    currentProfile,
    currentStore,
  };
}