'use client';

import { useMemo, useState } from 'react';

import HeaderBerita from '@/components/berita/HeaderBerita';
import CategoryBerita from '@/components/berita/CategoryBerita';
import ListBerita from '@/components/berita/ListBerita';

import { useVillageNews  } from '@/modules/dashboard/hooks/useVillageNews';
import type {
  News,
  NewsType,
} from '@/modules/desa/types/villageNews.type';

type FilterOption = 'newest' | 'oldest' | 'az' | 'za';

export default function BeritaPage() {
  const { newsList } = useVillageNews ();

  const [filterType, setFilterType] = useState<NewsType | ''>('');
  const [filterSort, setFilterSort] =
    useState<FilterOption>('newest');

  const filteredList = useMemo(() => {
    return [...newsList]
      .filter((item: News) => {
        if (filterType && item.type !== filterType) {
          return false;
        }

        return true;
      })
      .sort((a: News, b: News) => {
        switch (filterSort) {
          case 'az':
            return a.title.localeCompare(b.title);

          case 'za':
            return b.title.localeCompare(a.title);

          case 'oldest':
            return a.date - b.date;

          case 'newest':
          default:
            return b.date - a.date;
        }
      });
  }, [newsList, filterType, filterSort]);

  const resetFilters = () => {
    setFilterType('');
    setFilterSort('newest');
  };

  const handleFilterTypeChange = (type: NewsType | '') => {
    setFilterType(type);
  };

  const handleFilterSortChange = (sort: FilterOption) => {
    setFilterSort(sort);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-0">
      <div className="mx-auto max-w-7xl">
        <HeaderBerita />

        <CategoryBerita
          filterType={filterType}
          filterSort={filterSort}
          onFilterTypeChange={handleFilterTypeChange}
          onFilterSortChange={handleFilterSortChange}
          onResetFilters={resetFilters}
        />

        <ListBerita
          filteredList={filteredList}
          filterType={filterType}
        />
      </div>
    </div>
  );
}