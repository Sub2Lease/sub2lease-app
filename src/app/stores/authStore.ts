import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userId: number | null;
  tosAcceptedAt: string | null;
  setToken: (token: string) => void;
  setUserId: (id: number) => void;
  setTosAccepted: (timestamp: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}
function decodeToken(token: string): { user_id?: number } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      tosAcceptedAt: null,
      setToken: (token) => {
        const payload = decodeToken(token);
        set({ token, userId: payload?.user_id ?? null });
      },
      setUserId: (id) => set({ userId: id }),
      setTosAccepted: (timestamp) => set({ tosAcceptedAt: timestamp }),
      clearToken: () => set({ token: null, userId: null, tosAcceptedAt: null }),
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
export const useMyUserId = () => useAuthStore((s) => s.userId);
export const setToken = (token: string) => useAuthStore.getState().setToken(token);
export const setUserId = (id: number) => useAuthStore.getState().setUserId(id);
export const clearToken = () => useAuthStore.getState().clearToken();
export const setTosAccepted = (ts: string) => useAuthStore.getState().setTosAccepted(ts);