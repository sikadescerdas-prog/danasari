"use client";

import { FaUsers, FaUser, FaStore } from "react-icons/fa";
import { useUsers } from "@/modules/dashboard/hooks/useUsers";

export default function UsersHeader() {
  const { users } = useUsers();

  // 🔥 hanya user + seller
  const filtered = users.filter((u) => {
    const role = u.role || "user";
    return role === "user" || role === "seller";
  });

  const total = filtered.length;

  const usersOnly = filtered.filter((u) => !u.role || u.role === "user").length;
  const sellers = filtered.filter((u) => u.role === "seller").length;

  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 md:px-8 py-6">

      {/* glow background */}
      <div className="absolute inset-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/20 blur-3xl rounded-full" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
            <FaUsers className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-white text-xl font-bold">
              Manajemen Users
            </h1>
            <p className="text-white/60 text-sm">
              Data user & seller sistem
            </p>
          </div>
        </div>

        {/* RIGHT STATS */}
        <div className="flex flex-wrap gap-3">

          <Stat
            icon={<FaUsers className="text-green-400" />}
            label="Total"
            value={total}
          />

          <Stat
            icon={<FaUser className="text-gray-300" />}
            label="User"
            value={usersOnly}
          />

          <Stat
            icon={<FaStore className="text-blue-400" />}
            label="Seller"
            value={sellers}
          />

        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-white">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        {label}: <span className="font-bold">{value}</span>
      </div>
    </div>
  );
}