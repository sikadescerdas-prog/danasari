// modules/literasi/services/literasi.service.ts

import { db } from '@/lib/firebase';
import { ref, push, get, remove, set, update } from 'firebase/database';
import type { Literasi, FormLiterasi } from '@/modules/literasi/types/literasi.type';
import { generateSlug } from '@/modules/literasi/utils/slugLiterasi';
import { uploadImage, uploadPdf, deleteImage, deletePdf } from '@/modules/literasi/services/upload.literasi';

/* =========================
   ➕ CREATE LITERASI
========================= */
export const createLiterasi = async (
  uid: string,
  authorName: string,
  data: FormLiterasi,
  thumbnailFile?: File,
  pdfFile?: File
): Promise<Literasi> => {
  const slug = generateSlug(data.title);
  const literasiRef = ref(db, `literasi/${uid}`);
  const newRef = await push(literasiRef);

  let thumbnail = data.thumbnail;
  if (thumbnailFile) {
    try {
      thumbnail = await uploadImage(thumbnailFile, uid);
    } catch (err) {
      console.error('❌ uploadImage error:', err);
    }
  }

  let pdf = data.pdf;
  if (pdfFile) {
    try {
      pdf = await uploadPdf(pdfFile, uid);
    } catch (err) {
      console.error('❌ uploadPdf error:', err);
    }
  }

  const newData: Record<string, any> = {
    id: newRef.key!,
    slug,
    authorName,
    uid,
    status: 'active',
    createdAt: Date.now(),
    type: data.type,
    title: data.title,
    category: data.category,
    description: data.description,
  };

  if (data.content?.trim()) newData.content = data.content.trim();
  if (thumbnail) newData.thumbnail = thumbnail;
  if (pdf) newData.pdf = pdf;
  if (data.linkpdf?.trim()) newData.linkpdf = data.linkpdf.trim();
  if (data.tiktokLink?.trim()) newData.tiktokLink = data.tiktokLink.trim();
  if (data.youtubeLink?.trim()) newData.youtubeLink = data.youtubeLink.trim();
  if (data.instagramLink?.trim()) newData.instagramLink = data.instagramLink.trim();

  await set(newRef, newData);
  return newData as Literasi;
};

/* =========================
   📋 GET ALL LITERASI
========================= */
export const getAllLiterasi = async (): Promise<Literasi[]> => {
  const literasiRef = ref(db, 'literasi');
  const snapshot = await get(literasiRef);

  if (!snapshot.exists()) return [];

  const allData: Literasi[] = [];
  const usersData = snapshot.val();

  for (const uid in usersData) {
    const userItems = usersData[uid];
    for (const id in userItems) {
      allData.push({ ...userItems[id], uid, id });
    }
  }

  return allData.sort((a, b) => b.createdAt - a.createdAt);
};

/* =========================
   📄 GET BY SLUG
========================= */
export const getLiterasiBySlug = async (slug: string): Promise<Literasi | null> => {
  const list = await getAllLiterasi();
  return list.find((item) => item.slug === slug) || null;
};

