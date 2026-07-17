import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { api } from '../../api'
import { useCart } from '../../CartContext'

gsap.registerPlugin(ScrollTrigger)

function fmt(v) { return 'R$ ' + parseFloat(v).toFixed(2).replace('.', ',') }

export default function GiftsSection() {
  const [gifts, setGifts] = useState(window.__GIFTS || [])
  const [toast, setToast] = useState(false)
  const { items, add } = useCart()

  function copyPix() {
    const key = window.__PIX_KEY || ''
    const tryWrite = navigator.clipboard
      ? navigator.clipboard.writeText(key)
      : Promise.reject()
    tryWrite.catch(() => {
      const el = Object.assign(document.createElement('textarea'), {
        value: key, style: 'position:fixed;opacity:0'
      })
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    })
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

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

        <div className="gifts-scroll">
          <div className="gift-card gift-card--pix" onClick={copyPix}>
            <div className="gift-card-body">
              <svg className="gift-card-pix-icon" viewBox="0 0 512 512" width="34" height="34" fill="currentColor">
                <path d="M242.4 292.5C247.8 298 255.9 298 261.4 292.5L354.2 199.7C356.7 197.2 356.7 193.2 354.2 190.7L339.2 175.7C336.7 173.2 332.7 173.2 330.2 175.7L256.7 249.2C255.6 250.3 253.9 250.3 252.8 249.2L179.3 175.7C176.8 173.2 172.8 173.2 170.3 175.7L155.3 190.7C152.8 193.2 152.8 197.2 155.3 199.7L242.4 292.5Z" opacity="0"/>
                <path d="M256 32C247.2 32 238.4 35.3 231.7 42L149.7 124C144 129.7 136.6 132.6 129.2 132.6H108C89.2 132.6 74 147.8 74 166.6V187.8C74 195.2 71.1 202.6 65.4 208.3L42 231.7C28.7 245 28.7 267 42 280.3L65.4 303.7C71.1 309.4 74 316.8 74 324.2V345.4C74 364.2 89.2 379.4 108 379.4H129.2C136.6 379.4 144 382.3 149.7 388L231.7 470C245 483.3 267 483.3 280.3 470L362.3 388C368 382.3 375.4 379.4 382.8 379.4H404C422.8 379.4 438 364.2 438 345.4V324.2C438 316.8 440.9 309.4 446.6 303.7L470 280.3C483.3 267 483.3 245 470 231.7L446.6 208.3C440.9 202.6 438 195.2 438 187.8V166.6C438 147.8 422.8 132.6 404 132.6H382.8C375.4 132.6 368 129.7 362.3 124L280.3 42C273.6 35.3 264.8 32 256 32ZM238.9 173.5C248.6 163.8 264.2 163.8 273.9 173.5L338.5 238.1C348.2 247.8 348.2 263.4 338.5 273.1L273.9 337.7C264.2 347.4 248.6 347.4 238.9 337.7L174.3 273.1C164.6 263.4 164.6 247.8 174.3 238.1L238.9 173.5Z"/>
              </svg>
              <span className="gift-card-name">Presente Pix</span>
              <span className="gift-card-value">Clique para copiar a chave</span>
            </div>
          </div>
          {gifts.map(g => {
            const chosen = !!g.chosen_by
            const inCart = cartIds.has(g.id)
            return (
              <div key={g.id} className={`gift-card${chosen ? ' gift-card--chosen' : ''}`}>
                <div className="gift-card-body">
                  <span className="gift-card-name">{g.name}</span>
                  <span className="gift-card-value">{fmt(g.value)}</span>
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
        <p className="gifts-scroll-hint">← deslize para ver mais presentes →</p>
        {gifts.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: 12, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            O restante da lista de presentes será divulgado em breve.
          </p>
        )}
      </div>

      {toast && <div className="pix-toast">Pix copiado com sucesso</div>}
    </section>
  )
}
