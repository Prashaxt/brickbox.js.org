import { BrickBox } from 'brickbox/react'
import Examples from '../components/Examples'
import GoodToKnow from '../components/GoodToKnow'
import Hero from '../components/Hero'
import PixelStrip from '../components/PixelStrip'
import QuickStart from '../components/QuickStart'
import Ticker from '../components/Ticker'

const REPO = 'https://github.com/Prashaxt/brickbox'

export default function Home() {
  return (
    <>
      <section id="start" aria-label="Start">
        <div className="bento">
          <Hero />
          <Ticker />

          <div className="pn c-amber s5 how">
            <span className="pill">How it works</span>
            <div className="bot">
              <h2>A slab built from your element</h2>
              <p>
                brickbox measures your element once, draws thin walls behind it and lets CSS do the 3D. The element is
                the front face. It is never cloned or rewritten, so text stays selectable and buttons keep working.
              </p>
              <p>At rest nothing runs. Touch it and it tilts, press it and it sinks.</p>
            </div>
          </div>

          <div
            className="pn c-blue s7 dia"
            role="img"
            aria-label="Diagram of a slab: your element is the front face, thin walls sit behind it, and CSS rotates the whole thing"
          >
            <svg className="ln" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" stroke="#fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
                <path vectorEffect="non-scaling-stroke" d="M24 20 L44 42" />
                <path vectorEffect="non-scaling-stroke" d="M76 80 L62 60" />
                <path vectorEffect="non-scaling-stroke" d="M76 20 L60 38" />
              </g>
            </svg>
            <BrickBox id="diaW" className="w" depth={46} control="static" tilt={{ x: 10, y: 24 }}>
              <div className="face">your element</div>
            </BrickBox>
            <div className="lab l1">
              <b>Front face</b>Your element, untouched.
            </div>
            <div className="lab l3">
              <b>Rotation</b>Plain CSS 3D.
            </div>
            <div className="lab l2">
              <b>Walls</b>Drawn behind it, following the outline.
            </div>
          </div>

          <div className="pn c-green s4 stat">
            <span className="pill">Size</span>
            <div className="bot">
              <div className="big">9.8 KB</div>
              <p>gzipped, with no dependencies.</p>
            </div>
          </div>
          <div className="pn c-yellow s4 stat">
            <span className="pill">Real HTML</span>
            <div className="bot">
              <div className="big">100%</div>
              <p>your own element. Never cloned or rewritten.</p>
            </div>
          </div>
          <div className="pn c-coral s4 stat">
            <span className="pill">Server safe</span>
            <div className="bot">
              <div className="big">0</div>
              <p>
                touches of <code>window</code> or <code>document</code> while rendering.
              </p>
            </div>
          </div>

          <QuickStart />

          <div className="pn c-purple s4">
            <span className="pill">Three rules to know</span>
            <ol className="rl fill rules" style={{ listStyle: 'none' }}>
              <li>
                <span className="rn">Rule 1</span>The wrapper holds exactly one element, and that element is the front face.
              </li>
              <li>
                <span className="rn">Rule 2</span>Layout (flex, grid, margins, position) goes on the wrapper. Looks
                (background, radius, padding) stay on the element.
              </li>
              <li>
                <span className="rn">Rule 3</span>Opacity, filter and overflow go on the wrapper, never inside it, because
                they flatten the 3D.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <PixelStrip scene="hills1" />

      <section aria-label="Examples">
        <div className="bento">
          <Examples />
        </div>
      </section>

      <PixelStrip scene="city" />

      <section aria-label="Good to know">
        <div className="bento">
          <GoodToKnow />
        </div>
      </section>

      <PixelStrip scene="peaks" />

      <section id="contribute" aria-label="Contribute">
        <div className="bento">
          <div className="pn c-green s12 notopborder">
            <span className="pill">Contribute</span>
            <div className="bot">
              <h2>Help us find the rough edges</h2>
              <p style={{ maxWidth: '60ch' }}>
                Every change to brickbox is measured against six house rules.{' '}
                <a href={`${REPO}/blob/main/CONTRIBUTING.md`}>Read the contributing guide</a>.
              </p>
            </div>
          </div>
          <div className="pn c-purple s4 tall">
            <span className="pill">Quiet and gentle</span>
            <div className="bot">
              <h3>Light on the page</h3>
              <p>
                No timers or animation loops while nobody is touching it. No layout changes, walls hidden from screen
                readers, reduced motion respected, and no network or storage use.
              </p>
            </div>
          </div>
          <div className="pn c-orange s4 tall">
            <span className="pill">Tiny</span>
            <div className="bot">
              <h3>No dependencies, no stylesheet</h3>
              <p>
                No runtime dependencies and no stylesheet to import. Every change is measured against six house rules,
                and the goal is to shrink, not grow.
              </p>
            </div>
          </div>
          <div className="pn c-yellow s4 tall">
            <span className="pill">Honest</span>
            <div className="bot">
              <h3>Honest about limits</h3>
              <p>
                If something does not work, the docs say so. The limits are listed above, and the browsers that have not
                been checked are named.
              </p>
            </div>
          </div>
          <div className="pn c-onyx dk s6">
            <span className="pill">Report a bug</span>
            <div className="bot">
              <p>
                Open an issue on GitHub. Say which browser and version you used, your operating system, what you expected
                and what you saw. A short snippet that shows it helps most.
              </p>
              <a className="btn" style={{ justifySelf: 'start' }} href={`${REPO}/issues`}>
                Open an issue
              </a>
            </div>
          </div>
          <div className="pn c-blue s6">
            <span className="pill" style={{ color: '#fff' }}>
              Help test
            </span>
            <div className="bot">
              <p>
                Open the playground in Safari or Firefox, try hover, drag, press and a few shapes, then tell us what
                worked and what did not. Both good and bad reports are useful.
              </p>
              <a className="btn" style={{ justifySelf: 'start' }} href={`${REPO}/blob/main/CONTRIBUTING.md`}>
                Contributing guide
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
