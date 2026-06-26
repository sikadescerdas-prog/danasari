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
    requirements: ["KTP & KK", "Surat pengantar RT/RW", "Form permohonan"],
  },
  {
    title: "Bantuan Sosial",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-400",
    requirements: ["KTP & KK", "SKTM", "Data penghasilan keluarga"],
  },
  {
    title: "Surat Usaha",
    icon: Briefcase,
    color: "from-amber-500 to-orange-400",
    requirements: ["KTP & KK", "Surat usaha RT/RW", "Foto usaha aktif"],
  },
  {
    title: "Pengantar KTP",
    icon: IdCard,
    color: "from-violet-500 to-purple-400",
    requirements: ["KK asli", "KTP lama (jika ada)", "Surat pengantar RT/RW"],
  },
  {
    title: "Pengaduan Desa",
    icon: MessageCircle,
    color: "from-rose-500 to-pink-400",
    requirements: ["Identitas pelapor (opsional)", "Deskripsi jelas", "Foto bukti"],
  },
];

export default function LayananPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 pt-24 pb-24 md:px-10">

      {/* HEADER */}
      <div className="mx-auto mb-14 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-1 text-xs font-medium text-blue-600 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Layanan Desa Digital
        </div>

        <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
          Syarat & Ketentuan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
            Layanan
          </span>
        </h1>

        <p className="mt-3 text-sm md:text-base text-slate-500 max-w-xl mx-auto">
          Semua layanan desa kini lebih cepat, transparan, dan dapat diakses secara online.
        </p>
      </div>

      {/* GRID */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {services.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="
                group relative overflow-hidden rounded-3xl
                bg-white/70 backdrop-blur-xl
                border border-slate-100
                shadow-sm
                transition-all duration-300
                hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200
              "
            >

              {/* glow background */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

              {/* top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${item.color}`} />

              <div className="p-6">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-5">

                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                  >
                    <Icon className="h-5 w-5" />

                    {/* small glow dot */}
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white/80 blur-[1px]" />
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Dokumen persyaratan
                    </p>
                  </div>

                </div>

                {/* REQUIREMENTS */}
                <div className="space-y-2">
                  {item.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {req}
                      </p>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="mt-6 flex items-center justify-between">

                  <span className="text-xs font-medium text-emerald-600">
                    ● Online Ready
                  </span>

                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                    Ajukan →
                  </button>

                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}