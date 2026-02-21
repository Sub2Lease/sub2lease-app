export const math = {
  min: Math.min,
  max: Math.max,
  clamp: (value: number, min: number, max: number) => Math.min(max, Math.max(min, value)),
  lerp: (a: number, b: number, t: number) => a + (b - a) * t,
  lerpClamped: (a: number, b: number, t: number) => math.lerp(a, b, math.clamp(t, 0, 1)),
  inverseLerp: (a: number, b: number, value: number) => (value - a) / (b - a),
  inverseLerpClamped: (a: number, b: number, value: number) => math.clamp(math.inverseLerp(a, b, value), 0, 1),
};
