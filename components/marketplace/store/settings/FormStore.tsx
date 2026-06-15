// components/marketplace/settings/FormStore.tsx
// =========================
// FORM STORE
// =========================

"use client";

interface Props {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
}

export default function FormStore({ name, setName, description, setDescription, address, setAddress, city, setCity }: Props) {
  return (
    <>
      {/* NAMA TOKO */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Toko <span className="text-red-500">*</span>
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Nama Toko Anda" />
      </div>

      {/* DESKRIPSI */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span className="text-red-500">*</span></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Deskripsi toko..." />
      </div>

      <hr className="my-4 border-gray-200" />

      {/* ALAMAT TOKO */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Toko</label>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Alamat <span className="text-red-500">*</span>
          </label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Jl. Contoh No.123" />
        </div>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Kota <span className="text-red-500">*</span>
          </label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="Jakarta Selatan" />
        </div>
      </div>
    </>
  );
}