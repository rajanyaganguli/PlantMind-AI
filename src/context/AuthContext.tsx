import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthUser { name: string; role: string; email: string; initials: string; }
interface AuthCtx { user: AuthUser | null; login: (user: AuthUser) => void; logout: () => void; }

const AuthContext = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const login = (u: AuthUser) => setUser(u);
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export const DEMO_USER: AuthUser = {
  name: 'Rahul Sharma',
  role: 'Reliability Engineer',
  email: 'rahul.sharma@apexsteel.com',
  initials: 'RS',
};
