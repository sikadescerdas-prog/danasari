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
    `flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition ${
      filterType === type
        ? 'border-green-500 text-green-600'
        : 'border-transparent text-gray-600 hover:text-gray-800'
    }`;

  const getSortClass = (sort: FilterSort) =>
    `flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition w-full md:w-auto ${
      filterSort === sort
        ? 'bg-green-500 text-white border-green-500'
        : 'bg-white text-gray-600 hover:text-gray-800 border-gray-300'
    }`;

  return (
    <div className="w-full bg-white border rounded-lg shadow-sm px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      {/* LEFT - TYPE FILTER */}
      <div className="grid grid-cols-4 md:flex md:flex-wrap items-center gap-2 w-full md:w-auto">
        <button onClick={() => onFilterTypeChange('')} className={`${getTypeClass('')} w-full md:w-auto justify-center`}>
          <List className="w-4 h-4" />
          Semua
        </button>

        <button onClick={() => onFilterTypeChange('berita')} className={`${getTypeClass('berita')} w-full md:w-auto justify-center`}>
          <FileText className="w-4 h-4" />
          Berita
        </button>

        <button onClick={() => onFilterTypeChange('pengumuman')} className={`${getTypeClass('pengumuman')} w-full md:w-auto justify-center`}>
          <Bell className="w-4 h-4" />
          Pengumuman
        </button>

        <button onClick={() => onFilterTypeChange('event')} className={`${getTypeClass('event')} w-full md:w-auto justify-center`}>
          <CalendarDays className="w-4 h-4" />
          Event
        </button>
      </div>

      {/* RIGHT - SORT + RESET */}
      <div className="flex items-center justify-between w-full md:w-auto gap-2">

  {/* LEFT: filter buttons */}
  <div className="flex items-center gap-2">
     <span className="text-sm font-medium text-gray-500 mr-1">
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
      A-Z
    </button>

    <button onClick={() => onFilterSortChange('za')} className={getSortClass('za')}>
      <FaArrowDownAZ className="w-4 h-4" />
      Z-A
    </button>
  </div>

  {/* RIGHT: reset */}
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