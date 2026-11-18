export type ShapeKind =
  | 'star' | 'gear' | 'burst' | 'donut' | 'cheese' | 'arrow' | 'bolt'
  | 'cross' | 'heart' | 'pacman' | 'squiggle'

type Pt = [number, number]

const N = (v: number) => +v.toFixed(1)
const P = (a: number[][]) => 'M' + a.map((p) => N(p[0]) + ' ' + N(p[1])).join('L') + 'Z'
const C = (cx: number, cy: number, r: number) =>
  `M${N(cx - r)} ${N(cy)}A${N(r)} ${N(r)} 0 1 1 ${N(cx + r)} ${N(cy)}A${N(r)} ${N(r)} 0 1 1 ${N(cx - r)} ${N(cy)}Z`
const rot = (pts: Pt[], a: number, cx: number, cy: number): Pt[] => {
  const s = Math.sin(a)
  const c = Math.cos(a)
  return pts.map(([x, y]): Pt => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c])
}
const pct = (list: Pt[], w: number, h: number): Pt[] =>
  list.map(([x, y]): Pt => [(x / 100) * w, (y / 100) * h])

/** Each generator gets the pixel size and returns an SVG path (evenodd, so holes work). */
export const G: Record<ShapeKind, (w: number, h: number) => string> = {
  star: (w, h, n = 5, ri = 0.42) => {
    const R = Math.min(w, h) / 2
    return P(
      Array.from({ length: n * 2 }, (_, i) => {
        const a = (Math.PI * i) / n - Math.PI / 2
        const r = i % 2 ? R * ri : R
        return [w / 2 + r * Math.cos(a), h / 2 + r * Math.sin(a)]
      }),
    )
  },
  gear: (w, h) => {
    const R = Math.min(w, h) / 2
    const r0 = R * 0.8
    const t = 12
    const p = (2 * Math.PI) / t
    const pts: number[][] = []
    for (let i = 0; i < t; i++) {
      const a = i * p - Math.PI / 2
      ;[[-0.3, r0], [-0.2, R], [0.2, R], [0.3, r0]].forEach(([d, r]) =>
        pts.push([w / 2 + r * Math.cos(a + d * p), h / 2 + r * Math.sin(a + d * p)]),
      )
    }
    return P(pts) + C(w / 2, h / 2, R * 0.3)
  },
  burst: (w, h, n = 16, ri = 0.86) =>
    P(
      Array.from({ length: n * 2 }, (_, i) => {
        const a = (Math.PI * i) / n
        const r = i % 2 ? ri : 1
        return [w / 2 + ((r * w) / 2) * Math.cos(a), h / 2 + ((r * h) / 2) * Math.sin(a)]
      }),
    ),
  donut: (w, h) => C(w / 2, h / 2, Math.min(w, h) / 2) + C(w / 2, h / 2, Math.min(w, h) * 0.2),
  cheese: (w, h) =>
    P([[0, 0.42 * h], [w, 0], [w, h], [0, h]]) +
    C(0.24 * w, 0.72 * h, 0.1 * h) +
    C(0.52 * w, 0.5 * h, 0.15 * h) +
    C(0.8 * w, 0.74 * h, 0.12 * h) +
    C(0.8 * w, 0.3 * h, 0.06 * h) +
    C(0.1 * w, 0.86 * h, 0.05 * h),
  arrow: (w, h, deg = -24) =>
    P(
      rot(
        pct([[0, 34], [58, 34], [58, 6], [100, 50], [58, 94], [58, 66], [0, 66]], w * 0.84, h * 0.84).map(
          ([x, y]): Pt => [x + w * 0.08, y + h * 0.08],
        ),
        (deg * Math.PI) / 180,
        w / 2,
        h / 2,
      ),
    ),
  bolt: (w, h) => P(pct([[60, 0], [10, 55], [45, 55], [30, 100], [90, 40], [55, 40], [80, 0]], w, h)),
  cross: (w, h) =>
    P(pct([[35, 0], [65, 0], [65, 35], [100, 35], [100, 65], [65, 65], [65, 100], [35, 100], [35, 65], [0, 65], [0, 35], [35, 35]], w, h)),
  heart: (w, h) => {
    const sx = w / 200
    const sy = h / 172
    const s = 'M100 170C20 110 0 70 0 45C0 18 20 0 48 0C72 0 90 12 100 30C110 12 128 0 152 0C180 0 200 18 200 45C200 70 180 110 100 170Z'
    let i = 0
    return s.replace(/-?\d+(\.\d+)?/g, (m) => String(N(+m * (i++ % 2 ? sy : sx))))
  },
  pacman: (w, h) => {
    const R = Math.min(w, h) / 2
    const pts: number[][] = [[w / 2, h / 2]]
    for (let a = 35; a <= 325; a += 10) {
      const r = (a * Math.PI) / 180
      pts.push([w / 2 + R * Math.cos(r), h / 2 + R * Math.sin(r)])
    }
    return P(pts)
  },
  squiggle: (w, h) => {
    const t: number[][] = []
    const b: number[][] = []
    const n = 44
    const th = 0.12 * h
    for (let i = 0; i <= n; i++) {
      const x = (w * i) / n
      const y = h / 2 + 0.3 * h * Math.sin(i / 3.4)
      t.push([x, y - th])
      b.push([x, y + th])
    }
    return P(t.concat(b.reverse()))
  },
}

