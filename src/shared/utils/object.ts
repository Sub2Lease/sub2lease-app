import type { Obj } from "./types";

export function keys<T extends Obj>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
