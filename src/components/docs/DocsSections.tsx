import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SECTIONS } from '../../data/docsNav'
import { CHANGELOG } from '../../data/changelog'
import CodeBlock from '../CodeBlock'
import Tabs from '../Tabs'
import Inline from './Inline'
import PropsTable from './PropsTable'

const REPO = 'https://github.com/Prashaxt/brickbox'

/** A docs section. The heading sticks to the top until the next section arrives. */
function Sec({ id, children }: { id: string; children: ReactNode }) {
  const title = SECTIONS.find((s) => s.id === id)!.title
  return (
    <section className="dsec" id={id} aria-labelledby={id + '-h'}>
      <h2 className="dh" id={id + '-h'}>
        {title}
      </h2>
      <div className="dbody">{children}</div>
    </section>
  )
}

/* ---------- getting started ---------- */

const QS: [string, ReactNode][] = [
  [
    'React',
    <CodeBlock
      key="r"
      code={`import { BrickBox } from 'brickbox/react';

export function Card() {
  return (
    <BrickBox depth={40}>
      <div className="card">Hello, depth</div>
    </BrickBox>
  );
}`}
    />,
  ],
  [
    'HTML',
    <>
      <CodeBlock
        code={`<brick-box depth="40" control="hover" tilt="14 22">
  <div class="card">Hello, depth</div>
</brick-box>

<script type="module">
  import { defineBrickBox } from 'brickbox/element';
  defineBrickBox();
</script>`}
      />
      <p>
        The bare <code>brickbox/element</code> import needs a bundler or an import map. To use another tag name, call{' '}
        <code>defineBrickBox('my-box')</code>.
      </p>
    </>,
  ],
  [
    'JavaScript',
    <>
      <CodeBlock
        code={`<div id="wrapper">
  <div class="card">Hello, depth</div>
</div>`}
      />
      <CodeBlock
        code={`import { brickbox } from 'brickbox';

const box = brickbox(document.getElementById('wrapper'), { depth: 40 });

box.update({ depth: 60 }); // merges new options
box.destroy();             // restores your original markup`}
      />
      <p>The wrapper must contain exactly one element child. brickbox builds the 3D structure around it.</p>
    </>,
  ],
]

function GettingStarted() {
  const [i, setI] = useState(0)
  return (
    <Sec id="getting-started">
      <p>
        brickbox turns any element into a 3D slab you can tilt, press and drag. It stays real HTML: your element is the
        front face, and thin walls are drawn behind it.
      </p>
      <h3>Install</h3>
      <CodeBlock code="npm i brickbox" />
      <p>
        ESM and CJS builds with TypeScript types are included. React is an optional peer dependency (version 17 or
        newer) and is only needed for <code>brickbox/react</code>.
      </p>
      <h3>Quick start</h3>
      <Tabs label="Framework" idPrefix="dq" names={QS.map((q) => q[0])} value={i} onChange={setI} />
      <div role="tabpanel" tabIndex={0} aria-labelledby={'dq' + i} className="dpanel">
        {QS[i][1]}
      </div>
    </Sec>
  )
}

/* ---------- rules ---------- */

const PROMISES: [string, string][] = [
  ['The element stays real.', 'It’s your DOM, not a copy.'],
  ['Tiny, no dependencies.', ''],
  ['Quiet at rest.', 'No timers or loops while it’s idle.'],
  ['Gentle with the page.', 'No layout changes, walls are `aria-hidden`, and reduced motion is respected.'],
  ['Safe on the server.', 'No `window` or `document` access while rendering.'],
  ['Honest about limits.', 'The limits are listed on the home page.'],
]

function Rules() {
  return (
    <Sec id="rules">
      <p>Most problems come from breaking one of these three rules.</p>
      <ol className="drules">
        <li>
          <b>The wrapper holds exactly one element, and that element is the front face.</b>
        </li>
        <li>
          <b>Layout goes on the wrapper, looks stay on the element.</b> Flex, grid, margins and position go on the
          wrapper (the <code>BrickBox</code> or <code>brick-box</code> element). Background, radius and padding stay on
          your child.
        </li>
        <li>
          <b>Opacity, filter and overflow go on the wrapper</b>, never inside it, because they flatten the 3D.
        </li>
      </ol>
      <CodeBlock
        code={`<BrickBox style={{ margin: 24, opacity: 0.9 }}>   {/* layout and opacity: wrapper */}
  <div className="card">Hello, depth</div>        {/* background, radius, padding: element */}
</BrickBox>`}
      />
      <h3>What brickbox promises</h3>
      <ol className="dlist">
        {PROMISES.map(([b, t]) => (
          <li key={b}>
            <b>{b}</b> <Inline text={t} />
          </li>
        ))}
      </ol>
    </Sec>
  )
}

