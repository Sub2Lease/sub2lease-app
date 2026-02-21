export function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

export function isReadonlyArray<T>(value: T | readonly T[]): value is readonly T[] {
  return Array.isArray(value);
}
