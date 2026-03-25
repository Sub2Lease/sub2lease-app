import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatSocket } from "@/shared/hooks/useChatSocket";
import { useChatStore, conversationKey } from "@/shared/stores/chatStore";
import { useMyUserId } from "@/app/stores/authStore";
import { getConversation, getUserById, getConversationPartners } from "@/shared/api/backendGO/endpoints";
import type { ChatMessage } from "@/shared/hooks/useChatSocket";
import { Send, MessageSquare, Wifi, WifiOff } from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatDateDivider(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

function shouldShowDivider(msgs: ChatMessage[], index: number): boolean {
  if (index === 0) return true;
  const prev = new Date(msgs[index - 1].createdAt);
  const curr = new Date(msgs[index].createdAt);
  return (
    curr.getDate() !== prev.getDate() ||
    curr.getMonth() !== prev.getMonth() ||
    curr.getFullYear() !== prev.getFullYear()
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  name,
  photoUrl,
  size = "md",
}: {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${dim} rounded-full object-cover shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-white font-semibold shrink-0 uppercase`}
    >
      {name.charAt(0)}
    </div>
  );
}

// ─── Conversation list item ───────────────────────────────────────────────────

function ConversationItem({
  convKey,
  isActive,
  onClick,
}: {
  convKey: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const conv = useChatStore((s) => s.conversations[convKey]);
  if (!conv) return null;
  const lastMsg = conv.messages.at(-1);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all duration-150 border-b border-stone-100 ${
        isActive
          ? "bg-orange-50 border-l-[3px] border-l-orange-400"
          : "hover:bg-stone-50 border-l-[3px] border-l-transparent"
      }`}
    >
      <Avatar name={conv.withUsername} photoUrl={conv.withProfilePhoto} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm truncate ${
              conv.unreadCount > 0
                ? "font-semibold text-stone-900"
                : "font-medium text-stone-600"
            }`}
          >
            {conv.withUsername}
          </span>
          {lastMsg && (
            <span className="text-[11px] text-stone-400 shrink-0">
              {formatTime(lastMsg.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-stone-400 truncate flex-1">
            {lastMsg?.body ?? "No messages yet"}
          </p>
          {conv.unreadCount > 0 && (
            <span className="shrink-0 w-4 h-4 rounded-full bg-orange-400 text-white text-[10px] font-bold flex items-center justify-center">
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isMine,
  showAvatar,
  withUsername,
  withPhoto,
}: {
  msg: ChatMessage;
  isMine: boolean;
  showAvatar: boolean;
  withUsername: string;
  withPhoto?: string | null;
}) {
  const isOptimistic = msg.id.toString().startsWith("optimistic-");
  return (
    <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      {/* avatar placeholder keeps bubbles aligned */}
      <div className="w-7 shrink-0">
        {!isMine && showAvatar && (
          <Avatar name={withUsername} photoUrl={withPhoto} size="sm" />
        )}
      </div>
      <div
        className={`max-w-[65%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
          isMine
            ? `bg-orange-400 text-white rounded-br-sm ${isOptimistic ? "opacity-70" : ""}`
            : "bg-white border border-stone-200 text-stone-800 rounded-bl-sm shadow-sm"
        }`}
      >
        {msg.body}
        <span
          className={`block text-[10px] mt-0.5 ${isMine ? "text-orange-100 text-right" : "text-stone-400"}`}
        >
          {formatTime(msg.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ─── Chat panel ───────────────────────────────────────────────────────────────

function ChatPanel({
  convKey,
  myUserId,
  onSend,
}: {
  convKey: string;
  myUserId: number;
  onSend: (to: number, body: string) => void;
}) {
  const conv = useChatStore((s) => s.conversations[convKey]);
  const sendOptimistic = useChatStore((s) => s.sendOptimistic);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv?.messages.length]);

  const handleSend = () => {
    if (!draft.trim() || !conv) return;
    const optimistic: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      from: myUserId,
      to: conv.withUserId,
      body: draft.trim(),
      createdAt: new Date().toISOString(),
    };
    sendOptimistic(optimistic, myUserId);
    onSend(conv.withUserId, draft.trim());
    setDraft("");
    inputRef.current?.focus();
  };

  if (!conv) return null;

  const msgs = conv.messages;

  return (
    <div className="flex flex-col h-full">
      {/* chat header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100 bg-white shrink-0">
        <Avatar name={conv.withUsername} photoUrl={conv.withProfilePhoto} />
        <div>
          <p className="text-sm font-semibold text-stone-800">{conv.withUsername}</p>
          <p className="text-xs text-stone-400">
            {conv.messages.length > 0
              ? `${conv.messages.length} message${conv.messages.length !== 1 ? "s" : ""}`
              : "Start the conversation"}
          </p>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2 bg-[#faf9f7]">
        {msgs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-2 mt-20">
            <MessageSquare size={32} strokeWidth={1.2} />
            <p className="text-sm">Say hello to {conv.withUsername}</p>
          </div>
        )}

        {msgs.map((msg, i) => {
          const isMine = Number(msg.from) === Number(myUserId);
          // show avatar on last message in a sequence from the other person
          const nextMsg = msgs[i + 1];
          const showAvatar = !isMine && (!nextMsg || Number(nextMsg.from) === Number(myUserId));

          return (
            <div key={msg.id}>
              {shouldShowDivider(msgs, i) && (
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-[11px] text-stone-400 font-medium shrink-0">
                    {formatDateDivider(msg.createdAt)}
                  </span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
              )}
              <MessageBubble
                msg={msg}
                isMine={isMine}
                showAvatar={showAvatar}
                withUsername={conv.withUsername}
                withPhoto={conv.withProfilePhoto}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="px-4 py-3 border-t border-stone-100 bg-white shrink-0">
        <div className="flex items-center gap-2 bg-stone-100 rounded-2xl px-4 py-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${conv.withUsername}…`}
            className="flex-1 bg-transparent text-sm text-stone-800 placeholder-stone-400 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="shrink-0 w-8 h-8 rounded-xl bg-orange-400 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-white"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function MessagesPage() {
  const { userId: userIdParam } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  // userId is decoded from the JWT token and persisted in authStore — always
  // available synchronously, no async useMe() dependency needed for auth.
  const myUserId = useMyUserId() ?? undefined;

  const {
    conversations,
    activeConversationKey,
    openConversation,
    loadHistory,
    receiveMessage,
    markRead,
  } = useChatStore();

  // ── WebSocket ──
  const { connected, sendMessage } = useChatSocket({
    onMessage: useCallback(
      (msg: ChatMessage) => {
        if (myUserId == null) return;
        receiveMessage(msg, myUserId);

        // If sender is unknown, fetch their info so they appear in the sidebar
        const senderId = msg.from;
        const key = conversationKey(myUserId, senderId);
        const existing = useChatStore.getState().conversations[key];
        if (!existing || existing.withUsername === String(senderId)) {
          getUserById(senderId)
            .then((user) => {
              const u = user as unknown as { username?: string; first_name?: string; profile_photo_url?: string | null };
              const name = u.username ?? u.first_name ?? String(senderId);
              useChatStore.getState().openConversation(senderId, name, myUserId, u.profile_photo_url ?? null);
            })
            .catch(() => {
              useChatStore.getState().openConversation(senderId, String(senderId), myUserId);
            });
        }
      },
      [myUserId, receiveMessage],
    ),
  });

  // ── Load all conversation partners on mount (for /messages with no param) ──
  useEffect(() => {
    if (myUserId == null) return;
    getConversationPartners().then((partners: unknown) => {
      const list = partners as unknown as { partner_id: number; last_message_at: string }[];
      list.forEach(({ partner_id }) => {
        const key = conversationKey(myUserId, partner_id);
        const existing = useChatStore.getState().conversations[key];
        // Fetch user info and history for each partner not yet in store
        getUserById(partner_id)
          .then((user) => {
            const u = user as unknown as { username?: string; first_name?: string; profile_photo_url?: string | null };
            const name = u.username ?? u.first_name ?? String(partner_id);
            useChatStore.getState().openConversation(partner_id, name, myUserId, u.profile_photo_url ?? null);
            if (!existing || existing.messages.length === 0) {
              getConversation(partner_id).then((msgs) => {
                loadHistory(msgs as unknown as ChatMessage[], myUserId, partner_id, name);
              }).catch(() => {});
            }
          })
          .catch(() => {});
      });
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  // ── Open conversation from URL param ──
  useEffect(() => {
    if (!userIdParam || myUserId == null) return;
    const withUserId = Number(userIdParam);
    if (isNaN(withUserId)) return;

    const key = conversationKey(myUserId, withUserId);

    // Fetch user info then open conversation
    getUserById(withUserId)
      .then((user) => {
        const name =
          (user as unknown as { username?: string })?.username ??
          (user as unknown as { first_name?: string; last_name?: string })?.first_name ??
          String(withUserId);
        const photo =
          (user as unknown as { profile_photo_url?: string | null })?.profile_photo_url ?? null;
        openConversation(withUserId, name, myUserId, photo);
      })
      .catch(() => {
        openConversation(withUserId, String(withUserId), myUserId);
      });

    // Fetch conversation history
    getConversation(withUserId)
      .then((msgs) => {
        const name = useChatStore.getState().conversations[key]?.withUsername ?? String(withUserId);
        loadHistory(
          (msgs as unknown as ChatMessage[]),
          myUserId,
          withUserId,
          name,
        );
      })
      .catch(() => {/* history unavailable */});
  // openConversation and loadHistory are stable zustand actions — safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdParam, myUserId]);

  // ── Mark read when active conv changes ──
  useEffect(() => {
    if (activeConversationKey) markRead(activeConversationKey);
  }, [activeConversationKey, markRead]);

  const convList = Object.entries(conversations).sort(([, a], [, b]) => {
    const aLast = a.messages.at(-1)?.createdAt ?? "";
    const bLast = b.messages.at(-1)?.createdAt ?? "";
    return bLast.localeCompare(aLast);
  });

  const totalUnread = convList.reduce((n, [, c]) => n + c.unreadCount, 0);

  const handleSelectConversation = (_key: string, conv: (typeof conversations)[string]) => {
    if (myUserId == null) return;
    openConversation(conv.withUserId, conv.withUsername, myUserId, conv.withProfilePhoto);
    navigate(`/messages/${conv.withUserId}`, { replace: true });

    // Load history if not yet loaded
    if (conv.messages.length === 0) {
      getConversation(conv.withUserId)
        .then((msgs) => {
          loadHistory(msgs as unknown as ChatMessage[], myUserId, conv.withUserId, conv.withUsername);
        })
        .catch(() => {});
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-[280px] shrink-0 flex flex-col bg-white border-r border-stone-150">
        {/* header */}
        <div className="px-5 py-5 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-stone-900 tracking-tight">Messages</h1>
            {totalUnread > 0 && (
              <span className="flex items-center justify-center rounded-full bg-orange-400 text-white text-xs font-bold w-5 h-5 leading-none">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            {connected ? (
              <Wifi size={11} className="text-emerald-400" />
            ) : (
              <WifiOff size={11} className="text-stone-300" />
            )}
            <span className="text-[11px] text-stone-400">
              {connected ? "Connected" : "Connecting…"}
            </span>
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto">
          {convList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400 px-6 text-center py-16">
              <MessageSquare size={32} strokeWidth={1.2} />
              <p className="text-sm leading-relaxed">
                No conversations yet.
                <br />
                Message a listing to get started.
              </p>
            </div>
          ) : (
            convList.map(([convKey, conv]) => (
              <ConversationItem
                key={convKey}
                convKey={convKey}
                isActive={convKey === activeConversationKey}
                onClick={() => handleSelectConversation(convKey, conv)}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── Chat area ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#faf9f7]">
        {activeConversationKey && myUserId != null ? (
          <ChatPanel
            key={activeConversationKey}
            convKey={activeConversationKey}
            myUserId={myUserId}
            onSend={sendMessage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center">
              <MessageSquare size={28} strokeWidth={1.2} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-500">Select a conversation</p>
              <p className="text-xs text-stone-400 mt-1">
                or message someone from a listing
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}