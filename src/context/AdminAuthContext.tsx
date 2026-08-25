import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  defaultPasswordHint: string;
}

const DEFAULT_ADMIN_PASSWORD = 'lovey2026!';
const AUTH_STORAGE_KEY = 'lovey_admin_authenticated';
const PASS_STORAGE_KEY = 'lovey_admin_password';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const getStoredPassword = (): string => {
    try {
      return localStorage.getItem(PASS_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  };

  const login = (inputPassword: string): boolean => {
    const currentPass = getStoredPassword();
    if (inputPassword === currentPass) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    const currentPass = getStoredPassword();
    if (oldPass !== currentPass) {
      return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: '새 비밀번호는 최소 4자 이상이어야 합니다.' };
    }
    try {
      localStorage.setItem(PASS_STORAGE_KEY, newPass.trim());
      return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
    } catch {
      return { success: false, message: '비밀번호 저장 중 오류가 발생했습니다.' };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        changePassword,
        defaultPasswordHint: DEFAULT_ADMIN_PASSWORD,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
