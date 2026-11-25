/** Loads a file from public/data/. */
export async function fetchJson<T>(
  name: string,
  signal: AbortSignal,
): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`, {
    signal,
  })
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
  return response.json()
}
