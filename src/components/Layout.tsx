import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BrickBox } from 'brickbox/react'
import { GithubIcon, NpmIcon } from './Icons'
import ScrollManager from './ScrollManager'

const REPO = 'https://github.com/Prashaxt/brickbox'
const NPM = 'https://www.npmjs.com/package/brickbox'

/** `on` decides which tile is current. onContribute is true while the Contribute section is in view on Home. */
const TILES: { to: string; n: string; label: string; cls: string; on: (path: string, onContribute: boolean) => boolean }[] = [
  { to: '/', n: '01', label: 'Home', cls: 't1', on: (p, c) => p === '/' && !c },
  { to: '/docs', n: '02', label: 'Docs', cls: 't2', on: (p) => p === '/docs' },
  { to: '/playground', n: '03', label: 'Playground', cls: 't3', on: (p) => p === '/playground' },
  { to: '/#contribute', n: '04', label: 'Contribute', cls: 't4', on: (p, c) => p === '/' && c },
]

export default function Layout() {
  const { pathname } = useLocation()
  /** playground and docs have their own header (brand + page title) instead of the shared sidebar */
  const isPlayground = /^\/playground\/?$/.test(pathname)
  const isDocs = /^\/docs\/?$/.test(pathname)
  const bare = isPlayground || isDocs
  const [open, setOpen] = useState(false)
  const [onContribute, setOnContribute] = useState(false)
  const sideRef = useRef<HTMLElement>(null)
  const footRef = useRef<HTMLElement>(null)

  /* on Home, the Contribute tile is current once that section has scrolled into the upper half of the screen */
  useEffect(() => {
    if (pathname !== '/') return
    let q = 0
    const run = () => {
      q = 0
      const el = document.getElementById('contribute')
      setOnContribute(!!el && el.getBoundingClientRect().top < window.innerHeight * 0.5)
    }
    const req = () => {
      if (!q) q = requestAnimationFrame(run)
    }
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    run()
    return () => {
      window.removeEventListener('scroll', req)
      window.removeEventListener('resize', req)
      cancelAnimationFrame(q)
      setOnContribute(false)
    }
  }, [pathname])

  /* mobile drawer: lock body scroll, close on Escape and when the breakpoint flips */
  useEffect(() => {
    document.body.classList.toggle('lock', open)
    return () => document.body.classList.remove('lock')
  }, [open])

  useEffect(() => {
    const mq = matchMedia('(max-width:900px)')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onMq = () => setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [])

  const onSideClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a') && matchMedia('(max-width:900px)').matches) setOpen(false)
  }

  /* desktop: the fixed sidebar slides up as the footer scrolls into view */
  useEffect(() => {
    const sd = sideRef.current
    const ft = footRef.current
    if (!sd || !ft) return
    const dm = matchMedia('(min-width:901px)')
    let q = 0
    const run = () => {
      q = 0
      if (!dm.matches) {
        sd.style.removeProperty('transform')
        return
      }
      const s = Math.max(0, innerHeight - ft.getBoundingClientRect().top)
      sd.style.transform = s ? `translateY(${-s}px)` : ''
    }
    const req = () => {
      if (!q) q = requestAnimationFrame(run)
    }
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    dm.addEventListener('change', req)
    run()
    // page height changes with the route, so measure again once the new page has laid out
    const settle = requestAnimationFrame(run)
    return () => {
      window.removeEventListener('scroll', req)
      window.removeEventListener('resize', req)
      dm.removeEventListener('change', req)
      cancelAnimationFrame(q)
      cancelAnimationFrame(settle)
    }
  }, [pathname])

  const skip = (e: MouseEvent) => {
    e.preventDefault()
    const m = document.getElementById('main')
    m?.setAttribute('tabindex', '-1')
    m?.focus()
    m?.scrollIntoView()
  }

  const toTop = () => {
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <ScrollManager />

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="rough" x="-6%" y="-8%" width="112%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="4" result="w" />
            <feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="11" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 .05  0 0 0 0 .22  0 0 0 0 .45  2.6 0 0 0 -1.05" result="dark" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 2.6 0 0 -1.1" result="light" />
            <feComposite in="dark" in2="d" operator="in" result="dk" />
            <feComposite in="light" in2="d" operator="in" result="lt" />
            <feMerge>
              <feMergeNode in="d" />
              <feMergeNode in="dk" />
              <feMergeNode in="lt" />
            </feMerge>
          </filter>
          <symbol id="slab" viewBox="0 0 160 112">
            <g stroke="#3B140C" strokeWidth="3" strokeLinejoin="miter" strokeMiterlimit="1.5">
              <path d="M10 44 L38 16 H150 L122 44 Z" fill="#E08A6A" />
              <path d="M122 44 L150 16 V74 L122 102 Z" fill="#8F3B26" />
              <rect x="10" y="44" width="112" height="58" fill="#C1502F" />
            </g>
          </symbol>
        </defs>
      </svg>

      <a className="skip" href="#main" onClick={skip}>
        Skip to content
      </a>

      {bare ? (
        <header className={'topbar ' + (isDocs ? 'docsbar' : 'pgbar')}>
          <Link className="backlink" to="/" aria-label="Back to home" title="Back to home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5 8 12l7 7" />
            </svg>
          </Link>
          <div className="hrow">
            <Link className="brand" to="/" aria-label="brickbox">
              <svg className="logo" viewBox="0 0 160 112" aria-hidden="true">
                <use href="#slab" />
              </svg>
              BRiCKBOX
            </Link>
            <h1 className="pgtitle">{isDocs ? 'Documentation' : 'Playground'}</h1>
          </div>
        </header>
      ) : (
        <>
      <header className="topbar">
        <Link className="brand" to="/" aria-label="brickbox" onClick={toTop}>
          <svg className="logo" viewBox="0 0 160 112" aria-hidden="true">
            <use href="#slab" />
          </svg>
          BRiCKBOX
        </Link>
        <button
          className="burger"
          id="menu"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="side"
          onClick={() => setOpen((o) => !o)}
        >
          <i />
          <i />
          <i />
        </button>
      </header>

      <aside className={'side' + (open ? ' open' : '')} id="side" ref={sideRef} onClick={onSideClick}>
        <Link className="brand" to="/" aria-label="brickbox" onClick={toTop}>
          <span className="wm" aria-hidden="true">
            <span>Brickbox</span>
            <p>2d to 3d</p>
          </span>
        </Link>
        <nav className="tiles" aria-label="Pages">
          {TILES.map((t) => (
            <Link key={t.to} to={t.to} className={'tile ' + t.cls} aria-current={t.on(pathname, onContribute) ? 'page' : undefined}>
              <b>{t.n}</b>
              <i aria-hidden="true">↗</i>
              <span>{t.label}</span>
            </Link>
          ))}
        </nav>
        <Link className="sbcard" to="/docs#changelog">
          <small>v1.0.0</small>
          <b>Changelog</b>
        </Link>
        <a className="pl gh" href={REPO}>
          <span>GitHub</span>
          <GithubIcon />
        </a>
        <a className="pl np" href={NPM}>
          <span>npm</span>
          <NpmIcon />
        </a>
      </aside>

        </>
      )}

      <main id="main" className={isDocs ? 'bare docs' : isPlayground ? 'bare' : undefined}>
        <Outlet />
      </main>

      {!isDocs && (
        <footer ref={footRef}>
          <div className="fcta">
            <h2>
              Give any element
              <br />
              some{' '}
              <BrickBox as="span" className="w fhl" depth={18} tilt={{ x: 12, y: -18 }} pressSink="72%">
                <span className="face">depth.</span>
              </BrickBox>
            </h2>
            <p>Free, open source, about 9.8 KB.</p>
            <div className="frow">
              <a className="fb amber" href={NPM}>
                Get it on npm
              </a>
              <a className="fb ghost" href={REPO}>
                <GithubIcon />
                Star on GitHub
              </a>
            </div>
          </div>
          <div className="fcols">
            <div className="fbrand">
              <span className="brand">
                <svg className="logo" viewBox="0 0 160 112" aria-hidden="true">
                  <use href="#slab" />
                </svg>
                brickbox
              </span>
              <p>A tiny library that turns any element into a 3D slab.</p>
            </div>
            <div>
              <h4>Use it</h4>
              <Link to="/#start">Quick start</Link>
              <Link to="/playground">Playground</Link>
              <Link to="/#examples">Examples</Link>
              <Link to="/docs#props">Props</Link>
            </div>
            <div>
              <h4>Project</h4>
              <a href={REPO}>GitHub</a>
              <a href={NPM}>npm</a>
              <a href={`${REPO}/blob/main/CONTRIBUTING.md`}>Contributing guide</a>
            </div>
            <div>
              <h4>Help</h4>
              <a href={`${REPO}/issues`}>Report a bug</a>
              <Link to="/#contribute">Help test</Link>
            </div>
          </div>
          <p className="fcopy">© 2026 brickbox · MIT licence</p>
        </footer>
      )}

      <div className="sr" aria-live="polite" id="live" />
    </>
  )
}
