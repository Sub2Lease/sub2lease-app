import type { Any } from "./types";

export function runMaybeFn<T, Args extends Any[]>(fn: T | ((...args: Args) => T), ...args: Args): T {
  if (typeof fn === "function") {
    return (fn as (...args: Args) => T)(...args);
  } else {
    return fn;
  }
}
