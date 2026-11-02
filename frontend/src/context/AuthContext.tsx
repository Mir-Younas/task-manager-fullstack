
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  invalidateAuthSession,
  setSessionExpiredHandler,
} from "../config/axios";

import { authService } from "../services/auth.service";
import { AuthContext } from "./auth.context";

import type { AuthUser, LoginInput } from "../types/auth.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = useRef(0);

  const refreshUser = useCallback(async (): Promise<void> => {
    const currentSessionId = sessionId.current;

    try {
      const response = await authService.getMe();

      if (currentSessionId === sessionId.current) {
        setUser(response.user);
      }
    } catch (error) {
      if (currentSessionId === sessionId.current) {
        setUser(null);
      }

      throw error;
    }
  }, []);

  const login = useCallback(async (data: LoginInput): Promise<void> => {
    const response = await authService.login(data);

    sessionId.current += 1;
    invalidateAuthSession();

    setUser(response.user);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    sessionId.current += 1;
    invalidateAuthSession();

    setUser(null);

    await authService.logout();
  }, []);

  useEffect(() => {
    let active = true;
    const currentSessionId = sessionId.current;

    const handleSessionExpired = () => {
      sessionId.current += 1;
      setUser(null);
    };

    setSessionExpiredHandler(handleSessionExpired);

    authService
      .getMe()
      .then((response) => {
        if (active && currentSessionId === sessionId.current) {
          setUser(response.user);
        }
      })
      .catch(() => {
        if (active && currentSessionId === sessionId.current) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      setSessionExpiredHandler(null);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
