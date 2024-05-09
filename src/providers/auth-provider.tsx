'use client';

import { createContext, useCallback } from 'react';
import useEncryptLocalStorage from '../hooks/use-encrypt-local-store';

interface AuthContextProps {
  token: string | null;
  setToken: (data: unknown) => void;
  clearToken: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useEncryptLocalStorage<string | null>(
    'token',
    null
  );

  const handleClearToken = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const handleSetToken = useCallback(
    (data: unknown) => {
      const token = JSON.stringify(data);
      setToken(token);
    },
    [setToken]
  );

  return (
    <AuthContext.Provider
      value={{ token, setToken: handleSetToken, clearToken: handleClearToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
