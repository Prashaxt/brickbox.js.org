import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import PgControls, { type Demo } from '../components/PgControls'
import PgStage from '../components/PgStage'
import Tabs from '../components/Tabs'
import {
  PART_DEFAULT,
  PART_WRAP,
  SHADOW_DEFAULT,
  changedOpts,
  faceStyle,
  fullOpts,
  partChanged,
  partFull,
  shadowString,
  snippet,
  type PartState,
  type ShadowState,
  type St,
} from '../lib/playground'

const KINDS = ['React', 'HTML'] as const

const useMedia = (q: string) =>
  useSyncExternalStore(
    (cb) => {
      const m = matchMedia(q)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => matchMedia(q).matches,
    () => false,
  )

const DEMO_DEFAULT: Demo = { shape: 'card', bg: 'grad' }

export default function Playground() {
  const [st, setSt] = useState<St>({})
  const [shadow, setShadow] = useState<ShadowState>(SHADOW_DEFAULT)
  const [part, setPart] = useState<PartState>(PART_DEFAULT)
  const [demo, setDemo] = useState<Demo>(DEMO_DEFAULT)
  const [kind, setKind] = useState(0)
  const small = useMedia('(max-width:900px)')
  const { hash } = useLocation()

  /** Sets a value, or removes it when it is undefined or back at its default. */
  const setv = useCallback((k: string, v: unknown, d?: unknown) => {
    setSt((prev) => {
      const n = { ...prev }
      if (v === undefined || v === d) delete n[k]
      else n[k] = v
      return n
    })
  }, [])

  const depth = (st.depth as number | undefined) ?? 24
  const shadowStr = shadowString(shadow, depth)
  const changed = useMemo(() => changedOpts(st, shadowStr), [st, shadowStr])
  const full = useMemo(() => fullOpts(changed), [changed])
  const partOpts = useMemo(() => (part.on ? partFull(part) : null), [part])

  const stageStyle = faceStyle(demo.shape, demo.bg, small ? 0.72 : 1, part.on) as CSSProperties
  const codeStyle = faceStyle(demo.shape, demo.bg, 1, part.on)
  const label = 'this is a rectangle' + (st.ignore ? ' <span className="knob">knob</span>' : '')
  const code = snippet(KINDS[kind], changed, label, codeStyle, part.on ? { opts: partChanged(part), label: 'GO' } : undefined)

  const reset = () => {
    setSt({})
    setShadow(SHADOW_DEFAULT)
    setPart(PART_DEFAULT)
    setDemo(DEMO_DEFAULT)
  }

  /* /playground#w-depth (the docs "Try it live" links) flashes that control and focuses it */
  useEffect(() => {
    if (!hash.startsWith('#w-')) return
    const t = document.getElementById(hash.slice(1))
    if (!t) return
    t.classList.remove('flash')
    void t.offsetWidth
    t.classList.add('flash')
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const c = t.querySelector<HTMLElement>('input,select')
    const id = window.setTimeout(() => c?.focus({ preventScroll: true }), rm ? 0 : 500)
    return () => window.clearTimeout(id)
  }, [hash])

  return (
    <section id="playground" aria-label="Playground">
      <div className="bento">
        <div className="pn c-yellow s12 notopborder">
          <span className="pill">Playground</span>
          <div className="bot">
            <h2>Every option, live</h2>
            <p>
              Drag, hover and press the box, then copy the code for exactly what you see.{' '}
              <Link to="/docs#props">See every prop</Link>.
            </p>
          </div>
        </div>
      </div>
      <div className="pg" id="pg">
        <PgControls
          st={st}
          setv={setv}
          shadow={shadow}
          setShadow={setShadow}
          part={part}
          setPart={setPart}
          demo={demo}
          setDemo={setDemo}
        />
        <div id="right">
          <div id="stagebox">
            <PgStage
              opts={full}
              faceStyle={stageStyle}
              knob={'ignore' in st}
              part={partOpts}
              partWrapStyle={PART_WRAP as CSSProperties}
            />
          </div>
          <div className="pn c-onyx dk" id="snipP">
            <div className="tabs">
              <Tabs id="stabs" label="Code format" idPrefix="st" names={[...KINDS]} value={kind} onChange={setKind} />
              <button type="button" className="btn sm" id="reset" style={{ marginLeft: 'auto' }} onClick={reset}>
                Reset
              </button>
            </div>
            <CodeBlock code={code} />
            <p>Only props you changed appear here. Defaults are left out.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
