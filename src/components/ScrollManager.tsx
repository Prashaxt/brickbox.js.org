import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Router pages don't reset scroll on their own.
 * New page -> jump to the top (instantly, even though html has smooth scrolling).
 * /page#id -> smooth-scroll to that element, like the old single-page anchors.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash, key])
  return null
}
