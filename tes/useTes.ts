// tes/tes.hook.ts - FINAL

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tesImageService, tesProductService } from "./tes.service";
import { UploadImage } from "./tes.types";

export const MAX_IMAGES = 5;

export function useProductForm(productId?: string) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [images, setImages] = useState<UploadImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ← TAMBAH: tracking gambar yang diapus (belum dihapus dari cloudinary)
  const [deletedImages, setDeletedImages] = useState<UploadImage[]>([]);

  const loadProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const product = await tesProductService.getById(productId);
      if (product) {
        setName(product.name);
        setImages(product.images || []);
        setDeletedImages([]);  // Reset pas load
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleUpload = async (file: File) => {
    if (images.length >= MAX_IMAGES) {
      alert(`Maksimal ${MAX_IMAGES} gambar`);
      return;
    }

    setUploading(true);
    try {
      const imageData = await tesImageService.uploadImage(file);
      setImages((prev) => [...prev, imageData]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // ← FIX: HAPUS DARI STATE + SIMPEN KE DELETED (JANGAN DELETE CLOUDRINARY)
  const removeImage = (index: number) => {
    const img = images[index];
    
    // Simpen ke deletedImages (untuk dihapus pas save)
    if (img?.publicId) {
      setDeletedImages((prev) => [...prev, img]);
    }
    
    // Hapus dari state tampilan aja
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Nama produk wajib diisi");
      return;
    }

    setSaving(true);
    try {
      // ← TAMBAH: Hapus gambar yang dipilih dari cloudinary
      if (deletedImages.length > 0) {
        await tesImageService.deleteMultiple(deletedImages.map((img) => img.publicId));
      }

      if (productId) {
        await tesProductService.update(productId, { name, images });
      } else {
        await tesProductService.create({ name, images });
      }
      router.push("/tes");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!productId || !confirm("Yakin hapus produk ini?")) return;

    setSaving(true);
    try {
      // Hapus SEMUA gambar dari cloudinary
      await tesImageService.deleteMultiple(images.map((img) => img.publicId));
      await tesProductService.delete(productId);
      router.push("/tes");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    images,
    uploading,
    loading,
    saving,
    isEdit: !!productId,
    maxImages: MAX_IMAGES,
    loadProduct,
    handleUpload,
    removeImage,
    handleSave,
    deleteProduct,
  };
}