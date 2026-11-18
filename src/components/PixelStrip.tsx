import { useEffect, useRef } from 'react'
import { SCENES, STRIP_H, STRIP_W, type Scene } from '../lib/pixelScenes'

export default function PixelStrip({ scene }: { scene: Scene }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    c.width = STRIP_W
    c.height = STRIP_H
    const ctx = c.getContext('2d')
    if (ctx) SCENES[scene](ctx)
  }, [scene])
  return <canvas className="strip" ref={ref} aria-hidden="true" />
}
