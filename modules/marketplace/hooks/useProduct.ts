// modules/marketplace/hooks/product/useProduct.ts

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { productImageService, productService } from "@/modules/marketplace/services/product.service";
import type { Product, ProductFormData, ImageForm } from "@/modules/marketplace/types/product.types";
import { CloudinaryImage } from "@/shared/types/cloudinary.type";
import sweet from "@/shared/utils/sweet";

export const MAX_IMAGES = 5;

interface UseProductOptions {
  storeId: string;
  storeSlug: string;
  ownerUid: string;
  initialData?: Product | null;
  onSuccess?: () => void;
}

export function useProduct({
  storeId,
  storeSlug,
  ownerUid,
  initialData,
  onSuccess,
}: UseProductOptions) {
  const router = useRouter();

  // Form state
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [stock, setStock] = useState(initialData?.stock ? String(initialData.stock) : "1");
  
  // Images dari DB (sudah ada url)
  const [existingImages, setExistingImages] = useState<CloudinaryImage[]>(initialData?.images || []);
  
  // File baru (belum diupload)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const [uploading, setUploading] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Track deleted images
  const [deletedImages, setDeletedImages] = useState<CloudinaryImage[]>([]);

  // Combined images (untuk preview)
  const images: CloudinaryImage[] = useMemo(() => {
    const newPreviews = newImageFiles.map((file) => ({
      publicId: "",
      url: URL.createObjectURL(file),
    }));
    return [...existingImages, ...newPreviews];
  }, [existingImages, newImageFiles]);

  // ImageForms untuk ImgProduct
  const imageForms: ImageForm[] = useMemo(() => 
    images.map((img, idx) => ({
      id: img.publicId || `temp-${idx}`,
      url: img.url,
    })), 
    [images]
  );

  // canUpload: nama sudah diisi & belum max
  const canUploadImage = useMemo(() => 
    name.trim() !== "" && images.length < MAX_IMAGES,
    [name, images.length]
  );

  /* ----- HANDLERS ----- */

  const handleUpload = useCallback(async (files: FileList) => {
    if (!name.trim()) {
      sweet.warning({
        title: "Oops!",
        text: "Isi nama produk dulu",
      });
      return;
    }

    if (images.length >= MAX_IMAGES) {
      sweet.warning({
        title: "Maksimal",
        text: `Hanya ${MAX_IMAGES} gambar diperbolehkan`,
      });
      return;
    }

    const file = files[0];
    if (!file) return;

    setNewImageFiles((prev) => [...prev, file]);
  }, [name, images.length]);

  const handleRemoveImage = useCallback((index: number) => {
    const existingCount = existingImages.length;
    
    if (index < existingCount) {
      const img = existingImages[index];
      if (img?.publicId) {
        setDeletedImages((prev) => [...prev, img]);
      }
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingCount;
      setNewImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
    }
  }, [existingImages]);

  const handleReplaceImage = useCallback((index: number, file: File) => {
    const existingCount = existingImages.length;
    
    if (index < existingCount) {
      const oldImage = existingImages[index];
      if (oldImage?.publicId) {
        setDeletedImages((prev) => [...prev, oldImage]);
      }
      setNewImageFiles((prev) => [...prev, file]);
    } else {
      const newIndex = index - existingCount;
      setNewImageFiles((prev) => {
        const updated = [...prev];
        updated[newIndex] = file;
        return updated;
      });
    }
  }, [existingImages]);

  const handlePriceChange = useCallback((value: string) => {
    const numeric = value.replace(/[^\d]/g, "");
    setPrice(numeric);
  }, []);

  const handleStockChange = useCallback((value: string) => {
    const numeric = value.replace(/[^\d]/g, "");
    setStock(numeric);
  }, []);

  const submit = useCallback(async () => {
    if (!name.trim()) {
      sweet.warning({
        title: "Oops!",
        text: "Nama produk wajib diisi",
      });
      return;
    }

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      sweet.warning({
        title: "Oops!",
        text: "Minimal 1 gambar",
      });
      return;
    }

    if (!category) {
      sweet.warning({
        title: "Oops!",
        text: "Pilih kategori",
      });
      return;
    }

    setIsBusy(true);
    try {
      // Hapus gambar yang di-remove
      if (deletedImages.length > 0) {
        await productImageService.deleteMultiple(
          deletedImages.map((img) => img.publicId)
        );
      }

      const formData: ProductFormData = {
        name,
        description,
        category,
        price,
        stock,
        imageFiles: newImageFiles,
        images: existingImages,
      };

      if (initialData?.id) {
        await productService.update(
          storeId,
          initialData.id,
          ownerUid,
          formData
        );
      } else {
        await productService.create(
          storeId,
          storeSlug,
          ownerUid,
          formData
        );
      }

      sweet.success({
        title: initialData?.id ? "Berhasil!" : "Berhasil!",
        text: initialData?.id ? "Produk berhasil diperbarui" : "Produk berhasil dibuat",
        timer: 2000,
      }).then(() => {
        router.push(`/store/${storeSlug}`);
      });

      onSuccess?.();
      router.refresh();
    } catch (err) {
      console.error("Save failed:", err);
      sweet.error({
        title: "Gagal!",
        text: "Terjadi kesalahan, coba lagi",
      });
    } finally {
      setIsBusy(false);
    }
  }, [name, description, category, price, stock, newImageFiles, existingImages, deletedImages, initialData, storeId, storeSlug, ownerUid, onSuccess, router]);

  const remove = useCallback(async () => {
    if (!initialData?.id) return;

    const isConfirmed = await sweet.confirmWarning({
      title: "Yakin hapus?",
      text: "Produk akan dihapus permanen",
      confirmButtonText: "Hapus",
      cancelText: "Batal",
    });

    if (!isConfirmed) return;

    setIsBusy(true);
    try {
      // ✅ Kirim ownerUid juga
      await productService.remove(storeId, initialData.id, ownerUid);
      
      sweet.success({
        title: "Dihapus!",
        text: "Produk berhasil dihapus",
        timer: 2000,
      }).then(() => {
        router.push(`/store/${storeSlug}`);
      });

      onSuccess?.();
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
      sweet.error({
        title: "Gagal!",
        text: "Terjadi kesalahan",
      });
    } finally {
      setIsBusy(false);
    }
  }, [initialData, storeId, storeSlug, ownerUid, onSuccess, router]);

  return {
    // State
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    price,
    setPrice: handlePriceChange,
    stock,
    setStock: handleStockChange,
    images,
    imageForms,
    canUploadImage,

    // Status
    uploading,
    isBusy,
    isEdit: !!initialData?.id,
    maxImages: MAX_IMAGES,

    // Handlers
    handleUpload,
    handleRemoveImage,
    handleReplaceImage,
    submit,
    remove,
  };
}