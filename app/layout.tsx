// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Providers from "./providers";
import NavBottom from "@/components/NavBottom";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Desa Danasari",
  description: "SIKADES Cerdas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>          
          {/* Konten utama */}
          {children}
          {/* NavBottom mobile - visible di bawah lg */}
          <NavBottom />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}