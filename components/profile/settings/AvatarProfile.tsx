// components/profile/settings/ProfileAvatar.tsx

"use client";

import { Camera } from "lucide-react";
import { getInitials } from "@/core/profile/utils/getInitials";

type Avatar = string | null;

type Props = {
  fullname: string;
  avatar: Avatar;
  avatarPreview: string;
  progress: number;
  onUpload: (file: File) => void;
};

export default function Avatar({ fullname, avatar, avatarPreview, progress, onUpload }: Props) {
  const initials = getInitials(fullname);
  const avatarUrl = avatarPreview || avatar || null;

  const size = 112;
  const stroke = 6;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const color = progress < 40 ? "#ef4444" : progress < 70 ? "#f59e0b" : "#22c55e";
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[112px] h-[112px]">
        {progress > 0 && progress < 100 && (
          <svg className="absolute top-0 left-0 rotate-[-90deg]" width={size} height={size}>
            <circle cx={size/2} cy={size/2} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
            <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
        )}
        <div className="w-[112px] h-[112px] rounded-full overflow-hidden ring-4 ring-green-100 shadow-md flex items-center justify-center bg-gray-100 text-xl font-bold text-gray-600">
          {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar" /> : initials}
        </div>
        <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:scale-105 transition">
          <Camera size={16} className="text-green-600" />
          <input type="file" hidden accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file); }} />
        </label>
      </div>
      <label className="mt-3 text-sm font-bold text-green-600 cursor-pointer">
        Ubah Foto Profile
        <input type="file" hidden accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file); }} />
      </label>
      {progress > 0 && progress < 100 && <p className="text-xs text-gray-400 mt-1">Uploading... {progress}%</p>}
    </div>
  );
}