import { useEffect, useMemo, useRef } from 'react'
import { initExamples, prepareExamples } from '../lib/examples'

/** The four example scenes. Markup is injected as HTML; the scripts live in lib/examples.ts. */
export default function Examples() {
  const ref = useRef<HTMLDivElement>(null)
  const html = useMemo(() => prepareExamples(), [])

  useEffect(() => {
    const root = ref.current
    return root ? initExamples(root) : undefined
  }, [])

  return (
    <>
      <div className="s12 lp" id="examples">
        <span>Examples</span>
        <small>Boxes inside boxes inside boxes</small>
      </div>
      <div className="s12 xg" id="exg" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  )
}
