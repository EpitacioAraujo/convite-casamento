import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { api } from '../../api'

gsap.registerPlugin(ScrollTrigger)

const code = new URLSearchParams(location.search).get('code')

export default function RSVPSection() {
  const successRef = useRef()
  const [invite, setInvite] = useState(window.__INVITE ?? null)
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    gsap.fromTo('#rsvp', { opacity: 0, y: 30 }, {
      scrollTrigger: { trigger: '#rsvp', start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 1.2, ease: 'power2.out'
    })

    if (!window.__INVITE && code) {
      api.getInvite(code)
        .then(data => {
          setInvite(data)
          setDone(data.confirmed_count > 0)
          setSelected(data.members.filter(m => !!m.confirmed).map(m => m.id))
        })
        .catch(() => {}) // código inválido — seção não aparece
    } else if (invite) {
      setDone(invite.confirmed_count > 0)
      setSelected(invite.members.filter(m => !!m.confirmed).map(m => m.id))
    }
  }, [])

  function toggle(id) {
    if (!!invite?.members.find(m => m.id === id)?.confirmed) return
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function submit(e) {
    e.preventDefault()
    const newIds = selected.filter(id => !invite.members.find(m => m.id === id)?.confirmed)
    if (!newIds.length) { setError('Selecione pelo menos um membro para confirmar.'); return }
    setLoading(true)
    setError(null)
    try {
      await api.rsvp(invite.code, newIds)
      // merge confirmed status locally so success screen is accurate
      setInvite(inv => ({
        ...inv,
        members: inv.members.map(m => newIds.includes(m.id) ? { ...m, confirmed: true } : m)
      }))
      setDone(true)
      setTimeout(() => {
        if (successRef.current)
          gsap.fromTo(successRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
      }, 50)
    } catch {
      setError('Não foi possível confirmar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // sem código na URL ou código inválido
  if (!code || !invite) return null

  // confirmado
  if (done) {
    const confirmedMembers = invite.members.filter(m => !!m.confirmed)
    return (
      <section id="rsvp" className="section-rsvp">
        <div className="container container-sm">
          <div className="rsvp-card" ref={successRef}>
            <div className="rsvp-success-msg">
              <div className="success-icon">✓</div>
              <h3>Obrigado, {invite.family_name}!</h3>
              {confirmedMembers.length > 0 && (
                <div className="rsvp-confirmed-block">
                  <p className="rsvp-confirmed-label">Confirmados como presentes:</p>
                  <ul className="rsvp-confirmed-list">
                    {confirmedMembers.map(m => <li key={m.id}>{m.name}</li>)}
                  </ul>
                </div>
              )}
              <p>Aguardamos vocês com muito carinho no dia 21 de outubro! 🤍</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // pendente
  return (
    <section id="rsvp" className="section-rsvp">
      <div className="container container-sm">
        <div className="rsvp-card">
          <div className="rsvp-header">
            <img src="/icons/envelope.png" alt="Confirmação" className="rsvp-icon" />
            <h2 className="section-title-alt">Confirme sua Presença</h2>
          </div>

          <div className="rsvp-deadline">
            Por favor, confirme sua presença até <strong>03/08</strong>.
          </div>

          <form className="rsvp-form-custom" onSubmit={submit}>
            <div className="rsvp-members-list">
              <p className="rsvp-members-label">Quem irá comparecer?</p>
              {invite.members.map(m => (
                <label key={m.id} className={`member-row${!!m.confirmed ? ' member-row--confirmed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(m.id)}
                    onChange={() => toggle(m.id)}
                    disabled={!!m.confirmed}
                  />
                  <span className="member-row-name">{m.name}</span>
                  {!!m.confirmed && <span className="member-row-badge">já confirmado</span>}
                </label>
              ))}
            </div>

            {error && <p className="rsvp-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Enviando...' : 'Confirmar Presença'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
