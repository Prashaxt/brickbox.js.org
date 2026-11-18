export type Scene = 'hills1' | 'city' | 'peaks'
type Ctx = CanvasRenderingContext2D

export const STRIP_W = 160
export const STRIP_H = 18

const RNG = (s: number) => () => {
  s |= 0
  s = (s + 0x6d2b79f5) | 0
  let t = Math.imul(s ^ (s >>> 15), 1 | s)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const RC = (x: Ctx, c: string, a: number, b: number, w: number, hh: number) => {
  x.fillStyle = c
  x.fillRect(a, b, w, hh)
}
function hill(x: Ctx, w: number, hh: number, base: number, amp: number, fr: number, ph: number, col: string, edge: string) {
  for (let p = 0; p < w; p++) {
    const y = Math.round(base + amp * (Math.sin(p * fr + ph) + 0.5 * Math.sin(p * fr * 2.3 + ph * 1.7)))
    RC(x, col, p, y, 1, hh - y)
    RC(x, edge, p, y, 1, 1)
  }
}

export const SCENES: Record<Scene, (x: Ctx) => void> = {
  hills1: (x) => {
    hill(x, 160, 18, 7, 3, 0.06, 2, '#FF8E0A', '#D97400')
    hill(x, 160, 18, 12, 2.5, 0.08, 5, '#FEE000', '#D1B800')
  },
  city: (x) => {
    const r = RNG(7)
    const cols = ['#EA3737', '#0072E3', '#00AA3C', '#FEE000', '#FF6100']
    let p = 0
    while (p < 160) {
      const bw = 6 + Math.floor(r() * 7)
      const bh = 5 + Math.floor(r() * 12)
      const col = cols[Math.floor(r() * cols.length)]
      RC(x, col, p, 18 - bh, bw - 1, bh)
      for (let yy = 18 - bh + 2; yy < 17; yy += 3)
        for (let xx = p + 1; xx < p + bw - 2; xx += 3) RC(x, 'rgba(255,255,255,.6)', xx, yy, 1, 1)
      p += bw
    }
  },
  peaks: (x) => {
    for (let p = 0; p < 160; p++) {
      const y0 = Math.round(18 - (5 + 5 * Math.abs(Math.sin(p * 0.05 + 1))))
      RC(x, '#C79DFC', p, y0, 1, 18 - y0)
      const y = Math.round(18 - (5 + 8 * Math.abs(Math.sin(p * 0.07 + 0.5)) + 2 * Math.abs(Math.sin(p * 0.19))))
      RC(x, '#00C853', p, y, 1, 18 - y)
      if (y < 9) RC(x, '#fff', p, y, 1, 2)
    }
  },
}
