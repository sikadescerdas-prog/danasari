// components/profile/settings/ProfileForm.tsx
// =========================
// PROFILE FORM
// =========================

"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle, XCircle, Loader2 } from "lucide-react";

import { formatDate } from "@/shared/utils/formatDate";

import InputUnderline from "@/components/ui/InputUnderline";
import SelectUnderline from "@/components/ui/SelectUnderline";

import type { ProfileForm, Gender } from "@/core/profile/types/profile.types";

type FieldKey = keyof ProfileForm;

type Props = {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  usernameError?: string;
  fullnameError?: string;
  phoneError?: string;
  usernameAvailable?: boolean;
  checkingUsername?: boolean;
  currentUsername?: string;
  onUsernameFocus?: () => void;
  onUsernameBlur?: () => void;
  onPhoneFocus?: () => void;
  onPhoneBlur?: () => void;
};

export default function FormProfile({ 
  form, 
  setForm, 
  usernameError, 
  fullnameError, 
  phoneError,
  usernameAvailable,
  checkingUsername,
  currentUsername,
  onUsernameFocus,
  onUsernameBlur,
  onPhoneFocus,
  onPhoneBlur,
}: Props) {
  const [editField, setEditField] = useState<FieldKey | null>(null);

  const handleChange = (key: FieldKey, value: string) => {
    if (key === "phone") {
      const numericOnly = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [key]: numericOnly }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Get display value - pake formatDate dari utils  // ← UPDATE
  const getDisplayValue = (field: FieldKey, value: string) => {
    const v = value?.trim();
    switch (field) {
      case "birthDate": return v ? formatDate(value) : "Belum dipilih";
      case "gender": return v === "male" ? "Laki-laki" : v === "female" ? "Perempuan" : "Belum dipilih";
      case "bio": return v || "Tambahkan bio";
      case "fullname": return v || "Tambahkan nama lengkap";
      case "username": return v || "Buat username";
      case "phone": return v || "Tambahkan nomor telepon";
      case "addressFull": return v || "Tambahkan alamat";
      case "addressCity": return v || "Tambahkan kota";
      default: return v || "Belum diisi";
    }
  };

  const getError = (field: FieldKey): string | undefined => {
    if (field === "username") return usernameError;
    if (field === "fullname") return fullnameError;
    if (field === "phone") return phoneError;
    return undefined;
  };

  const isOwnerUsername = form.username === currentUsername;

  const fields: { key: FieldKey; label: string }[] = [
    { key: "username", label: "Username" },
    { key: "fullname", label: "Full Name" },
    { key: "phone", label: "Phone" },
    { key: "bio", label: "Bio" },
    { key: "gender", label: "Gender" },
    { key: "birthDate", label: "Birth Date" },
    { key: "addressFull", label: "Address" },
    { key: "addressCity", label: "City" },
  ];

  return (
    <div className="w-full p-6">
      {fields.map((field) => {
        const isEditing = editField === field.key;
        const value = form[field.key] || "";
        const isEmpty = !value?.trim();
        
        const isUsername = field.key === "username";
        const isPhone = field.key === "phone";
        
        const fieldError = getError(field.key);

        return (
          <div key={field.key} className="grid grid-cols-12 items-start py-4 border-b">
            <div className="col-span-4 text-sm font-medium text-gray-500 pt-1">
              {field.label}
            </div>

            <div className="col-span-8 flex flex-col">
              {isEditing ? (
                field.key === "birthDate" ? (
                  <InputUnderline type="date" value={value} onChange={(e) => handleChange(field.key, e.target.value)} onBlur={() => setEditField(null)} />
                ) : field.key === "gender" ? (
                  <SelectUnderline value={value} onChange={(e) => handleChange(field.key, e.target.value as Gender)} onBlur={() => setEditField(null)}>
                    <option value="">Pilih jenis kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </SelectUnderline>
                ) : isUsername ? (
                  <div className="relative">
                    <InputUnderline 
                      autoFocus 
                      value={value} 
                      onChange={(e) => handleChange(field.key, e.target.value)} 
                      onFocus={() => onUsernameFocus?.()}
                      onBlur={() => {
                        setEditField(null);
                        onUsernameBlur?.();
                      }}
                      onKeyDown={(e) => { 
                        if (e.key === "Enter") {
                          setEditField(null);
                          onUsernameBlur?.();
                        }
                        if (e.key === "Escape") setEditField(null);
                      }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {checkingUsername && <Loader2 size={16} className="animate-spin text-gray-400" />}
                      {isOwnerUsername && <CheckCircle size={16} className="text-blue-500" />}
                      {usernameAvailable === true && !isOwnerUsername && <CheckCircle size={16} className="text-green-500" />}
                      {usernameAvailable === false && !isOwnerUsername && <XCircle size={16} className="text-red-500" />}
                    </div>
                  </div>
                ) : isPhone ? (
                  <div>
                    <InputUnderline 
                      autoFocus 
                      value={value} 
                      onChange={(e) => handleChange(field.key, e.target.value)} 
                      onFocus={() => onPhoneFocus?.()}
                      onBlur={() => {
                        setEditField(null);
                        onPhoneBlur?.();
                      }}
                      onKeyDown={(e) => { 
                        if (e.key === "Enter") {
                          setEditField(null);
                          onPhoneBlur?.();
                        }
                        if (e.key === "Escape") setEditField(null);
                      }}
                      placeholder="0812xxxxxx"
                    />
                    {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
                  </div>
                ) : (
                  <InputUnderline 
                    autoFocus 
                    value={value} 
                    onChange={(e) => handleChange(field.key, e.target.value)} 
                    onBlur={() => setEditField(null)} 
                    onKeyDown={(e) => { if (e.key === "Enter") setEditField(null); if (e.key === "Escape") setEditField(null); }} 
                  />
                )
              ) : (
                <div onClick={() => setEditField(field.key)} className="flex w-full items-center justify-between cursor-pointer hover:text-green-600 transition py-1">
                  <span className={`text-sm ${isEmpty ? "text-gray-400" : "text-gray-900"}`}>
                    {getDisplayValue(field.key, value)}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              )}
              
              {!isEditing && fieldError && (
                <p className="text-xs text-red-500 mt-1">{fieldError}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}