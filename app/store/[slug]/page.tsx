"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";

import { useStoreDetail } from "@/modules/marketplace/hooks/useStoreDetail";
import HeaderStore from "@/components/marketplace/store/HeaderStore";
import CategoryStore from "@/components/marketplace/store/CategoryStore";
import ProductCard from "@/components/marketplace/store/ProductCard";

import { FaStoreSlash, FaBoxOpen } from "react-icons/fa";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-green-500" />
    </div>
  );
}

function TokoContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const {
    toko,
    isOwner,
    loading,
    isStoreOpen,
    paginated,
    filtered,
    hasMore,
    setPage,
    setCategory,
    setSort,
    handleEdit,
    handleToggleProduct,
    handleToggleStoreStatus,
    handleDelete,
  } = useStoreDetail(slug);

  if (loading) return <LoadingFallback />;

  if (!toko) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Toko tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-20 pt-16">
      <HeaderStore 
        toko={toko} 
        isStoreOpen={isStoreOpen} 
        isOwner={isOwner}              
        onToggleStore={isOwner ? handleToggleStoreStatus : undefined}
      />

      {!isStoreOpen ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <FaStoreSlash size={80} className="text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-600">Toko Sedang Tutup</h2>
          <p className="text-slate-500 mt-2">Produk tidak tersedia saat ini.</p>
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <FaBoxOpen size={80} className="text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-600">Produk Belum Tersedia</h2>
          <p className="text-slate-500 mt-2">Toko ini belum memiliki produk.</p>
        </div>
      ) : (
        <>
          <CategoryStore
            totalProduk={filtered.length}
            onSort={(v) => { setSort(v); setPage(1); }}
            onCategoryChange={(c) => { setCategory(c); setPage(1); }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
            {paginated.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                storeSlug={slug}
                isOwner={isOwner}
                onEdit={() => handleEdit(p)}
                onToggleActive={() => handleToggleProduct(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="p-4">
              <button onClick={() => setPage((p) => p + 1)} className="w-full py-2 bg-white border rounded-lg">
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function TokoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TokoContent />
    </Suspense>
  );
}