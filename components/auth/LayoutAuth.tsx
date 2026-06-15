// components/auth/LayoutAuth.tsx

import HeroAuth from "./HeroAuth";

interface LayoutAuthProps {
  children: React.ReactNode;
  reverse?: boolean;
}

export default function LayoutAuth({ children, reverse = false }: LayoutAuthProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Hero (Kiri - Default) */}
      {!reverse && <HeroAuth />}

      {/* Form (Kanan - Default / Kiri - Reverse) */}
      <main className="relative flex items-center justify-center bg-white px-6 lg:px-12 overflow-hidden">
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Hero (Kanan - Reverse) */}
      {reverse && <HeroAuth reverse={true} />}

    </div>
  );
}