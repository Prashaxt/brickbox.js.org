import { useEffect, useRef } from 'react'
import { brickbox } from 'brickbox'
import { G, SHAPES } from '../lib/heroShapes'
import CopyButton from './CopyButton'

/** pressDepth (px the box shrinks to) became pressSink (% of depth it sinks) in brickbox 0.3. */
const sink = (depth: number, pressedTo: number) => `${Math.round((1 - pressedTo / depth) * 100)}%`

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hosts = useRef<(HTMLDivElement | null)[]>([])
  const faces = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const boxes = SHAPES.map((s, i) =>
      brickbox(hosts.current[i]!, {
        depth: s.d,
        tilt: { x: s.t[0], y: s.t[1] },
        pressSink: sink(s.d, 6),
        control: 'hover',
      }),
    )

    const layout = () => {
      const k = Math.max(0.5, Math.min(1.1, hero.clientWidth / 1150))
      SHAPES.forEach((s, i) => {
        const face = faces.current[i]
        if (!face) return
        const kk = s.k === 'burst' && hero.clientWidth < 700 ? k * 1.6 : k
        const w = Math.round(s.w * kk)
        const h = Math.round(s.h * kk)
        face.style.width = w + 'px'
        face.style.height = h + 'px'
        face.style.clipPath = `path(evenodd,"${G[s.k](w, h)}")`
        boxes[i].update({})
      })
    }

    layout()
    let rt: number | undefined
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(layout, 120)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.clearTimeout(rt)
      window.removeEventListener('resize', onResize)
      boxes.forEach((b) => b.destroy())
    }
  }, [])

  return (
    <div className="pn hero s12" id="top" ref={heroRef}>
      <div className="hbg" aria-hidden="true" />
      <div className="shapes" id="shapes" aria-hidden="true">
        {SHAPES.map((s, i) => (
          <div
            key={i}
            className={'hs' + (s.mh ? ' mh' : '')}
            style={{ left: s.x + '%', top: s.y + '%' }}
            ref={(el) => {
              hosts.current[i] = el
            }}
          >
            <div
              className="face"
              style={{ background: `linear-gradient(135deg,rgb(${s.c[0]}),rgb(${s.c[1]}))` }}
              ref={(el) => {
                faces.current[i] = el
              }}
            />
          </div>
        ))}
      </div>
      <div className="hcopy">
        <h1>
          Give any element
          <br />
          real depth.
        </h1>
        <p>A tiny library that turns any element into a 3D slab you can tilt, press and drag. It stays real HTML.</p>
        <div className="npmbox">
          <code>npm i brickbox</code>
          <CopyButton text="npm i brickbox" />
        </div>
      </div>
    </div>
  )
}
