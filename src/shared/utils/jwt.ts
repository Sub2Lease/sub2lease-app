export interface JwtPayload {
  exp: number;
  jti?: string;
  type?: string;
  user_id?: string;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function getTokenExpirationDate(token: string): Date | null {
  const payload = decodeJwt(token);
  if (!payload?.exp) return null;

  return new Date(payload.exp * 1000); // Convert Unix timestamp to Date
}
