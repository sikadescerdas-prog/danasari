"use client";

import {
  FileText,
  ClipboardList,
  ShieldCheck,
  Briefcase,
  IdCard,
  MessageCircle,
} from "lucide-react";

const services = [
  {
    title: "Surat Keterangan",
    icon: FileText,
    color: "from-blue-500 to-sky-400",
    requirements: [
      "KTP asli & fotokopi",
      "KK terbaru",
      "Bukti domisili (jika diperlukan)",
    ],
  },
  {
    title: "Surat Domisili",
    icon: ClipboardList,
    color: "from-indigo-500 to-blue-400",
    requirements: [
      "KTP & KK",
      "Surat pengantar RT/RW",
      "Form permohonan",
    ],
  },
  {
    title: "Bantuan Sosial",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-400",
    requirements: [
      "KTP & KK",
      "Surat Tidak Mampu (SKTM)",
      "Data penghasilan keluarga",
    ],
  },
  {
    title: "Surat Usaha",
    icon: Briefcase,
    color: "from-amber-500 to-orange-400",
    requirements: [
      "KTP & KK",
      "Surat usaha RT/RW",
      "Foto usaha aktif",
    ],
  },
  {
    title: "Pengantar KTP",
    icon: IdCard,
    color: "from-violet-500 to-purple-400",
    requirements: [
      "KK asli",
      "KTP lama (jika ada)",
      "Surat pengantar RT/RW",
    ],
  },
  {
    title: "Pengaduan Desa",
    icon: MessageCircle,
    color: "from-rose-500 to-pink-400",
    requirements: [
      "Identitas pelapor (opsional)",
      "Deskripsi laporan jelas",
      "Foto bukti (opsional)",
    ],
  },
];

export default function LayananPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100/40 px-4 pt-20 pb-24 md:px-10">

      {/* HEADER */}
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm">
          Layanan Desa Digital
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Syarat & Ketentuan Layanan
        </h1>

        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Semua layanan desa transparan, cepat, dan mudah diakses
        </p>
      </div>

      {/* GRID */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">

        {services.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="
                group relative overflow-hidden rounded-3xl
                border border-white/40
                bg-white/60 backdrop-blur-xl
                p-6 shadow-sm
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                hover:border-blue-200/60
              "
            >

              {/* soft glow */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl opacity-0 transition group-hover:opacity-100" />

              {/* HEADER */}
              <div className="mb-5 flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md ring-1 ring-white/30 transition group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900 md:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Syarat pengajuan layanan
                  </p>
                </div>

              </div>

              {/* REQUIREMENTS */}
              <div className="space-y-2">
                {item.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400/80" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {req}
                    </p>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="mt-5 text-xs font-medium text-blue-600/80">
                ✔ Siap diajukan secara online
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}