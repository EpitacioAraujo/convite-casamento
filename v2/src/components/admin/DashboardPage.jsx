import { useEffect, useState } from 'react'
import { api } from '../../api'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => { api.stats().then(setStats).catch(() => {}) }, [])

  const cards = stats ? [
    { label: 'Convites', num: stats.total_invites },
    { label: 'Convidados', num: stats.total_members },
    { label: 'Confirmados', num: stats.confirmed },
    { label: 'Pendentes', num: stats.pending },
  ] : []

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>
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
