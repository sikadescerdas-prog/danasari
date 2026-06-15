// modules/dashboard/hooks/useVillagePotential.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { potentialService } from "@/modules/dashboard/services/villagePotential.service";
import { potentialUploadHelper } from "@/modules/dashboard/cloudinary/upload.potential";
import { sweet } from "@/shared/utils/sweet";

import type { potential } from "@/modules/desa/types/villagePotential.type";
import type { CloudinaryImage } from "@/shared/types/cloudinary.type";

/* ================= OPTIONS ================= */

export const POTENTIAL_CATEGORY_OPTIONS = [
  { value: "umkm", label: "UMKM" },
  { value: "pertanian", label: "Pertanian" },
  { value: "peternakan", label: "Peternakan" },
  { value: "perikiran", label: "Perikiran" },
  { value: "kerajinan", label: "Kerainan" },
  { value: "budaya", label: "Budaya" },
  { value: "sejarah", label: "Sejarah" },
  { value: "kuliner", label: "Kuliner" },
  { value: "objek_wisata", label: "Objek Wisata" },
];

/* ================= HOOK ================= */

export function useVillagePotential() {
  const router = useRouter();
  const [potentialList, setPotentialList] = useState<potential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPotential();
  }, []);

  const loadPotential = async () => {
    try {
      setIsLoading(true);
      const data = await potentialService.get();
      setPotentialList(data);
    } finally {
      setIsLoading(false);
    }
  };

  const redirect = () => {
    router.push("/dashboard/potential");
  };

  const addPotential = async (form: Partial<potential> & { imageFile?: File }) => {
    try {
      setIsSaving(true);

      let image: CloudinaryImage | undefined;

      if (form.imageFile) {
        image = await potentialUploadHelper.uploadPhoto(form.imageFile, form.name!);
      }

      if (!image) {
        throw new Error("Thumbnail wajib diisi");
      }

      const data = {
        name: form.name || "",
        category: form.category || "umkm",
        description: form.description || "",
        address: form.address || "",
        locationUrl: form.locationUrl || "",
        image,
      };

      await potentialService.addPotential(data);
      await loadPotential();

      sweet.toast({ title: "Berhasil", text: "Potensial ditambahkan" });
      
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

  const updatePotential = async (
    id: string,
    form: Partial<potential> & { imageFile?: File; deleteImage?: boolean }
  ) => {
    try {
      setIsSaving(true);

      const old = potentialList.find((p) => p.id === id);
      
      if (!old) {
        throw new Error("Data tidak ditemukan");
      }
      
      let image: CloudinaryImage | undefined = old.image;
      let hasImageChange = false;

      // Klik X → hapus image
      if (form.deleteImage && old.image?.publicId) {
        await potentialUploadHelper.deletePhoto(old.image.publicId);
        image = null as any;
        hasImageChange = true;
      }

      // Upload image baru
      if (form.imageFile) {
        if (old.image?.publicId) {
          await potentialUploadHelper.deletePhoto(old.image.publicId);
        }
        image = await potentialUploadHelper.uploadPhoto(form.imageFile, form.name!);
        hasImageChange = true;
      }

      // Siapkan data, image hanya jika ada perubahan
      const data: any = {
        name: form.name || "",
        category: form.category || "umkm",
        description: form.description || "",
        address: form.address || "",
        locationUrl: form.locationUrl || "",
      };

      if (hasImageChange) {
        data.image = image;
      }

      await potentialService.updatePotential(id, data);
      await loadPotential();

      sweet.toast({ title: "Berhasil", text: "Potential diperbarui" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const deletePotential = async (id: string, publicId?: string) => {
    try {
      setIsSaving(true);

      if (publicId) {
        await potentialUploadHelper.deletePhoto(publicId);
      }

      await potentialService.deletePotential(id);
      await loadPotential();

      sweet.toast({ title: "Berhasil", text: "Potential dihapus" });
      
      setTimeout(redirect, 1000);
    } catch (err: any) {
      sweet.warning({ title: "Gagal", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    potentialList,
    isLoading,
    isSaving,
    addPotential,
    updatePotential,
    deletePotential,
    reload: loadPotential,
    POTENTIAL_CATEGORY_OPTIONS,
  };
}