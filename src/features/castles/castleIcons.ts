import type { ExpressionSpecification } from 'maplibre-gl'
import { SHU, SUMI, WASHI } from '../../map/mapStyle'
import { CASTLE_SHAPES, SHAPE_SIZE, type CastleType } from './castleShapes'

/** Pixels per CSS pixel, so the icons stay sharp on dense screens. */
export const ICON_PIXEL_RATIO = 3

const STATUS_SIZE = 18 // CSS pixels
const CENTER = STATUS_SIZE / 2

type Draw = (context: CanvasRenderingContext2D, color: string) => void

/** A dotted circle */
const drawPlanned: Draw = (context, color) => {
  context.beginPath()
  context.arc(CENTER, CENTER, 6, 0, 2 * Math.PI)
  context.fillStyle = WASHI
  context.fill()
  context.strokeStyle = color
  context.lineWidth = 2
  context.setLineDash([0, (2 * Math.PI * 6) / 10]) // 10 round dots
  context.stroke()
}

/** An ✕ with a paper-coloured edge */
const drawRuin: Draw = (context, color) => {
  const near = 4
  const far = STATUS_SIZE - near
  for (const [style, width] of [
    [WASHI, 6],
    [color, 3],
  ] as const) {
    context.strokeStyle = style
    context.lineWidth = width
    context.beginPath()
    context.moveTo(near, near)
    context.lineTo(far, far)
    context.moveTo(far, near)
    context.lineTo(near, far)
    context.stroke()
  }
}

/** Drawn here, as symbols in fonts differ by device. */
function render(
  size: number,
  draw: (context: CanvasRenderingContext2D) => void,
): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size * ICON_PIXEL_RATIO
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available')

  context.scale(ICON_PIXEL_RATIO, ICON_PIXEL_RATIO)
  context.lineCap = 'round'
  context.lineJoin = 'round'
  draw(context)
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

function renderType(type: CastleType, fill: string, edge: string): ImageData {
  const shape = new Path2D(CASTLE_SHAPES[type])
  return render(SHAPE_SIZE, (context) => {
    context.fillStyle = fill
    context.fill(shape)
    context.strokeStyle = edge
    context.lineWidth = 2
    context.stroke(shape)
  })
}

const renderStatus = (draw: Draw, color: string) =>
  render(STATUS_SIZE, (context) => draw(context, color))

const STATUS_ICONS = new Map([
  ['planned', () => renderStatus(drawPlanned, SUMI)],
  ['planned-selected', () => renderStatus(drawPlanned, SHU)],
  ['ruin', () => renderStatus(drawRuin, SUMI)],
  ['ruin-selected', () => renderStatus(drawRuin, SHU)],
])

const isCastleType = (type: string): type is CastleType =>
  Object.hasOwn(CASTLE_SHAPES, type)

/** The name of the icon for a castle's type, e.g. 山城|#b0890e|#2b2622 */
export const typeIcon = (
  fill: ExpressionSpecification | string,
  edge: string,
): ExpressionSpecification => ['concat', ['get', 'type'], '|', fill, '|', edge]

/** null: there's no icon with this name */
export function renderIcon(name: string): ImageData | null {
  const status = STATUS_ICONS.get(name)
  if (status) return status()

  const [type, fill, edge] = name.split('|')
  return isCastleType(type) ? renderType(type, fill, edge) : null
}
