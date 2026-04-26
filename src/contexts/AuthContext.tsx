"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthSession, mockAuth } from "@/lib/mock-auth";

import { useRouter } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  SESSION_STORAGE_KEY,
  SIGN_IN_PATH,
} from "@/lib/auth-constants";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setSessionCookie(session: AuthSession) {
  if (typeof window === "undefined") return;
  const cookieValue = encodeURIComponent(
    JSON.stringify({ token: session.token, expiresAt: session.expiresAt }),
  );
  const expires = new Date(session.expiresAt).toUTCString();
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE_NAME}=${cookieValue}; path=/; expires=${expires}; SameSite=Lax${secureFlag}`;
}

function clearSessionCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=${new Date(0).toUTCString()}; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true until we've checked storage
  const router = useRouter();

  /** Derive user state from the persisted session. */
  const syncFromStorage = useCallback(() => {
    const session: AuthSession | null = mockAuth.getSession();
    setUser(session ? session.user : null);
    if (session) {
      setSessionCookie(session);
    } else {
      clearSessionCookie();
    }
  }, []);

  useEffect(() => {
    // Hydrate on mount
    syncFromStorage();
    setLoading(false);

    /**
     * React to sign-in / sign-out happening in OTHER browser tabs.
     * Both tabs share the same localStorage, so a storage event keeps
     * them in sync without a full page reload.
     */
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [syncFromStorage]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await mockAuth.signIn(email, password);
      setUser(session.user);
      setSessionCookie(session);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, name: string, password: string) => {
    setLoading(true);
    try {
      const session = await mockAuth.signUp(email, name, password);
      setUser(session.user);
      setSessionCookie(session);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    mockAuth.signOut();
    clearSessionCookie();
    setUser(null);
    router.push(SIGN_IN_PATH);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
