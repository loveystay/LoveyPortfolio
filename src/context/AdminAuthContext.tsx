import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  const resolveAdminRole = async (userId?: string) => {
    if (!userId) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
    const { data, error } = await requireSupabase().from('profiles').select('role').eq('id', userId).maybeSingle();
    const isAdmin = !error && data?.role === 'admin';
    setIsAuthenticated(isAdmin);
    setIsLoading(false);
    return isAdmin;
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    const client = requireSupabase();
    void client.auth.getSession().then(({ data }) => void resolveAdminRole(data.session?.user.id));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      void resolveAdminRole(session?.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    const isAdmin = await resolveAdminRole(data.user.id);
    if (!isAdmin) await client.auth.signOut();
    return isAdmin;
  };

  const logout = async () => {
    const { error } = await requireSupabase().auth.signOut();
    if (error) throw new Error(error.message);
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    const client = requireSupabase();
    const { data: userData } = await client.auth.getUser();
    const email = userData.user?.email;
    if (!email) return { success: false, message: 'No authenticated administrator session.' };
    const { error: verifyError } = await client.auth.signInWithPassword({ email, password: oldPass });
    if (verifyError) return { success: false, message: 'Current password is incorrect.' };
    const { error: updateError } = await client.auth.updateUser({ password: newPass });
    return updateError
      ? { success: false, message: updateError.message }
      : { success: true, message: 'Password updated.' };
  };

  return <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, changePassword }}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