/* ---------- props ---------- */

function Props() {
  return (
    <Sec id="props">
      <p>
        Numbers are pixels for lengths and degrees for angles. Lengths also accept CSS strings like <code>"1.5rem"</code>
        . The React wrapper also takes <code>as</code> (default <code>"div"</code>), <code>className</code>,{' '}
        <code>style</code> and <code>ref</code>, which go on the outer wrapper. Use “Try it live” to open a prop in the{' '}
        <Link to="/playground">playground</Link>.
      </p>
      <PropsTable />
    </Sec>
  )
}

/* ---------- control modes ---------- */

function ControlModes() {
  return (
    <Sec id="control-modes">
      <table className="dtable">
        <thead>
          <tr>
            <th>
              <code>control</code>
            </th>
            <th>What happens</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>"hover"</code> (default)
            </td>
            <td>
              Tilts toward the pointer while it is over the element’s real silhouette, then springs back. On touch it
              behaves like <code>"drag"</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>"drag"</code>
            </td>
            <td>
              Grab and turn. 0.5° per pixel by default, starts after 5 px of movement, clamped to <code>maxAngle</code>. A
              drag suppresses the click that would follow it.
            </td>
          </tr>
          <tr>
            <td>
              <code>"both"</code>
            </td>
            <td>
              Hover until you grab it, and drag takes over while held. On release, hover resumes if the pointer is still
              over the element, otherwise it springs back.
            </td>
          </tr>
          <tr>
            <td>
              <code>"static"</code>
            </td>
            <td>
              No pointer tilt. The box stays at its resting <code>tilt</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Pointer options</h3>
      <ul className="dlist">
        <li>
          <code>maxAngle</code> is the largest angle hover and drag can reach.
        </li>
        <li>
          <code>springBack</code> and <code>springDuration</code> control the return to the resting tilt.
        </li>
        <li>
          <code>reverseHover</code> and <code>reverseDrag</code> flip each direction on its own.
        </li>
        <li>
          <code>touchScroll</code> (on by default) lets vertical swipes scroll the page, so only horizontal drags tilt a{' '}
          <code>"hover"</code> box.
        </li>
      </ul>
      <CodeBlock
        code={`<BrickBox control="both" reverseDrag>
  <div className="card">Grab me</div>
</BrickBox>`}
      />
      <h3>Touch</h3>
      <p>
        There is no hover on touch screens, so <code>"hover"</code> and <code>"both"</code> behave like{' '}
        <code>"drag"</code>. With <code>touchScroll</code> on, <code>"hover"</code> uses <code>touch-action: pan-y</code>.{' '}
        <code>"drag"</code> and <code>"both"</code> set <code>touch-action: none</code>.
      </p>
      <h3>Ignore areas</h3>
      <p>
        Mark part of the element with <code>data-brickbox-ignore</code>, or pass a selector with <code>ignore</code>. Over
        that area the tilt holds still, and a drag or press can’t start there. A drag that began elsewhere keeps going
        across it.
      </p>
      <CodeBlock
        code={`<BrickBox>
  <div className="card">
    <h2>Volume</h2>
    <input type="range" data-brickbox-ignore />
  </div>
</BrickBox>

{/* or: <BrickBox ignore=".knob, .slider"> */}`}
      />
    </Sec>
  )
}

/* ---------- shapes and colours ---------- */

