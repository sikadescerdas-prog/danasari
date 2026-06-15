// modules/dashboard/cloudinary/upload.facility

import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

export const potentialUploadHelper = {
  uploadPhoto: async (file: File, name?: string): Promise<CloudinaryImage> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "village/potential");
    formData.append("publicId", `village/potential/${name || "potential"}-${Date.now()}`);
    formData.append("cropType", "16:9");

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload gagal");

    return { publicId: data.publicId, url: data.url };
  },

  deletePhoto: async (publicId: string): Promise<void> => {
    if (!publicId) return;
    await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, resourceType: "image" }),
    });
  },
};