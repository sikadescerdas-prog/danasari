"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FaSpinner, FaArrowLeft, FaStore } from "react-icons/fa";
import FormProduct from "@/components/marketplace/product/FormProduct";
import { useSellerProductForm } from "@/modules/marketplace/hooks/useForm";

export default function StoreFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams?.get("id") || "";

  const { store, product, loading, error, handleDelete } =
    useSellerProductForm({ editId });

  const handleSuccess = () => {
    router.push("/store");
  };

  const handleCancel = () => {
    router.push("/store");
  };

  // Loading / Waiting Session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-slate-400" size={24} />
      </div>
    );
  }

  // Error: Bukan seller
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <FaStore size={48} className="text-slate-300 mb-4" />
        <p className="text-center text-slate-600 mb-4">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/store/create")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Buka Toko
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border rounded-lg"
          >
            Beranda
          </button>
        </div>
      </div>
    );
  }

  if (!store) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-full"
        >
          <FaArrowLeft />
        </button>
        <h1 className="font-bold">
          {product ? "Edit Produk" : "Tambah Produk"}
        </h1>

        {product && (
          <button onClick={handleDelete} className="ml-auto text-red-500 text-sm">
            Hapus
          </button>
        )}
      </div>

      {/* FORM */}
      <div className="p-4">
        <FormProduct
          store={store}
          initialData={product}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}