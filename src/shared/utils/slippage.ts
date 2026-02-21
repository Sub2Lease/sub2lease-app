/**
 * Converts a slippage percentage to basis points (bps)
 * @param slippagePercent - The slippage percentage (e.g., 0.5 for 0.5%)
 * @returns The slippage in basis points (e.g., 50 for 0.5%)
 */
export function slippageToBps(slippagePercent: number): number {
  return Math.round(slippagePercent * 100);
}

/**
 * Converts basis points (bps) to a slippage percentage
 * @param bps - The slippage in basis points (e.g., 50 for 0.5%)
 * @returns The slippage percentage (e.g., 0.5 for 0.5%)
 */
export function bpsToSlippage(bps: number): number {
  return bps / 100;
}

/**
 * Bounds a slippage value to a safe range
 * @param slippagePercent - The slippage percentage to bound
 * @param minPercent - The minimum allowed slippage percentage (default: 0.1%)
 * @param maxPercent - The maximum allowed slippage percentage (default: 10%)
 * @returns The bounded slippage percentage
 */
export function boundSlippage(slippagePercent: number, minPercent: number = 0.1, maxPercent: number = 10): number {
  return Math.max(minPercent, Math.min(maxPercent, slippagePercent));
}

/**
 * Calculates the minimum amount to receive based on slippage percentage
 * @param amount - The original amount
 * @param slippagePercent - The slippage percentage (e.g., 0.5 for 0.5%)
 * @returns The minimum amount to receive after applying slippage
 */
export function calculateMinimumAmount(amount: bigint, slippagePercent: number): bigint {
  const boundedSlippage = boundSlippage(slippagePercent);
  const slippageFactor = 1 - boundedSlippage / 100;
  return (amount * BigInt(Math.floor(slippageFactor * 10000))) / BigInt(10000);
}
