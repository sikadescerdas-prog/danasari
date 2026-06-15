"use client";

import React from "react";
import { X } from "lucide-react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export default function TextareaGoogle({
  label,
  error,
  id,
  value,
  placeholder,
  ...props
}: Props) {
  const inputId = id || props.name;

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const isError = !!error;

  return (
    <div className="relative w-full">
      <div className="relative">
        <textarea
          {...props}
          id={inputId}
          value={hasValue ? value : ""}
          placeholder={hasValue ? "" : (placeholder || "")}
          className={`
            peer w-full px-4 py-3 pr-10 text-sm bg-white border rounded-xl outline-none transition-all resize-none
            border-gray-300 focus:border-green-500
            ${isError ? "border-red-500 focus:border-red-500" : ""}
          `}
        />

        {/* LABEL - SELALU FLOAT di atas */}
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

        {/* ERROR ICON */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isError && <X className="w-5 h-5 text-red-500" />}
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
    </div>
  );
}