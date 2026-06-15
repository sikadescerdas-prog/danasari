"use client";

import { FaMapMarkerAlt, FaBoxOpen, FaListUl } from "react-icons/fa";
import { useRouter } from "next/navigation";
import type { UMKMProduct } from "@/modules/dashboard/hooks/useUMKM";

type Store = {
  ownerUid: string;
  nameStore?: string;
  addressStore?: {
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  logo?: { url?: string };
};

type Props = {
  stores: Store[];
  products: UMKMProduct[];
};

export default function UMKMList({ stores, products }: Props) {
  const router = useRouter();

  const getProductCount = (uid: string) =>
    products.filter((p) => p.ownerUid === uid).length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">

        {/* HEADER */}
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="text-left p-3">Nama Toko</th>
            <th className="text-left p-3">Alamat</th>
            <th className="text-center p-3">Total Produk</th>
            <th className="text-center p-3">Link</th>
            <th className="text-right p-3">Aksi</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {stores.map((store) => {
            const count = getProductCount(store.ownerUid);

            return (
              <tr
                key={store.ownerUid}
                className="border-b hover:bg-gray-50"
              >

                {/* STORE INFO */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={store.logo?.url || "/placeholder.png"}
                      className="w-10 h-10 rounded-lg object-cover border"
                      alt={store.nameStore || "store"}
                    />

                    <p className="font-semibold">
                      {store.nameStore || "-"}
                    </p>
                  </div>
                </td>

                {/* ADDRESS */}
                <td className="p-3 text-gray-600">
                  {store.addressStore?.city || "-"}
                </td>

                {/* PRODUCT COUNT */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FaBoxOpen />
                    {count}
                  </div>
                </td>

                {/* MAPS */}
                <td className="p-3 text-center">
                  {store.addressStore?.latitude &&
                  store.addressStore?.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${store.addressStore.latitude},${store.addressStore.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 flex items-center justify-center gap-2"
                    >
                      <FaMapMarkerAlt size={18} />
                      Google Maps
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                {/* ACTION */}
                <td className="p-3 text-right">
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/umkm?id=${store.ownerUid}`)
                      }
                      className="
                        flex items-center gap-2
                        px-3 py-1.5
                        rounded-lg
                        bg-gray-100
                        text-gray-700
                        hover:bg-gray-200
                        hover:text-black
                        transition
                        text-sm
                        font-medium
                      "
                    >
                      <FaListUl size={16} />
                      List Product
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}