import { useState, useEffect } from 'react'
import useScrollSpy from '../../hooks/useScrollSpy'

const LINKS = [
  { href: 'hero', label: 'Início' },
  { href: 'detalhes', label: 'O Evento' },
  { href: 'colagem', label: 'Galeria' },
  { href: 'rsvp', label: 'Confirmar' },
  { href: 'presentes', label: 'Presentes' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(LINKS.map(l => l.href))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function close() { setMenuOpen(false) }

  return (
    <header className={`header-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="logo">B &amp; E</div>
      <button
        className={`nav-toggle${menuOpen ? ' open' : ''}`}
        aria-label="Abrir menu"
        onClick={() => setMenuOpen(v => !v)}
      >
        <span /><span /><span />
      </button>
      <nav className={`nav-menu${menuOpen ? ' open' : ''}`}>
        {LINKS.map(l => (
          <a
            key={l.href}
            href={`#${l.href}`}
            className={`nav-link${active === l.href ? ' active' : ''}`}
            onClick={close}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