/* =========================
   👤 GET BY UID
========================= */
export const getLiterasiByUid = async (userUid: string): Promise<Literasi[]> => {
  const userRef = ref(db, `literasi/${userUid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) return [];

  const items = snapshot.val();
  const result: Literasi[] = [];

  for (const id in items) {
    result.push({ ...items[id], uid: userUid, id });
  }

  return result.sort((a, b) => b.createdAt - b.createdAt);
};

/* =========================
   🔍 GET BY ID
========================= */
export const getLiterasiById = async (userUid: string, id: string): Promise<Literasi | null> => {
  const itemRef = ref(db, `literasi/${userUid}/${id}`);
  const snapshot = await get(itemRef);

  if (!snapshot.exists()) return null;

  return { ...snapshot.val(), uid: userUid, id } as Literasi;
};

/* =========================
   ✏️ UPDATE (tanpa pdf file)
========================= */
export const updateLiterasi = async (
  uid: string,
  id: string,
  data: Partial<FormLiterasi>
): Promise<void> => {
  const itemRef = ref(db, `literasi/${uid}/${id}`);

  const updateData: Record<string, any> = {
    updatedAt: Date.now(),
  };

  if (data.type) updateData.type = data.type;
  if (data.title) updateData.title = data.title;
  if (data.category !== undefined) updateData.category = data.category;  // ✅ FIX: !== undefined
  if (data.description) updateData.description = data.description;
  if (data.content?.trim()) updateData.content = data.content.trim();
  if (data.thumbnail) updateData.thumbnail = data.thumbnail;
  if (data.pdf) updateData.pdf = data.pdf;
  if (data.linkpdf?.trim()) updateData.linkpdf = data.linkpdf.trim();
  if (data.tiktokLink?.trim()) updateData.tiktokLink = data.tiktokLink.trim();
  if (data.youtubeLink?.trim()) updateData.youtubeLink = data.youtubeLink.trim();
  if (data.instagramLink?.trim()) updateData.instagramLink = data.instagramLink.trim();

  await update(itemRef, updateData);
};

/* =========================
   ✏️ UPDATE DENGAN FILE
========================= */
export const updateLiterasiWithFiles = async (
  uid: string,
  id: string,
  data: Partial<FormLiterasi>,
  thumbnailFile?: File,
  pdfFile?: File
): Promise<void> => {
  const itemRef = ref(db, `literasi/${uid}/${id}`);
  const snapshot = await get(itemRef);
  const existing = snapshot.exists() ? snapshot.val() : {};

  let thumbnail = data.thumbnail;
  if (thumbnailFile) {
    if (existing.thumbnail?.publicId) {
      await deleteImage(existing.thumbnail.publicId).catch(console.error);
    }
    thumbnail = await uploadImage(thumbnailFile, uid);
  }

  let pdf = data.pdf;
  if (pdfFile) {
    if (existing.pdf?.publicId) {
      await deletePdf(existing.pdf.publicId).catch(console.error);
    }
    pdf = await uploadPdf(pdfFile, uid);
  }

  const updateData: Record<string, any> = {
    updatedAt: Date.now(),
  };

  if (data.type) updateData.type = data.type;
  if (data.title) updateData.title = data.title;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.description) updateData.description = data.description;
  if (data.content?.trim()) updateData.content = data.content.trim();
  if (thumbnail) updateData.thumbnail = thumbnail;
  if (pdf) updateData.pdf = pdf;
  if (data.linkpdf?.trim()) updateData.linkpdf = data.linkpdf.trim();
  if (data.tiktokLink?.trim()) updateData.tiktokLink = data.tiktokLink.trim();
  if (data.youtubeLink?.trim()) updateData.youtubeLink = data.youtubeLink.trim();
  if (data.instagramLink?.trim()) updateData.instagramLink = data.instagramLink.trim();

  await update(itemRef, updateData);
};

/* =========================
   🗑️ DELETE (Cloudinary + Firebase)
========================= */
export const deleteLiterasi = async (uid: string, id: string): Promise<void> => {
  const item = await getLiterasiById(uid, id);
  
  if (item) {
    // ✅ Hapus dari Cloudinary
    if (item.thumbnail?.publicId) {
      try {
        await deleteImage(item.thumbnail.publicId);
        console.log('🖼️ Thumbnail deleted:', item.thumbnail.publicId);
      } catch (err) {
        console.error('❌ deleteImage error:', err);
      }
    }
    if (item.pdf?.publicId) {
      try {
        await deletePdf(item.pdf.publicId);
        console.log('📄 PDF deleted:', item.pdf.publicId);
      } catch (err) {
        console.error('❌ deletePdf error:', err);
      }
    }
    
    // ✅ Hapus dari Firebase
    const itemRef = ref(db, `literasi/${uid}/${id}`);
    await remove(itemRef);
    console.log('✅ Firebase entry deleted:', `${uid}/${id}`);
  }
};