/* eslint-disable react-refresh/only-export-components */

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: "dark",
};

const themeStore = create(
  persist(
    () => initialState, 
    { 
      name: "theme",
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // Ignore storage errors
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            // Ignore storage errors
          }
        },
      },
    }
  )
);

export const useTheme = () => themeStore(({ theme }) => theme);

export const setTheme = (theme: Theme) => themeStore.setState({ theme });

export function ThemeProvider() {
  // const theme = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    // if (theme === "system") {
    //   const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    //
    //   root.classList.add(systemTheme);
    //   return;
    // }

    // root.classList.add("dark");
  }, []);

  return null;
}
