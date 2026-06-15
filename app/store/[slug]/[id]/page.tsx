"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";

import { useProductDetail } from "@/modules/marketplace/hooks/useProductDetail";
import ProductDetailBody from "@/components/marketplace/product/detail/ProductDetailBody";
import ProductDetailNews from "@/components/marketplace/product/detail/ProductDetailNews";
import ProductDetailNavBottom from "@/components/marketplace/product/detail/ProductDetailNavBottom";

// Loading Fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-green-500" />
    </div>
  );
}

// Main Page Content
function DetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const productSlug = params?.id as string;

  // Use the custom hook
  const { store, product, loading, otherProducts } = useProductDetail(slug, productSlug);

  if (loading || !product || !store) {
    return <LoadingFallback />;
  }

  const marketplace = (store as any).marketplace || {};

  return (
    <div className="min-h-screen bg-slate-50 pt-4 lg:pt-10 pb-14 lg:pb-8">
      {/* Main Layout */}
      <div className="pt-12 lg:pt-8 max-w-7xl mx-auto p-0 lg:p-12">
        
        {/* Body: Images & Details */}
        <ProductDetailBody product={product} store={store} slug={slug} />

        {/* News: Other Products */}
        <ProductDetailNews products={otherProducts} slug={slug} />
      
      </div>

      {/* NavBottom: Mobile Only */}
      <ProductDetailNavBottom marketplace={marketplace} />
    </div>
  );
}

export default function DetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DetailContent />
    </Suspense>
  );
}