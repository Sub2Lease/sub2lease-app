import { math } from "./math.ts";

export const random = {
  range: (min: number, max: number) => math.lerp(min, max, Math.random()),
  rangeInt: (min: number, max: number) => Math.floor(random.range(min, max)),
};
