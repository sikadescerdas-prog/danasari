"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { ref, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";

import { useUsers } from "@/modules/dashboard/hooks/useUsers";
import { useSessionStore } from "@/core/auth/store/session.store";
import { useProfile } from "@/core/profile/hooks/useProfile";
import { FaTrash } from "react-icons/fa";

export default function UserList() {
  const { users } = useUsers();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const session = useSessionStore((state) => state.session);
  const isSuperAdmin = session?.role === "superadmin";
  const isAdmin = session?.role === "admin";

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const role = u.role || "user";
      return role === "user" || role === "seller" || role === "admin";
    });
  }, [users]);

  const handleMakeAdmin = async (uid: string) => {
    if (!isSuperAdmin) {
      await Swal.fire({
        title: "Akses Ditolak",
        text: "Hanya superadmin",
        icon: "error",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Jadikan Admin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
    });

    if (!result.isConfirmed) return;

    setLoadingId(uid);

    await update(ref(db, `users/${uid}`), {
      role: "admin",
    });

    setLoadingId(null);
  };

  const handleDelete = async (uid: string) => {
    if (!isSuperAdmin) {
      await Swal.fire({
        title: "Akses Ditolak",
        icon: "error",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Hapus User?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    setLoadingId(uid);

    await remove(ref(db, `users/${uid}`));

    setLoadingId(null);
  };

  const getRoleStyle = (role?: string) => {
    switch (role) {
      case "seller":
        return "bg-blue-100 text-blue-700";
      case "admin":
        return "bg-green-100 text-green-700";
      case "superadmin":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 overflow-hidden">

      {/* TABLE WRAPPER RESPONSIVE */}
      <div className="w-full overflow-x-auto">

        <table className="min-w-[800px] w-full text-sm">

          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left">Nama</th>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => {
              // 🔥 PROFILE NAME PRIORITY
              const profileName =
                user.profile?.fullname ||
                user.fullname ||
                user.username ||
                "-";

              return (
                <tr
                  key={user.uid}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >

                  {/* NAME */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {profileName}
                  </td>

                  {/* USERNAME */}
                  <td className="px-6 py-4 text-gray-600">
                    @{user.username || "-"}
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-gray-500">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(
                        user.role
                      )}`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">

                      {/* MAKE ADMIN */}
                      {isSuperAdmin && user.role !== "superadmin" && (
                        <button
                          onClick={() => handleMakeAdmin(user.uid)}
                          disabled={loadingId === user.uid}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          Jadikan Admin
                        </button>
                      )}

                      {/* DELETE */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(user.uid)}
                          disabled={loadingId === user.uid}
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* MOBILE HINT */}
      <div className="md:hidden text-xs text-gray-400 p-3">
        Swipe kanan/kiri untuk melihat tabel lengkap
      </div>

    </div>
  );
}