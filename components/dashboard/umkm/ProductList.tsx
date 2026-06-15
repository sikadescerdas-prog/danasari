// components/dashboard/umkm/ProductList.tsx
"use client";

import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import type { UMKMProduct } from "@/modules/dashboard/hooks/useUMKM";

type Props = {
  products?: UMKMProduct[];
};

export default function ProductList({ products }: Props) {
  const router = useRouter();

  const safeProducts = products ?? [];

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700"
        >
          <FaArrowLeft /> Kembali
        </button>

        <h1 className="font-semibold text-lg">
          Daftar Produk UMKM
        </h1>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">Produk</th>
              <th className="text-left p-3">Kategori</th>
              <th className="text-right p-3">Harga</th>
            </tr>
          </thead>

          <tbody>
            {safeProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50"
              >

                {/* PRODUCT */}
                <td className="p-3">
                  <div className="flex items-center gap-3">

                    <img
                      src={product.image?.url}
                      className="w-10 h-10 rounded-lg object-cover border"
                      alt={product.name || "product"}
                    />

                    <p className="font-semibold">
                      {product.name || "Tanpa Nama"}
                    </p>

                  </div>
                </td>

                {/* CATEGORY */}
                <td className="p-3 text-gray-600">
                  {product.category || "-"}
                </td>

                {/* PRICE */}
                <td className="p-3 text-right">
                  {product.price
                    ? `Rp ${product.price.toLocaleString()}`
                    : "-"}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {/* EMPTY STATE */}
        {safeProducts.length === 0 && (
          <p className="text-left text-gray-500 mt-6">
            Tidak ada produk
          </p>
        )}
      </div>
    </div>
  );
}