import { useCallback } from "react";

const GEOCODIO_API_KEY = import.meta.env.VITE_GEOCODIO_API_KEY as string;

export function useCoordinates() {
  if (!GEOCODIO_API_KEY) throw new Error("GEOCODIO_API_KEY missing");

  const getCoordinates = useCallback(async (query: string) => {
    if (!query.trim()) return null;
    const queryParams = new URLSearchParams({
      q: query,
      api_key: GEOCODIO_API_KEY,
    });
    return fetch(`https://api.geocod.io/v1.11/geocode?${queryParams}`);
  }, []);

  return { getCoordinates };
}