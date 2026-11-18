import CopyButton from './CopyButton'

export default function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code">
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
      <CopyButton className="btn sm" text={code} />
    </div>
  )
}
