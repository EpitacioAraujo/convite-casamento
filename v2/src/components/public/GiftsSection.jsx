import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { api } from '../../api'
import { useCart } from '../../CartContext'

gsap.registerPlugin(ScrollTrigger)

function fmt(v) { return 'R$ ' + parseFloat(v).toFixed(2).replace('.', ',') }

export default function GiftsSection() {
  const [gifts, setGifts] = useState(window.__GIFTS || [])
  const { items, add } = useCart()

  useEffect(() => {
    gsap.fromTo('#presentes', { opacity: 0, y: 30 }, {
      scrollTrigger: { trigger: '#presentes', start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 1.2, ease: 'power2.out'
    })
    if (!window.__GIFTS) api.getGifts().then(setGifts).catch(() => {})
  }, [])

  const cartIds = new Set(items.map(i => i.id))

  return (
    <section id="presentes" className="section-gifts">
      <div className="container">
        <div className="section-header">
          <img src="/icons/gift.png" alt="Presentes" className="section-icon" />
          <h2 className="section-title">Lista de Presentes</h2>
          <p className="section-subtitle">Se deseja nos presentear, escolha um item da nossa lista</p>
        </div>

        {gifts.length > 0 ? (
          <div className="gifts-scroll">
            {gifts.map(g => {
              const chosen = !!g.chosen_by
              const inCart = cartIds.has(g.id)
              return (
                <div key={g.id} className={`gift-card${chosen ? ' gift-card--chosen' : ''}`}>
                  <div className="gift-card-body">
                    <span className="gift-card-name">{g.name}</span>
                    <span className="gift-card-value">{fmt(g.value)}</span>
                    {g.link && <a href={g.link} target="_blank" rel="noreferrer" className="gift-link">Ver produto →</a>}
                  </div>
                  <div className="gift-card-footer">
                    {chosen ? (
                      <span className="gift-chosen-tag">🎁 Escolhido</span>
                    ) : inCart ? (
                      <span className="gift-in-cart-tag">✓ No carrinho</span>
                    ) : (
                      <button className="gift-add-btn" onClick={() => add(g)}>Adicionar ao carrinho</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', marginTop: 40, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            A lista de presentes será divulgada em breve.
          </p>
        )}
      </div>

    </section>
  )
}
