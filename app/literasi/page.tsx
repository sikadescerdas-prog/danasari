// app/literasi/page.tsx

'use client';

import { useState, useMemo } from 'react';
import HeaderLiterasi from '@/components/literasi/HeaderLiterasi';
import CategoryLiterasi from '@/components/literasi/CategoryLiterasi';
import ListLiterasi from '@/components/literasi/ListLiterasi';
import BacaUMP from '@/components/literasi/BacaUMP';
import { useLiterasi } from '@/modules/literasi/hooks/useLiterasi';
import { useSessionStore } from '@/core/auth/store/session.store';
import type { Literasi } from '@/modules/literasi/types/literasi.type';

type FilterOption = 'newest' | 'oldest' | 'az' | 'za';

export default function LiterasiPage() {
  const { session } = useSessionStore();
  const isLoggedIn = !!session?.uid;
  const { literasiList, loading } = useLiterasi();
  
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterSort, setFilterSort] = useState<FilterOption>('newest');
  const [filterOwner, setFilterOwner] = useState<boolean>(false);

  // Filter & Sort - useMemo untuk performa
  const filteredList = useMemo(() => {
    return literasiList
      .filter((item: Literasi) => {
        // Filter by type
        if (filterType && item.type !== filterType) return false;
        
        // Filter by category (jika bukan buku)
        if (filterType !== 'buku' && filterCategory && item.category !== filterCategory) return false;
        
        // Filter by owner
        if (filterOwner && session.uid && item.uid !== session.uid) return false;
        
        return true;
      })
      .sort((a: Literasi, b: Literasi) => {
        if (filterSort === 'az') return a.title.localeCompare(b.title);
        if (filterSort === 'za') return b.title.localeCompare(a.title);
        if (filterSort === 'newest') return b.createdAt - a.createdAt;
        if (filterSort === 'oldest') return a.createdAt - b.createdAt;
        return b.createdAt - a.createdAt;
      });
  }, [literasiList, filterType, filterCategory, filterOwner, filterSort, session.uid]);

  const resetFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setFilterSort('newest');
    setFilterOwner(false);
  };

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    if (type === 'buku') {
      setFilterCategory('');
    }
  };

  const handleFilterCategoryChange = (category: string) => {
    setFilterCategory(category);
  };

  const handleFilterSortChange = (sort: FilterOption) => {
    setFilterSort(sort);
  };

  const handleFilterOwnerChange = (owner: boolean) => {
    setFilterOwner(owner);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-0">
      <div className="max-w-7xl mx-auto">
        <HeaderLiterasi />

        <CategoryLiterasi
          isLoggedIn={isLoggedIn}
          filterType={filterType}
          filterCategory={filterCategory}
          filterSort={filterSort}
          filterOwner={filterOwner}
          onFilterTypeChange={handleFilterTypeChange}
          onFilterCategoryChange={handleFilterCategoryChange}
          onFilterSortChange={handleFilterSortChange}
          onFilterOwnerChange={handleFilterOwnerChange}
          onResetFilters={resetFilters}
        />

        {/* ← FIX: TAMBAHKAN filterType KE ListLiterasi */}
        <ListLiterasi 
          filteredList={filteredList} 
          filterType={filterType}
        />

        <div className="mt-8">
          <BacaUMP />
        </div>
      </div>
    </div>
  );
}