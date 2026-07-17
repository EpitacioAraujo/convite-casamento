import { useEffect, useRef, useState } from 'react'
import { Link as LinkIcon, Users, Pencil, Trash2 } from 'lucide-react'
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
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [membersFilter, setMembersFilter] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | { type: 'edit'|'members', invite }
  const [dragId, setDragId] = useState(null)

  useEffect(() => { load(); api.adminTags().then(setTags) }, [])

  const invitesRef = useRef([])
  useEffect(() => { invitesRef.current = invites }, [invites])

  async function load() {
    setInvites(await api.adminInvites())
  }

  // reorder only makes sense within a single group and a full (unfiltered) list
  const canReorder = !!tagFilter && !search

  function onDragOver(overId) {
    if (dragId == null || overId === dragId) return
    setInvites(prev => {
      const arr = [...prev]
      const from = arr.findIndex(i => i.id === dragId)
      const to = arr.findIndex(i => i.id === overId)
      if (from < 0 || to < 0) return prev
      arr.splice(to, 0, arr.splice(from, 1)[0])
      return arr
    })
  }

  async function persistOrder() {
    setDragId(null)
    const ids = invitesRef.current.filter(i => i.tag === tagFilter).map(i => i.id)
    await api.reorderInvites(ids)
  }

  const tagColor = name => tags.find(t => t.name === name)?.color || '#c9a227'

  async function createInvite(e) {
    e.preventDefault()
    const name = e.target.family_name.value.trim()
    await api.createInvite(name, e.target.tag.value.trim())
    setModal(null)
    load()
  }

  async function editInvite(e) {
    e.preventDefault()
    const name = e.target.family_name.value.trim()
    await api.updateInvite(modal.invite.id, name, e.target.tag.value.trim())
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

  async function unconfirmAll(invite) {
    if (!confirm(`Desconfirmar todos os membros de "${invite.family_name}"?`)) return
    await api.unconfirmInvite(invite.id)
    load()
    const fresh = await api.adminInvites()
    const updated = fresh.find(i => i.id === invite.id)
    setModal(m => ({ ...m, invite: updated }))
  }

  function copyLink(code) {
    navigator.clipboard.writeText(`${location.origin}/?code=${code}`)
  }

  const filtered = invites.filter(i =>
    i.family_name.toLowerCase().includes(search.toLowerCase()) &&
    (!tagFilter || i.tag === tagFilter) &&
    (!membersFilter || (membersFilter === 'with' ? i.members.some(m => m.confirmed) : !i.members.some(m => m.confirmed)))
  )

  return (
    <>
      <h1 className="admin-page-title">Convites</h1>

      <div className="admin-toolbar">
        <input
          placeholder="Buscar família..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="">Todos os grupos</option>
          {tags.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
        </select>
        <select value={membersFilter} onChange={e => setMembersFilter(e.target.value)}>
          <option value="">Com ou sem confirmados</option>
          <option value="with">Com confirmados</option>
          <option value="without">Sem confirmados</option>
        </select>
        <button className="admin-btn admin-btn-primary" onClick={() => setModal('create')}>+ Novo Convite</button>
      </div>

      <p className="admin-hint">
        {canReorder
          ? 'Arraste as linhas para reordenar os convites deste grupo.'
          : 'Selecione um grupo e limpe a busca para reordenar por arraste.'}
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Família</th>
              <th>Grupo</th>
              <th>Código</th>
              <th>Confirmados</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
              const confirmed = inv.members.filter(m => m.confirmed).length
              return (
                <tr
                  key={inv.id}
                  draggable={canReorder}
                  onDragStart={() => setDragId(inv.id)}
                  onDragOver={e => { if (canReorder) { e.preventDefault(); onDragOver(inv.id) } }}
                  onDragEnd={() => canReorder && persistOrder()}
                  className={canReorder ? 'row-draggable' : undefined}
                  style={dragId === inv.id ? { opacity: 0.5 } : undefined}
                >
                  <td className="cell-primary">{canReorder && <span className="drag-handle">⠿</span>} {inv.family_name}</td>
                  <td className="cell-meta">{inv.tag ? <span className="badge" style={{ background: tagColor(inv.tag), color: '#fff' }}>{inv.tag}</span> : <span style={{ color: '#999' }}>—</span>}</td>
                  <td className="cell-meta"><span className="invite-link-code">{inv.code}</span></td>
                  <td className="cell-badge">
                    <span className={`badge ${confirmed === inv.members.length && inv.members.length > 0 ? 'badge-green' : 'badge-yellow'}`}>
                      {confirmed}/{inv.members.length}
                    </span>
                  </td>
                  <td className="cell-actions" style={{ display: 'flex', gap: 15 }}>
                    <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Copiar Link" aria-label="Copiar Link" onClick={() => copyLink(inv.code)}><LinkIcon size={18} /></button>
                    <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Membros" aria-label="Membros" onClick={() => setModal({ type: 'members', invite: inv })}><Users size={18} /></button>
                    <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Editar" aria-label="Editar" onClick={() => setModal({ type: 'edit', invite: inv })}><Pencil size={18} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-icon" title="Deletar" aria-label="Deletar" onClick={() => del(inv.id)}><Trash2 size={18} /></button>
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
            <select name="tag" defaultValue="">
              <option value="">Sem grupo</option>
              {tags.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
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
            <select name="tag" defaultValue={modal.invite.tag || ''}>
              <option value="">Sem grupo</option>
              {tags.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <div className="modal-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="admin-btn admin-btn-primary">Salvar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.type === 'members' && (
        <Modal title={`Membros — ${modal.invite.family_name}`} onClose={() => setModal(null)}>
          {modal.invite.members.some(m => m.confirmed) && (
            <button className="admin-btn admin-btn-danger admin-btn-sm" style={{ marginBottom: 12 }} onClick={() => unconfirmAll(modal.invite)}>
              Desconfirmar todos
            </button>
          )}
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
