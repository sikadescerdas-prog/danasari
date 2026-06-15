// components/profile/MenuProfile.tsx
"use client";

import { ChevronRight } from "lucide-react";

// Export type agar bisa di-import di page.tsx
export type MenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "green" | "emerald";
};

type Props = {
  items: MenuItem[];
};

export function MenuProfile({ items }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <button 
          key={index}
          onClick={item.onClick}
          className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition ${
            item.variant === "emerald" 
              ? "bg-emerald-50 hover:bg-emerald-100" 
              : item.variant === "green"
              ? "bg-green-50 hover:bg-green-100"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className={`font-medium ${
              item.variant === "emerald" ? "text-emerald-700" : item.variant === "green" ? "text-green-700" : "text-gray-700"
            }`}>
              {item.label}
            </span>
          </div>
          <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition" />
        </button>
      ))}
    </div>
  );
}