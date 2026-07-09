import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const nav = useNavigate()

  function logout() {
    localStorage.removeItem('admin_token')
    nav('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="logo">B &amp; E Admin</div>
        <nav>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/invites">Convites</NavLink>
          <NavLink to="/admin/tags">Grupos</NavLink>
          <NavLink to="/admin/gifts">Presentes</NavLink>
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <button onClick={logout}>Sair</button>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
