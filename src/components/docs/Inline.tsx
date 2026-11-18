import { Fragment } from 'react'

/** Turns `backticked` pieces of a string into <code>. */
export default function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>))}
    </>
  )
}
