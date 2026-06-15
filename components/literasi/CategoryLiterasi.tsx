// components/literasi/CategoryLiterasi.tsx

import { useState } from 'react';
import { User, BookOpen, FileText, List, RotateCcw, Clock, ChevronDown } from 'lucide-react';
import { FaArrowUpAZ, FaArrowDownZA } from "react-icons/fa6";
import { LITERASI_CATEGORIES } from '@/modules/literasi/types/literasi.type';

type FilterOption = 'newest' | 'oldest' | 'az' | 'za';

interface CategoryLiterasiProps {
  filterType: string;
  filterCategory: string;
  filterSort: FilterOption;
  filterOwner: boolean;
  isLoggedIn: boolean;
  onFilterTypeChange: (type: string) => void;
  onFilterCategoryChange: (category: string) => void;
  onFilterSortChange: (sort: FilterOption) => void;
  onFilterOwnerChange: (owner: boolean) => void;
  onResetFilters: () => void;
}

export default function CategoryLiterasi({
  filterType,
  filterCategory,
  filterSort,
  filterOwner,
  isLoggedIn,
  onFilterTypeChange,
  onFilterCategoryChange,
  onFilterSortChange,
  onFilterOwnerChange,
  onResetFilters,
}: CategoryLiterasiProps) {
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleCategoryChange = (value: string) => {
    onFilterCategoryChange(value);
    if (value) {
      onFilterTypeChange('');
    }
    setIsCategoryOpen(false);
  };

  const handleFilterType = (type: string) => {
    onFilterTypeChange(type);
    if (type) {
      onFilterCategoryChange('');
    }
    setIsCategoryOpen(false);
  };

  const handleReset = () => {
    onResetFilters();
    setIsSortOpen(false);
    setIsCategoryOpen(false);
  };

  const handleSortSelect = (sort: FilterOption) => {
    onFilterSortChange(sort);
    setIsSortOpen(false);
  };

  const isAllActive = !filterType && !filterCategory && !filterOwner;
  const isFilterActive = filterSort !== 'newest';
  const isCategoryActive = !!filterCategory;
  const showKategori = filterType !== 'buku';

  const getSortLabel = () => {
    if (filterSort === 'newest') return 'Terbaru';
    if (filterSort === 'oldest') return 'Terlama';
    if (filterSort === 'az') return 'Sort A-Z';
    if (filterSort === 'za') return 'Sort Z-A';
    return 'Terbaru';
  };

  const getCategoryLabel = () => {
    if (!filterCategory) return 'Kategori';
    const cat = LITERASI_CATEGORIES.find(c => c.value === filterCategory);
    return cat ? cat.label : 'Kategori';
  };

  const getFilterIcon = (isActive: boolean) => {
    const iconClass = `w-4 h-4 ${isActive ? 'text-white' : 'text-gray-800'}`;
    if (filterSort === 'newest' || filterSort === 'oldest') return <Clock className={iconClass} />;
    if (filterSort === 'az') return <FaArrowUpAZ className={iconClass} />;
    if (filterSort === 'za') return <FaArrowDownZA className={iconClass} />;
    return <Clock className={iconClass} />;
  };

  const getButtonClass = (isActive: boolean) => 
    `flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-green-500 text-white border-white' 
        : 'bg-white text-gray-800 border-green-300 hover:bg-gray-50'
      }`;

  const getSortIconClass = (isActive: boolean) => `w-4 h-4 ${isActive ? 'text-white' : 'text-gray-800'}`;

  const getNavClass = (isActive: boolean) => 
    `text-sm font-medium transition-colors flex items-center gap-2 mt-2 pb-1 border-b-2 
      ${isActive ? 'border-green-500 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`;

  const getIconBtnClass = (isActive: boolean) => 
    `p-2 rounded-lg border text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-green-500 text-white border-white' 
        : 'bg-white text-gray-800 border-green-300 hover:bg-gray-50'
      }`;

  return (
    <div className="w-full">
      
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col w-full gap-3 px-3 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
        
        {/* Row 1: Semua | Artikel | Buku | Postingan Saya */}
        <div className="flex items-center justify-between gap-2 w-full">
          <button onClick={() => handleFilterType('')} className={getNavClass(isAllActive)}>
            <List className="w-4 h-4" />
            Semua
          </button>
          <span className="text-gray-400">|</span>
          <button onClick={() => handleFilterType('artikel')} className={getNavClass(filterType === 'artikel')}>
            <FileText className="w-4 h-4" />
            Artikel
          </button>
          <span className="text-gray-400">|</span>
          <button onClick={() => handleFilterType('buku')} className={getNavClass(filterType === 'buku')}>
            <BookOpen className="w-4 h-4" />
            Buku
          </button>
          <span className="text-gray-400">|</span>  
          {isLoggedIn && (
            <button onClick={() => onFilterOwnerChange(!filterOwner)} className={getNavClass(filterOwner)}>
              <User className="w-4 h-4" />
              Postingan Saya
            </button>
          )}
        </div>

        {/* Row 2: Kategori | Filter | Reset */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-sm font-medium text-gray-600 mr-2">Filter</span>
          {showKategori && (
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={getButtonClass(isCategoryActive)}
              >
                <div className="flex items-center gap-2">
                  {getCategoryLabel()}
                </div>
                <ChevronDown className={getSortIconClass(isCategoryActive)} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  <button 
                    onClick={() => handleCategoryChange('')} 
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${!filterCategory ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    Semua Kategori
                  </button>
                  {LITERASI_CATEGORIES.filter((c) => c.value).map((item) => (
                    <button 
                      key={item.value} 
                      onClick={() => handleCategoryChange(item.value)} 
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterCategory === item.value ? 'bg-gray-100 font-medium' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={getButtonClass(isFilterActive)}
            >
              <div className="flex items-center gap-2">
                {getFilterIcon(isFilterActive)}
                {getSortLabel()}
              </div>
              <ChevronDown className={getSortIconClass(isFilterActive)} />
            </button>

            {isSortOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button 
                  onClick={() => handleSortSelect('newest')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'newest' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <Clock className="w-4 h-4" /> Terbaru
                </button>
                <button 
                  onClick={() => handleSortSelect('oldest')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'oldest' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <Clock className="w-4 h-4" /> Terlama
                </button>
                <button 
                  onClick={() => handleSortSelect('az')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'az' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <FaArrowUpAZ className="w-4 h-4" /> A-Z
                </button>
                <button 
                  onClick={() => handleSortSelect('za')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'za' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <FaArrowDownZA className="w-4 h-4" /> Z-A
                </button>
              </div>
            )}
          </div>

          <button onClick={handleReset} className="p-2 rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50" title="Reset Filter">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-wrap justify-between items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
        
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => handleFilterType('')} className={getNavClass(isAllActive)}>
            <List className="w-4 h-4" />
            Semua
          </button>
          <span className="text-gray-400">|</span>
          <button onClick={() => handleFilterType('artikel')} className={getNavClass(filterType === 'artikel')}>
            <FileText className="w-4 h-4" />
            Artikel
          </button>
          <span className="text-gray-400">|</span>
          <button onClick={() => handleFilterType('buku')} className={getNavClass(filterType === 'buku')}>
            <BookOpen className="w-4 h-4" />
            Buku
          </button>
          <span className="text-gray-400">|</span>
          {isLoggedIn && (
            <button onClick={() => onFilterOwnerChange(!filterOwner)} className={getNavClass(filterOwner)}>
              <User className="w-4 h-4" />
              Postingan Saya
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Filter</span>

          {showKategori && (
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={getButtonClass(isCategoryActive)}
              >
                <div className="flex items-center gap-2">
                  {getCategoryLabel()}
                </div>
                <ChevronDown className={getSortIconClass(isCategoryActive)} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <button 
                    onClick={() => handleCategoryChange('')} 
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${!filterCategory ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    Semua Kategori
                  </button>
                  {LITERASI_CATEGORIES.filter((c) => c.value).map((item) => (
                    <button 
                      key={item.value} 
                      onClick={() => handleCategoryChange(item.value)} 
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterCategory === item.value ? 'bg-gray-100 font-medium' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={getButtonClass(isFilterActive)}
            >
              <div className="flex items-center gap-2">
                {getFilterIcon(isFilterActive)}
                {getSortLabel()}
              </div>
              <ChevronDown className={getSortIconClass(isFilterActive)} />
            </button>

            {isSortOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <button 
                  onClick={() => handleSortSelect('newest')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'newest' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <Clock className="w-4 h-4 text-gray-800" /> Terbaru
                </button>
                <button 
                  onClick={() => handleSortSelect('oldest')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'oldest' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <Clock className="w-4 h-4 text-gray-800" /> Terlama
                </button>
                <button 
                  onClick={() => handleSortSelect('az')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'az' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <FaArrowUpAZ className="w-4 h-4 text-gray-800" /> Sort A-Z
                </button>
                <button 
                  onClick={() => handleSortSelect('za')} 
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 ${filterSort === 'za' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  <FaArrowDownZA className="w-4 h-4 text-gray-800" /> Sort Z-A
                </button>
              </div>
            )}
          </div>

          <button onClick={handleReset} className="p-2 rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50" title="Reset Filter">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}