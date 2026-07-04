import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // [{ id, name, value, qty, customValue }]

  function add(gift) {
    setItems(s => {
      if (s.find(i => i.id === gift.id)) return s
      return [...s, { id: gift.id, name: gift.name, value: gift.value, qty: 1, customValue: gift.value }]
    })
  }

  function remove(id) { setItems(s => s.filter(i => i.id !== id)) }

  function clear() { setItems([]) }

  function setQty(id, qty) {
    setItems(s => s.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
  }

  function setCustomValue(id, val) {
    setItems(s => s.map(i => i.id === id ? { ...i, customValue: val } : i))
  }

  const total = items.reduce((sum, i) => sum + (parseFloat(i.customValue) || 0) * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, clear, setQty, setCustomValue, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
