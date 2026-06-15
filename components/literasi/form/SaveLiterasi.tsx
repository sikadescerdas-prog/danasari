// components/literasi/form/SaveLiterasi.tsx

'use client';

import { Save, Loader2, X } from 'lucide-react';

interface SaveLiterasiProps {
  isEdit?: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export const SaveLiterasi = ({ isEdit, saving, onCancel, onSave }: SaveLiterasiProps) => {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        <X className="w-4 h-4" />
        Batal
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isEdit ? 'Update' : 'Publish'}
          </>
        )}
      </button>
    </div>
  );
};