// modules/marketplace/components/SaveProduct.tsx

"use client";

import { FaSave, FaSpinner } from "react-icons/fa";

interface SaveProductProps {
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function SaveProduct({
  loading = false,
  isEdit = false,
  onCancel,
}: SaveProductProps) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="submit"
        disabled={loading}
        className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <FaSpinner className="animate-spin" size={18} />
        ) : (
          <FaSave size={18} />
        )}
        {isEdit ? "Update" : "Simpan"}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border rounded-lg font-medium disabled:opacity-50"
        >
          Batal
        </button>
      )}
    </div>
  );
}