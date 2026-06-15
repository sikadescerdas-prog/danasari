// core/auth/store/session.store.ts

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { UserRole } from "@/core/auth/types/user.types";

type SessionState = {
  uid: string | null;
  email: string | null;
  role: UserRole;
  loading: boolean;
  hydrated: boolean;
};

type SessionStore = {
  session: SessionState;
  setSession: (data: { uid: string; email: string; role: UserRole }) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
};

const initialState: SessionState = {
  uid: null,
  email: null,
  role: "user",
  loading: true,
  hydrated: false,
};

export const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set, get) => ({
        session: initialState,

        setSession: (data) =>
          set({
            session: {
              ...initialState,
              ...data,
              loading: false,
              hydrated: true,
            },
          }),

        clearSession: () =>
          set({ session: { ...initialState, loading: false, hydrated: true } }),

        setLoading: (loading) =>
          set((state) => ({
            session: { ...state.session, loading },
          })),

        setHydrated: (hydrated) =>
          set((state) => ({
            session: { ...state.session, hydrated },
          })),
      }),
      { 
        name: "sikades-auth",
        // Fix: onRehydrateStorage yang benar
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Trigger hydrated flag setelah rehydrate selesai
            // Gunakan setTimeout untuk avoid state update during rehydration
            setTimeout(() => {
              state.setHydrated(true);
              state.setLoading(false);
            }, 0);
          }
        },
      }
    ),
    { name: "SessionStore" }
  )
);

// SELECTORS
export const selectUid = (state: SessionStore) => state.session.uid;
export const selectEmail = (state: SessionStore) => state.session.email;
export const selectRole = (state: SessionStore) => state.session.role;
export const selectSession = (state: SessionStore) => state.session;
export const selectIsAuthenticated = (state: SessionStore) => 
  !!state.session.uid && state.session.hydrated;
export const selectIsLoading = (state: SessionStore) => state.session.loading;
export const selectIsHydrated = (state: SessionStore) => state.session.hydrated;