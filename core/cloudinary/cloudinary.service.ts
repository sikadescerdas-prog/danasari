// core/cloudinary/cloudinary.service.ts

"use client";

import { UploadOptions, UploadResult } from "./cloudinary.types";

export class CloudinaryService {
  private apiUrl = "/api/upload";

  async upload(
    file: File,
    options: UploadOptions,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    if (!file) throw new Error("File is required");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", options.folder);

    if (options.customPublicId) {
      formData.append("publicId", options.customPublicId);
    }

    formData.append("cropType", options.cropType || "none");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", this.apiUrl);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ url: res.url, publicId: res.publicId });
          } else {
            reject(new Error(res.error || "Upload failed"));
          }
        } catch (err) {
          reject(err);
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));

      xhr.send(formData);
    });
  }

  async delete(publicId: string): Promise<void> {
    if (!publicId) return;

    const res = await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete failed");
    }
  }

  async deleteFolder(folder: string): Promise<void> {
    if (!folder) return;

    const res = await fetch("/api/upload/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete folder failed");
    }
  }

  async replace(
    oldPublicId: string,
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> {
    if (oldPublicId) {
      await this.delete(oldPublicId);
    }

    return this.upload(file, options);
  }
}

export const cloudinaryService = new CloudinaryService();
