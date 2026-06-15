// components/literasi/form/HeaderLiterasi.tsx

'use client';

import { FileText, BookOpen } from 'lucide-react';
import type { LiterasiType } from '@/modules/literasi/types/literasi.type';
import { LITERASI_TYPES } from '@/modules/literasi/types/literasi.type';

interface HeaderLiterasiProps {
  type: LiterasiType;
  onTypeChange: (type: LiterasiType) => void;
  isEditing?: boolean;
}

export const HeaderLiterasi = ({
  type,
  onTypeChange,
  isEditing = false,
}: HeaderLiterasiProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Tipe Konten</label>
        <div className="flex gap-3">
          {LITERASI_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => !isEditing && onTypeChange(item.value as LiterasiType)}
              disabled={isEditing}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                type === item.value
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item.value === 'artikel' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <BookOpen className="w-5 h-5" />
              )}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};