import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { GROUP_COLORS, PROPS, groupOf, type PropGroup } from '../../data/props'

const GROUPS = Object.keys(GROUP_COLORS) as PropGroup[]
const countOf = (g: PropGroup | 'All') => (g === 'All' ? PROPS.length : PROPS.filter((p) => groupOf(p) === g).length)
const haystack = (p: (typeof PROPS)[number]) => [p.k, p.n, p.a, p.v, p.x].join(' ').toLowerCase()

/** Every prop in one table, with group filters and search. Reads src/data/props.ts. */
export default function PropsTable() {
  const [group, setGroup] = useState<PropGroup | 'All'>('All')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const shown = PROPS.filter((p) => (group === 'All' || group === groupOf(p)) && (!q || haystack(p).includes(q)))
  const n = shown.length

  return (
    <div className="pn c-w ptab">
      <div className="ptool">
        <div className="pchips" role="group" aria-label="Filter props by group">
          {(['All', ...GROUPS] as const).map((g) => (
            <button key={g} type="button" className="pchip" aria-pressed={g === group} onClick={() => setGroup(g)}>
              {g}
              <span>{countOf(g)}</span>
            </button>
          ))}
        </div>
        <label className="psearch">
          <span className="sr">Search props</span>
          <input type="search" placeholder="Search props" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      <p className="pcount" aria-live="polite">
        {n} {n === 1 ? 'prop' : 'props'}
        {q || group !== 'All' ? ' shown' : ''}
      </p>
      <div className="tw" tabIndex={0} role="region" aria-label="Props table">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Values</th>
              <th>Default</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => {
              const rows = shown.filter((p) => groupOf(p) === g)
              if (!rows.length) return null
              return (
                <Fragment key={g}>
                  <tr className="gr">
                    <th colSpan={4} style={{ background: GROUP_COLORS[g] }}>
                      {g}
                      <span>
                        {rows.length} {rows.length > 1 ? 'props' : 'prop'}
                      </span>
                    </th>
                  </tr>
                  {rows.map((p) => (
                    <tr key={p.k} id={'prop-' + p.k} data-g={g} style={{ '--gc': GROUP_COLORS[g] } as React.CSSProperties}>
                      <td className="pn1" data-l="Prop">
                        <b className="pname">{p.n || p.k}</b>
                        <small>{p.a}</small>
                        {!p.ro && (
                          <Link className="try" to={'/playground#w-' + p.k}>
                            Try it live ↗
                          </Link>
                        )}
                      </td>
                      <td className="vl" data-l="Values">
                        {p.v}
                      </td>
                      <td data-l="Default">
                        <span className="df">{p.ds}</span>
                      </td>
                      <td data-l="What it does">{p.x + (p.ro ? ' Reference-only here.' : '')}</td>
                    </tr>
                  ))}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      {n === 0 && <p className="pempty">No props match that search.</p>}
    </div>
  )
}
