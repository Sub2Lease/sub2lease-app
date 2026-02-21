export function safeParseFloat(value: string): number {
  const parsed = Number.parseFloat(value);
  return value.trim() === "" || Number.isNaN(parsed) ? 0 : parsed;
}
