import { useEffect, useRef, useCallback, useState } from "react";
import { useAuthStore } from "@/app/stores/authStore";

export interface ChatMessage {
  id: string;
  from: number;
  to: number;
  body: string;
  createdAt: string;
}

interface UseChatSocketOptions {
  onMessage?: (msg: ChatMessage) => void;
}

function getTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    return (JSON.parse(raw) as { state?: { token?: string } })?.state?.token ?? null;
  } catch {
    return null;
  }
}

export function useChatSocket({ onMessage }: UseChatSocketOptions = {}) {
  // token from store (may be null on first render before rehydration)
  const storeToken = useAuthStore((s) => s.token);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef<typeof onMessage>(undefined);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    // Zustand persist rehydrates async — fall back to localStorage directly
    // so the token is available on the very first render.
    const token = storeToken ?? getTokenFromStorage();
    if (!token) return;

    const apiRoot = (import.meta.env.VITE_BACKEND_API_ROOT ?? "") as string;
    const wsRoot = apiRoot.replace(/^https?/, (m) => (m === "https" ? "wss" : "ws"));

    const ws = new WebSocket(`${wsRoot}/chat/ws?token=${token}`);
    wsRef.current = ws;

    let active = true;

    ws.onopen = () => {
      if (active) setConnected(true);
    };
    ws.onclose = () => {
      if (active) setConnected(false);
      wsRef.current = null;
    };
    ws.onerror = () => {
      if (active) setConnected(false);
    };
    ws.onmessage = (event) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data as string);
        onMessageRef.current?.(msg);
      } catch {
        // ignore malformed frames
      }
    };

    return () => {
      active = false;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [storeToken]);

  const sendMessage = useCallback((to: number, body: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ to, body }));
    }
  }, []);

  return { connected, sendMessage };
}