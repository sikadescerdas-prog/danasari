// components/product/id/ProductDetailHeader.tsx

"use client";

interface ProductDetailHeaderProps {
  images: { url: string }[];
  activeImage: number;
  onScrollToImage: (index: number) => void;
}

export default function ProductDetailHeader({ images, activeImage, onScrollToImage }: ProductDetailHeaderProps) {
  if (images.length <= 1) return null;

  return (
    <div className="flex gap-2 p-3 bg-white overflow-x-auto lg:flex-wrap lg:justify-start">
      {images.map((img, idx) => (
        <button 
          key={idx}
          onClick={() => onScrollToImage(idx)}
          className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
            activeImage === idx 
              ? "border-emerald-500 scale-105" 
              : "border-transparent opacity-50 hover:opacity-100"
          }`}
        >
          <img src={img.url} className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  );
}