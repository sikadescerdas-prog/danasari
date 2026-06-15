'use client';

import Link from 'next/link';
import { useSessionStore } from '@/core/auth/store/session.store';

export default function HeaderBerita() {
  const { session } = useSessionStore();

  return (
    <>
      {/* Banner */}
      <div className="relative mt-16 h-64 bg-cover bg-center">
        <img
          src="/img/bg-desa.jpeg"
          alt="Banner Berita"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-center text-white">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              Berita Desa
            </h1>

            <p className="text-lg">
              Informasi, pengumuman, dan event terbaru desa
            </p>
          </div>
        </div>
      </div>
    </>
  );
}