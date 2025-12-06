import { createContext, useContext, ReactNode } from 'react';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import type { UserResponse } from '@/api/types';
import { isAuthenticated } from '@/api/client';

interface AuthContextType {
  user: UserResponse | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: isAuthenticated() && !!user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
