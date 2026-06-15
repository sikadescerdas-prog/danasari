"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  Home,
  Users,
  Building,
  Newspaper,
  Target,
} from "lucide-react";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

const YEAR = "2026";

const TEMPLATE = {
  phone: "0812xxxxx",
  email: "email@xxxxx.com",
  whatsapp: "62812xxxxx",
  facebook: "https://facebook.com/desa",
  instagram: "https://instagram.com/desa",
  youtube: "https://youtube.com/desa",
  village: "Desa xxx",
  district: "Kec. xxx",
};

const notEmpty = (val: unknown): val is string => {
  return (
    val !== null &&
    val !== undefined &&
    typeof val === "string" &&
    val.trim() !== ""
  );
};

const getVal = (val: unknown, fallback: string): string => {
  return notEmpty(val) ? val : fallback;
};

export default function Footer() {
  const pathname = usePathname();

  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "village/profile"), (snap) => {
      setData(snap.val() as Record<string, unknown>);
    });

    return () => unsubscribe();
  }, []);

  const hiddenRoutes = ["/dashboard", "/profile"];

  const shouldHide = hiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (shouldHide) return null;

  if (!data) {
    return (
      <footer className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </footer>
    );
  }

  const name = getVal(data.name, "Desa Kami");
  const address = (data.address as Record<string, unknown>) || {};
  const contact = (data.contact as Record<string, unknown>) || {};
  const socialMedia = (data.socialMedia as Record<string, unknown>) || {};

  const phone = getVal(data.phone, getVal(contact.phone, TEMPLATE.phone));
  const email = getVal(data.email, getVal(contact.email, TEMPLATE.email));

  const village = getVal(address.village, TEMPLATE.village);
  const district = getVal(address.district, TEMPLATE.district);

  const logoObj = data.logo as { url?: string } | undefined;
  const logoUrl = logoObj?.url;

  return (
    <footer className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white mb-16 md:mb-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full floating" />
        <div className="absolute top-1/3 -right-16 w-32 h-32 bg-white/10 rounded-full floating" />
      </div>

      <div className="h-1 bg-white/30" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Deskripsi */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white/30">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-3xl">🏘️</span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-xl text-white">{name}</h3>
                <p className="text-sm text-green-100">{district}</p>
              </div>
            </div>

            <p className="text-sm text-green-100 max-w-sm">
              Website resmi {name} untuk memberikan informasi terkini.
            </p>

            {notEmpty(data.locationUrl) && (
              <div className="flex items-center gap-2 text-sm text-green-100">
                <a
                  href={data.locationUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  Google Maps {name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-green-100">
              <Clock className="w-4 h-4" />
              <span>Senin - Jumat: 08.00 - 16.00 WIB</span>
            </div>
          </div>

          {/* Menu */}
          <div className="hidden md:inline space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">
              Menu
            </h4>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/visi-misi"
                  className="flex items-center gap-3 text-sm text-green-100 hover:text-white"
                >
                  <Target className="w-4 h-4" />
                  Visi & Misi
                </Link>
              </li>

              <li>
                <Link
                  href="/struktur"
                  className="flex items-center gap-3 text-sm text-green-100 hover:text-white"
                >
                  <Users className="w-4 h-4" />
                  Struktur
                </Link>
              </li>

              <li>
                <Link
                  href="/lembaga"
                  className="flex items-center gap-3 text-sm text-green-100 hover:text-white"
                >
                  <Building className="w-4 h-4" />
                  Lembaga
                </Link>
              </li>

              <li>
                <Link
                  href="/potensi"
                  className="flex items-center gap-3 text-sm text-green-100 hover:text-white"
                >
                  <Home className="w-4 h-4" />
                  Potensi
                </Link>
              </li>

              <li>
                <Link
                  href="/berita"
                  className="flex items-center gap-3 text-sm text-green-100 hover:text-white"
                >
                  <Newspaper className="w-4 h-4" />
                  Berita
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="hidden md:inline space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider">
              Kontak
            </h4>

            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-green-100">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {village}, {district}
                </span>
              </li>

              <li className="flex items-center gap-2 text-sm text-green-100">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{phone}</span>
              </li>

              <li className="flex items-center gap-2 text-sm text-green-100">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{email}</span>
              </li>
            </ul>

            <div className="flex gap-3 pt-2">
              <a
                href={getVal(socialMedia.facebook, TEMPLATE.facebook)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30"
              >
                <FaFacebook className="w-5 h-5" />
              </a>

              <a
                href={getVal(socialMedia.instagram, TEMPLATE.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30"
              >
                <FaInstagram className="w-5 h-5" />
              </a>

              <a
                href={getVal(socialMedia.youtube, TEMPLATE.youtube)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30"
              >
                <FaYoutube className="w-5 h-5" />
              </a>

              <a
                href={`https://wa.me/${getVal(
                  contact.whatsapp,
                  TEMPLATE.whatsapp
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-green-100">
            <p>
              © {YEAR} {name}. All rights reserved.
            </p>

            <p>
              Dikembangkan dengan oleh{" "}
              <span className="text-white font-medium italic">
                SIKADES Cerdas {YEAR}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}