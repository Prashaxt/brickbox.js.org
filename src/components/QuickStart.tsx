import { useState } from 'react'
import { QUICK_START } from '../data/quickStart'
import CodeBlock from './CodeBlock'
import Tabs from './Tabs'

export default function QuickStart() {
  const [i, setI] = useState(0)
  const steps = QUICK_START[i][1]

  return (
    <div className="pn c-onyx dk s8" id="qs">
      <span className="pill">Quick start</span>
      <h2>Two minutes to your first slab</h2>
      <Tabs
        id="tabs"
        label="Framework"
        idPrefix="qt"
        names={QUICK_START.map((q) => q[0])}
        value={i}
        onChange={setI}
      />
      <div id="tabpanel" role="tabpanel" tabIndex={0} aria-labelledby={'qt' + i}>
        <ol className="stp">
          {steps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              {s.note ? <span>{s.body}</span> : <CodeBlock code={s.body} />}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
