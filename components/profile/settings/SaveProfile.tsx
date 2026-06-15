// =========================
// SAVE PROFILE
// =========================

"use client";

import { Save, Loader2 } from "lucide-react";

type Props = {
  loading?: boolean;
  onSave: () => void;
  disabled?: boolean;
};

export default function SaveProfile({ 
  loading = false, 
  onSave, 
  disabled = false 
}: Props) {
  return (
    <button 
      onClick={onSave} 
      disabled={loading || disabled}
      className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20 bg-white/10 blur-xl" />
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Save size={18} />
          <span>Save Profile</span>
        </>
      )}
    </button>
  );
}