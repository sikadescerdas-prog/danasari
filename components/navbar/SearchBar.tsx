// components/navbar/SearchBar.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Cari..." }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const basePath = pathname.split("?")[0];
      router.push(`${basePath}?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group p-2.5 rounded-full hover:bg-slate-100 transition-all duration-300"
        >
          <svg 
            className="w-5 h-5 text-slate-400 group-hover:text-[#25C95F] transition-all duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      ) : (
        <>
          {/* Subtle backdrop blur */}
          <div 
            className="fixed inset-0 bg-slate-100/60 backdrop-blur-sm -z-10 animate-in fade-in duration-300" 
            onClick={() => { setIsOpen(false); setQuery(""); }}
          />
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 md:w-80 z-20">
            <form 
              onSubmit={handleSearch} 
              className="flex items-center gap-2.5 bg-white rounded-full shadow-xl shadow-black/[0.08] border border-slate-200/60 px-3 py-1.5 animate-in slide-in-from-right-4 fade-in duration-300"
            >
              <svg className="w-4 h-4 text-[#7AF3AE] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 py-1.5 text-sm outline-none bg-transparent placeholder:text-slate-400 text-slate-700"
              />
              <button
                type="button"
                onClick={() => { setIsOpen(false); setQuery(""); }}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}