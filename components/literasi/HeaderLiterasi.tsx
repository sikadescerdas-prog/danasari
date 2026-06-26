// components/literasi/HeaderLiterasi.tsx

import Link from 'next/link';
import { useSessionStore } from '@/core/auth/store/session.store';

export default function HeaderLiterasi() {
  const { session } = useSessionStore();

  return (
    <>
      {/* Banner */}
      <div className="h-64 bg-cover bg-center relative mt-16">
        <img src="/img/literasi.png" alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
      </div>
    </>
  );
}