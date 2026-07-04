import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HeroSection() {
  const bgRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline()

    gsap.to(bgRef.current, { scale: 1, duration: 2.5, ease: 'power2.out' })

    tl.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .fromTo('.hero-title',    { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.7')
      .fromTo('.hero-tagline',  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, '-=0.8')
      .fromTo('.hero-date-block', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .fromTo('.btn-hero',      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
      .fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 0.8, duration: 1 }, '-=0.2')
  }, [])

  return (
    <section id="hero" className="section-hero">
      <div className="hero-bg-wrapper">
        <div className="hero-bg" ref={bgRef} />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <p className="hero-subtitle">COM A BENÇÃO DE DEUS E DE SEUS PAIS</p>
        <h1 className="hero-title">Bianca &amp; Epitacio</h1>
        <p className="hero-tagline">Convidam para celebrar o amor e o início de uma nova jornada juntos</p>
        <div className="hero-date-block">
          <span className="line" />
          <span className="date-text">21 DE OUTUBRO DE 2026</span>
          <span className="line" />
        </div>
        <a href="#rsvp" className="btn btn-primary btn-hero">Confirmar Presença</a>
      </div>
      <div className="scroll-indicator">
        <span className="mouse"><span className="wheel" /></span>
      </div>
    </section>
  )
}
