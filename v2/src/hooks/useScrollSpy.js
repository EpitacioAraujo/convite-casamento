import { useState, useEffect } from 'react'

export default function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    function onScroll() {
      const pos = window.scrollY + 100
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= pos) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids])

  return active
}
