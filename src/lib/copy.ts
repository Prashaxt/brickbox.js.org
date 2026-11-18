/** Copies text. Uses the Clipboard API, falls back to execCommand. Resolves true if it worked. */
export async function copyText(txt: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(txt)
      return true
    }
  } catch {
    /* fall through to the textarea fallback */
  }
  const t = document.createElement('textarea')
  t.value = txt
  t.style.cssText = 'position:fixed;opacity:0'
  document.body.append(t)
  t.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    /* ignore */
  }
  t.remove()
  return ok
}

/** Announces a message in the page-wide polite live region (#live, rendered by Layout). */
export function announce(msg: string) {
  const el = document.getElementById('live')
  if (el) el.textContent = msg
}
