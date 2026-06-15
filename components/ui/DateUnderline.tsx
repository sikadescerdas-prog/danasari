// components/ui/DateUnderline

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function DateUnderline({
  label,
  error,
  ...props
}: Props) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}

      <input
        type="date"
        {...props}
        className={`
          w-full
          px-1 py-2
          bg-transparent
          border-b
          border-[var(--border)]
          text-[var(--text)]
          text-sm
          outline-none
          transition-all

          focus:border-[var(--primary)]

          ${error ? "border-red-400" : ""}
        `}
      />

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}