"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { structureService } from "@/modules/dashboard/services/villageStructure.service";
import { structureUploadHelper } from "@/modules/dashboard/cloudinary/upload.structure";
import { sweet } from "@/shared/utils/sweet";

import type { StructurePosition } from "@/modules/desa/types/villageStructure.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

/* ================= OPTIONS ================= */

export const STRUCTURE_GENDER_OPTIONS = [
  { value: "laki_laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
];

export const STRUCTURE_TITLE_OPTIONS = [
  { value: "kepala_desa", label: "Kepala Desa" },
  { value: "sekretaris_desa", label: "Sekretaris Desa" },
  { value: "bendahara", label: "Bendahara" },
  { value: "kaur_keuangan", label: "Kaur Keuangan" },
  { value: "kaur_umum", label: "Kaur Umum" },
  { value: "kasi_kesejahteraan", label: "Kasi Kesejahteraan" },
  { value: "kasi_pemerintah", label: "Kasi Pemerintahan" },
  { value: "kasi_pembangunan", label: "Kasi Pembangunan" },
  { value: "kadus", label: "Kadus" },
  { value: "rw", label: "RW" },
  { value: "rt", label: "RT" },
  { value: "bpd", label: "BPD" },
  { value: "karang_taruna", label: "Karang Taruna" },
  { value: "kader_posyandu", label: "Kader Posyandu" },
  { value: "lainnya", label: "Lainnya" },
];

/* ================= HOOK ================= */

export function useVillageStructure() {
  const router = useRouter();
  const [structureList, setStructureList] = useState<StructurePosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadStructure();
  }, []);

  const loadStructure = async () => {
    try {
      setIsLoading(true);
      const data = await structureService.get();
      setStructureList(data);
    } finally {
      setIsLoading(false);
    }
  };

  const redirect = () => {
    router.push("/dashboard/structure");
  };

  // ✅ FOTO OPSIONAL
  const addStructure = async (form: Partial<StructurePosition> & { photoFile?: File }) => {
    try {
      setIsSaving(true);

      // ✅ Validasi nama wajib
      if (!form.name?.trim()) {
        throw new Error("Nama wajib diisi");
      }

      let photo: CloudinaryImage | null = null;

      // Foto hanya diupload jika ada file
      if (form.photoFile) {
        photo = await structureUploadHelper.uploadPhoto(form.photoFile, form.name) as any;
      }

      const structureData = {
        name: form.name.trim(),
        title: form.title,
        gender: form.gender,
        phone: form.phone || "",
        yearJoined: form.yearJoined,
        // ✅ Gunakan null, bukan undefined
        photo,
      };

      await structureService.addStructure(structureData);
      await loadStructure();

      sweet.toast({ title: "Berhasil", text: "Struktur ditambahkan" });
      
      setTimeout(redirect, 500);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const updateStructure = async (
    id: string,
    form: Partial<StructurePosition> & { photoFile?: File; deletePhoto?: boolean }
  ) => {
    try {
      setIsSaving(true);

      const old = structureList.find((s) => s.id === id);
      
      if (!old) {
        throw new Error("Data tidak ditemukan");
      }
      
      // ✅ Foto: null jika dihapus, undefined jika tidak berubah
      let photo: CloudinaryImage | null | undefined = old.photo;
      let hasPhotoChange = false;

      // Hapus photo
      if (form.deletePhoto && old.photo?.publicId) {
        await structureUploadHelper.deletePhoto(old.photo.publicId);
        photo = null; // ✅ null untuk hapus
        hasPhotoChange = true;
      }

      // Upload photo baru
      if (form.photoFile) {
        if (old.photo?.publicId) {
          await structureUploadHelper.deletePhoto(old.photo.publicId);
        }
        photo = await structureUploadHelper.uploadPhoto(form.photoFile, form.name!) as any;
        hasPhotoChange = true;
      }

      // Siapkan data
      const data: any = {
        name: form.name || "",
        title: form.title,
        gender: form.gender,
        phone: form.phone || "",
        yearJoined: form.yearJoined,
      };

      // ✅ Photo: hanya tambah jika ada perubahan
      if (hasPhotoChange) {
        data.photo = photo ?? null;
      }

      await structureService.updateStructure(id, data);
      await loadStructure();

      sweet.toast({ title: "Berhasil", text: "Struktur diperbarui" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStructure = async (id: string, publicId?: string) => {
    try {
      setIsSaving(true);

      if (publicId) {
        await structureUploadHelper.deletePhoto(publicId);
      }

      await structureService.deleteStructure(id);
      await loadStructure();

      sweet.toast({ title: "Berhasil", text: "Struktur dihapus" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    structureList,
    isLoading,
    isSaving,
    addStructure,
    updateStructure,
    deleteStructure,
    reload: loadStructure,
    STRUCTURE_GENDER_OPTIONS,
    STRUCTURE_TITLE_OPTIONS,
  };
}