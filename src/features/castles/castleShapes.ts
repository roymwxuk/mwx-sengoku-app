import type { Castle } from '../../data/castleSchema'

export type CastleType = Castle['type']

/** Width and height of the box the shapes are drawn in */
export const SHAPE_SIZE = 24

/** SVG paths, used on the map and in the legend */
export const CASTLE_SHAPES: Record<CastleType, string> = {
  // A peak
  山城: 'M12 1.5 18.5 8.5 23 21.5H1L5.5 8.5Z',
  // A low hill
  平山城: 'M1.5 20.5C2 10 6 5 12 5S22 10 22.5 20.5Z',
  // Flat ground
  平城: 'M3.5 3.5H20.5V20.5H3.5Z',
  // A house with eaves
  館: 'M12 2.5 22.5 10H19.5V21H4.5V10H1.5Z',
}
