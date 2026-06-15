"use client";

import { useEffect, useState, useCallback } from "react";
import { ref, onValue, Unsubscribe } from "firebase/database";
import { db } from "@/lib/firebase";

export interface UserItem {
  uid: string;
  fullname?: string;
  username?: string;
  email?: string;
  role?: string;
  avatar?: {
    url: string;
    publicId: string;
  } | null;

  // optional kalau kamu pakai nested profile
  profile?: {
    fullname?: string;
    avatar?: {
      url: string;
      publicId: string;
    } | null;
  };
}

export function useUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(() => {
    setLoading(true);

    const userRef = ref(db, "users");

    const unsubscribe: Unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const list: UserItem[] = Object.entries(data).map(
        ([uid, value]: any) => ({
          uid,
          ...value,
        })
      );

      // 🔥 OPTIONAL SORTING (admin → seller → user)
      const sorted = list.sort((a, b) => {
        const order = (role?: string) => {
          if (role === "superadmin") return 0;
          if (role === "admin") return 1;
          if (role === "seller") return 2;
          return 3;
        };

        return order(a.role) - order(b.role);
      });

      setUsers(sorted);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const reload = useCallback(() => {
    // safe reload: langsung trigger ulang listener
    const unsub = fetchUsers();
    return unsub;
  }, [fetchUsers]);

  useEffect(() => {
    const unsub = fetchUsers();
    return () => {
      if (unsub) unsub();
    };
  }, [fetchUsers]);

  return {
    users,
    loading,
    reload,
  };
}