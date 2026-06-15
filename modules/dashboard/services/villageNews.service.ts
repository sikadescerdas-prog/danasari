// modules/dashboard/service/villageNews.service.ts
import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import type { News, NewsType } from "@/modules/desa/types/villageNews.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

const NEWS_REF = ref(db, "village/news");

interface NewsItem extends News {
  createdAt?: number;
  updatedAt?: number;
}

interface NewsForm {
  title: string;
  content: string;
  image?: CloudinaryImage;
  imageFile?: File;
  type: NewsType;
  date: number;
  deleteImage?: boolean;
}

export const newsService = {

  get: async (): Promise<NewsItem[]> => {
    const snapshot = await get(NEWS_REF);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    
    if (data && typeof data === 'object') {
      return Object.values(data);
    }
    
    return [];
  },

  addNews: async (form: NewsForm): Promise<NewsItem> => {
    const snapshot = await get(NEWS_REF);
    const newsObj: Record<string, NewsItem> = snapshot.exists() ? snapshot.val() : {};

    const now = Date.now();
    const type = form.type || "berita";
    const id = `${type}-${now}`;
    
    const newItem: NewsItem = {
      id,
      title: form.title || "",
      content: form.content || "",
      type: form.type,
      date: form.date || now,
      image: form.image,
      createdAt: now,
      updatedAt: now,
    };

    newsObj[id] = newItem;
    await set(NEWS_REF, newsObj);
    return newItem;
  },

  updateNews: async (newsId: string, form: Partial<News>): Promise<NewsItem> => {
    const snapshot = await get(NEWS_REF);
    const newsObj: Record<string, NewsItem> = snapshot.exists() ? snapshot.val() : {};

    if (!newsObj[newsId]) throw new Error("News tidak ditemukan");

    // Filter: hanya update field yang ADA (tidak undefined)
    const updateData: Partial<NewsItem> = {};
    
    if (form.title !== undefined) updateData.title = form.title;
    if (form.content !== undefined) updateData.content = form.content;
    if (form.type !== undefined) updateData.type = form.type;
    if (form.date !== undefined) updateData.date = form.date;
    
    // Image: null = hapus, undefined = abaikan (pakai image lama)
    if ('image' in form) {
      updateData.image = form.image;
    }

    const updated: NewsItem = {
      ...newsObj[newsId],
      ...updateData,
      id: newsId,
      updatedAt: Date.now(),
    };

    newsObj[newsId] = updated;
    await set(NEWS_REF, newsObj);
    return updated;
  },

  deleteNews: async (newsId: string): Promise<void> => {
    const snapshot = await get(NEWS_REF);
    const newsObj: Record<string, NewsItem> = snapshot.exists() ? snapshot.val() : {};

    delete newsObj[newsId];
    await set(NEWS_REF, newsObj);
  },
};