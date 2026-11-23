import type { Castle } from '../../data/castleSchema'

type YearRange = NonNullable<Castle['built']>

/** 1576年, or 1600〜1601年 when sources disagree or are vague. */
export function formatYears({ earliest, latest }: YearRange): string {
  return earliest === latest ? `${earliest}年` : `${earliest}〜${latest}年`
}
