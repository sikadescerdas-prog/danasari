"use client";

import { FaStore, FaShoppingBag } from "react-icons/fa";
import type { UMKMProduct } from "@/modules/dashboard/hooks/useUMKM";

type Store = {
  ownerUid: string;
};

type Props = {
  stores: Store[];
  products: UMKMProduct[];
};

export default function UMKMHeader({ stores, products }: Props) {
  const totalStores = stores?.length || 0;
  const totalProducts = products?.length || 0;

  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 px-6 md:px-8 py-6">

      {/* glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
            <FaStore className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-white text-xl font-bold">
              UMKM Marketplace
            </h1>
            <p className="text-white/60 text-sm">
              Data toko & produk sistem
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap gap-3">

          <Stat
            icon={<FaStore className="text-blue-400" />}
            label="Toko"
            value={totalStores}
          />

          <Stat
            icon={<FaShoppingBag className="text-green-400" />}
            label="Produk"
            value={totalProducts}
          />

        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-white">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        {label}: <span className="font-bold">{value}</span>
      </div>
    </div>
  );
} 