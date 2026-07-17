import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../../api'

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

export default function TagsPage() {
  const [tags, setTags] = useState([])
  const [modal, setModal] = useState(null) // null | 'create' | tag-object

  useEffect(() => { load() }, [])

  async function load() { setTags(await api.adminTags()) }

  async function save(e) {
    e.preventDefault()
    const { name, color } = Object.fromEntries(new FormData(e.target))
    if (modal === 'create') await api.createTag(name.trim(), color)
    else await api.updateTag(modal.id, name.trim(), color)
    setModal(null)
    load()
  }

  async function del(id) {
    if (!confirm('Deletar grupo? Convites que usam este grupo mantêm o nome.')) return
    await api.deleteTag(id)
    load()
  }

  return (
    <>
      <h1 className="admin-page-title">Grupos</h1>

      <div className="admin-toolbar">
        <button className="admin-btn admin-btn-primary" onClick={() => setModal('create')}>+ Novo Grupo</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Grupo</th><th>Cor</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {tags.map(t => (
              <tr key={t.id}>
                <td className="cell-primary"><span className="badge" style={{ background: t.color, color: '#fff' }}>{t.name}</span></td>
                <td className="cell-meta"><code style={{ fontSize: '0.8rem' }}>{t.color}</code></td>
                <td className="cell-actions" style={{ display: 'flex', gap: 15 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Editar" aria-label="Editar" onClick={() => setModal(t)}><Pencil size={18} /></button>
                  <button className="admin-btn admin-btn-danger admin-btn-icon" title="Deletar" aria-label="Deletar" onClick={() => del(t.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Novo Grupo' : 'Editar Grupo'} onClose={() => setModal(null)}>
          <form className="modal-form" onSubmit={save}>
            <input name="name" defaultValue={modal?.name || ''} placeholder="Nome do grupo" required />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
              Cor <input type="color" name="color" defaultValue={modal?.color || '#c9a227'} />
            </label>
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
