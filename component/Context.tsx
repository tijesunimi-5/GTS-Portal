'use client';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
  department?: string;
  uniqueID?: string;
  email?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setAlertMessage: (message: string, type: 'success' | 'error' | 'loading' | 'info') => void;
  alertMessage: { message: string; type: 'success' | 'error' | 'loading' | 'info' } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useCustomContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useCustomContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading' | 'info';
  } | null>(null);

  const isMounted = useRef(false);

  // Restore user from localStorage on mount
  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
      setUser(null);
    }
    isMounted.current = true;
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        setAlertMessage: (message, type) => setAlertMessage({ message, type }),
        alertMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};