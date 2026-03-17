export function getUserIdFromToken(): number | null {
  try {
    const raw = localStorage.getItem("auth");
    const token = raw
      ? (JSON.parse(raw) as { state?: { token?: string } })?.state?.token ?? null
      : null;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.user_id === "number" ? payload.user_id : null;
  } catch {
    return null;
  }
}