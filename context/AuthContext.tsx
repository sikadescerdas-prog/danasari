// context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { 
  useSessionStore, 
  selectSession,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsHydrated 
} from "@/core/auth/store/session.store";
import type { UserRole } from "@/core/auth/types/user.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hydrated: false,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { setSession, clearSession } = useSessionStore();
  const session = useSessionStore(selectSession);
  const isLoading = useSessionStore(selectIsLoading);
  const isHydrated = useSessionStore(selectIsHydrated);

  const fetchUserRole = useCallback(async (uid: string): Promise<UserRole> => {
    try {
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return (userData.role as UserRole) || "user";
      }
      return "user";
    } catch (error) {
      console.error("Error fetching role:", error);
      return "user";
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        const role = await fetchUserRole(firebaseUser.uid);
        
        setSession({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          role,
        });
      } else {
        setUser(null);
        clearSession();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setSession, clearSession, fetchUserRole]);

  const value: AuthContextType = {
    user,
    loading: isLoading,
    hydrated: isHydrated,
    isAuthenticated: !!session.uid && isHydrated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);