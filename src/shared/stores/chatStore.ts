import { create } from "zustand";
import type { ChatMessage } from "@/shared/hooks/useChatSocket";

export function conversationKey(a: number, b: number): string {
  return `${Math.min(a, b)}:${Math.max(a, b)}`;
}

export interface Conversation {
  withUserId: number;
  withUsername: string;
  withProfilePhoto?: string | null;
  messages: ChatMessage[];
  unreadCount: number;
}

interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationKey: string | null;

  receiveMessage: (msg: ChatMessage, myUserId: number) => void;
  openConversation: (
    withUserId: number,
    withUsername: string,
    myUserId: number,
    withProfilePhoto?: string | null
  ) => void;
  sendOptimistic: (msg: ChatMessage, myUserId: number) => void;
  loadHistory: (msgs: ChatMessage[], myUserId: number, withUserId: number, withUsername: string) => void;
  markRead: (key: string) => void;
  setActiveKey: (key: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: {},
  activeConversationKey: null,

  receiveMessage: (msg, myUserId) => {
    const otherId = msg.from === myUserId ? msg.to : msg.from;
    const key = conversationKey(myUserId, otherId);
    const isActive = get().activeConversationKey === key;
    set((state) => {
      const existing = state.conversations[key];
      // deduplicate by id
      const already = existing?.messages.some((m) => m.id === msg.id);
      if (already) return state;
      return {
        conversations: {
          ...state.conversations,
          [key]: {
            withUserId: otherId,
            withUsername: existing?.withUsername ?? String(otherId),
            withProfilePhoto: existing?.withProfilePhoto,
            messages: [...(existing?.messages ?? []), msg],
            unreadCount: isActive ? 0 : (existing?.unreadCount ?? 0) + 1,
          },
        },
      };
    });
  },

  sendOptimistic: (msg, myUserId) => {
    const key = conversationKey(myUserId, msg.to);
    set((state) => {
      const existing = state.conversations[key];
      return {
        conversations: {
          ...state.conversations,
          [key]: {
            withUserId: msg.to,
            withUsername: existing?.withUsername ?? String(msg.to),
            withProfilePhoto: existing?.withProfilePhoto,
            messages: [...(existing?.messages ?? []), msg],
            unreadCount: 0,
          },
        },
      };
    });
  },

  loadHistory: (msgs, myUserId, withUserId, withUsername) => {
    const key = conversationKey(myUserId, withUserId);
    set((state) => {
      const existing = state.conversations[key];
      return {
        conversations: {
          ...state.conversations,
          [key]: {
            withUserId,
            withUsername,
            withProfilePhoto: existing?.withProfilePhoto,
            messages: [
              ...msgs,
              ...(existing?.messages ?? []).filter(
                (m) => m.id.startsWith("optimistic-") && !msgs.some((h) => h.id === m.id)
              ),
            ],
            unreadCount: existing?.unreadCount ?? 0,
          },
        },
      };
    });
  },

  openConversation: (withUserId, withUsername, myUserId, withProfilePhoto) => {
    const key = conversationKey(myUserId, withUserId);
    set((state) => ({
      activeConversationKey: key,
      conversations: {
        ...state.conversations,
        [key]: {
          withUserId,
          withUsername,
          withProfilePhoto: withProfilePhoto ?? state.conversations[key]?.withProfilePhoto,
          messages: state.conversations[key]?.messages ?? [],
          unreadCount: 0,
        },
      },
    }));
  },

  markRead: (key) => {
    set((state) => {
      const conv = state.conversations[key];
      if (!conv) return state;
      return {
        conversations: {
          ...state.conversations,
          [key]: { ...conv, unreadCount: 0 },
        },
      };
    });
  },

  setActiveKey: (key) => set({ activeConversationKey: key }),
}));