import { Card, EmptyState, SectionHeader } from "./Components";
import { PLACEHOLDER_MESSAGES } from "./Placeholders";

export function MessagesSection() {
  return (
    <section>
      <SectionHeader
        title="Messages"
        count={PLACEHOLDER_MESSAGES.filter((m) => m.unread).length}
      />
      {PLACEHOLDER_MESSAGES.length === 0 ? (
        <EmptyState message="No messages yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {PLACEHOLDER_MESSAGES.map((msg) => (
            <Card
              key={msg.id}
              className={`flex items-start gap-3 cursor-pointer hover:bg-foreground/5 transition-colors ${msg.unread ? "border-foreground/20" : ""}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground">
                {msg.from.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${msg.unread ? "font-semibold text-foreground" : "font-medium text-foreground/70"}`}>
                    {msg.from}
                  </p>
                  <span className="text-xs text-foreground/40 shrink-0">{msg.time}</span>
                </div>
                <p className="text-xs text-foreground/50 truncate mt-0.5">{msg.preview}</p>
              </div>
              {msg.unread && <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground" />}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}