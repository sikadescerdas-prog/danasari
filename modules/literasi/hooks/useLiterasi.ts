// modules/literasi/hooks/useLiterasi.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  getAllLiterasi, 
  getLiterasiBySlug,
  getLiterasiByUid,
  getLiterasiById,
  createLiterasi, 
  deleteLiterasi, 
  updateLiterasi,
  updateLiterasiWithFiles 
} from '@/modules/literasi/services/literasi.service';
import { 
  validateTitle, 
  validateDescription, 
  validateLink 
} from '@/modules/literasi/utils/validateLiterasi';
import type { Literasi, FormLiterasi } from '@/modules/literasi/types/literasi.type';
import { useSessionStore } from '@/core/auth/store/session.store';
import { sweet } from '@/shared/utils/sweet';

export const useLiterasi = () => {
  const { session } = useSessionStore();
  const [literasiList, setLiterasiList] = useState<Literasi[]>([]);
  const [loading, setLoading] = useState(true);

  // 📋 Fetch all
  const fetchLiterasi = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllLiterasi();
      setLiterasiList(data);
    } catch (err) {
      console.error('❌ fetchLiterasi error:', err);
      sweet.error({ title: 'Error', text: 'Gagal mengambil data' });
    } finally {
      setLoading(false);
    }
  }, []);

  // 📄 Get by slug
  const getBySlug = useCallback(async (slug: string) => {
    return await getLiterasiBySlug(slug);
  }, []);

  // 👤 Get by uid
  const getByUser = useCallback(async (uid: string) => {
    return await getLiterasiByUid(uid);
  }, []);

  // 🔍 Get by id
  const getById = useCallback(async (uid: string, id: string) => {
    return await getLiterasiById(uid, id);
  }, []);

  // ➕ Create new
  const addLiterasi = async (
    data: FormLiterasi, 
    thumbnailFile?: File, 
    pdfFile?: File
  ): Promise<boolean> => {
    if (!session.uid || !session.email) {
      sweet.error({ title: 'Error', text: 'Silakan login terlebih dahulu' });
      return false;
    }

    // Validasi title
    const titleValid = validateTitle(data.title);
    if (!titleValid.isValid) {
      sweet.error({ title: 'Error', text: titleValid.message });
      return false;
    }
    
    // Validasi description
    const descValid = validateDescription(data.description);
    if (!descValid.isValid) {
      sweet.error({ title: 'Error', text: descValid.message });
      return false;
    }

    // Validasi kategori untuk artikel
    if (data.type === 'artikel' && !data.category) {
      sweet.error({ title: 'Error', text: 'Pilih kategori terlebih dahulu' });
      return false;
    }

    // Validasi buku: wajib PDF atau Link
    if (data.type === 'buku' && !pdfFile && !data.linkpdf) {
      sweet.error({ title: 'Error', text: 'Pilih: Upload PDF atau Link PDF' });
      return false;
    }

    // Validasi links
    if (data.tiktokLink && !validateLink(data.tiktokLink)) {
      sweet.error({ title: 'Error', text: 'Link TikTok tidak valid' });
      return false;
    }
    if (data.youtubeLink && !validateLink(data.youtubeLink)) {
      sweet.error({ title: 'Error', text: 'Link YouTube tidak valid' });
      return false;
    }
    if (data.instagramLink && !validateLink(data.instagramLink)) {
      sweet.error({ title: 'Error', text: 'Link Instagram tidak valid' });
      return false;
    }

    try {
      const authorName = session.email?.split('@')[0] || 'user';
      await createLiterasi(session.uid, authorName, data, thumbnailFile, pdfFile);
      
      sweet.toast({
        title: 'Berhasil',
        text: 'Artikel berhasil dibuat',
        icon: 'success',
      });
      
      await fetchLiterasi();
      return true;
    } catch (err) {
      console.error('❌ addLiterasi error:', err);
      sweet.error({ title: 'Error', text: 'Gagal menyimpan' });
      return false;
    }
  };

  // ✏️ Update (tanpa file)
  const editLiterasi = async (
    uid: string, 
    id: string, 
    data: Partial<FormLiterasi>
  ): Promise<boolean> => {
    // Validasi title jika ada
    if (data.title) {
      const titleValid = validateTitle(data.title);
      if (!titleValid.isValid) {
        sweet.error({ title: 'Error', text: titleValid.message });
        return false;
      }
    }

    // Validasi description jika ada
    if (data.description) {
      const descValid = validateDescription(data.description);
      if (!descValid.isValid) {
        sweet.error({ title: 'Error', text: descValid.message });
        return false;
      }
    }

    // Validasi links jika ada
    if (data.tiktokLink && !validateLink(data.tiktokLink)) {
      sweet.error({ title: 'Error', text: 'Link TikTok tidak valid' });
      return false;
    }
    if (data.youtubeLink && !validateLink(data.youtubeLink)) {
      sweet.error({ title: 'Error', text: 'Link YouTube tidak valid' });
      return false;
    }
    if (data.instagramLink && !validateLink(data.instagramLink)) {
      sweet.error({ title: 'Error', text: 'Link Instagram tidak valid' });
      return false;
    }

    try {
      await updateLiterasi(uid, id, data);
      
      sweet.toast({
        title: 'Berhasil',
        text: 'Artikel berhasil diperbarui',
        icon: 'success',
      });
      
      await fetchLiterasi();
      return true;
    } catch (err) {
      console.error('❌ editLiterasi error:', err);
      sweet.error({ title: 'Error', text: 'Gagal mengupdate' });
      return false;
    }
  };

  // ✏️ Update (dengan file)
  const editLiterasiWithFiles = async (
    uid: string, 
    id: string, 
    data: Partial<FormLiterasi>,
    thumbnailFile?: File,
    pdfFile?: File
  ): Promise<boolean> => {
    // Validasi title jika ada
    if (data.title) {
      const titleValid = validateTitle(data.title);
      if (!titleValid.isValid) {
        sweet.error({ title: 'Error', text: titleValid.message });
        return false;
      }
    }

    // Validasi links jika ada
    if (data.tiktokLink && !validateLink(data.tiktokLink)) {
      sweet.error({ title: 'Error', text: 'Link TikTok tidak valid' });
      return false;
    }
    if (data.youtubeLink && !validateLink(data.youtubeLink)) {
      sweet.error({ title: 'Error', text: 'Link YouTube tidak valid' });
      return false;
    }
    if (data.instagramLink && !validateLink(data.instagramLink)) {
      sweet.error({ title: 'Error', text: 'Link Instagram tidak valid' });
      return false;
    }

    try {
      await updateLiterasiWithFiles(uid, id, data, thumbnailFile, pdfFile);
      
      sweet.toast({
        title: 'Berhasil',
        text: 'Artikel berhasil diperbarui',
        icon: 'success',
      });
      
      await fetchLiterasi();
      return true;
    } catch (err) {
      console.error('❌ editLiterasiWithFiles error:', err);
      sweet.error({ title: 'Error', text: 'Gagal mengupdate' });
      return false;
    }
  };

  // 🗑️ Delete - Dynamic Type
  const removeLiterasi = async (
    uid: string, 
    id: string, 
    type: string = 'Artikel'
  ): Promise<boolean> => {
    try {
      await deleteLiterasi(uid, id);
      
      sweet.toast({
        title: 'Berhasil',
        text: `${type} berhasil dihapus`,
        icon: 'success',
      });
      
      await fetchLiterasi();
      return true;
    } catch (err) {
      console.error('❌ removeLiterasi error:', err);
      
      sweet.toast({
        title: 'Gagal',
        text: `${type} gagal dihapus`,
        icon: 'error',
      });
      
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLiterasi();
  }, [fetchLiterasi]);

  return {
    literasiList,
    loading,
    fetchLiterasi,
    getBySlug,
    getByUser,
    getById,
    addLiterasi,
    editLiterasi,
    editLiterasiWithFiles,
    removeLiterasi,
    isAuthenticated: !!session.uid,
    currentUid: session.uid,
  };
};