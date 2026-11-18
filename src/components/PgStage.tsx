import { useEffect, useRef, type CSSProperties } from 'react'
import { brickbox, type BrickBoxInstance, type BrickBoxOptions } from 'brickbox'

type Opts = Record<string, unknown>

interface Props {
  /** every option of the main box (unset ones undefined, so update() resets them) */
  opts: Opts
  faceStyle: CSSProperties
  /** show the demo knob (for the ignore option) */
  knob: boolean
  /** options of the nested part, or null when there is none */
  part: Opts | null
  partWrapStyle: CSSProperties
}

/**
 * The live box. The main box is built first and the part second, because a part
 * needs its parent to exist when it is built. Both are updated on every change.
 */
export default function PgStage({ opts, faceStyle, knob, part, partWrapStyle }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const partRef = useRef<HTMLDivElement>(null)
  const main = useRef<BrickBoxInstance | null>(null)
  const nested = useRef<BrickBoxInstance | null>(null)
  const latest = useRef({ opts, part })
  useEffect(() => {
    latest.current = { opts, part }
  })

  /* main box: build once, destroy on unmount (the part goes first) */
  useEffect(() => {
    if (!wrapRef.current) return
    main.current = brickbox(wrapRef.current, latest.current.opts as BrickBoxOptions)
    return () => {
      nested.current?.destroy()
      nested.current = null
      main.current?.destroy()
      main.current = null
    }
  }, [])

  /* part: build when it is switched on, destroy when it is switched off */
  const partOn = part !== null
  useEffect(() => {
    if (!partOn || !partRef.current || !main.current) return
    nested.current = brickbox(partRef.current, (latest.current.part ?? {}) as BrickBoxOptions)
    return () => {
      nested.current?.destroy()
      nested.current = null
    }
  }, [partOn])

  /* every change: parent first, then the part */
  const key = JSON.stringify({ opts, part, faceStyle, knob })
  useEffect(() => {
    main.current?.update(latest.current.opts as BrickBoxOptions)
    if (latest.current.part) nested.current?.update(latest.current.part as BrickBoxOptions)
  }, [key])

  return (
    <div className="stage c-w" style={{ height: '100%' }}>
      <div className="w" id="pgW" ref={wrapRef}>
        <div className="face" id="pgF" style={faceStyle}>
          this is a rectangle
          {knob && <span className="knob">knob</span>}
          {partOn && (
            <div ref={partRef} style={partWrapStyle}>
              <div className="part">GO</div>
            </div>
          )}
        </div>
      </div>
      <p className="hint">Hover, drag or press the box</p>
    </div>
  )
}
