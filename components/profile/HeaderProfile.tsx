// src/components/profile/HeaderProfile.tsx
"use client";

import Image from "next/image";
import { getInitials } from "@/core/profile/utils/getInitials";

type Props = {
  fullname: string;
  username: string;
  avatarUrl: string | null;
  email: string;
};

export function HeaderProfile({ fullname, username, avatarUrl, email }: Props) {
  // Fallback name
  const safeName = fullname || username || "User";
  const initials = getInitials(safeName);

  return (
    <div className="flex flex-col items-center text-center">
      {/* AVATAR */}
      {avatarUrl ? (
        <div className="w-24 h-24 relative rounded-full overflow-hidden ring-4 ring-green-100">
          <Image
            src={avatarUrl}
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 text-2xl font-bold ring-4 ring-green-100">
          {initials}
        </div>
      )}

      {/* FULLNAME */}
      <h1 className="mt-4 text-xl font-bold text-gray-900">
        {fullname || "User"}
      </h1>

      {/* USERNAME - tampil kalau ada & berbeda dari fullname */}
      {username && (
        <p className="text-green-600 text-sm font-medium">
          @{username}
        </p>
      )}

      {/* EMAIL */}
      {email && (
        <p className="text-gray-400 text-sm mt-1">
          {email}
        </p>
      )}
    </div>
  );
}