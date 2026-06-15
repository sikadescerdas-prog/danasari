// components/marketplace/settings/MarketStore.tsx
// =========================
// MARKET STORE
// =========================

"use client";

// HAPUS import phoneToDisplay

interface Props {
  waBusinessInput: string;
  waError: string;
  handleWaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateWaBusiness: () => boolean;
  onWaFocus?: () => void;
  onWaBlur?: () => void;
  shopee: string;
  setShopee: (val: string) => void;
  tiktokShop: string;
  setTiktokShop: (val: string) => void;
  isStoreComplete: boolean;
  loading: boolean;
  handleSave: () => void;
}

export default function MarketStore({ 
  waBusinessInput, 
  waError, 
  handleWaChange, 
  validateWaBusiness,
  onWaFocus,
  onWaBlur,
  shopee, 
  setShopee, 
  tiktokShop, 
  setTiktokShop, 
  isStoreComplete, 
  loading, 
  handleSave 
}: Props) {
  // HAPUS: const waDisplay = phoneToDisplay(waBusinessInput);
  
  const inputClass = "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none";

  return (
    <>
      <hr className="my-4 border-gray-200" />

      {/* MARKETPLACE */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Marketplace</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp Business</label>
            <input 
              type="tel" 
              inputMode="tel" 
              value={waBusinessInput}  // ← langsung dari props
              onChange={handleWaChange} 
              onFocus={() => onWaFocus?.()}
              onBlur={() => {
                validateWaBusiness();
                onWaBlur?.();
              }}
              className={`${inputClass} ${waError ? "border-red-500" : ""}`} 
              placeholder="081234567890"
            />
            {waError && <p className="text-xs text-red-500 mt-1">{waError}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Shopee</label>
            <input type="text" value={shopee} onChange={(e) => setShopee(e.target.value)} className={inputClass} placeholder="@username" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">TikTok Shop</label>
            <input type="text" value={tiktokShop} onChange={(e) => setTiktokShop(e.target.value)} className={inputClass} placeholder="@username" />
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      <button onClick={handleSave} disabled={loading} className="w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 disabled:opacity-50">
        {isStoreComplete ? "Simpan & Aktifkan" : "Simpan"}
      </button>
    </>
  );
}