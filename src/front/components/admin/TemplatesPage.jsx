import { useEffect, useRef, useState } from 'react'
import { Bold, Italic, Strikethrough, Pencil, Trash2 } from 'lucide-react'
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

// wraps the selected text in a textarea with the given WhatsApp marker (or inserts it at the cursor)
function wrapSelection(textarea, marker) {
  const { selectionStart: start, selectionEnd: end, value } = textarea
  const selected = value.slice(start, end)
  const next = value.slice(0, start) + marker + selected + marker + value.slice(end)
  textarea.value = next
  const cursor = start + marker.length + selected.length + marker.length
  textarea.focus()
  textarea.setSelectionRange(selected ? start + marker.length : cursor, selected ? end + marker.length : cursor)
  return next
}

function insertAtCursor(textarea, text) {
  const { selectionStart: start, selectionEnd: end, value } = textarea
  const next = value.slice(0, start) + text + value.slice(end)
  textarea.value = next
  const cursor = start + text.length
  textarea.focus()
  textarea.setSelectionRange(cursor, cursor)
  return next
}

const PLACEHOLDERS = [
  { token: '@{link}', label: 'Link' },
  { token: '@{familia}', label: 'Família' },
  { token: '@{convidados}', label: 'Convidados' },
]

function TemplateEditor({ defaultValue, onChange }) {
  const ref = useRef(null)
  return (
    <div className="modal-form" style={{ gap: 8 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-icon" title="Negrito" onClick={() => onChange(wrapSelection(ref.current, '*'))}><Bold size={16} /></button>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-icon" title="Itálico" onClick={() => onChange(wrapSelection(ref.current, '_'))}><Italic size={16} /></button>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-icon" title="Tachado" onClick={() => onChange(wrapSelection(ref.current, '~'))}><Strikethrough size={16} /></button>
        {PLACEHOLDERS.map(p => (
          <button key={p.token} type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => onChange(insertAtCursor(ref.current, p.token))}>
            {p.label}
          </button>
        ))}
      </div>
      <textarea ref={ref} name="body" rows={8} defaultValue={defaultValue} required onChange={e => onChange(e.target.value)} />
    </div>
  )
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [modal, setModal] = useState(null) // null | 'create' | template-object
  const [body, setBody] = useState('')

  useEffect(() => { load() }, [])

  async function load() { setTemplates(await api.adminTemplates()) }

  function openModal(t) {
    setBody(t === 'create' ? '' : t.body)
    setModal(t)
  }

  async function save(e) {
    e.preventDefault()
    const title = e.target.title.value.trim()
    if (modal === 'create') await api.createTemplate(title, body)
    else await api.updateTemplate(modal.id, title, body)
    setModal(null)
    load()
  }

  async function del(id) {
    if (!confirm('Deletar este modelo de mensagem?')) return
    await api.deleteTemplate(id)
    load()
  }

  return (
    <>
      <h1 className="admin-page-title">Modelos de mensagem</h1>

      <div className="admin-toolbar">
        <button className="admin-btn admin-btn-primary" onClick={() => openModal('create')}>+ Novo Modelo</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Título</th><th>Prévia</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr key={t.id}>
                <td className="cell-primary">{t.title}</td>
                <td className="cell-meta" style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.body}</td>
                <td className="cell-actions" style={{ display: 'flex', gap: 15 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Editar" aria-label="Editar" onClick={() => openModal(t)}><Pencil size={18} /></button>
                  <button className="admin-btn admin-btn-danger admin-btn-icon" title="Deletar" aria-label="Deletar" onClick={() => del(t.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Novo Modelo' : 'Editar Modelo'} onClose={() => setModal(null)}>
          <form className="modal-form" onSubmit={save}>
            <input name="title" defaultValue={modal?.title || ''} placeholder="Título (ex: Padrinho, Convidado)" required />
            <TemplateEditor defaultValue={body} onChange={setBody} />
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
