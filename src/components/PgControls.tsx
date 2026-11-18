import { useState } from 'react'
import { PROPS, groupOf, type PropDef, type PropGroup } from '../data/props'
import {
  BG_LABELS,
  SHAPE_LABELS,
  hasClip,
  shadowString,
  type BgKey,
  type PartState,
  type ShadowMode,
  type ShadowState,
  type ShapeKey,
  type St,
} from '../lib/playground'

export interface Demo {
  shape: ShapeKey
  bg: BgKey
}

interface Props {
  st: St
  setv: (k: string, v: unknown, d?: unknown) => void
  shadow: ShadowState
  setShadow: (s: ShadowState) => void
  part: PartState
  setPart: (p: PartState) => void
  demo: Demo
  setDemo: (d: Demo) => void
}

interface CtlProps extends Props {
  p: PropDef
}

/** One control row: label, current value, description, then the input(s). */
function Row({ p, out, htmlFor, children }: { p: PropDef; out: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="ctl" id={'w-' + p.k}>
      <div>
        <label htmlFor={htmlFor ?? 'c-' + p.k}>{p.n || p.k}</label>
        <output>{out}</output>
      </div>
      <p id={'d-' + p.k}>{p.x}</p>
      {children}
    </div>
  )
}

const desc = (p: PropDef) => ({ 'aria-describedby': 'd-' + p.k })

function Range({ p, st, setv }: CtlProps) {
  const v = (st[p.k] as number | undefined) ?? (p.d as number)
  return (
    <Row p={p} out={v + (p.u || '')}>
      <input
        type="range"
        id={'c-' + p.k}
        min={p.min}
        max={p.max}
        step={p.step || 1}
        value={v}
        onChange={(e) => setv(p.k, +e.target.value, p.d)}
        {...desc(p)}
      />
    </Row>
  )
}

function Check({ p, st, setv }: CtlProps) {
  const v = (st[p.k] as boolean | undefined) ?? (p.d as boolean)
  return (
    <Row p={p} out={String(v)}>
      <input type="checkbox" id={'c-' + p.k} checked={v} onChange={(e) => setv(p.k, e.target.checked, p.d)} {...desc(p)} />
    </Row>
  )
}

