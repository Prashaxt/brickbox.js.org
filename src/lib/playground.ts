import { PROPS } from '../data/props'

/* ---------- demo element: shapes and backgrounds (not brickbox props) ---------- */

const HEX = 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)'
const STAR =
  'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'

interface ShapeDef {
  w: string
  h: string
  /** border-radius */
  r?: string
  /** clip-path */
  clip?: string
}

export const SHAPES = {
  card: { w: '260px', h: '170px', r: '28px' },
  pill: { w: '300px', h: '92px', r: '999px' },
  circle: { w: '190px', h: '190px', r: '95px' },
  mixed: { w: '260px', h: '170px', r: '56px 8px 56px 8px' },
  ellipse: { w: '290px', h: '150px', r: '50%' },
  blob: { w: '260px', h: '190px', r: '60% 40% 30% 70% / 60% 30% 70% 40%' },
  hex: { w: '280px', h: '170px', clip: HEX },
  star: { w: '230px', h: '220px', clip: STAR },
  // clip-paths written with calc(), min() and clamp()
  notch: { w: '260px', h: '170px', clip: 'polygon(0 0, calc(100% - 36px) 0, 100% 36px, 100% 100%, 0 100%)' },
  clamp: { w: '260px', h: '170px', clip: 'polygon(0 0, min(60%, 90px) 0, 100% clamp(14px, 30%, 50px), 100% 100%, 0 100%)' },
  inset: { w: '260px', h: '170px', clip: 'inset(calc(8px + 4%) 0 0 0 round calc(3 * 10px))' },
  circcalc: { w: '190px', h: '190px', clip: 'circle(calc(50% - 8px) at 50% 50%)' },
} satisfies Record<string, ShapeDef>

export type ShapeKey = keyof typeof SHAPES

export const SHAPE_LABELS: Record<ShapeKey, string> = {
  card: 'Rounded card',
  pill: 'Pill',
  circle: 'Circle',
  mixed: 'Mixed corner radii',
  ellipse: 'Ellipse (elliptical radius)',
  blob: 'Blob (elliptical radii)',
  hex: 'Hexagon (clip-path)',
  star: 'Star (clip-path)',
  notch: 'Notched corner (clip-path with calc)',
  clamp: 'Slanted edge (clip-path with min and clamp)',
  inset: 'Inset (clip-path with calc and round)',
  circcalc: 'Circle (clip-path with calc)',
}

export const BGS = {
  grad: { b: 'linear-gradient(135deg, rgb(255,178,0), rgb(255,97,0))', c: '#0F0F14' },
  solid: { b: 'rgb(0,114,227)', c: '#fff' },
  yellow: { b: 'rgb(254,224,0)', c: '#0F0F14' },
}
export type BgKey = keyof typeof BGS

export const BG_LABELS: Record<BgKey, string> = { grad: 'Sunset gradient', solid: 'Blue', yellow: 'Yellow' }

export const hasClip = (s: ShapeKey) => 'clip' in SHAPES[s]

const scl = (v: string, k: number) => Math.round(parseFloat(v) * k) + 'px'

/** Inline style of the demo element. k scales the size down on small screens. */
export function faceStyle(shape: ShapeKey, bg: BgKey, k = 1, withPart = false): Record<string, string> {
  const s: ShapeDef = SHAPES[shape]
  const b = BGS[bg]
  return {
    width: scl(s.w, k),
    height: scl(s.h, k),
    ...(s.r ? { borderRadius: s.r } : {}),
    ...(s.clip ? { clipPath: s.clip } : {}),
    background: b.b,
    color: b.c,
    // the nested part is positioned against the face
    ...(withPart ? { position: 'relative' } : {}),
  }
}

/* ---------- nested part ---------- */

export type ShadowMode = 'none' | 'followLight' | 'bottom'

export interface PartState {
  on: boolean
  lift: number
  depth: number
  sinkOn: boolean
  sinkVal: number
  shadow: ShadowMode
}

export const PART_DEFAULT: PartState = { on: false, lift: 0, depth: 12, sinkOn: true, sinkVal: 65, shadow: 'none' }

/** Layout goes on the wrapper, looks stay on the element (house rule 2). */
export const PART_WRAP: Record<string, string> = { position: 'absolute', right: '8%', top: 'calc(50% - 22px)' }
export const PART_FACE: Record<string, string> = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: '#0F0F14',
  color: '#fff',
}

type Opts = Record<string, unknown>

/** Options that differ from the defaults. lift is always included: it is what makes the box a part. */
export function partChanged(p: PartState): Opts {
  const o: Opts = { lift: p.lift }
  if (p.depth !== 24) o.depth = p.depth
  if (p.sinkOn) o.pressSink = p.sinkVal
  if (p.shadow !== 'none') o.shadow = p.shadow
  return o
}

/** Every key present, so a key that went back to its default is reset by update(). */
export function partFull(p: PartState): Opts {
  return {
    lift: p.lift,
    depth: p.depth,
    pressSink: p.sinkOn ? p.sinkVal : undefined,
    shadow: p.shadow === 'none' ? undefined : p.shadow,
  }
}

/* ---------- shadow control state ---------- */

export interface ShadowState {
  mode: ShadowMode
  /** px, blank = leave out */
  blur: string
  /** px, blank = leave out */
  spread: string
  color: string
}

export const SHADOW_DEFAULT: ShadowState = { mode: 'none', blur: '', spread: '', color: '' }

/**
 * Builds the shadow string: mode, then blur, spread, colour (in that order).
 * Spread needs blur before it, and blur needs spread after it, so a missing partner gets its default.
 */
