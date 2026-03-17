export function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function statusColor(status: string) {
  if (status === "accepted") return "text-green-600 bg-green-50";
  if (status === "declined") return "text-red-500 bg-red-50";
  return "text-amber-600 bg-amber-50";
}