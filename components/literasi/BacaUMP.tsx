// components/literasi/BacaUMP.tsx

import { useState } from 'react';
import Image from 'next/image';
import { SiGoogleplay } from 'react-icons/si';
import { FaBook, FaNewspaper, FaUsers, FaFire, FaVideo, FaCheck, FaArrowRight, FaEye, FaHeart, FaStar, FaPlay } from 'react-icons/fa';

export default function BacaUMP() {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const features = [
    { icon: FaBook, text: '1000+ Buku', desc: 'Buku terlengkap' },
    { icon: FaNewspaper, text: '100+ Artikel', desc: 'Update harian' },
    { icon: FaVideo, text: 'Video', desc: 'Tutorial menarik' },
    { icon: FaUsers, text: 'Komunitas', desc: 'Diskusi aktif' },
  ];

  const benefits = [
    'Online & Offline',
    'Notifikasi update',
    'Simpan favorit',
    'Pencarian cepat',
    '100% Gratis',
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 mb-8">
      {/* Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#25c95f] via-[#4ade80] to-[#25c95f] bg-[length:200%_100%] animate-gradient" />
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-white" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#25c95f]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-green-300/30 rounded-full animate-ping" />
      <div className="absolute bottom-32 right-20 w-3 h-3 bg-green-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      
      <div className="relative z-10 p-6 lg:p-8">
        {/* Mobile: Column, Web: Row */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          
          {/* ==================== TEXT CONTENT ==================== */}
          {/* Mobile: order-1, Web: order-1 */}
          <div className="flex-1 text-center lg:text-left order-1 w-full">
            {/* Trending Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
              <FaFire className="w-4 h-4 text-white animate-pulse" />
              <span className="text-sm font-bold text-white">Trending Sekarang</span>
              <span className="text-xs text-orange-100">🔥</span>
            </div>
            
            {/* Title */}
            <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
              Aplikasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25c95f] to-[#16a34a]">UMP Baca</span>
            </h3>
            
            {/* Description */}
            <p className="text-base text-gray-600 mb-6 max-w-md mx-auto lg:mx-0">
              Akses literasi <span className="text-[#25c95f] font-bold">dimana saja, kapan saja</span> dengan mudah dan cepat langsung dari HP mu
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto lg:mx-0">
              {features.map((item, i) => (
                <div 
                  key={i} 
                  className="group flex items-center gap-3 px-4 py-3 bg-white rounded-2xl hover:bg-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-green-100 group-hover:bg-white/30 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#25c95f] group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-white block">{item.text}</span>
                    <span className="text-xs text-gray-500 group-hover:text-green-100">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Benefits Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-green-300 transition-all">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheck className="w-2.5 h-2.5 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Stats Row */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mb-0 pt-5 border-t border-dashed border-gray-200">
              {[
                { icon: FaUsers, value: '100rb+', label: 'Pengguna Aktif' },
                { icon: FaEye, value: '500rb+', label: 'Total Baca' },
                { icon: FaHeart, value: '50rb+', label: 'Favorites' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* ==================== IMAGE SECTION ==================== */}
          {/* Mobile: order-2 (below text), Web: order-2 (right side) */}
          <div className="order-2 lg:order-2 w-full lg:w-auto">
            <div className="flex flex-col items-center gap-4">
              {/* Image Container */}
              <div className="relative w-full max-w-[280px] lg:max-w-[240px]">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#25c95f] via-green-300 to-emerald-400 rounded-3xl blur-2xl opacity-20 animate-pulse" />
                
                {/* Phone mockup */}
                <div 
                  className={`relative w-full aspect-[2/3] lg:aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800 transition-all duration-500 ${
                    isHovered ? 'shadow-2xl shadow-green-300' : ''
                  }`}
                >
                  {/* Loading skeleton */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  
                  <Image 
                    src="/img/apps.png" 
                    alt="UMP Baca App" 
                    fill
                    className="object-cover"
                    onLoad={() => setImageLoaded(true)}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  
                  {/* Center Play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                      isHovered ? 'scale-110' : 'hover:scale-110'
                    }`}>
                      <FaPlay className="w-8 h-8 text-green-500 ml-1" />
                    </div>
                  </div>
                  
                  {/* NEW Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-orange-500 rounded-full shadow-lg">
                    <span className="text-xs font-bold text-white">NEW</span>
                  </div>
                </div>
              </div>
              
              {/* Download Button - Below image */}
              <a 
                href="https://play.google.com/store/apps/details?id=id.kubuku.kbk1986375&hl=id" 
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-gradient-to-r from-[#25c95f] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl shadow-green-300 hover:shadow-2xl hover:shadow-green-400 hover:-translate-y-1 ${
                  isHovered ? 'scale-[1.02]' : ''
                }`}
              >
                <SiGoogleplay className="text-2xl" />
                <span>Download Sekarang</span>
                <FaArrowRight className={`w-5 h-5 ${isHovered ? 'translate-x-1' : ''}`} />
              </a>
              
              <p className="text-xs text-gray-400 hidden lg:block">Tersedia di Google Play Store</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}