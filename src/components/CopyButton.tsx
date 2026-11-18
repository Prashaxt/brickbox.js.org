import { useEffect, useRef, useState } from 'react'
import { announce, copyText } from '../lib/copy'

interface Props {
  text: string
  className?: string
}

export default function CopyButton({ text, className }: Props) {
  const [state, setState] = useState<'idle' | 'done' | 'manual'>('idle')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = async () => {
    const ok = await copyText(text)
    if (ok) {
      setState('done')
      announce('Copied to clipboard')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setState('idle'), 1500)
    } else {
      setState('manual')
      window.prompt('Copy this:', text)
    }
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {state === 'done' ? 'Copied' : state === 'manual' ? 'Press Ctrl+C' : 'Copy'}
    </button>
  )
}
