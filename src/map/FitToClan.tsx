import type { LngLatBoundsLike, PaddingOptions } from 'maplibre-gl'
import { useEffect, useRef, type RefObject } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type { CastleCollection } from '../data/castleSchema'
import { useClanFilter } from '../features/clans/clanFilterStore'

/** Never closer than this, so that a clan with one castle isn't zoomed right in */
const MAX_ZOOM = 8
const GAP = 24
/** Clear of the title and year switch */
const TOP = 64

type ElementRef = RefObject<HTMLElement | null>

interface Props {
  /** The clan's castles, the ones on the map */
  castles: CastleCollection
  /** The detail panel: on the left, or a bottom sheet on phones */
  panelRef: ElementRef
  /** The legend, its button and the filter chip, top right */
  legendRef: ElementRef
  /** The castle list and about buttons, bottom left */
  bottomBarRef: ElementRef
}

/**
 * Fits the map to the box around the clan's castles when the clan is chosen.
 * The box, not the average position: castles bunched in one region would pull
 * an average towards them and push a far-off castle off screen.
 * Switching years doesn't move the map.
 */
export function FitToClan({
  castles,
  panelRef,
  legendRef,
  bottomBarRef,
}: Props) {
  const { current: map } = useMap()
  const fits = useClanFilter((s) => s.fits)
  const done = useRef(0)

  useEffect(() => {
    if (!map || fits === done.current) return
    done.current = fits
    const bounds = boundsOf(castles)
    if (!bounds) return
    map.fitBounds(bounds, {
      padding: paddingFor(
        map.getContainer(),
        panelRef.current,
        legendRef.current,
        bottomBarRef.current,
      ),
      maxZoom: MAX_ZOOM,
    })
  }, [map, fits, castles, panelRef, legendRef, bottomBarRef])

  return null
}

function boundsOf({ features }: CastleCollection): LngLatBoundsLike | null {
  if (features.length === 0) return null
  const lngs = features.map((c) => c.geometry.coordinates[0])
  const lats = features.map((c) => c.geometry.coordinates[1])
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
}

/** Keeps the castles out from under the panel, legend and buttons. */
function paddingFor(
  container: HTMLElement,
  panel: HTMLElement | null,
  legend: HTMLElement | null,
  bottomBar: HTMLElement | null,
): PaddingOptions {
  const map = container.getBoundingClientRect()
  const rect = (el: HTMLElement) => el.getBoundingClientRect()
  let left = 0
  let right = 0
  let bottom = bottomBar ? map.bottom - rect(bottomBar).top : 0

  if (panel) {
    const isSheet = panel.offsetWidth >= container.clientWidth
    if (isSheet) bottom = Math.max(bottom, map.bottom - rect(panel).top)
    else left = rect(panel).right - map.left
  }
  let top = TOP
  if (legend) {
    // Keep clear of the narrower strip: the one beside the legend, or the one
    // above its bottom (a closed legend on a phone is short but wide).
    const fromRight = map.right - rect(legend).left
    const fromTop = rect(legend).bottom - map.top
    if (fromRight * map.height <= fromTop * map.width) right = fromRight
    else top = Math.max(top, GAP + fromTop)
  }

  // On phones these can cover most of the map: keep at least half of it for
  // the castles, even if some end up under the legend or sheet.
  return {
    top,
    left: GAP + left,
    right: GAP + Math.max(0, Math.min(right, map.width / 2 - left - 2 * GAP)),
    bottom: Math.max(GAP, Math.min(GAP + bottom, map.height / 2 - top)),
  }
}