export function shadowString(s: ShadowState, depth: number): string | undefined {
  if (s.mode === 'none') return undefined
  const parts: string[] = [s.mode]
  if (s.blur !== '' || s.spread !== '') {
    parts.push(`${s.blur !== '' ? s.blur : depth}px`, `${s.spread !== '' ? s.spread : 0}px`)
  }
  if (s.color.trim()) parts.push(s.color.trim())
  return parts.join(' ')
}

/* ---------- options built from the control state ---------- */

/** st holds only the values the user changed. tilt is stored as tx / ty. */
export type St = Record<string, unknown>

export function changedOpts(st: St, shadow: string | undefined): Opts {
  const o: Opts = {}
  const adv: Opts = {}
  for (const p of PROPS) {
    if (p.ro || p.nest) continue
    if (p.k === 'tilt') {
      if ('tx' in st || 'ty' in st) o.tilt = { x: (st.tx as number | undefined) ?? 14, y: (st.ty as number | undefined) ?? 22 }
    } else if (p.k === 'shadow') {
      if (shadow) o.shadow = shadow
    } else if (p.adv) {
      if (p.k in st) adv[p.k] = st[p.k]
    } else if (p.k in st) o[p.k] = st[p.k]
  }
  if (Object.keys(adv).length) o.advanced = adv
  return o
}

/** Every option present (unset ones are undefined) so update() resets what went back to default. */
export function fullOpts(c: Opts): Opts {
  const o: Opts = {}
  const adv: Opts = {}
  const cAdv = (c.advanced ?? {}) as Opts
  for (const p of PROPS) {
    if (p.ro || p.nest) continue
    if (p.adv) adv[p.k] = cAdv[p.k]
    else o[p.k] = c[p.k]
  }
  o.advanced = adv
  return o
}

/* ---------- code snippets ---------- */

type Kind = 'React' | 'HTML'
type XY = { x: number; y: number }

const lit = (v: unknown) => (typeof v === 'string' ? `"${v}"` : `{${String(v)}}`)

function reactProps(o: Opts): string[] {
  return Object.entries(o).map(([k, v]) =>
    k === 'tilt'
      ? `tilt={{ x: ${(v as XY).x}, y: ${(v as XY).y} }}`
      : k === 'advanced'
        ? `advanced={{ ${Object.entries(v as Opts)
            .map(([a, b]) => `${a}: ${String(b)}`)
            .join(', ')} }}`
        : `${k}=${lit(v)}`,
  )
}

function htmlProps(o: Opts): string[] {
  return Object.entries(o).flatMap(([k, v]) => {
    if (k === 'tilt') return [`tilt="${(v as XY).x} ${(v as XY).y}"`]
    // tolerance is the only advanced option that exists as an attribute
    if (k === 'advanced') return 'tolerance' in (v as Opts) ? [`tolerance="${String((v as Opts).tolerance)}"`] : []
    const a = PROPS.find((p) => p.k === k)!.a
    return a === 'not an attribute' ? [] : [`${a}="${String(v)}"`]
  })
}

const fmtCss = (s: Record<string, string>) =>
  Object.entries(s)
    .map(([k, v]) => `${k}: '${v}'`)
    .join(', ')
const cssText = (s: Record<string, string>) =>
  Object.entries(s)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}: ${v}`)
    .join('; ')

const wrap = (open: string, attrs: string[], ind: string) =>
  attrs.length > 2 || attrs.join(' ').length > 50
    ? `${open}\n${ind}  ${attrs.join(`\n${ind}  `)}\n${ind}>`
    : `${open}${attrs.length ? ' ' + attrs.join(' ') : ''}>`

export interface PartSnippet {
  opts: Opts
  label: string
}

/** Code for exactly what the stage shows. Only changed options are listed. */
export function snippet(kind: Kind, o: Opts, label: string, style: Record<string, string>, part?: PartSnippet): string {
  if (kind === 'HTML') label = label.replace('className', 'class')
  const hasPart = !!part

  if (kind === 'React') {
    const head = `import { BrickBox } from 'brickbox/react';\n\n${wrap('<BrickBox', reactProps(o), '')}`
    if (!hasPart) return `${head}\n  <div style={{ ${fmtCss(style)} }}>${label}</div>\n</BrickBox>`
    const partAttrs = [...reactProps(part.opts), `style={{ ${fmtCss(PART_WRAP)} }}`]
    return (
      `${head}\n  <div style={{ ${fmtCss(style)} }}>\n    ${label}\n` +
      `    ${wrap('<BrickBox', partAttrs, '    ')}\n` +
      `      <div style={{ ${fmtCss(PART_FACE)} }}>${part.label}</div>\n` +
      `    </BrickBox>\n  </div>\n</BrickBox>`
    )
  }

  const tail = `\n<script type="module">\n  import { defineBrickBox } from 'brickbox/element';\n  defineBrickBox();\n</script>`
  const head = wrap('<brick-box', htmlProps(o), '')
  if (!hasPart) return `${head}\n  <div style="${cssText(style)}">${label}</div>\n</brick-box>${tail}`
  const partAttrs = [...htmlProps(part.opts), `style="${cssText(PART_WRAP)}"`]
  return (
    `${head}\n  <div style="${cssText(style)}">\n    ${label}\n` +
    `    ${wrap('<brick-box', partAttrs, '    ')}\n` +
    `      <div style="${cssText(PART_FACE)}">${part.label}</div>\n` +
    `    </brick-box>\n  </div>\n</brick-box>${tail}`
  )
}
