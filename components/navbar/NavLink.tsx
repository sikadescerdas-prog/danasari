// components/navbar/NavLink.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  hasDropdown?: boolean;
  dropdownItems?: { href: string; label: string }[];
}

export default function NavLink({ 
  href, 
  label, 
  hasDropdown = false,
  dropdownItems = [] 
}: NavLinkProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  const hasValidDropdown = hasDropdown && dropdownItems.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle click - don't navigate if has valid dropdown
  const handleClick = (e: React.MouseEvent) => {
    if (hasValidDropdown) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Jika ada dropdown dengan items, gunakan button. Jika tidak, gunakan Link */}
      {hasValidDropdown ? (
        <button
          type="button"
          onClick={handleClick}
          className="relative flex items-center cursor-pointer"
        >
          <span className={`
             px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300
            ${isActive 
              ? "text-white bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] shadow-lg shadow-green-500/25" 
              : "text-slate-600 hover:text-[#25C95F] hover:bg-slate-100"
            }
          `}>
            <span className="flex items-center gap-2 whitespace-nowrap">
              {label}
              <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </span>
        </button>
      ) : (
        <Link href={href} className="relative flex items-center">
          <span className={`
            px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300
            ${isActive 
              ? "text-white bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] shadow-lg shadow-green-500/25" 
              : "text-slate-600 hover:text-[#25C95F] hover:bg-slate-100"
            }
          `}>
            <span className="flex items-center gap-1.5">
              {label}
            </span>
          </span>
        </Link>
      )}

      {/* Dropdown */}
      {hasValidDropdown && isOpen && (
        <div className="absolute top-full left-1 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {dropdownItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-green-50 hover:text-[#25C95F] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}