function Select({ p, st, setv }: CtlProps) {
  const v = (st[p.k] as string | undefined) ?? (p.d as string)
  return (
    <Row p={p} out={v}>
      <select id={'c-' + p.k} value={v} onChange={(e) => setv(p.k, e.target.value, p.d)} {...desc(p)}>
        {p.o!.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </Row>
  )
}

function Tilt({ p, st, setv }: CtlProps) {
  const x = (st.tx as number | undefined) ?? 14
  const y = (st.ty as number | undefined) ?? 22
  return (
    <Row p={p} out={`x ${x}°, y ${y}°`} htmlFor="c-tiltx">
      <div style={{ display: 'grid', gap: 4, gridTemplateColumns: 'minmax(0,1fr)' }}>
        {(
          [
            ['x', x, 14],
            ['y', y, 22],
          ] as const
        ).map(([ax, val, d]) => (
          <div key={ax} className="l" style={{ display: 'grid', gridTemplateColumns: '20px 1fr', alignItems: 'center' }}>
            <span>{ax} </span>
            <input
              type="range"
              id={'c-tilt' + ax}
              min={-60}
              max={60}
              value={val}
              aria-label={'tilt ' + ax}
              onChange={(e) => setv('t' + ax, +e.target.value, d)}
              {...(ax === 'x' ? desc(p) : {})}
            />
          </div>
        ))}
      </div>
    </Row>
  )
}

function PressSink({ p, st, setv }: CtlProps) {
  const on = 'pressSink' in st
  const [val, setVal] = useState(70)
  return (
    <Row p={p} out={on ? val + '%' : 'unset (no press)'}>
      <div className="two">
        <input
          type="checkbox"
          id="c-pressSink-on"
          aria-label="Set pressSink"
          checked={on}
          onChange={(e) => setv('pressSink', e.target.checked ? val : undefined)}
        />
        <label htmlFor="c-pressSink-on">Set</label>
        <input
          type="range"
          id="c-pressSink"
          min={0}
          max={99}
          value={val}
          disabled={!on}
          style={{ flex: 1 }}
          onChange={(e) => {
            setVal(+e.target.value)
            setv('pressSink', +e.target.value)
          }}
          {...desc(p)}
        />
      </div>
    </Row>
  )
}

function ColorPick({ p, st, setv }: CtlProps) {
  const cur = st[p.k] as string | undefined
  const isC = cur !== undefined && !p.o!.includes(cur)
  return (
    <Row p={p} out={cur ?? String(p.d)} htmlFor={'c-' + p.k}>
      <div className="two">
        <select
          id={'c-' + p.k}
          value={isC ? 'custom' : (cur ?? String(p.d))}
          onChange={(e) => setv(p.k, e.target.value === 'custom' ? p.cc : e.target.value, p.d)}
          {...desc(p)}
        >
          {[...p.o!, 'custom'].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <input
          type="color"
          value={isC ? cur : p.cc}
          aria-label={p.k + ' colour'}
          disabled={!isC}
          onChange={(e) => setv(p.k, e.target.value, p.d)}
        />
      </div>
    </Row>
  )
}

function Ignore({ p, st, setv }: CtlProps) {
  const on = 'ignore' in st
  return (
    <Row p={p} out={on ? String(st.ignore) : 'none'}>
      <input
        type="checkbox"
        id="c-ignore"
        checked={on}
        onChange={(e) => setv('ignore', e.target.checked ? '.knob' : undefined)}
        {...desc(p)}
      />
    </Row>
  )
}

function Shading({ p, st, setv }: CtlProps) {
  const v = st.shading === undefined ? 'auto' : st.shading ? 'on' : 'off'
  return (
    <Row p={p} out={v}>
      <select
        id="c-shading"
        value={v}
        onChange={(e) => setv('shading', e.target.value === 'auto' ? undefined : e.target.value === 'on')}
        {...desc(p)}
      >
        <option value="auto">Auto</option>
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
    </Row>
  )
}

const MODES: ShadowMode[] = ['none', 'followLight', 'bottom']

function Shadow({ p, st, shadow, setShadow }: CtlProps) {
  const depth = (st.depth as number | undefined) ?? 24
  const set = (patch: Partial<ShadowState>) => setShadow({ ...shadow, ...patch })
  return (
    <Row p={p} out={shadowString(shadow, depth) ?? 'none'}>
      <div className="two">
        <select id="c-shadow" aria-label="shadow mode" value={shadow.mode} onChange={(e) => set({ mode: e.target.value as ShadowMode })} {...desc(p)}>
          {MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      {shadow.mode !== 'none' && (
        <div className="two" style={{ marginTop: 8 }}>
          <input type="number" min={0} placeholder="blur" aria-label="shadow blur in px" value={shadow.blur} onChange={(e) => set({ blur: e.target.value })} />
          <input type="number" placeholder="spread" aria-label="shadow spread in px" value={shadow.spread} onChange={(e) => set({ spread: e.target.value })} />
          <input type="text" placeholder="colour" aria-label="shadow colour" value={shadow.color} onChange={(e) => set({ color: e.target.value })} />
        </div>
      )}
      {shadow.mode !== 'none' && <p style={{ marginTop: 6 }}>Blur and spread are in px. Blank uses the default: blur equal to depth, spread 0, colour rgba(0,0,0,.35).</p>}
    </Row>
  )
}

function Nest({ p, part, setPart, demo }: CtlProps) {
  const set = (patch: Partial<PartState>) => setPart({ ...part, ...patch })
  return (
    <Row p={p} out={part.on ? `lift ${part.lift} px` : 'unset'}>
      <div className="two">
        <input type="checkbox" id="c-lift" checked={part.on} onChange={(e) => set({ on: e.target.checked })} {...desc(p)} />
        <label htmlFor="c-lift">Add a nested part</label>
      </div>
      {part.on && (
        <div className="sub">
          {hasClip(demo.shape) && (
            <p className="note">
              This shape uses clip-path, which flattens the 3D, so the part cannot stand out from it. Pick a rounded shape
              in the demo controls below.
            </p>
          )}
          <div>
            <label htmlFor="pt-lift">part lift</label>
            <output>{part.lift} px</output>
          </div>
          <input type="range" id="pt-lift" min={0} max={60} value={part.lift} onChange={(e) => set({ lift: +e.target.value })} />
          <p>How high the part’s base sits above the face. 0 sits on it.</p>
          <div>
            <label htmlFor="pt-depth">part depth</label>
            <output>{part.depth} px</output>
          </div>
          <input type="range" id="pt-depth" min={2} max={40} value={part.depth} onChange={(e) => set({ depth: +e.target.value })} />
          <p>The part’s own height.</p>
          <div>
            <label htmlFor="pt-sink-on">part pressSink</label>
            <output>{part.sinkOn ? part.sinkVal + '%' : 'unset'}</output>
          </div>
          <div className="two">
            <input type="checkbox" id="pt-sink-on" aria-label="Set pressSink on the part" checked={part.sinkOn} onChange={(e) => set({ sinkOn: e.target.checked })} />
            <label htmlFor="pt-sink-on">Set</label>
            <input
              type="range"
              id="pt-sink"
              min={0}
              max={99}
              value={part.sinkVal}
              disabled={!part.sinkOn}
              style={{ flex: 1 }}
              aria-label="part pressSink"
              onChange={(e) => set({ sinkVal: +e.target.value })}
            />
          </div>
          <p>Pressing the part presses only it.</p>
          <div>
            <label htmlFor="pt-shadow">part shadow</label>
            <output>{part.shadow}</output>
          </div>
          <select id="pt-shadow" value={part.shadow} onChange={(e) => set({ shadow: e.target.value as ShadowMode })}>
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <p>The part’s shadow falls on the parent’s face.</p>
        </div>
      )}
    </Row>
  )
}

function Control(props: CtlProps) {
  switch (props.p.t) {
    case 'n': return <Range {...props} />
    case 's': return <Select {...props} />
    case 'b': return <Check {...props} />
    case 't2': return <Tilt {...props} />
    case 'ps': return <PressSink {...props} />
    case 'c': return <ColorPick {...props} />
    case 'ig': return <Ignore {...props} />
    case 'sh': return <Shading {...props} />
    case 'shadow': return <Shadow {...props} />
    case 'lift': return <Nest {...props} />
    default: return null
  }
}

export default function PgControls(props: Props) {
  const { demo, setDemo } = props
  const groups = new Map<PropGroup, PropDef[]>()
  for (const p of PROPS) {
    if (p.ro) continue
    const g = groupOf(p)
    groups.set(g, [...(groups.get(g) ?? []), p])
  }

  return (
    <div className="pn c-w ctls" id="ctls">
      {[...groups].map(([g, ps]) => (
        <fieldset key={g}>
          <legend>{g}</legend>
          {ps.map((p) => (
            <Control key={p.k} p={p} {...props} />
          ))}
        </fieldset>
      ))}
      <div className="demo">
        <b>Demo only: not brickbox props</b>
        <div className="ctl">
          <div>
            <label htmlFor="dm-shape">Element shape</label>
          </div>
          <select id="dm-shape" value={demo.shape} onChange={(e) => setDemo({ ...demo, shape: e.target.value as ShapeKey })}>
            {(Object.keys(SHAPE_LABELS) as ShapeKey[]).map((k) => (
              <option key={k} value={k}>
                {SHAPE_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
        <div className="ctl">
          <div>
            <label htmlFor="dm-bg">Element background</label>
          </div>
          <select id="dm-bg" value={demo.bg} onChange={(e) => setDemo({ ...demo, bg: e.target.value as BgKey })}>
            {(Object.keys(BG_LABELS) as BgKey[]).map((k) => (
              <option key={k} value={k}>
                {BG_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
