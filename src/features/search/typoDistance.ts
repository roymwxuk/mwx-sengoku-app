/**
 * The fewest typos (a wrong, missing, extra or swapped letter) that turn
 * `query` into some part of `text`.
 */
export function typoDistance(query: string, text: string): number {
  const q = [...query]
  const t = [...text]
  let beforePrevious: number[] = []
  // A match may start anywhere in the text, so the first row is all 0.
  let previous: number[] = Array(t.length + 1).fill(0)

  for (let i = 1; i <= q.length; i++) {
    const row = [i]
    for (let j = 1; j <= t.length; j++) {
      const wrong = previous[j - 1] + (q[i - 1] === t[j - 1] ? 0 : 1)
      row[j] = Math.min(wrong, previous[j] + 1, row[j - 1] + 1)
      const swapped =
        i > 1 && j > 1 && q[i - 1] === t[j - 2] && q[i - 2] === t[j - 1]
      if (swapped) row[j] = Math.min(row[j], beforePrevious[j - 2] + 1)
    }
    beforePrevious = previous
    previous = row
  }
  return Math.min(...previous) // it may also end anywhere
}
