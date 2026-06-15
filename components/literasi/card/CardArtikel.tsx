// components/literasi/CardArtikel.tsx

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaYoutube, FaTiktok, FaInstagram, FaEdit, FaTrash } from 'react-icons/fa';
import { LITERASI_CATEGORIES } from '@/modules/literasi/types/literasi.type';
import { useSessionStore } from '@/core/auth/store/session.store';
import { formatRelativeTime } from '@/shared/utils/formatRelativeTime';

interface CardArtikelProps {
  item: any;
  onOpenModal: (item: any) => void;
  onDelete?: (uid: string, id: string, type: string) => void;  // ← Prop untuk delete
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  '': { bg: 'bg-gray-100', text: 'text-gray-600' },
  'pendidikan': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'kesehatan': { bg: 'bg-red-100', text: 'text-red-700' },
  'usaha': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'finansial': { bg: 'bg-green-100', text: 'text-green-700' },
  'lingkungan': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'teknologi': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'tips': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'lainnya': { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const getCategoryColor = (categoryValue: string) => {
  return CATEGORY_COLORS[categoryValue] || { bg: 'bg-blue-100', text: 'text-blue-700' };
};

// ← Pure UI Component
export default function CardArtikel({ item, onOpenModal, onDelete }: CardArtikelProps) {
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
    onDelete?.(item.uid, item.id, 'Artikel');  // ← Panggil parent
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  const isOwner = session.uid === item.uid;
  const categoryLabel = LITERASI_CATEGORIES.find(c => c.value === item.category)?.label || item.category;
  const categoryColor = getCategoryColor(item.category);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={() => onOpenModal(item)}
    >
      {/* Mobile: horizontal */}
      <div className="md:block flex">
        {/* Thumbnail - lebih compact */}
        <div className="relative w-52 md:hidden bg-gray-100 shrink-0">
          <div className="aspect-video w-28">
            {item.thumbnail?.url ? (
              <Image src={item.thumbnail.url} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">📰</div>
            )}
          </div>
        </div>
        <div className="w-[1px] bg-gray-200 md:hidden shrink-0" />
        
        {/* Content - Mobile */}
        <div className="flex-1 p-2 flex flex-col justify-between md:hidden min-w-0">
          {/* Row 1: Category | Date + Menu */}
          <div className="flex items-center justify-between mb-1.5">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${categoryColor.bg} ${categoryColor.text} shrink-0`}>
              {categoryLabel}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-gray-400">{formatRelativeTime(item.createdAt)}</span>
              {isOwner && (
                <div className="relative" ref={menuRef}>
                  <button type="button" onClick={toggleMenu} className="p-0.5 hover:bg-gray-100 rounded-full">
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[90px] z-50">
                      <Link href={`/literasi/form?edit=${item.id}&uid=${item.uid}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] hover:bg-gray-100">
                        <FaEdit className="w-2.5 h-2.5" />Edit
                      </Link>
                      <button type="button" onClick={handleDelete} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[10px] text-red-500 hover:bg-gray-100">
                        <FaTrash className="w-2.5 h-2.5" />Hapus
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Row 2: Avatar + AuthorName */}
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[8px] font-semibold text-green-600 shrink-0">
              {item.authorName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="text-[10px] text-gray-500 truncate">{item.authorName || '-'}</span>
          </div>
          
          {/* Row 3: Title */}
          <h3 className="font-medium text-gray-800 text-xs line-clamp-2 mb-1">{item.title}</h3>
          
          {/* Row 4: Description */}
          <p className="text-[10px] text-gray-500 line-clamp-1 mb-1">{item.description}</p>
          
          {/* Row 5: Links - icons only */}
          <div className="flex flex-wrap gap-1 mt-auto">
            {item.youtubeLink && (
              <a href={item.youtubeLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 bg-red-50 text-red-500 rounded">
                <FaYoutube className="w-3 h-3" />
              </a>
            )}
            {item.tiktokLink && (
              <a href={item.tiktokLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 bg-gray-100 text-gray-700 rounded">
                <FaTiktok className="w-3 h-3" />
              </a>
            )}
            {item.instagramLink && (
              <a href={item.instagramLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 bg-pink-50 text-pink-500 rounded">
                <FaInstagram className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Web: vertical */}
      <div className="hidden md:flex flex-col flex-1">
        {/* Thumbnail */}
        <div className="relative bg-gray-100">
          <div className="aspect-[4/3] w-full">
            {item.thumbnail?.url ? (
              <Image src={item.thumbnail.url} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
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
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[90px] z-50">
                  <Link href={`/literasi/form?edit=${item.id}&uid=${item.uid}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] hover:bg-gray-100">
                    <FaEdit className="w-2.5 h-2.5" />Edit
                  </Link>
                  <button type="button" onClick={handleDelete} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[10px] text-red-500 hover:bg-gray-100">
                    <FaTrash className="w-2.5 h-2.5" />Hapus
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-3">
          <div>
            {/* Category + Date */}
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                {categoryLabel}
              </span>
              <span className="text-[10px] text-gray-400">{formatRelativeTime(item.createdAt)}</span>
            </div>
            
            {/* Avatar + AuthorName */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[9px] font-semibold text-green-600">
                {item.authorName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="text-xs text-gray-600">{item.authorName || '-'}</span>
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2">{item.title}</h3>
            
            {/* Description */}
            <p className="text-xs text-gray-500 leading-snug line-clamp-2 mb-3">{item.description}</p>
          </div>
          
          {/* Links - icons */}
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {item.youtubeLink && (
              <a href={item.youtubeLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                <FaYoutube className="w-4 h-4" />
              </a>
            )}
            {item.tiktokLink && (
              <a href={item.tiktokLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <FaTiktok className="w-4 h-4" />
              </a>
            )}
            {item.instagramLink && (
              <a href={item.instagramLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 bg-pink-50 text-pink-500 rounded-lg hover:bg-pink-100">
                <FaInstagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}