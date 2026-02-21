const timeScales = {
  ms: 1,
  secs: 1 * 1000,
  mins: 1 * 1000 * 60,
  hours: 1 * 1000 * 60 * 60,
  days: 1 * 1000 * 60 * 60 * 24,
  weeks: 1 * 1000 * 60 * 60 * 24 * 7,
  months: 1 * 1000 * 60 * 60 * 24 * 30,
  years: 1 * 1000 * 60 * 60 * 24 * 365,
} as const;

export const ms = Object.fromEntries(
  Object.entries(timeScales).map(([key, value]) => [key, (num: number) => num * value]),
) as {
  [K in keyof typeof timeScales]: (value: number) => number;
};
