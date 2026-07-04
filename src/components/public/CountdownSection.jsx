import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useCountdown from '../../hooks/useCountdown'

gsap.registerPlugin(ScrollTrigger)

export default function CountdownSection() {
  const parts = useCountdown()

  useEffect(() => {
    gsap.fromTo('#countdown', { opacity: 0, y: 30 }, {
      scrollTrigger: { trigger: '#countdown', start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 1.2, ease: 'power2.out'
    })
  }, [])

  return (
    <section id="countdown" className="section-countdown">
      <div className="container">
        <h2 className="section-title-alt">Faltam apenas...</h2>
        <div className="countdown-grid">
          {parts ? (
            [['days', 'Dias'], ['hours', 'Horas'], ['minutes', 'Minutos'], ['seconds', 'Segundos']].map(([k, label]) => (
              <div key={k} className="countdown-card">
                <span className="countdown-num">{parts[k]}</span>
                <span className="countdown-label">{label}</span>
              </div>
            ))
          ) : (
            <div className="countdown-card" style={{ maxWidth: '100%', width: '100%' }}>
              <span className="countdown-num" style={{ fontSize: '1.8rem', fontStyle: 'italic' }}>Chegou o Grande Dia!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
