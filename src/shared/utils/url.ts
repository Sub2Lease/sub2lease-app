export function joinUrl(...parts: string[]): string {
  if (parts.length < 2) return parts[0] || "";

  const cleanParts = parts.map((part, index) => {
    if (index !== 0) {
      return part.replace(/^\/+/, "");
    }
    return part.replace(/\/+$/, "");
  });

  return cleanParts.join("/");
}
