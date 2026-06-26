// app/profile/settings/page.tsx
// =========================
// PROFILE SETTINGS PAGE
// =========================

"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/core/auth/store/session.store";

import Avatar from "@/components/profile/settings/AvatarProfile";
import Form from "@/components/profile/settings/FormProfile";
import Save from "@/components/profile/settings/SaveProfile";

import { useProfile } from "@/core/profile/hooks/useProfile";
import { sweet } from "@/shared/utils/sweet";

import { Loader2, ArrowLeft } from "lucide-react";

const MapsProfile = dynamic(
  () => import("@/components/profile/settings/MapsProfile"),
  { ssr: false }
);

export default function ProfileSettingsPage() {
  const { session } = useSessionStore();
  const router = useRouter();
  const uid = session?.uid || "";

  const {
    loading,
    saving,
    form,
    setForm,
    location,
    setLocation,
    usernameError,
    fullnameError,
    phoneError,
    usernameAvailable,
    checkingUsername,
    currentUser,
    setUsernameFocus,
    setUsernameBlur,
    setPhoneFocus,
    setPhoneBlur,
    avatarPreview,
    progress,
    handleAvatarUpload,
    saveProfile,
  } = useProfile(uid);

  const isLoading = loading || saving;

  if (!uid) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please login to access profile settings
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white px-4 py-6 pt-24 flex justify-center">

  <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border overflow-hidden">

    {/* BACK BUTTON (DI DALAM CARD) */}
    <div className="p-4 bg-white/70 backdrop-blur-md">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full border hover:bg-gray-50 transition"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Kembali</span>
      </button>
    </div>

        {/* AVATAR */}
        <div className="p-6">
          <Avatar
            fullname={form.fullname}
            avatar={avatarPreview}
            avatarPreview={avatarPreview}
            progress={progress}
            onUpload={handleAvatarUpload}
          />
        </div>

        {/* FORM */}
        <div className="px-6 pb-2">
          <Form
            form={form}
            setForm={setForm}
            usernameError={usernameError}
            fullnameError={fullnameError}
            phoneError={phoneError}
            usernameAvailable={usernameAvailable}
            checkingUsername={checkingUsername}
            currentUsername={currentUser?.username}
            onUsernameFocus={setUsernameFocus}
            onUsernameBlur={setUsernameBlur}
            onPhoneFocus={setPhoneFocus}
            onPhoneBlur={setPhoneBlur}
          />
        </div>

        {/* MAPS */}
        <div className="px-6">
          <MapsProfile
            value={location}
            onSelect={setLocation}
          />
        </div>

        {/* SAVE */}
        <div className="px-6 pb-6">
          <Save
            loading={isLoading}
            onSave={saveProfile}
          />
        </div>

      </div>
    </div>
  );
}