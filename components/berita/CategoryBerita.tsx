'use client';

import { List, FileText, Bell, CalendarDays, RotateCcw } from 'lucide-react';
import { FaArrowUpAZ, FaArrowDownAZ } from 'react-icons/fa6';

type FilterType = '' | 'berita' | 'pengumuman' | 'event';
type FilterSort = 'newest' | 'oldest' | 'az' | 'za';

interface CategoryBeritaProps {
  filterType: FilterType;
  filterSort: FilterSort;
  onFilterTypeChange: (type: FilterType) => void;
  onFilterSortChange: (sort: FilterSort) => void;
  onResetFilters: () => void;
}

export default function CategoryBerita({
  filterType,
  filterSort,
  onFilterTypeChange,
  onFilterSortChange,
  onResetFilters,
}: CategoryBeritaProps) {

  const getTypeClass = (type: FilterType) =>
    `flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
      filterType === type
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-600 hover:text-gray-800'
    }`;

  const getSortClass = (sort: FilterSort) =>
    `flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition whitespace-nowrap ${
      filterSort === sort
        ? 'bg-green-500 text-white border-green-500'
        : 'bg-white text-gray-600 hover:text-gray-800 border-gray-300'
    }`;

  return (
    <div className="w-full bg-white border rounded-lg shadow-sm px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      {/* TYPE FILTER - HORIZONTAL SCROLL */}
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide md:flex-wrap md:overflow-visible w-full md:w-auto">

        <button onClick={() => onFilterTypeChange('')} className={getTypeClass('')}>
          <List className="w-4 h-4" />
          Semua
        </button>

        <button onClick={() => onFilterTypeChange('berita')} className={getTypeClass('berita')}>
          <FileText className="w-4 h-4" />
          Berita
        </button>

        <button onClick={() => onFilterTypeChange('pengumuman')} className={getTypeClass('pengumuman')}>
          <Bell className="w-4 h-4" />
          Pengumuman
        </button>

        <button onClick={() => onFilterTypeChange('event')} className={getTypeClass('event')}>
          <CalendarDays className="w-4 h-4" />
          Event
        </button>

      </div>

      {/* SORT + RESET */}
      <div className="flex items-center gap-2 justify-between md:justify-end w-full md:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide">

        <span className="text-sm font-medium text-gray-500 hidden md:inline">
          Filter
        </span>

        <button onClick={() => onFilterSortChange('newest')} className={getSortClass('newest')}>
          Terbaru
        </button>

        <button onClick={() => onFilterSortChange('oldest')} className={getSortClass('oldest')}>
          Terlama
        </button>

        <button onClick={() => onFilterSortChange('az')} className={getSortClass('az')}>
          <FaArrowUpAZ className="w-4 h-4" />
           <span className="hidden md:inline">A-Z</span>
        </button>

        <button onClick={() => onFilterSortChange('za')} className={getSortClass('za')}>
          <FaArrowDownAZ className="w-4 h-4" />
            <span className="hidden md:inline">Z-A</span>
        </button>

        <button
          onClick={onResetFilters}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}