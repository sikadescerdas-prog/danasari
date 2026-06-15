"use client";

import { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

import VillageHeader from "@/components/home/DesaHeader";
import { motion } from "framer-motion";
import CountUp from "react-countup";

import {
  Users,
  MapPin,
  Ruler,
  Mars,
  Venus,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

/* =======================
   TYPES
======================= */

interface PotentialItem {
  category: string;
}

interface Population {
  male: number;
  female: number;
  year: string;
}

interface StructureItem {
  title: string;
  name: string;
  yearJoined: number;
  photo?: string | { url: string };
}

/* =======================
   PAGE
======================= */

export default function ProfileDesaPage() {
  const [profile, setProfile] = useState<any>(null);
  const [population, setPopulation] = useState<Population | null>(null);
  const [head, setHead] = useState<StructureItem | null>(null);
  const [potential, setPotential] =
    useState<Record<string, number>>({});

  /* =======================
     FETCH DATA
  ======================= */

  useEffect(() => {
    const p1 = onValue(ref(db, "village/profile"), (snap) =>
      setProfile(snap.val())
    );

    const p2 = onValue(ref(db, "village/population"), (snap) => {
      const data = snap.val();
      if (!data) return;

      const values = Object.values(data ?? {}) as Population[];

      const latest = values.reduce((a, b) =>
        Number(b.year) > Number(a.year) ? b : a
      );

      setPopulation(latest);
    });

    const p3 = onValue(ref(db, "village/structure"), (snap) => {
      const data = snap.val();
      if (!data) return;

      const list = Object.values(data ?? {}) as StructureItem[];

      const kepala = list
        .filter((x) => x.title === "kepala_desa")
        .reduce((a, b) =>
          Number(b.yearJoined) > Number(a.yearJoined) ? b : a
        );

      setHead(kepala);
    });

    const p4 = onValue(ref(db, "village/potential"), (snap) => {
      const data = snap.val();
      if (!data) return;

      const grouped = (Object.values(data ?? {}) as PotentialItem[]).reduce<
        Record<string, number>
      >((acc, item) => {
        const key = item.category || "lainnya";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      setPotential(grouped);
    });

    return () => {
      p1();
      p2();
      p3();
      p4();
    };
  }, []);

  /* =======================
     DERIVED DATA
  ======================= */

  const male = Number(population?.male || 0);
  const female = Number(population?.female || 0);
  const total = male + female;

  const pieData = [
    { name: "Laki-laki", value: male },
    { name: "Perempuan", value: female },
  ];

  const COLORS = ["#2563eb", "#ec4899"];

  const totalPotential = useMemo(() => {
    return Object.values(potential).reduce(
      (a, b) => a + Number(b),
      0
    );
  }, [potential]);

  const address = profile?.address || {};
  const social = profile?.socialMedia || {};
  const contact = profile?.contact || {};

  const phone = contact?.phone || "0812xxxxx";
  const email = contact?.email || "email@xxxxx.com";
  const workingHours = "08:00 - 16:00";

  const headPhoto =
    typeof head?.photo === "object"
      ? head?.photo?.url
      : head?.photo;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  /* =======================
     UI (UNCHANGED)
  ======================= */

  return (
    <main className="min-h-screen bg-slate-50 pt-14 pb-8">

      <VillageHeader title="Profil Desa" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 lg:-mt-24 relative z-10 space-y-8">

        {/* ===== SEJARAH DESA + KEPALA DESA ===== */}
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">

          <div className="h-2 bg-gradient-to-r from-green-400 to-green-500" />

          <div className="p-5">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h2 className="text-lg font-bold text-slate-800">
                Sejarah Desa
              </h2>

              <p className="text-sm text-black/80">
                {profile?.name} • {address?.district} • {address?.regency}
              </p>

              <p className="mt-3 text-black/90 text-sm">
                {profile?.history}
              </p>
            </motion.div>

          </div>

          <div className="flex items-center gap-5 p-6 border-l-4 border-emerald-500 pl-8">

            <img
              src={headPhoto || "/avatar.png"}
              className="w-36 h-36 rounded-full object-cover border"
            />

            <div>
              <p className="text-sm text-slate-500">Kepala Desa</p>
              <p className="font-bold text-lg">{head?.name || "-"}</p>
              <p className="text-sm text-slate-600">
                {profile?.welcomeMessage}
              </p>
            </div>

          </div>
        </div>

        {/* ===== PENDUDUK ===== */}
        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6 relative overflow-hidden">

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-emerald-600 w-5 h-5" />
                Data Penduduk
              </h2>

              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                Tahun {population?.year || "-"}
              </span>
            </div>

            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={72}
                    outerRadius={98}
                    paddingAngle={6}
                    stroke="#fff"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6">

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-sm text-slate-600">
                  Laki-laki
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-sm text-slate-600">
                  Perempuan
                </span>
              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-emerald-400 to-green-400 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">

            <div className="relative flex flex-col justify-center items-center text-center h-full">

              <Users className="w-10 h-10 mb-2 text-white/90" />

              <p className="text-6xl font-extrabold">
                <CountUp end={total} duration={3} />
              </p>

              <p className="text-white/80 mt-1">
                Total Jiwa
              </p>

              {/* GENDER MINI CARDS */}
              <div className="grid grid-cols-2 gap-3 mt-6 w-full">

                <div className="bg-white/10 rounded-xl p-3 backdrop-blur text-center">
                  <Mars className="w-5 h-5 mx-auto mb-1 text-white" />
                  <p className="text-lg font-bold">{male}</p>
                  <p className="text-xs text-white/80">Laki-laki</p>
                </div>

                <div className="bg-white/10 rounded-xl p-3 backdrop-blur text-center">
                  <Venus className="w-5 h-5 mx-auto mb-1 text-white" />
                  <p className="text-lg font-bold">{female}</p>
                  <p className="text-xs text-white/80">Perempuan</p>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ===== MAPS ===== */}
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">

          <div className="h-2 bg-gradient-to-r from-green-400 to-green-500" />

          <div className="p-5 space-y-4">

            <div className="flex items-center gap-2">
              <MapPin className="text-green-600 w-5 h-5" />
              <h2 className="font-bold text-slate-800">
                Lokasi & Peta Desa
              </h2>
            </div>

            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">
              <p className="font-semibold text-slate-700">
                Alamat Lengkap:
              </p>
              <p>
                {address?.village}, {address?.district}, {address?.regency},{" "}
                {address?.province}, Indonesia, {address?.postalCode}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
              <Ruler className="text-emerald-600" />
              <div>
                <p className="text-xs text-slate-500">Luas Wilayah</p>
                <p className="font-semibold">
                  {profile?.areaSize || "-"} Ha
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31668.205384917852!2d109.4400255!3d-7.180695049999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fe4cd19cc2e13%3A0x5027a76e3551560!2sDanasari%2C%20Kec.%20Karangjambu%2C%20Kabupaten%20Purbalingga%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1781289341810!5m2!1sid!2sid"
                className="w-full h-64 sm:h-80 lg:h-96"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

            </div>

            <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="font-semibold text-blue-700">Batas Desa:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Utara: {address?.north}</li>
                <li>Timur: {address?.east}</li>
                <li>Selatan: {address?.south}</li>
                <li>Barat: {address?.west}</li>
              </ul>
            </div>

          </div>
        </div>

        {/* ===== INFORMASI DESA ===== */}
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden mt-6">

          <div className="h-2 bg-gradient-to-r from-emerald-400 to-green-500" />

          <div className="p-5 space-y-6">

            <h2 className="font-bold text-slate-800">
              Informasi Desa
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

               <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
                <Clock className="text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-500">Jam Kerja</p>
                  <p className="font-semibold">{workingHours}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
                <Phone className="text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-500">Telepon</p>
                  <p className="font-semibold">{phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
                <Mail className="text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-semibold">{email}</p>
                </div>
              </div>

             

            </div>

            <div>
              <p className="font-semibold mb-3">Sosial Media</p>

              <div className="flex flex-wrap gap-3">

                <a
                  href={social?.facebook || "#"}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <FaFacebook /> Facebook
                </a>

                <a
                  href={social?.instagram || "#"}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-pink-50 text-pink-600 hover:bg-pink-100"
                >
                  <FaInstagram /> Instagram
                </a>

                <a
                  href={social?.tiktok || "#"}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <FaTiktok /> TikTok
                </a>

                <a
                  href={social?.youtube || "#"}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <FaYoutube /> YouTube
                </a>

              </div>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

/* =======================
   COMPONENTS
======================= */

function Stat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border flex items-center gap-3">
      <div className="text-emerald-600">{icon}</div>
      <div>
        <p className="font-bold text-lg">
          {typeof value === "number" ? (
            <CountUp end={value} />
          ) : (
            value
          )}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function SmallStat({ label, value, color }: any) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl">
      <p className={`font-bold ${color}`}>
        <CountUp end={value} />
      </p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}