// modules/marketplace/components/FormProduct.tsx

"use client";

import { IStore } from "@/modules/marketplace/types/store.types";
import { Product } from "@/modules/marketplace/types/product.types";
import { ImgProduct } from "@/components/marketplace/product/ImgProduct";
import { SaveProduct } from "./SaveProduct";
import InputGoogle from "@/components/ui/InputGoogle";
import SelectGoogle from "@/components/ui/SelectGoogle";
import { useProduct } from "@/modules/marketplace/hooks/useProduct";
import { parseRibuan, formatRibuan } from "@/shared/utils/formatRibuan";
import { slugProduct } from "@/modules/marketplace/utils//slugProduct";
import TextareaGoogle from "@/components/ui/TextareaGoogle";

interface Props {
  store: IStore;
  initialData?: Product | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FormProduct({
  store,
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const form = useProduct({
    storeId: store.id,
    storeSlug: store.slug,
    ownerUid: store.ownerUid,
    initialData: initialData ?? null,
    onSuccess,
  });

  const displaySlug = form.name ? slugProduct(form.name) : "";
  const displayPrice = form.price ? formatRibuan(Number(form.price)) : "";
  const isEdit = !!initialData;

  return (
    <div className="space-y-4">
      {/* JUDUL */}
      <div className="text-center pb-4">
        <h1 className="text-xl font-bold text-slate-800">
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </h1>
        <p className="text-sm text-slate-500">
          {store.nameStore}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.submit();
        }}
        className="space-y-4"
      >
        {/* NAME */}
        <InputGoogle
          label="Nama produk"
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
          disabled={form.isBusy}
          placeholder="Contoh: Kerupuk Udang"
        />
        
        {displaySlug && (
          <span className="text-xs text-slate-400 px-3">slug: {displaySlug}</span>
        )}

        {/* DESCRIPTION */}
        <TextareaGoogle
          label="Deskripsi"
          value={form.description}
          onChange={(e) => form.setDescription(e.target.value)}
          disabled={form.isBusy}
          placeholder="Jelaskan produk Anda..."
        />

        {/* CATEGORY */}
        <SelectGoogle
          label="Kategori"
          value={form.category}
          onChange={(e) => form.setCategory(e.target.value)}
          disabled={form.isBusy}
          options={[
            { value: "", label: "Pilih Kategori" },
            { value: "makanan", label: "Makanan" },
            { value: "minuman", label: "Minuman" },
            { value: "snack", label: "Snack" },
            { value: "kerajinan", label: "Kerajinan" },
            { value: "pakaian", label: "Pakaian" },
            { value: "elektronik", label: "Elektronik" },
            { value: "lainnya", label: "Lainnya" },
          ]}
        />

        {/* PRICE + STOCK */}
        <div className="flex gap-3">
          <div className="w-2/3">
            <InputGoogle
              label="Harga"
              type="text"
              value={displayPrice}
              onChange={(e) => form.setPrice(String(parseRibuan(e.target.value)))}
              placeholder="0"
              disabled={form.isBusy}
            />
          </div>
          <div className="w-1/3">
            <InputGoogle
              label="Stok"
              type="number"
              value={form.stock}
              onChange={(e) => form.setStock(e.target.value)}
              placeholder="0"
              disabled={form.isBusy}
            />
          </div>
        </div>

        {/* IMAGES */}
        <ImgProduct
          images={form.imageForms}
          canUpload={form.canUploadImage}
          isUploading={form.uploading}
          onUpload={form.handleUpload}
          onRemove={form.handleRemoveImage}
          onReplace={form.handleReplaceImage}
        />

        {/* ACTION */}
        <SaveProduct
          loading={form.isBusy}
          isEdit={isEdit}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}