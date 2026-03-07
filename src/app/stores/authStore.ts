import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,

      setToken: (token) => set({ token }),

      clearToken: () => set({ token: null }),

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