export function toNumber(value?: string | number, def = 0) {
  if (value === undefined) {
    return def;
  }

  try {
    const val = Number.parseFloat(value.toString());

    if (Number.isNaN(val)) {
      return def;
    }

    return val;
  } catch (e) {
    return def;
  }
}

/**
 * Safely converts a value to BigInt, handling scientific notation strings
 * @param value - The value to convert to BigInt
 * @returns BigInt representation of the value, or 0n if conversion fails
 */
export function toBigInt(value?: string | number | bigint): bigint {
  if (value === undefined || value === null) {
    return 0n;
  }

  // If it's already a BigInt, return it
  if (typeof value === "bigint") {
    return value;
  }

  try {
    const str = value.toString();
    
    // Handle scientific notation (e.g., "2.844547e+16")
    if (str.includes("e") || str.includes("E")) {
      const num = Number.parseFloat(str);
      if (Number.isNaN(num)) {
        return 0n;
      }
      // Convert to string without scientific notation
      return BigInt(num.toLocaleString("fullwide", { useGrouping: false }));
    }
    
    // Handle regular numbers and strings
    return BigInt(str);
  } catch (e) {
    console.warn("Failed to convert value to BigInt:", value, e);
    return 0n;
  }
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function inverseLerp(a: number, b: number, value: number) {
  return clamp((value - a) / (b - a));
}

export function clamp(value: number, min = 0, max = 1) {
  if (value > max) {
    return max;
  }
  if (value < min) {
    return min;
  }
  return value;
}

export function min(...vals: number[]) {
  let smallest = Number.MAX_VALUE;

  for (const val of vals) {
    if (val >= smallest) {
      continue;
    }

    smallest = val;
  }

  return smallest;
}

export function max(...vals: number[]) {
  let biggest = -Number.MAX_VALUE;

  for (const val of vals) {
    if (val <= biggest) {
      continue;
    }

    biggest = val;
  }

  return biggest;
}

export function abs(val: number) {
  if (val < 0) return -val;

  return val;
}

export function sigmoid(x: number, c: number) {
  return 1 / (1 + Math.exp(x * -c));
}

export function softClamp(x: number, min: number, max: number, c: number = 1) {
  const f = ((x - min) / (max - min)) * 2 - 1;
  return min + sigmoid(f, c) * (max - min);
}
