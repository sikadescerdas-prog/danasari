"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { facilityService } from "@/modules/dashboard/services/villageFacility.service";
import { facilityUploadHelper } from "@/modules/dashboard/cloudinary/upload.facility";
import { sweet } from "@/shared/utils/sweet";

import type { Facility } from "@/modules/desa/types/villageFacility.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

/* ================= OPTIONS ================= */

export const FACILITY_CATEGORY_OPTIONS = [
  { value: "pendidikan", label: "Pendidikan" },
  { value: "ibadah", label: "Ibadah" },
  { value: "umum", label: "Umum" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "ekonomi", label: "Ekonomi" },
];

export const FACILITY_TYPE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  pendidikan: [
    { value: "paud", label: "PAUD" },
    { value: "tk", label: "TK" },
    { value: "sd", label: "SD" },
    { value: "smp", label: "SMP" },
    { value: "sma", label: "SMA" },
    { value: "smk", label: "SMK" },
    { value: "pt", label: "Perguruan Tinggi" },
    { value: "ponpes", label: "Pondok Pesantren" },
  ],
  ibadah: [
    { value: "masjid", label: "Masjid" },
    { value: "mushola", label: "Mushola" },
    { value: "gereja", label: "Gereja" },
    { value: "pura", label: "Pura" },
    { value: "vihara", label: "Vihara" },
    { value: "klenteng", label: "Klenteng" },
  ],
  umum: [
    { value: "kantor_desa", label: "Kantor Desa" },
    { value: "balai_desa", label: "Balai Desa" },
    { value: "bal_rw", label: "BAL RW" },
    { value: "poskamling", label: "Poskamling" },
    { value: "lapangan", label: "Lapangan" },
  ],
  kesehatan: [
    { value: "puskesmas", label: "Puskesmas" },
    { value: "pustu", label: "Pustu" },
    { value: "klinik", label: "Klinik" },
    { value: "posyandu", label: "Posyandu" },
  ],
  ekonomi: [
    { value: "pasar", label: "Pasar" },
    { value: "toko", label: "Toko" },
    { value: "koperasi", label: "Koperasi" },
    { value: "bumdes", label: "BUMDES" },
  ],
};

export const getTypeOptions = (category: string): { value: string; label: string }[] => {
  return FACILITY_TYPE_OPTIONS[category] || [];
};

export const getTypeLabel = (type: string): string => {
  for (const options of Object.values(FACILITY_TYPE_OPTIONS)) {
    const found = options.find(o => o.value === type);
    if (found) return found.label;
  }
  return type;
};

/* ================= HOOK ================= */

export function useVillageFacility() {
  const router = useRouter();
  const [facilityList, setFacilityList] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadFacility();
  }, []);

  const loadFacility = async () => {
    try {
      setIsLoading(true);
      const data = await facilityService.get();
      setFacilityList(data);
    } finally {
      setIsLoading(false);
    }
  };

  const redirect = () => {
    router.push("/dashboard/facility");
  };

  const addFacility = async (form: Partial<Facility> & { photoFile?: File }) => {
    try {
      setIsSaving(true);

      let photo: CloudinaryImage | undefined;

      if (form.photoFile) {
        photo = await facilityUploadHelper.uploadPhoto(form.photoFile, form.name!);
      }

      if (!photo) {
        throw new Error("Thumbnail wajib diisi");
      }

      const data = {
        name: form.name || "",
        address: form.address || "",
        photo,
        category: form.category || "umum",
        type: form.type,
        locationUrl: form.locationUrl || "",
      };

      await facilityService.addFacility(data);
      await loadFacility();

      sweet.toast({ title: "Berhasil", text: "Fasilitas ditambahkan" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      let message = err.message;

      if (message.includes("photo") || message.includes("value argument contains")) {
        message = "Thumbnail wajib diisi";
      }

      sweet.warning({ title: "Gagal", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFacility = async (
    id: string,
    form: Partial<Facility> & { photoFile?: File; deletePhoto?: boolean }
  ) => {
    try {
      setIsSaving(true);

      const old = facilityList.find((f) => f.id === id);
      
      if (!old) {
        throw new Error("Data tidak ditemukan");
      }
      
      let photo: CloudinaryImage | undefined = old.photo;
      let hasPhotoChange = false;

      // Klik X → hapus foto
      if (form.deletePhoto && old.photo?.publicId) {
        await facilityUploadHelper.deletePhoto(old.photo.publicId);
        photo = null as any;
        hasPhotoChange = true;
      }

      // Upload foto baru
      if (form.photoFile) {
        if (old.photo?.publicId) {
          await facilityUploadHelper.deletePhoto(old.photo.publicId);
        }
        photo = await facilityUploadHelper.uploadPhoto(form.photoFile, form.name!);
        hasPhotoChange = true;
      }

      // Siapkan data, photo hanya jika ada perubahan
      const data: any = {
        name: form.name || "",
        address: form.address || "",
        category: form.category || "umum",
        type: form.type,
        locationUrl: form.locationUrl || "",
      };

      if (hasPhotoChange) {
        data.photo = photo;
      }

      await facilityService.updateFacility(id, data);
      await loadFacility();

      sweet.toast({ title: "Berhasil", text: "Fasilitas diperbarui" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteFacility = async (id: string, publicId?: string) => {
    try {
      setIsSaving(true);

      if (publicId) {
        await facilityUploadHelper.deletePhoto(publicId);
      }

      await facilityService.deleteFacility(id);
      await loadFacility();

      sweet.toast({ title: "Berhasil", text: "Fasilitas dihapus" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    facilityList,
    isLoading,
    isSaving,
    addFacility,
    updateFacility,
    deleteFacility,
    reload: loadFacility,
    FACILITY_CATEGORY_OPTIONS,
    getTypeOptions,
    getTypeLabel,
  };
}