// modules/dashboard/cloudinary/upload.struktur

import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

export const structureUploadHelper = {
  uploadPhoto: async (file: File, name?: string): Promise<CloudinaryImage> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "village/structure");
    
    const publicId = `"structure"-${Date.now()}`;
    formData.append("publicId", publicId);
    formData.append("cropType", "1:1");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload gagal");

    return { publicId: data.publicId, url: data.url };
  },

  deletePhoto: async (publicId: string): Promise<void> => {
    if (!publicId) return;
    const res = await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, resourceType: "image" }),
    });
    if (!res.ok) console.error("Delete failed");
  },
};