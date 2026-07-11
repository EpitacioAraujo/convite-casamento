import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../../CartContext'
import { buildCheckoutUrl, toCentsInt } from '../../infinitepay'

function fmt(v) { return 'R$ ' + parseFloat(v).toFixed(2).replace('.', ',') }

export default function CheckoutModal({ onClose }) {
  const { items, total, clear } = useCart()
  const [pixCopied, setPixCopied] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function payByCard() {
    const handle = window.__INFINITEPAY_HANDLE
    if (!handle) return
    const url = buildCheckoutUrl({
      handle,
      items: items.map(i => ({
        description: i.name,
        price: toCentsInt((parseFloat(i.customValue) || 0) * i.qty),
        quantity: 1,
      })),
      orderNsu: `convite-${Date.now()}`,
      redirectUrl: `${window.location.origin}/obrigado`,
    })
    clear()
    onClose()
    window.open(url, '_blank')
  }

  function payByPix() {
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
    setPixCopied(true)
    setTimeout(() => { clear(); onClose() }, 1500)
  }

  return createPortal(
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal checkout-modal">
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
          <button className="checkout-btn checkout-btn--pix" onClick={payByPix} disabled={pixCopied}>
            <span className="checkout-btn-icon">◎</span>
            {pixCopied ? '✓ Chave Pix copiada!' : 'Pagar com Pix'}
          </button>
          {window.__INFINITEPAY_HANDLE && (
            <button className="checkout-btn checkout-btn--card" onClick={payByCard}>
              <span className="checkout-btn-icon">▣</span>
              Pagar com Cartão
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