export interface HeroShape {
  k: ShapeKind
  /** centre as % of the hero */
  x: number
  y: number
  /** size at full scale (px) */
  w: number
  h: number
  c: [string, string]
  /** brickbox depth */
  d: number
  /** brickbox resting tilt [x, y] */
  t: [number, number]
  /** hidden on small screens */
  mh?: boolean
}

export const SHAPES: HeroShape[] = [
  // big shape behind the text
  { k: 'burst', x: 50, y: 50, w: 740, h: 620, c: ['255,234,0', '255,190,0'], d: 38, t: [6, 10] },
  { k: 'star', x: 13, y: 19, w: 250, h: 240, c: ['255,128,171', '255,31,90'], d: 42, t: [10, 16] },
  { k: 'bolt', x: 22, y: 27, w: 92, h: 150, c: ['255,234,0', '255,110,64'], d: 26, t: [10, 16] }, // overlaps the star
  { k: 'gear', x: 88, y: 23, w: 230, h: 230, c: ['234,128,252', '213,0,249'], d: 40, t: [8, -18] },
  { k: 'donut', x: 79, y: 11, w: 116, h: 116, c: ['255,255,255', '200,210,255'], d: 28, t: [12, -16] }, // overlaps the gear
  { k: 'cheese', x: 16, y: 81, w: 270, h: 190, c: ['255,171,0', '255,110,64'], d: 44, t: [10, 18] },
  { k: 'arrow', x: 85, y: 79, w: 270, h: 190, c: ['255,128,171', '213,0,249'], d: 40, t: [6, -18] },
  { k: 'squiggle', x: 70, y: 90, w: 270, h: 84, c: ['0,200,83', '0,150,120'], d: 24, t: [8, -14] }, // overlaps the arrow
  { k: 'cross', x: 6, y: 52, w: 84, h: 84, c: ['255,255,255', '200,210,255'], d: 22, t: [12, 16], mh: true },
  { k: 'heart', x: 94, y: 53, w: 104, h: 90, c: ['255,31,90', '255,110,64'], d: 24, t: [10, -16], mh: true },
  { k: 'pacman', x: 43, y: 92, w: 106, h: 106, c: ['255,128,171', '255,31,90'], d: 26, t: [8, 14], mh: true },
  { k: 'star', x: 19, y: 60, w: 62, h: 62, c: ['255,255,255', '200,210,255'], d: 18, t: [12, 16], mh: true },
]
