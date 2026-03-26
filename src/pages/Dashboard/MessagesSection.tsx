import { useNavigate } from "react-router-dom";
import { Card, EmptyState, SectionHeader } from "./Components";
import { useChatStore } from "@/shared/stores/chatStore";

export function MessagesSection() {
  const navigate = useNavigate();
  const conversations = useChatStore((s) => s.conversations);

  const convList = Object.entries(conversations)
    .map(([key, conv]) => ({ key, conv }))
    .sort((a, b) => {
      const aLast = a.conv.messages.at(-1)?.createdAt ?? "";
      const bLast = b.conv.messages.at(-1)?.createdAt ?? "";
      return bLast.localeCompare(aLast);
    });

  return (
    <section>
      <SectionHeader title="Messages" />
      {convList.length === 0 ? (
        <EmptyState message="No messages yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {convList.slice(0, 5).map(({ conv }) => {
            const lastMsg = conv.messages.at(-1);

            return (
              <Card
                key={conv.withUserId}
                className="cursor-pointer hover:bg-foreground/5 transition-colors"
              >
                <div
                  className="flex items-start gap-3"
                  onClick={() => navigate(`/messages/${conv.withUserId}`)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground overflow-hidden uppercase">
                    {conv.withProfilePhoto ? (
                      <img
                        src={conv.withProfilePhoto}
                        alt={conv.withUsername}
                        className="size-full object-cover"
                      />
                    ) : (
                      conv.withUsername.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground/70 truncate">
                        {conv.withUsername}
                      </p>
                      {lastMsg && (
                        <span className="text-xs text-foreground/40 shrink-0">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/50 truncate mt-0.5">
                      {lastMsg?.body ?? "No messages yet"}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
          {convList.length > 5 && (
            <button
              onClick={() => navigate("/messages")}
              className="text-xs text-center text-foreground/50 hover:text-foreground/80 transition-colors py-1"
            >
              View all {convList.length} conversations →
            </button>
          )}
        </div>
      )}
    </section>
  );
}