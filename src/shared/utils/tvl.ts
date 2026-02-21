export interface TvlData {
  tvl_usd: number;
  asset_tvl_usd: number;
  debt_tvl_usd: number;
}

export function getTvl(tvl: TvlData | undefined, showDebt: boolean | undefined | null) {
  if (!tvl) return 0;
  return showDebt ? tvl.asset_tvl_usd + tvl.debt_tvl_usd : tvl.tvl_usd;
}
