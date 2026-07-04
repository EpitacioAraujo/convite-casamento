import { useEffect, useState } from 'react'
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

export default function InvitesPage() {
  const [invites, setInvites] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | { type: 'edit'|'members', invite }

  useEffect(() => { load() }, [])

  async function load() {
    setInvites(await api.adminInvites())
  }

  async function createInvite(e) {
    e.preventDefault()
    const name = e.target.family_name.value.trim()
    await api.createInvite(name)
    setModal(null)
    load()
  }

  async function editInvite(e) {
    e.preventDefault()
    const name = e.target.family_name.value.trim()
    await api.updateInvite(modal.invite.id, name)
    setModal(null)
    load()
  }

  async function del(id) {
    if (!confirm('Deletar convite e todos os membros?')) return
    await api.deleteInvite(id)
    load()
  }

  async function addMember(e) {
    e.preventDefault()
    const name = e.target.member_name.value.trim()
    await api.addMember(modal.invite.id, name)
    e.target.reset()
    load()
    // refresh the modal invite
    const fresh = await api.adminInvites()
    const updated = fresh.find(i => i.id === modal.invite.id)
    setModal(m => ({ ...m, invite: updated }))
  }

  async function delMember(id) {
    await api.deleteMember(id)
    load()
    const fresh = await api.adminInvites()
    const updated = fresh.find(i => i.id === modal.invite.id)
    setModal(m => ({ ...m, invite: updated }))
  }

  function copyLink(code) {
    navigator.clipboard.writeText(`${location.origin}/?code=${code}`)
  }

  const filtered = invites.filter(i => i.family_name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <h1 className="admin-page-title">Convites</h1>

      <div className="admin-toolbar">
        <input
          placeholder="Buscar família..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="admin-btn admin-btn-primary" onClick={() => setModal('create')}>+ Novo Convite</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Família</th>
              <th>Código</th>
              <th>Membros</th>
              <th>Confirmados</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
              const confirmed = inv.members.filter(m => m.confirmed).length
              return (
                <tr key={inv.id}>
                  <td>{inv.family_name}</td>
                  <td><span className="invite-link-code">{inv.code}</span></td>
                  <td>{inv.members.length}</td>
                  <td>
                    <span className={`badge ${confirmed === inv.members.length && inv.members.length > 0 ? 'badge-green' : 'badge-yellow'}`}>
                      {confirmed}/{inv.members.length}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => copyLink(inv.code)}>Copiar Link</button>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setModal({ type: 'members', invite: inv })}>Membros</button>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setModal({ type: 'edit', invite: inv })}>Editar</button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => del(inv.id)}>Del</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal === 'create' && (
        <Modal title="Novo Convite" onClose={() => setModal(null)}>
          <form className="modal-form" onSubmit={createInvite}>
            <input name="family_name" placeholder="Nome da família" required />
            <div className="modal-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn-primary">Criar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Editar Convite" onClose={() => setModal(null)}>
          <form className="modal-form" onSubmit={editInvite}>
            <input name="family_name" defaultValue={modal.invite.family_name} required />
            <div className="modal-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn-primary">Salvar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.type === 'members' && (
        <Modal title={`Membros — ${modal.invite.family_name}`} onClose={() => setModal(null)}>
          <ul style={{ listStyle: 'none', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {modal.invite.members.map(m => (
              <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
                <span style={{ flex: 1 }}>{m.name}</span>
                <span className={`badge ${m.confirmed ? 'badge-green' : 'badge-yellow'}`}>
                  {m.confirmed ? 'confirmado' : 'pendente'}
                </span>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => delMember(m.id)}>✕</button>
              </li>
            ))}
          </ul>
          <form className="modal-form" onSubmit={addMember}>
            <input name="member_name" placeholder="Nome do membro" required />
            <div className="modal-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Fechar</button>
              <button type="submit" className="admin-btn admin-btn-primary">+ Adicionar</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
