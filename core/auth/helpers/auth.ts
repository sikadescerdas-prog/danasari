// core/auth/helpers/auth.ts

import { useSessionStore } from "@/core/auth/store/session.store";

export function useAuthCheck() {
  const { session } = useSessionStore();
  
  return {
    isAuthenticated: !!session.uid && !session.loading && session.hydrated,
    uid: session.uid,
    email: session.email,
    role: session.role,
    loading: session.loading,
  };
}