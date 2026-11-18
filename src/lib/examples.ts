import BrickBoxLegacy from '../vendor/brickbox-legacy.js'
import rawMarkup from '../assets/examples.html?raw'

/* Everything below is the old site's Examples code, kept as it was. The example boxes are
   <brick-box> elements driven by the old build in src/vendor, not by the brickbox npm package. */

/**
 * Prepares the markup once, before it reaches the page:
 * gives every nested part its defaults (so the markup stays short).
 * Done on an inert <template>, so the elements are not upgraded yet.
 */
export function prepareExamples(): string {
  if (typeof document === 'undefined') return rawMarkup
  const t = document.createElement('template')
  t.innerHTML = rawMarkup
  t.content.querySelectorAll('.scene brick-box').forEach((b) => {
    if (!b.hasAttribute('control')) b.setAttribute('control', 'static')
    if (!b.hasAttribute('tilt')) b.setAttribute('tilt', '0 0')
    if (!b.hasAttribute('edge-color')) b.setAttribute('edge-color', 'auto')
    if (b.hasAttribute('side-color') && !b.hasAttribute('shading')) b.setAttribute('shading', '')
  })
  return t.innerHTML
}

/** Wires up the examples inside `root`. Returns a cleanup function. */
export function initExamples(root: HTMLElement): () => void {
  const off: (() => void)[] = []
  const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void) => {
    window.addEventListener(type, fn)
    off.push(() => window.removeEventListener(type, fn))
  }
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!
  const flash = (el: Element, c: string, ms = 520) => {
    el.classList.remove(c)
    void (el as HTMLElement).offsetWidth
    el.classList.add(c)
    setTimeout(() => el.classList.remove(c), ms)
  }

  BrickBoxLegacy.defineBrickBox()

  /* shrink the 400px scenes to fit narrow columns */
  const fit = () =>
    root.querySelectorAll<HTMLElement>('.xstage').forEach((st) => {
      const r = st.querySelector<HTMLElement>('brick-box.root')
      if (!r) return
      const k = Math.min(1, (st.parentElement!.clientWidth - 36) / 410)
      r.style.zoom = String(k)
      st.style.minHeight = Math.round(380 * k + 24) + 'px'
    })
  fit()
  let ft: number | undefined
  on('resize', () => {
    window.clearTimeout(ft)
    ft = window.setTimeout(fit, 100)
  })
  off.push(() => window.clearTimeout(ft))

  /* camera */
  $('#shutter').addEventListener('click', () => {
    flash($('#lamp .f'), 'fire')
    flash($('#glass .f'), 'fire')
    $('#lamp').classList.add('x')
    const f = $('#lamp .f')
    const g = $('#glass .f')
    ;[f, g].forEach((e) => {
      e.style.animation = 'none'
      void e.offsetWidth
      e.style.animation = e === f ? 'fire .5s ease-out' : 'glint .5s ease-out'
    })
  })

  /* remote */
  let ledTimer: number | undefined
  $('#rem').addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('[data-key]')) {
      const l = $('#led')
      l.classList.add('on')
      window.clearTimeout(ledTimer)
      ledTimer = window.setTimeout(() => l.classList.remove('on'), 160)
    }
  })
  off.push(() => window.clearTimeout(ledTimer))

  /* radio */
  {
    const st: Record<string, number> = { tune: 0.35, vol: 0.5 }
    const apply = () => {
      $('#needle').style.left = 10 + st.tune * 126 + 'px'
      $('#freq').textContent = 'FM ' + (88 + st.tune * 20).toFixed(1)
      const c = $('#cone')
      c.classList.add('beat')
      c.style.setProperty('--sc', (1 + st.vol * 0.22).toFixed(3))
      c.style.setProperty('--bt', (0.9 - st.vol * 0.55).toFixed(2) + 's')
    }
    root.querySelectorAll<HTMLElement>('.xknob').forEach((k) => {
      const key = k.dataset.knob!
      const mk = k.querySelector<HTMLElement>('.mk')!
      let rot = -135 + st[key] * 270
      const draw = () => {
        mk.parentElement!.style.setProperty('--r', String(rot))
        mk.style.transformOrigin = '50% 22px'
        mk.style.transform = `translateZ(3px) rotate(${rot}deg)`
      }
      draw()
      k.addEventListener('pointerdown', (e) => {
        const r = k.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        let last = Math.atan2(e.clientY - cy, e.clientX - cx)
        const mv = (ev: PointerEvent) => {
          const a = Math.atan2(ev.clientY - cy, ev.clientX - cx)
          let d = a - last
          if (d > Math.PI) d -= 2 * Math.PI
          if (d < -Math.PI) d += 2 * Math.PI
          last = a
          rot = Math.max(-135, Math.min(135, rot + (d * 180) / Math.PI))
          st[key] = (rot + 135) / 270
          draw()
          apply()
        }
        const up = () => {
          removeEventListener('pointermove', mv)
          removeEventListener('pointerup', up)
        }
        addEventListener('pointermove', mv)
        addEventListener('pointerup', up)
        off.push(up)
      })
    })
    apply()
  }

  /* robot */
  {
    const eyes = [
      ['#eyeL', '#pupL'],
      ['#eyeR', '#pupR'],
    ].map(([e, p]) => ({ e: $(e), p: $(p) }))
    let px = 0
    let py = 0
    let raf = 0
    on('pointermove', (ev) => {
      px = ev.clientX
      py = ev.clientY
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          eyes.forEach(({ e, p }) => {
            const r = e.getBoundingClientRect()
            const cx = r.left + r.width / 2
            const cy = r.top + r.height / 2
            let dx = px - cx
            let dy = py - cy
            const d = Math.hypot(dx, dy) || 1
            const m = Math.min(10, d / 12)
            dx = (dx / d) * m
            dy = (dy / d) * m
            p.style.left = 14 + dx + 'px'
            p.style.top = 14 + dy + 'px'
          })
        })
    })
    off.push(() => cancelAnimationFrame(raf))
    let fast = false
    $('#bot').addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-bot]')
      if (!b) return
      const k = b.dataset.bot
      if (k === 'eyes') eyes.forEach(({ e }) => flash(e, 'blink', 400))
      if (k === 'ball') flash($('#ball'), 'glow', 900)
      if (k === 'heart') {
        fast = !fast
        $('#heart').style.setProperty('--hb', fast ? '.45s' : '1.1s')
      }
    })
  }

  return () => off.forEach((f) => f())
}
