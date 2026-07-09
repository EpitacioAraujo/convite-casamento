import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../../CartContext'

function fmt(v) { return 'R$ ' + parseFloat(v).toFixed(2).replace('.', ',') }

export default function CheckoutModal({ onClose }) {
  const { items, total, clear } = useCart()
  const [step, setStep] = useState('summary') // summary | pix | card

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function finish() { clear(); onClose() }

  return createPortal(
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal checkout-modal">

        {step === 'summary' && (
          <>
            <div className="checkout-header">
              <h3>Resumo do Presente</h3>
              <button className="checkout-close" onClick={onClose}>✕</button>
            </div>

            <ul className="checkout-items">
              {items.map(i => (
                <li key={i.id} className="checkout-row">
                  <div className="checkout-row-name">
                    {i.name}
                    {i.qty > 1 && <span className="checkout-qty">×{i.qty}</span>}
                  </div>
                  <span className="checkout-row-value">{fmt((parseFloat(i.customValue) || 0) * i.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="checkout-total-row">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            <div className="checkout-actions">
              <button className="checkout-btn checkout-btn--pix" onClick={() => setStep('pix')}>
                <span className="checkout-btn-icon">◎</span>
                Pagar com Pix
              </button>
              <button className="checkout-btn checkout-btn--card" onClick={() => setStep('card')}>
                <span className="checkout-btn-icon">▣</span>
                Pagar com Cartão
              </button>
            </div>
          </>
        )}

        {step === 'pix' && (
          <>
            <div className="checkout-header">
              <button className="checkout-back" onClick={() => setStep('summary')}>← Voltar</button>
              <h3>Pagar com Pix</h3>
              <button className="checkout-close" onClick={onClose}>✕</button>
            </div>
            <PixStep total={total} onDone={finish} />
          </>
        )}

        {step === 'card' && (
          <>
            <div className="checkout-header">
              <button className="checkout-back" onClick={() => setStep('summary')}>← Voltar</button>
              <h3>Pagar com Cartão</h3>
              <button className="checkout-close" onClick={onClose}>✕</button>
            </div>
            <div className="checkout-card-body">
              <p>Você será redirecionado para o ambiente seguro de pagamento.</p>
              <p className="checkout-amount">{fmt(total)}</p>
              {/* ponytail: link externo configurado pelo admin futuramente */}
              <button className="btn btn-primary btn-block" onClick={finish}>
                Continuar para Pagamento →
              </button>
            </div>
          </>
        )}

      </div>
    </div>,
    document.body
  )
}

function PixStep({ total, onDone }) {
  const pixKey = window.__PIX_KEY || 'casamento.epitaciobianca@exemplo.com'
  const [copied, setCopied] = useState(false)

  function copy() {
    // select the visible text so user can copy manually if API fails
    const codeEl = document.querySelector('.checkout-pix-key')
    if (codeEl) {
      const range = document.createRange()
      range.selectNodeContents(codeEl)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }

    const tryWrite = navigator.clipboard
      ? navigator.clipboard.writeText(pixKey)
      : Promise.reject()

    tryWrite.catch(() => {
      const el = Object.assign(document.createElement('textarea'), {
        value: pixKey, style: 'position:fixed;opacity:0'
      })
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    })

    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="checkout-pix-body">
      <p className="checkout-pix-hint">Copie a chave abaixo e realize a transferência no seu banco.</p>
      <div className="checkout-pix-key-block">
        <code className="checkout-pix-key">{pixKey}</code>
        <button className={`checkout-copy-btn${copied ? ' copied' : ''}`} onClick={copy}>
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>
      <p className="checkout-amount">{fmt(total)}</p>
      <button className="btn btn-primary btn-block" onClick={onDone}>Já realizei o Pix ✓</button>
    </div>
  )
}
