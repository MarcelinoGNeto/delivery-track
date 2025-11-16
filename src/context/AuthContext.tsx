"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { createContext, useContext, useState, useEffect } from "react";

type AuthUser = {
  name: string;
  email: string;
  _id: string;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = async () => {
    try {
      await fetchWithAuth("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("Erro ao limpar cookie:", err);
    }

    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
