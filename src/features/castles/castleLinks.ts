/** See https://developers.google.com/maps/documentation/urls (no API key). */
export function googleMapsUrl([lng, lat]: readonly [number, number]): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`
}

/** The article title is as shown on Japanese Wikipedia. */
export function wikipediaUrl(title: string): string {
  return `https://ja.wikipedia.org/wiki/${encodeURIComponent(title)}`
}
