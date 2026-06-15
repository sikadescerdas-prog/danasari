// modules/dashboard/hooks/useVillageNews.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { newsService } from "@/modules/dashboard/services/villageNews.service";
import { newsUploadHelper } from "@/modules/dashboard/cloudinary/upload.news";
import { sweet } from "@/shared/utils/sweet";

import type { News } from "@/modules/desa/types/villageNews.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

/* ================= OPTIONS ================= */

export const NEWS_TYPE_OPTIONS = [
  { value: "berita", label: "Berita" },
  { value: "pengumuman", label: "Pengumuman" },
  { value: "event", label: "Event" },
];

/* ================= HOOK ================= */

export function useVillageNews() {
  const router = useRouter();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const data = await newsService.get();
      setNewsList(data);
    } finally {
      setIsLoading(false);
    }
  };

  const redirect = () => {
    router.push("/dashboard/news");
  };

  const addNews = async (form: Partial<News> & { imageFile?: File }) => {
    try {
      setIsSaving(true);

      let image: CloudinaryImage | undefined;

      if (form.imageFile) {
        image = await newsUploadHelper.uploadPhoto(form.imageFile, form.title);
      }

      if (!image) {
        throw new Error("Thumbnail wajib diisi");
      }

      const newsData = {
        title: form.title || "",
        content: form.content || "",
        image,
        type: form.type || "berita",
        date: form.date || Date.now(),
      };

      await newsService.addNews(newsData);
      await loadNews();

      sweet.toast({ title: "Berhasil", text: "Berita ditambahkan" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      let message = err.message;

      if (message.includes("image") || message.includes("value argument contains")) {
        message = "Thumbnail wajib diisi";
      }

      sweet.warning({ title: "Gagal", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const updateNews = async (
    id: string,
    form: Partial<News> & { imageFile?: File; deleteImage?: boolean }
  ) => {
    try {
      setIsSaving(true);

      const old = newsList.find((n) => n.id === id);
      
      if (!old) {
        throw new Error("Data tidak ditemukan");
      }
      
      let image: CloudinaryImage | undefined = old.image;
      let hasImageChange = false;

      // Klik X → hapus image
      if (form.deleteImage && old.image?.publicId) {
        await newsUploadHelper.deletePhoto(old.image.publicId);
        image = null as any;
        hasImageChange = true;
      }

      // Upload image baru
      if (form.imageFile) {
        if (old.image?.publicId) {
          await newsUploadHelper.deletePhoto(old.image.publicId);
        }
        image = await newsUploadHelper.uploadPhoto(form.imageFile, form.title);
        hasImageChange = true;
      }

      // Siapkan data, image hanya jika ada perubahan
      const data: any = {
        title: form.title || "",
        content: form.content || "",
        type: form.type || "berita",
        date: form.date || Date.now(),
      };

      if (hasImageChange) {
        data.image = image;
      }

      await newsService.updateNews(id, data);
      await loadNews();

      sweet.toast({ title: "Berhasil", text: "Berita diperbarui" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNews = async (id: string, publicId?: string) => {
    try {
      setIsSaving(true);

      if (publicId) {
        await newsUploadHelper.deletePhoto(publicId);
      }

      await newsService.deleteNews(id);
      await loadNews();

      sweet.toast({ title: "Berhasil", text: "Berita dihapus" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    newsList,
    isLoading,
    isSaving,
    addNews,
    updateNews,
    deleteNews,
    reload: loadNews,
    NEWS_TYPE_OPTIONS,
  };
}