function ShapesColours() {
  return (
    <Sec id="shapes-colours">
      <h3>Shapes</h3>
      <p>
        brickbox reads the shape from your element’s CSS, so you never describe it twice. Hover, drag and press follow the
        real silhouette, not the bounding box.
      </p>
      <CodeBlock
        code={`.donut {
  width: 170px;
  height: 170px;
  clip-path: path(evenodd,
    'M5 85 A80 80 0 1 0 165 85 A80 80 0 1 0 5 85 Z M55 85 A30 30 0 1 0 115 85 A30 30 0 1 0 55 85 Z');
}`}
      />
      <ul className="dlist">
        <li>
          <b>Supported <code>clip-path</code>:</b> <code>polygon()</code>, <code>circle()</code>, <code>ellipse()</code>,{' '}
          <code>inset()</code> (with <code>round</code>) and <code>path()</code>. Without a supported{' '}
          <code>clip-path</code>, the shape comes from <code>border-radius</code>, including per-corner and elliptical
          radii.
        </li>
        <li>
          <b>Holes</b> use even-odd nesting: a shape inside an odd number of others is a hole. Use <code>evenodd</code> in{' '}
          <code>path()</code>. That handles donuts, frames, a solid centre inside a hole, and separate islands.
        </li>
        <li>
          <b>Lengths</b> can be plain px or %, or any CSS length expression the browser can evaluate: <code>calc()</code>,{' '}
          <code>min()</code>, <code>max()</code>, <code>clamp()</code> and units such as <code>rem</code> and{' '}
          <code>vw</code>. <code>path()</code> takes fixed numbers only. <b>Not supported:</b>{' '}
          <code>url(#id)</code> and <code>shape()</code>, which fall back to the rounded rectangle with a warning in
          development.
        </li>
        <li>
          A set <code>clip-path</code> overrides <code>border-radius</code> for the walls.
        </li>
        <li>
          <code>path()</code> coordinates are fixed pixels from the element’s top-left corner, so give the element the same
          size as the path. Extra subpaths must start with an absolute <code>M</code>.
        </li>
        <li>
          A polygon with a zero-width slit (a “keyhole”) may show a seam. A nested <code>path()</code> with the same
          winding and no <code>evenodd</code> is treated as a hole by the walls.
        </li>
      </ul>

      <h3>Colour matching</h3>
      <p>
        With <code>sideColor="match"</code>, brickbox reads the child’s computed background when the box is built.
      </p>
      <ul className="dlist">
        <li>
          A <b>solid colour</b> gives solid walls.
        </li>
        <li>
          A <b>single linear gradient with <code>rgb()</code> or <code>rgba()</code> stops</b> is continued around the
          edge.
        </li>
        <li>
          <b>Anything else</b> falls back to the element’s background colour, or to a neutral grey if that is transparent.
          That covers images, stacked backgrounds, radial and conic gradients, and stops in px or em.
        </li>
      </ul>
      <CodeBlock
        code={`.solid    { background: #00AA3C; }
.gradient { background: linear-gradient(135deg, rgb(255, 178, 0), rgb(234, 55, 55)); }
.image    { background-color: #AB54F7; background-image: url(stripes.svg); }`}
      />
      <p>
        The walls follow the face when its colour or shape changes. brickbox re-reads the face after a pointer
        enters, leaves, presses or releases, after focus changes, after a class or style change on the face, after a
        theme change on <code>&lt;html&gt;</code> (a class, an attribute or the colour scheme), and frame by frame while a
        colour or shape transition or a finite animation runs. Nothing runs while the box is idle. It can miss a change
        that reaches the face through a stylesheet edit, a class on a middle ancestor, or an infinite animation, so call{' '}
        <code>box.update({'{}'})</code> to refresh the walls then, or turn tracking off with{' '}
        <code>advanced.trackColor</code>. Walls always follow the background, never the border colour.
      </p>

      <h3>Walls and edges</h3>
      <ul className="dlist">
        <li>
          <code>sideColor</code> accepts <code>"match"</code> or any CSS colour, which paints the walls exactly that colour.{' '}
          <code>"none"</code> (or <code>"transparent"</code>) builds no walls at all, which suits a box that only tilts its
          children.
        </li>
        <li>
          <code>shading</code> and <code>light</code> control the lighting on the walls.
        </li>
        <li>
          <code>edgeColor</code> and <code>edgeWidth</code> draw lines on the back rim and on sharp corners.
        </li>
        <li>
          <code>box-shadow</code> and <code>outline</code> are not extruded. Borders stay on the front face.
        </li>
      </ul>
    </Sec>
  )
}

/* ---------- press and shadows ---------- */

function PressShadows() {
  return (
    <Sec id="press-shadows">
      <h3>Press and sink</h3>
      <p>
        Set <code>pressSink</code> to a percent of <code>depth</code> and the face sinks toward the back when pressed. It’s
        off unless you set it. 70 sinks the face most of the way, and 99 is the most it takes. A press starts on pointer
        down and is cancelled as soon as a drag begins.
      </p>
      <CodeBlock
        code={`<BrickBox depth={40} pressSink={70} pressDuration={150}>
  <button className="btn">Press me</button>
</BrickBox>`}
      />
      <h3>Shadows</h3>
      <CodeBlock
        code={`<BrickBox depth={40} shadow="followLight">
  <div className="card">Soft shadow</div>
</BrickBox>`}
      />
      <p>
        <code>"followLight"</code> casts the shadow away from <code>light</code>, from any direction: light from the
        top-left puts the shadow at the bottom-right, and light from the right puts it on the left.{' '}
        <code>"bottom"</code> always casts it straight down, and <code>"none"</code> (the default) turns it off.
      </p>
      <p>
        Add blur, spread and colour after the mode, in that order, like <code>box-shadow</code> without the offsets:{' '}
        <code>shadow="followLight 12px 2px rgba(0,0,0,.4)"</code>. Blur and spread are in px, and spread may be negative.
        What you leave out is chosen from <code>depth</code>: blur equal to depth, spread 0, colour{' '}
        <code>rgba(0,0,0,.35)</code>. The distance always comes from <code>depth</code> too (0.6 × depth), so a deeper box
        casts a longer, softer shadow.
      </p>
      <p>
        The shadow is the flat silhouette of your element, holes included, drawn behind the box. It follows the box as it
        tilts, hovers, drags and presses: the side that lifts away casts a longer shadow, and a pressed box casts a tighter
        one. An ancestor with <code>overflow: hidden</code> will cut it off, so leave it room.
      </p>
    </Sec>
  )
}

/* ---------- nesting ---------- */

function Nesting() {
  return (
    <Sec id="nesting">
      <p>
        Give a box a <code>lift</code> and it becomes a part standing on its parent brickbox, in the same 3D scene, so it
        tilts with the parent and stands out from it.
      </p>
      <CodeBlock
        code={`<BrickBox depth={36} control="drag" shadow="followLight">
  <div className="remote">
    <BrickBox lift={0} depth={12} pressSink={65}>
      <button className="key">OK</button>
    </BrickBox>
    <BrickBox lift={12} depth={8} pressSink={60}>
      <button className="key small">GO</button>
    </BrickBox>
  </div>
</BrickBox>`}
      />
      <p>
        <code>lift</code> is how high the part’s base sits above the parent’s face (0 sits on it), and <code>depth</code> is
        the part’s height. In the example GO sits on top of OK, because its <code>lift</code> equals OK’s{' '}
        <code>depth</code>.
      </p>
      <h3>How a nested box behaves</h3>
      <ul className="dlist">
        <li>It is static, untilted and shaded, and it uses its parent’s <code>light</code>.</li>
        <li>
          Pressing it presses only it, and the parent doesn’t start a drag. Hovering over it still tilts the parent.
        </li>
        <li>Its shadow falls on the parent’s face.</li>
        <li>
          A box inside another box that has no <code>lift</code> behaves exactly as before.
        </li>
        <li>It uses the browser’s own hit test, so it works inside a rotated parent.</li>
      </ul>
      <h3>When a part doesn’t stand out</h3>
      <p>
        Something between the part and its parent’s face flattens the 3D scene: <code>overflow</code> other than{' '}
        <code>visible</code>, <code>opacity</code> below 1, <code>filter</code>, <code>clip-path</code>, <code>mask</code>,{' '}
        <code>isolation: isolate</code>, <code>mix-blend-mode</code> or <code>contain: paint</code>. In development
        brickbox names the element. Remove it, or move the part out of it. A parent face with its own{' '}
        <code>clip-path</code> can’t have parts standing out of it either, so put the part next to it.
      </p>
      <p>
        Try it in the <Link to="/playground#w-lift">playground</Link> with “Add a nested part”.
      </p>
    </Sec>
  )
}

/* ---------- API ---------- */

const ATTRS: [string, ReactNode][] = [
  ['depth', <>A number, or a CSS length such as <code>2rem</code>.</>],
  ['control', <><code>hover</code>, <code>drag</code>, <code>both</code> or <code>static</code>.</>],
  ['tilt', <>Two numbers, written <code>tilt="14 22"</code> (a comma works too).</>],
  [
    'max-angle, spring-duration, press-sink, press-duration, perspective, edge-width',
    <>Numbers. <code>press-sink</code> is a percent of depth, 0 to 99.</>,
  ],
  [
    'spring-back, shading, touch-scroll, disabled, reverse-hover, reverse-drag',
    <>Booleans. Present, or any value except <code>"false"</code>, means true. <code>="false"</code> means false.</>,
  ],
  [
    'side-color, edge-color',
    <>Any CSS colour, plus <code>match</code> or <code>none</code> for <code>side-color</code> and <code>none</code> or <code>auto</code> for <code>edge-color</code>.</>,
  ],
  ['light', <>A word such as <code>top-left</code>, or a number in degrees.</>],
  ['ignore', <>A CSS selector.</>],
  ['lift', <>A number, or a CSS length. Nests the box on its parent brickbox.</>],
  [
    'shadow',
    <>A mode, optionally followed by blur, spread and colour: <code>shadow="followLight 12px 2px rgba(0,0,0,.4)"</code>.</>,
  ],
  ['tolerance', <>Number. The only advanced option exposed as an attribute.</>],
]

function Api() {
  return (
    <Sec id="api">
      <h3>Plain JavaScript</h3>
      <CodeBlock
        code={`import { brickbox } from 'brickbox';
import type { BrickBoxOptions, BrickBoxInstance } from 'brickbox';

const box: BrickBoxInstance = brickbox(wrapperEl, options);
box.update({ depth: 60 });  // merges; a key set to undefined resets to its default
box.destroy();              // removes the structure and restores the original markup`}
      />
      <p>
        Also exported as types: <code>Advanced</code>, <code>Control</code>, <code>LightWord</code>, <code>Tilt</code>.
        Pass the advanced options as <code>advanced: {'{ ... }'}</code>.
      </p>
      <h3>React</h3>
      <table className="dtable">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>as</code>
            </td>
            <td>element type</td>
            <td>
              <code>"div"</code>
            </td>
            <td>Element type of the outer wrapper.</td>
          </tr>
          <tr>
            <td>
              <code>className</code>, <code>style</code>, <code>ref</code> and other HTML attributes
            </td>
            <td>as usual</td>
            <td>none</td>
            <td>Go on the outer wrapper. Layout props belong here.</td>
          </tr>
          <tr>
            <td>
              <code>children</code>
            </td>
            <td>exactly one React element</td>
            <td>required</td>
            <td>The front face.</td>
          </tr>
        </tbody>
      </table>
      <p>
        <code>&lt;BrickBox&gt;</code> renders the whole structure itself, so React owns the DOM, and the core attaches to
        it. Changing a prop calls <code>update</code> for you. The <code>BrickBoxProps</code> type is exported from{' '}
        <code>brickbox/react</code>.
      </p>
      <h3>Custom element</h3>
      <p>
        Attribute names are the kebab-case form of the options. Changing an attribute updates the box live. Call{' '}
        <code>defineBrickBox()</code> once, or <code>defineBrickBox('my-box')</code> for another tag name. The element
        needs exactly one element child.
      </p>
      <table className="dtable">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {ATTRS.map(([a, n]) => (
            <tr key={a}>
              <td>
                {a.split(', ').map((x, i) => (
                  <span key={x}>
                    {i > 0 && ', '}
                    <code>{x}</code>
                  </span>
                ))}
              </td>
              <td>{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Sec>
  )
}

/* ---------- server rendering and motion ---------- */

function SsrMotion() {
  return (
    <Sec id="ssr-motion">
      <h3>Server rendering</h3>
      <p>
        <code>&lt;BrickBox&gt;</code> is designed to be safe on the server: it doesn’t touch <code>window</code> or{' '}
        <code>document</code> while rendering. It renders your element inside the wrapper as normal, and the walls appear
        after the component mounts in the browser. Automated tests don’t cover server rendering yet. The plain{' '}
        <code>brickbox()</code> function and the custom element need a DOM, so call them in the browser.
      </p>
      <h3>Reduced motion</h3>
      <p>Hover tilt is off, and the press and spring transitions are removed.</p>
      <h3>Development warnings</h3>
      <p>
        When <code>process.env.NODE_ENV</code> isn’t <code>"production"</code>, brickbox warns when <code>depth</code> is
        more than half of <code>perspective</code> and when a <code>clip-path</code> isn’t supported.
      </p>
    </Sec>
  )
}

/* ---------- troubleshooting ---------- */

const TROUBLE: [string, string][] = [
  ['My box looks flat.', '`opacity`, `filter` or `overflow` is probably on the child or the 3D layer. Move it to the wrapper.'],
  [
    'The shape is a rounded rectangle, not my clip-path.',
    'It probably uses `url(#id)` or `shape()`, which aren’t supported (`calc()`, `min()`, `max()` and `clamp()` are). Rewrite it as `polygon()`, `circle()`, `ellipse()`, `inset()` or `path()`.',
  ],
  [
    'My nested box doesn’t stand out from its parent.',
    'Something between the nested box and its parent’s face flattens the 3D scene: `overflow` other than `visible`, `opacity` below 1, `filter`, `clip-path`, `mask`, `isolation: isolate`, `mix-blend-mode` or `contain: paint`. In development brickbox names the element. Remove it, or move the nested box out of it. A parent face with its own `clip-path` can’t have parts standing out of it either, so put the part next to it.',
  ],
  [
    'The keys move away from under my pointer.',
    'When the parent tilts on hover, everything on it moves, so a small key can slide out from under a still pointer. For a panel with many small keys, use `control="drag"` on the parent, or a small `maxAngle`.',
  ],
  [
    'The walls look clipped or distorted.',
    '`depth` is probably more than about half of `perspective`. Lower the depth or raise `perspective`.',
  ],
  [
    'The page slows down with many boxes.',
    'Every wall segment is its own element with a 3D transform. Raise `advanced.tolerance` for fewer, coarser segments, and use fewer boxes where you can. Boxes that share a `path()` share one sampling, and boxes far off screen wait to build their walls until you scroll close.',
  ],
  [
    'Nothing happens with <brick-box>.',
    'Check that you called `defineBrickBox()`, and that the element has exactly one element child.',
  ],
  [
    ':active or onPointerDown on my element fires before a drag.',
    'That’s a known limit, and it only applies when `pressSink` is set. A press is cancelled when a drag starts, but handlers and `:active` styles on your own element can fire first. Put buttons and inputs inside a `data-brickbox-ignore` area and brickbox won’t start a press or drag on them.',
  ],
]

function Troubleshooting() {
  return (
    <Sec id="troubleshooting">
      {TROUBLE.map(([q, a]) => (
        <div className="dq" key={q}>
          <h3>{q}</h3>
          <p>
            <Inline text={a} />
          </p>
        </div>
      ))}
      <p>
        Still stuck? <a href={`${REPO}/issues`}>Open an issue</a> and say which browser and version you used.
      </p>
    </Sec>
  )
}

/* ---------- migration ---------- */

function Migration() {
  return (
    <Sec id="migration">
      <h3>0.2 to 0.3: pressDepth is now pressSink</h3>
      <p>
        <code>pressDepth</code> was the depth the box shrank to while pressed. <code>pressSink</code> is how far it sinks,
        as a percent of <code>depth</code>. Unset means no press, so nothing sinks unless you ask. The custom element
        attribute changed from <code>press-depth</code> to <code>press-sink</code>. In development, passing{' '}
        <code>pressDepth</code> logs a warning. Projects that stay on 0.2.x see no change.
      </p>
      <p>
        To convert, use <code>(1 − pressDepth ÷ depth) × 100</code>. A box with <code>depth=40</code> and{' '}
        <code>pressDepth=8</code> sinks 80%:
      </p>
      <CodeBlock
        code={`// 0.2
<BrickBox depth={40} pressDepth={8}>

// 0.3 and later
<BrickBox depth={40} pressSink={80}>`}
      />
      <h3>0.3 to 1.0: nothing breaks</h3>
      <p>
        Boxes without <code>lift</code> are untouched. What is new: nesting with <code>lift</code>,{' '}
        <code>sideColor: "none"</code>, <code>advanced.trackColor</code>, <code>calc()</code> and friends in a{' '}
        <code>clip-path</code>, and walls and shadows that follow the face as it changes. You can usually delete{' '}
        <code>update()</code> calls you added only to refresh colours. <code>update({'{}'})</code> still works. The core
        grows by about 2.2 KB gzipped.
      </p>
      <p>
        Everything that changed in each release is in the <a href="#changelog">changelog</a> below.
      </p>
    </Sec>
  )
}

/* ---------- changelog ---------- */

function Changelog() {
  return (
    <Sec id="changelog">
      {CHANGELOG.map((r) => (
        <div className="dver" key={r.version}>
          <h3>{r.version}</h3>
          {r.groups.map((g) => (
            <div key={g.label}>
              <h4>{g.label}</h4>
              <ul className="dlist">
                {g.items.map((it) => (
                  <li key={it}>
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      <p>
        The full history is also in the <a href={`${REPO}/blob/main/CHANGELOG.md`}>CHANGELOG on GitHub</a>.
      </p>
    </Sec>
  )
}

/** All sections, in the order of SECTIONS. */
export default function DocsSections() {
  return (
    <>
      <GettingStarted />
      <Rules />
      <Props />
      <ControlModes />
      <ShapesColours />
      <PressShadows />
      <Nesting />
      <Api />
      <SsrMotion />
      <Troubleshooting />
      <Migration />
      <Changelog />
    </>
  )
}
