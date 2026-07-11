import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MAPS_URL = 'https://www.google.com/maps?q=Av.+Benjamim+Brasil,+570+-+Maraponga,+Fortaleza+-+CE,+60762-080'
const WAZE_URL = 'https://waze.com/ul?q=Av.+Benjamim+Brasil,+570+-+Maraponga,+Fortaleza+-+CE,+60762-080'
const ADDRESS = 'Av. Benjamim Brasil, 570 — Maraponga, Fortaleza - CE'

export default function EventDetailsSection() {
  useEffect(() => {
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 50 }, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 1, y: 0, duration: 1, ease: 'power3.out'
      })
    })
  }, [])

  return (
    <section id="detalhes" className="section-details">
      <div className="container">
        <div className="section-header">
          <img src="/icons/hearts.png" alt="Corações" className="section-icon animate-spin-slow" />
          <h2 className="section-title">O Grande Dia</h2>
          <p className="section-subtitle">Tudo o que você precisa saber para celebrar conosco</p>
        </div>

        <div className="details-grid">
          <div className="details-card reveal-up">
            <div className="details-card-icon">
              <img src="/icons/calendar.png" alt="Calendário" />
            </div>
            <h3>A Cerimônia</h3>
            <p className="venue">Garden Buffet</p>
            <p className="time">Quarta-feira, às 17:00h</p>
            <p className="venue">Cerimônia e Recepção no mesmo local</p>
            <p className="address">{ADDRESS}</p>
            <div className="card-actions">
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                <img src="/icons/pin.png" alt="Pin" className="btn-icon" /> Ver no Google Maps
              </a>
              <a href={WAZE_URL} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Ver no Waze</a>
            </div>
          </div>

          <div className="details-card reveal-up">
            <div className="details-card-icon">
              <img src="/icons/pin.png" alt="Local" />
            </div>
            <h3>A Festa</h3>
            <p className="time">Quarta-feira, a partir das 18:00h</p>
            <p className="venue">Mesmo local da cerimônia</p>
            <p className="address">{ADDRESS}</p>
            <div className="card-actions">
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                <img src="/icons/pin.png" alt="Pin" className="btn-icon" /> Ver no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
