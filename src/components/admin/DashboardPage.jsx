import { useEffect, useState } from 'react'
import { api } from '../../api'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [tags, setTags] = useState([])
  const [tagFilter, setTagFilter] = useState('')

  useEffect(() => { api.adminTags().then(setTags).catch(() => {}) }, [])
  useEffect(() => { api.stats(tagFilter).then(setStats).catch(() => {}) }, [tagFilter])

  const cards = stats ? [
    { label: 'Convites', num: stats.total_invites },
    { label: 'Convidados', num: stats.total_members },
    { label: 'Confirmados', num: stats.confirmed },
    { label: 'Pendentes', num: stats.pending },
  ] : []

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-toolbar">
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="">Todos os grupos</option>
          {tags.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
        </select>
      </div>
      <div className="stat-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card">
            <span className="stat-num">{c.num}</span>
            <span className="stat-label">{c.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
