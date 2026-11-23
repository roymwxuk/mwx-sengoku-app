import { SUMI, WASHI } from '../../map/mapStyle'

/** Castles not built yet, or whose owner isn't known, in the year shown */
export const NO_CLAN_COLOR = '#6b645c'

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const value = parseInt(hex.slice(i, i + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y)
  return (light + 0.05) / (dark + 0.05)
}

/** Ink or paper, whichever reads better on the colour */
export function textColorOn(color: string): string {
  return contrast(color, SUMI) > contrast(color, WASHI) ? SUMI : WASHI
}
