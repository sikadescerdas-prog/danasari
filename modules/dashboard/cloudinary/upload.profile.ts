// modules/dashboard/cloudinary/upload.profile.ts

import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

export const villageProfileHelper = {
  uploadLogo: async (file: File): Promise<CloudinaryImage> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "village");
    formData.append("publicId", `logo-desa`);
    formData.append("cropType", "1:1");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload gagal");

    return { publicId: data.publicId, url: data.url };
  },

  deleteLogo: async (publicId: string): Promise<void> => {
    if (!publicId) return;
    const res = await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, resourceType: "image" }),
    });
    if (!res.ok) console.error("Delete failed");
  },
};