import { SHU, SUMI, WASHI } from '../../map/mapStyle'

/** Pixels per CSS pixel, so the icons stay sharp on dense screens. */
export const ICON_PIXEL_RATIO = 3

const SIZE = 18 // CSS pixels
const CENTER = SIZE / 2

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
  const far = SIZE - near
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
function render(draw: Draw, color: string): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE * ICON_PIXEL_RATIO
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available')

  context.scale(ICON_PIXEL_RATIO, ICON_PIXEL_RATIO)
  context.lineCap = 'round'
  draw(context, color)
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

export const CASTLE_ICONS = {
  planned: () => render(drawPlanned, SUMI),
  'planned-selected': () => render(drawPlanned, SHU),
  ruin: () => render(drawRuin, SUMI),
  'ruin-selected': () => render(drawRuin, SHU),
}
