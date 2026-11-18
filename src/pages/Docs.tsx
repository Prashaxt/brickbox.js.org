import { useEffect, useState, type MouseEvent } from 'react'
import DocsSections from '../components/docs/DocsSections'
import { SECTIONS } from '../data/docsNav'

/**
 * Documentation: a fixed text sidebar (no scrolling), sticky section headings,
 * and a scroll-spy that highlights the section you are reading.
 */
export default function Docs() {
  const [active, setActive] = useState(SECTIONS[0].id)
  const [open, setOpen] = useState(false)

  /* scroll-spy: the active section is the last one whose top has passed the header */
  useEffect(() => {
    let q = 0
    const run = () => {
      q = 0
      const bar = document.querySelector('.docsbar')
      const off = (bar?.getBoundingClientRect().height ?? 72) + 24
      let cur = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= off) cur = s.id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        cur = SECTIONS[SECTIONS.length - 1].id
      }
      setActive(cur)
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
    }
  }, [])

  /* mobile contents drawer: lock the page, close on Escape or when the screen grows */
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

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView()
    window.history.replaceState(window.history.state, '', '#' + id)
    setActive(id)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="dtoc-btn"
        aria-expanded={open}
        aria-controls="dnav"
        onClick={() => setOpen((o) => !o)}
      >
        Contents
      </button>
      {open && <div className="dscrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <nav className={'dnav' + (open ? ' open' : '')} id="dnav" aria-label="Documentation sections">
        <ol>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={'#' + s.id}
                className={s.id === active ? 'on' : undefined}
                aria-current={s.id === active ? 'location' : undefined}
                onClick={(e) => go(e, s.id)}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="dcontent">
        <DocsSections />
      </div>
    </>
  )
}
