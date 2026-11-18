import { useRef, type KeyboardEvent } from 'react'

interface Props {
  names: string[]
  value: number
  onChange: (i: number) => void
  /** accessible name of the tablist */
  label: string
  /** each tab gets id = idPrefix + index, so a panel can point at it with aria-labelledby */
  idPrefix: string
  id?: string
}

/** Roving-tabindex tablist: ← → Home End move between tabs. */
export default function Tabs({ names, value, onChange, label, idPrefix, id }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const len = names.length
    const n =
      e.key === 'ArrowRight' ? (value + 1) % len
      : e.key === 'ArrowLeft' ? (value + len - 1) % len
      : e.key === 'Home' ? 0
      : e.key === 'End' ? len - 1
      : -1
    if (n < 0) return
    e.preventDefault()
    onChange(n)
    refs.current[n]?.focus()
  }

  return (
    <div role="tablist" aria-label={label} id={id} onKeyDown={onKeyDown}>
      {names.map((n, i) => (
        <button
          key={n}
          ref={(el) => {
            refs.current[i] = el
          }}
          role="tab"
          type="button"
          id={idPrefix + i}
          aria-selected={i === value}
          tabIndex={i === value ? 0 : -1}
          onClick={() => onChange(i)}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
