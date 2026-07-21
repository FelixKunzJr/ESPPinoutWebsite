import { useEffect, useState } from 'react'

// Small media-query hook. Used where a breakpoint has to change *what* is
// rendered rather than just how it looks - on phones the pin table, mapping
// builder and export panel move out of the page and into sheets, and
// rendering them twice would double the DOM for no benefit.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : false)

  useEffect(() => {
    if (!window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
