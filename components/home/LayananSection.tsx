"use client";

import {
  FileText,
  ClipboardList,
  ShieldCheck,
  Package,
  Users,
  MessageCircle,
  IdCard,
  Briefcase,
} from "lucide-react";

const services = [
  {
    title: "Surat Keterangan",
    icon: FileText,
    color: "from-blue-500 to-sky-400",
  },
  {
    title: "Surat Domisili",
    icon: ClipboardList,
    color: "from-indigo-500 to-blue-400",
  },
  {
    title: "Bantuan Sosial",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-400",
  },
  {
    title: "Surat Usaha",
    icon: Briefcase,
    color: "from-amber-500 to-orange-400",
  },
  {
    title: "Pengantar KTP",
    icon: IdCard,
    color: "from-violet-500 to-purple-400",
  },
  {
    title: "Pengaduan Desa",
    icon: MessageCircle,
    color: "from-rose-500 to-pink-400",
  },
];

export default function LayananSection() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-red-50 via-white to-rose-100/60 border border-red-100 shadow-xl p-5 xl:p-8 overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-400 text-white shadow-lg">
          <FileText className="h-5 w-5 animate-pulse" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Layanan Desa
          </h3>
          <p className="text-xs text-gray-500">
            Surat & administrasi
          </p>
        </div>
      </div>

      {/* GRID COMPACT */}
      <div className="mt-7 grid grid-cols-2 gap-2 md:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <button
              key={service.title}
              className="group flex flex-col items-center rounded-xl border border-white/70 bg-white/80 p-3 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-sm transition group-hover:scale-110`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span className="text-[11px] font-medium text-gray-800 md:text-xs">
                {service.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* glow kecil */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />
    </div>
  );
}