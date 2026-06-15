"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  showValidIcon?: boolean;
};

export default function InputGoogle({
  label,
  error,
  type,
  value,
  showValidIcon = false,
  id,
  placeholder,
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputId = id || props.name;

  // ✅ Fixed: check dengan !== undefined dan tidak membersihkan koma
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const isError = !!error;
  const isValid = hasValue && !isError && showValidIcon;

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          {...props}
          id={inputId}
          // ✅ Fixed: langsung gunakan value tanpa filter
          value={value ?? ""}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder || ""}
          className={`
            peer w-full px-4 py-3 text-sm bg-white border rounded-xl outline-none transition-all
            border-gray-300 focus:border-green-500
            ${isError ? "border-red-500 focus:border-red-500" : ""}
          `}
        />

        <label
          htmlFor={inputId}
          className={`
            absolute left-3 bg-white px-1 text-sm transition-all pointer-events-none
            -top-2 text-xs
            ${isError ? "text-red-500" : "text-gray-500"}
          `}
        >
          {label}
        </label>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isError && !isPassword && <X className="w-5 h-5 text-red-500" />}
          {!isError && isValid && <Check className="w-5 h-5 text-green-500" />}
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-gray-400 hover:text-green-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
    </div>
  );
}