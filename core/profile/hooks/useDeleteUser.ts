// core/profile/hooks/useDeleteUser.ts
"use client";

import Swal from "sweetalert2";
import { ref, get, remove } from "firebase/database";
import { db } from "@/lib/firebase";

export function useDeleteUser() {
  const deleteUser = async (uid: string) => {
    const confirm = await Swal.fire({
      title: "Tutup Akun?",
      text: "Semua data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      // =========================
      // 🔥 FETCH DATA
      // =========================
      const [profileSnap, storeSnap, productSnap] = await Promise.all([
        get(ref(db, `profiles/${uid}`)),
        get(ref(db, `stores/${uid}`)),
        get(ref(db, `products/${uid}`)),
      ]);

      const profile = profileSnap.val();
      const store = storeSnap.val();
      const products = productSnap.val();

      // =========================
      // ☁️ COLLECT CLOUDINARY DATA
      // =========================
      const deletions: { publicId: string }[] = [];

      // avatar
      if (profile?.avatar?.publicId) {
        deletions.push({ publicId: profile.avatar.publicId });
      }

      // store
      if (store?.logo?.publicId) {
        deletions.push({ publicId: store.logo.publicId });
      }

      if (store?.banner?.publicId) {
        deletions.push({ publicId: store.banner.publicId });
      }

      // products images
      if (products) {
        Object.values(products).forEach((p: any) => {
          p?.images?.forEach((img: any) => {
            if (img?.publicId) {
              deletions.push({ publicId: img.publicId });
            }
          });
        });
      }

      // =========================
      // ☁️ DELETE CLOUDINARY FIRST
      // =========================
      if (deletions.length > 0) {
        const results = await Promise.allSettled(
          deletions.map((file) =>
            fetch("/api/upload/delete", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                publicId: file.publicId,
              }),
            })
          )
        );

        const failed = results.filter((r) => r.status === "rejected");

        if (failed.length > 0) {
          console.warn("⚠️ Some Cloudinary deletes failed:", failed);
        }
      }

      // =========================
      // 🧹 DELETE FIREBASE (AFTER CLOUD DONE)
      // =========================
      await Promise.all([
        remove(ref(db, `users/${uid}`)),
        remove(ref(db, `profiles/${uid}`)),
        remove(ref(db, `stores/${uid}`)),
        remove(ref(db, `products/${uid}`)),
        remove(ref(db, `literasi/${uid}`)),
        remove(ref(db, `emailIndex/${uid}`)),
        remove(ref(db, `usernameIndex/${uid}`)),
      ]);

      // =========================
      // ✅ SUCCESS
      // =========================
      await Swal.fire({
        title: "Berhasil",
        text: "Akun dan semua data berhasil dihapus",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      Swal.fire({
        title: "Gagal",
        text: "Tidak bisa menghapus akun",
        icon: "error",
      });
    }
  };

  return { deleteUser };
}