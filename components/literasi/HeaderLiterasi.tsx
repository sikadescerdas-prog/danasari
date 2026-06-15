// components/literasi/HeaderLiterasi.tsx

import Link from 'next/link';
import { useSessionStore } from '@/core/auth/store/session.store';

export default function HeaderLiterasi() {
  const { session } = useSessionStore();

  return (
    <>
      {/* Banner */}
      <div className="h-64 bg-cover bg-center relative mt-16">
        <img src="/img/bg-desa.jpeg" alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Literasi Desa</h1>
            <p className="text-lg">Baca & pelajari informasi menarik</p>
          </div>
        </div>
      </div>
    </>
  );
}