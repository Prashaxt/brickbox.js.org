import { Fragment, type CSSProperties } from 'react'

const WORDS = ['depth', 'tilt', 'press', 'drag', 'spring', 'real DOM', '9.8 KB', 'no dependencies']
const cssVar = (i: number) => ({ '--i': i }) as CSSProperties

export default function Ticker() {
  // the list is rendered twice so the marquee loops seamlessly
  return (
    <div className="s12 band" aria-hidden="true">
      <div className="track" id="track">
        {[0, 1].flatMap((copy) =>
          WORDS.map((w, i) => (
            <Fragment key={`${copy}-${i}`}>
              <span style={cssVar(2 * i)}>{w}</span>
              <em style={cssVar(2 * i + 1)}>✦</em>
            </Fragment>
          )),
        )}
      </div>
    </div>
  )
}
