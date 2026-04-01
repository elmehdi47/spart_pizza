import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isChecking: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "spart_admin_token";
const USERNAME_KEY = "spart_admin_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    username: null,
    isAuthenticated: false,
    isChecking: true,
  });

  useEffect(() => {
    const token = sessionStorage.getItem(STORAGE_KEY);
    const username = sessionStorage.getItem(USERNAME_KEY);
    if (!token) {
      setState(s => ({ ...s, isChecking: false }));
      return;
    }
    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.ok) {
          setState({ token, username, isAuthenticated: true, isChecking: false });
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(USERNAME_KEY);
          setState({ token: null, username: null, isAuthenticated: false, isChecking: false });
        }
      })
      .catch(() => {
        setState(s => ({ ...s, isChecking: false }));
      });
  }, []);

  const login = (token: string, username: string) => {
    sessionStorage.setItem(STORAGE_KEY, token);
    sessionStorage.setItem(USERNAME_KEY, username);
    setState({ token, username, isAuthenticated: true, isChecking: false });
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    setState({ token: null, username: null, isAuthenticated: false, isChecking: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
