import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  tosAcceptedAt: string | null;
  setToken: (token: string) => void;
  setTosAccepted: (timestamp: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      tosAcceptedAt: null,
      setToken: (token) => set({ token }),
      setTosAccepted: (timestamp) => set({ tosAcceptedAt: timestamp }),
      clearToken: () => set({ token: null, tosAcceptedAt: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth",
    },
  ),
);

// Selectors
export const useToken = () => useAuthStore((s) => s.token);
export const useIsAuthenticated = () => useAuthStore((s) => !!s.token);
export const setToken = (token: string) => useAuthStore.getState().setToken(token);
export const clearToken = () => useAuthStore.getState().clearToken();
export const setTosAccepted = (ts: string) => useAuthStore.getState().setTosAccepted(ts);