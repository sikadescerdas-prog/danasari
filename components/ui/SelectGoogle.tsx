"use client";

import React from "react";
import { X } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: Option[];
};

export default function SelectGoogle({
  label,
  error,
  id,
  value,
  options,
  ...props
}: Props) {
  const inputId = id || props.name;

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const isError = !!error;

  return (
    <div className="relative w-full">
      <div className="relative">
        <select
          {...props}
          id={inputId}
          value={hasValue ? value : ""}
          className={`
            peer w-full px-4 py-3 pr-10 text-sm bg-white border rounded-xl outline-none transition-all
            border-gray-300 focus:border-green-500
            ${isError ? "border-red-500 focus:border-red-500" : ""}
          `}
        >
          {/* Placeholder Option */}
          <option value="" disabled>
            {label}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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