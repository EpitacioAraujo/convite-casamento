import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PHOTOS = ['foto2', 'foto3', 'foto1', 'foto5', 'foto6', 'foto4']

export default function CollageSection() {
  useEffect(() => {
    gsap.utils.toArray('.reveal-collage').forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 60, scale: 0.88 }, {
        scrollTrigger: { trigger: '.collage-grid', start: 'top 82%', toggleActions: 'play none none none' },
        opacity: 1, y: 0, scale: 1, duration: 0.75, delay: i * 0.12, ease: 'power3.out'
      })
    })
  }, [])

  return (
    <section id="colagem" className="section-collage">
      <div className="container">
        <div className="section-header">
          <img src="/icons/hearts.png" alt="Corações" className="section-icon animate-spin-slow" />
          <h2 className="section-title">Nossos Momentos</h2>
          <p className="section-subtitle">Cada instante, uma lembrança viva</p>
        </div>
        <div className="collage-grid">
          {PHOTOS.map((f, i) => (
            <div key={i} className="collage-card reveal-collage">
              <div className="collage-img-wrapper">
                <img src={`/images/gallery/${f}.jpeg`} alt={`Momento ${i + 1}`} loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
