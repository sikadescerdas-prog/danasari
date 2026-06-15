"use client";

import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function SelectUnderline({
  className = "",
  children,
  ...props
}: Props) {
  return (
    <div className="relative w-full">
      
      {/* SELECT */}
      <select
        {...props}
        className={`
          w-full

          border-0
          rounded-none
          shadow-none
          bg-transparent

          border-b-2 border-green-500

          outline-none
          focus:outline-none
          focus:ring-0

          text-gray-800
          leading-normal

          appearance-none

          py-2
          pl-1
          pr-8

          min-h-[38px]

          ${className}
        `}
      >
        {children}
      </select>

      {/* ICON */}
      <ChevronDown
        size={16}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}