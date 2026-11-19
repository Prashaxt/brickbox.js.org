export default function GoodToKnow() {
  return (
    <>
      <div className="s12 lp" style={{borderTopLeftRadius: "0px", borderTopRightRadius: "0px"}}>
        <span>Good to know</span>
        <small>What it does, and what it doesn’t</small>
      </div>
      <div className="pn c-green s5">
        <span className="pill">Browser support</span>
        <div className="bot">
          <h3 style={{ fontSize: '1.5rem' }}>Tested on major browsers</h3>
          <p>
            Tested on desktop and phone browsers, including Firefox, Safari and older mobile browsers. Nesting
            (<code>lift</code>) is the newest feature, so it has had the least testing.
          </p>
        </div>
      </div>
      <div className="pn c-yellow s7">
        <h3>What it supports</h3>
        <ul className="rl" style={{ padding: 0, listStyle: 'none' }}>
          <li>
            Any shape: rounded rectangles, pills, circles, blobs, and <code>clip-path</code> outlines with holes and{' '}
            <code>calc()</code> lengths.
          </li>
          <li>Solid or single-gradient colours, continued around the sides and kept in step as they change.</li>
          <li>
            Soft shadows with <code>shadow</code>, and nested parts with <code>lift</code>.
          </li>
          <li>
            Areas that opt out of hover, drag and press, with <code>ignore</code>.
          </li>
          <li>Server rendering of the React wrapper.</li>
        </ul>
      </div>
      <div className="pn c-lilac s12">
        <h3>What it does not do yet</h3>
        <ul className="rl cols2" style={{ padding: 0, listStyle: 'none' }}>
          <li>
            Clip-paths that use <code>url(#id)</code> or <code>shape()</code>. An unsupported clip-path falls back to the
            rounded rectangle.
          </li>
          <li>
            Background images, stacked backgrounds, radial or conic gradients, or stops in px or em. These fall back to a
            solid colour. The walls follow the background, never the border colour.
          </li>
          <li>
            Extruding the element’s own <code>box-shadow</code> or <code>outline</code>. Borders stay on the front face.
          </li>
          <li>
            Depth beyond about half of <code>perspective</code> can clip or distort. Development builds log a warning.
          </li>
          <li>
            Opacity, filter and overflow must go on the wrapper, not inside it, or the 3D flattens. A nested part can’t
            stand out of a parent face that has them or a <code>clip-path</code>.
          </li>
          <li>
            Known issue: when <code>pressSink</code> is set, a press can start, and fire <code>:active</code> styles, just
            before a drag cancels it.
          </li>
        </ul>
        <p className="nfoot">
          <span aria-hidden="true">JS</span>It uses a small amount of JavaScript to measure the element and build the
          walls. It is not a CSS-only effect.
        </p>
      </div>
    </>
  )
}
