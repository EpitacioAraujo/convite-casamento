import * as Dialog from '@radix-ui/react-dialog'
import { useCart } from '../../CartContext'
import CheckoutModal from './CheckoutModal'
import { useState } from 'react'

function fmt(v) { return 'R$ ' + parseFloat(v).toFixed(2).replace('.', ',') }

// Converts raw number to masked display string: 10050 → "100,50"
function toCents(v) { return Math.round(parseFloat(v) * 100) || 0 }
function fmtCents(cents) {
  return (cents / 100).toFixed(2).replace('.', ',')
}
function parseMask(masked) {
  // strip everything except digits
  const digits = masked.replace(/\D/g, '')
  return parseInt(digits || '0', 10) / 100
}

const GiftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function CartDrawer() {
  const { items, remove, setQty, setCustomValue, clear, total } = useCart()
  const [checkout, setCheckout] = useState(false)

  function handleFab() {
    if (items.length === 0) {
      document.getElementById('presentes')?.scrollIntoView({ behavior: 'smooth' })
    }
    // when items exist, Dialog.Trigger opens the sheet automatically
  }

  return (
    <>
      <Dialog.Root>
        {/* FAB — always fixed bottom-right */}
        <Dialog.Trigger asChild>
          <button
            className="cart-fab"
            onClick={items.length === 0 ? handleFab : undefined}
            aria-label={items.length > 0 ? 'Abrir carrinho' : 'Ver presentes'}
            // prevent opening dialog when empty
            data-state={items.length === 0 ? 'closed' : undefined}
          >
            <GiftIcon />
            {items.length > 0 && <span className="cart-fab-badge">{items.length}</span>}
          </button>
        </Dialog.Trigger>

        {items.length > 0 && (
          <Dialog.Portal>
            <Dialog.Overlay className="cart-overlay" />
            <Dialog.Content className="cart-sheet" aria-describedby={undefined}>
              <div className="cart-sheet-handle" />
              <div className="cart-panel-header">
                <Dialog.Title className="cart-panel-title">Carrinho de Presentes</Dialog.Title>
                <Dialog.Close className="cart-panel-close" aria-label="Fechar">
                  <CloseIcon />
                </Dialog.Close>
              </div>

              <ul className="cart-list">
                {items.map(item => (
                  <li key={item.id} className="cart-row">
                    <div className="cart-row-top">
                      <span className="cart-row-name">{item.name}</span>
                      <button className="cart-row-remove" onClick={() => remove(item.id)} aria-label="Remover">
                        <CloseIcon />
                      </button>
                    </div>
                    <div className="cart-row-bottom">
                      <div className="cart-qty-control">
                        <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <div className="cart-value-field">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={'R$ ' + fmtCents(toCents(item.customValue))}
                          onChange={e => setCustomValue(item.id, parseMask(e.target.value))}
                        />
                      </div>
                      <span className="cart-row-subtotal">
                        {fmt((parseFloat(item.customValue) || 0) * item.qty)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-panel-footer">
                <div className="cart-total-row">
                  <span>Total</span>
                  <span className="cart-total-value">{fmt(total)}</span>
                </div>
                <button className="btn btn-primary btn-block" onClick={() => setCheckout(true)}>
                  Finalizar Presente
                </button>
                <button className="cart-clear-link" onClick={clear}>Limpar carrinho</button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </Dialog.Root>

      {checkout && <CheckoutModal onClose={() => setCheckout(false)} />}
    </>
  )
}
