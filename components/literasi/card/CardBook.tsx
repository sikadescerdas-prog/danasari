// components/literasi/CardBook.tsx

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash, FaBookOpen } from 'react-icons/fa';
import { useSessionStore } from '@/core/auth/store/session.store';
import { formatRelativeTime } from '@/shared/utils/formatRelativeTime';

interface CardBookProps {
  item: any;
  onOpenModal: (item: any) => void;
  onDelete?: (uid: string, id: string, type: string) => void;  // ← TAMBAHKAN
}

// ← Pure UI Component
export default function CardBook({ item, onOpenModal, onDelete }: CardBookProps) {
  const { session } = useSessionStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ← HANYA PASS DATA, LOGIC DI PARENT
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.(item.uid, item.id, 'Buku');  // ← Panggil parent
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  const isOwner = session.uid === item.uid;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={() => onOpenModal(item)}
    >
      {/* Mobile: horizontal */}
      <div className="md:block flex">
        <div className="relative w-52 md:hidden bg-gray-100 shrink-0">
          <div className="aspect-video w-28">
            {item.thumbnail?.url ? (
              <Image src={item.thumbnail.url} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
            )}
          </div>
        </div>
        <div className="w-[1px] bg-gray-200 md:hidden shrink-0" />
        
        <div className="flex-1 p-3 flex flex-col justify-between md:hidden min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-600 shrink-0">Buku</span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-gray-400">{formatRelativeTime(item.createdAt)}</span>
              {isOwner && (
                <div className="relative" ref={menuRef}>
                  <button type="button" onClick={toggleMenu} className="p-1 hover:bg-gray-100 rounded-full">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[110px] z-50">
                      <Link href={`/literasi/form?edit=${item.id}&uid=${item.uid}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-100">
                        <FaEdit className="w-3 h-3 text-gray-500" />Edit
                      </Link>
                      <button type="button" onClick={handleDelete} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-gray-100">
                        <FaTrash className="w-3 h-3" />Hapus
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[8px] font-semibold text-green-600 shrink-0">
              {item.authorName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="text-[10px] text-gray-500 truncate">{item.authorName || '-'}</span>
          </div>
          
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">{item.title}</h3>
          <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{item.description}</p>
          
          <button type="button" onClick={(e) => { e.stopPropagation(); onOpenModal(item); }} className="flex items-center gap-1 text-[9px] text-green-500 mt-auto hover:underline">
            <span>Klik di sini selengkapnya</span>
          </button>
        </div>
      </div>
      
      {/* Web: vertical */}
      <div className="hidden md:flex flex-col flex-1">
        <div className="relative bg-gray-100">
          <div className="aspect-[4/3] w-full">
            {item.thumbnail?.url ? (
              <Image src={item.thumbnail.url} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
            )}
          </div>
          {isOwner && (
            <div className="absolute top-2 right-2 z-10" ref={menuRef}>
              <button type="button" onClick={toggleMenu} className="bg-white/90 p-1.5 rounded-full hover:bg-white shadow">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[110px] z-50">
                  <Link href={`/literasi/form?edit=${item.id}&uid=${item.uid}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-100">
                    <FaEdit className="w-3 h-3 text-gray-500" />Edit
                  </Link>
                  <button type="button" onClick={handleDelete} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-gray-100">
                    <FaTrash className="w-3 h-3" />Hapus
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between p-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-600">Buku</span>
              <span className="text-[10px] text-gray-400">{formatRelativeTime(item.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[9px] font-semibold text-green-600">
                {item.authorName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="text-xs text-gray-600">{item.authorName || '-'}</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-snug line-clamp-2">{item.description}</p>
          </div>
          <div className="mt-auto pt-2">
            <button type="button" onClick={(e) => { e.stopPropagation(); onOpenModal(item); }} className="flex items-center gap-1 text-xs text-green-500 hover:underline">
              <span>Klik di sini selengkapnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}