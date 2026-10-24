// Deterministic (seeded) torn-paper edge generator. Same seed -> same
// jagged shape every load (server and client agree, no hydration risk) —
// no Math.random() anywhere here.

/** mulberry32: small, fast, deterministic PRNG. */
function mulberry32(seed: number) {
  let state = seed
  return function next() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Point = [number, number]

function jaggedEdge(rand: () => number, baseY: number, band: number, segments: number): Point[] {
  const points: Point[] = []
  for (let i = 0; i <= segments; i++) {
    const x = i / segments
    // Corners stay close to the true edge so the card still reads as
    // roughly rectangular; the middle segments jitter the most.
    const edgeFalloff = i === 0 || i === segments ? 0.25 : 1
    const y = baseY + rand() * band * edgeFalloff
    points.push([x, y])
  }
  return points
}

/**
 * Builds a `<polygon>` `points` string (objectBoundingBox units, 0-1) for a
 * torn-paper card: straight left/right edges, jagged top and bottom. Pass
 * the same `seed` every render (e.g. the card's index) to get an identical
 * shape on every load — used as a `clip-path` in TornCard.
 */
export function tornCardClipPoints(seed: number, segments = 7): string {
  const rand = mulberry32(seed * 7919 + 1)

  const top = jaggedEdge(rand, 0, 0.05, segments)
  const bottom = jaggedEdge(rand, 0.95, 0.05, segments).slice().reverse()

  const polygon: Point[] = [...top, ...bottom]
  return polygon.map(([x, y]) => `${x.toFixed(4)},${y.toFixed(4)}`).join(' ')
}
