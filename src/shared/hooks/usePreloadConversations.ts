import { useEffect } from "react";
import { useMyUserId } from "@/app/stores/authStore";
import { useChatStore, conversationKey } from "@/shared/stores/chatStore";
import { getConversationPartners, getConversation, getUserById } from "@/shared/api/backendGO/endpoints";
import type { ChatMessage } from "@/shared/hooks/useChatSocket";

/**
 * Preloads all conversation history into the chat store.
 * Mount this once at the app root so MessagesSection on the Dashboard
 * always has data without requiring a visit to /messages first.
 */
export function usePreloadConversations() {
  const myUserId = useMyUserId();

  useEffect(() => {
    if (myUserId == null) return;

    getConversationPartners()
      .then((partners: unknown) => {
        const list = partners as { partner_id: number; last_message_at: string }[];
        list.forEach(({ partner_id }) => {
          const key = conversationKey(myUserId, partner_id);
          const existing = useChatStore.getState().conversations[key];

          getUserById(partner_id)
            .then((user) => {
              const u = user as unknown as {
                username?: string;
                first_name?: string;
                profile_photo_url?: string | null;
              };
              const name = u.username ?? u.first_name ?? String(partner_id);
              useChatStore.getState().openConversation(
                partner_id,
                name,
                myUserId,
                u.profile_photo_url ?? null,
              );

              if (!existing || existing.messages.length === 0) {
                getConversation(partner_id)
                  .then((msgs) => {
                    useChatStore.getState().loadHistory(
                      msgs as unknown as ChatMessage[],
                      myUserId,
                      partner_id,
                      name,
                    );
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {
              useChatStore.getState().openConversation(partner_id, String(partner_id), myUserId);
            });
        });
      })
      .catch(() => {});
  }, [myUserId]);
}