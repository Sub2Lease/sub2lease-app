export function shorten(value?: string) {
  if (value === undefined) return undefined;
  return `${value.substring(0, 6)}..${value.substring(value.length - 4)}`;
}
