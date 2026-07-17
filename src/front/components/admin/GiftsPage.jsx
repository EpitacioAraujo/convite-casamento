import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../../api'

function CurrencyInput({ name, defaultValue }) {
  const initial = defaultValue ? Math.round(parseFloat(defaultValue) * 100) : 0
  const [cents, setCents] = useState(initial)

  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, '')
    setCents(parseInt(digits || '0', 10))
  }

  const display = 'R$ ' + (cents / 100).toFixed(2).replace('.', ',')

  return (
    <>
      <input type="text" inputMode="numeric" value={display} onChange={handleChange} placeholder="R$ 0,00" required />
      <input type="hidden" name={name} value={(cents / 100).toFixed(2)} />
    </>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}

export default function GiftsPage() {
  const [gifts, setGifts] = useState([])
  const [modal, setModal] = useState(null) // null | 'create' | gift-object

  useEffect(() => { load() }, [])

  async function load() { setGifts(await api.adminGifts()) }

  async function save(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    if (modal === 'create') {
      await api.createGift(data)
    } else {
      await api.updateGift(modal.id, { ...modal, ...data })
    }
    setModal(null)
    load()
  }

  async function del(id) {
    if (!confirm('Deletar presente?')) return
    await api.deleteGift(id)
    load()
  }

  return (
    <>
      <h1 className="admin-page-title">Presentes</h1>

      <div className="admin-toolbar">
        <button className="admin-btn admin-btn-primary" onClick={() => setModal('create')}>+ Novo Presente</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Link</th>
              <th>Escolhido por</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map(g => (
              <tr key={g.id}>
                <td className="cell-primary">{g.name}</td>
                <td className="cell-badge">R$ {parseFloat(g.value).toFixed(2).replace('.', ',')}</td>
                <td className="cell-meta">{g.link ? <a href={g.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>link</a> : '—'}</td>
                <td className="cell-meta">{g.chosen_by || '—'}</td>
                <td className="cell-actions" style={{ display: 'flex', gap: 15 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Editar" aria-label="Editar" onClick={() => setModal(g)}><Pencil size={18} /></button>
                  <button className="admin-btn admin-btn-danger admin-btn-icon" title="Deletar" aria-label="Deletar" onClick={() => del(g.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Novo Presente' : 'Editar Presente'} onClose={() => setModal(null)}>
          <form className="modal-form" onSubmit={save}>
            <input name="name" defaultValue={modal?.name || ''} placeholder="Nome do presente" required />
            <CurrencyInput name="value" defaultValue={modal?.value} />
            <input name="link" defaultValue={modal?.link || ''} placeholder="Link (opcional)" />
            <input name="chosen_by" defaultValue={modal?.chosen_by || ''} placeholder="Escolhido por (opcional)" />
            <div className="modal-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn-primary">Salvar</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
