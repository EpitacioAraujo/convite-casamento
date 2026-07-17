import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const nav = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function logout() {
    localStorage.removeItem('admin_token')
    nav('/admin/login')
  }

  function closeMenu() { setMenuOpen(false) }

  return (
    <div className="admin-layout">
      {menuOpen && <div className="admin-menu-backdrop" onClick={closeMenu} />}

      <aside className={`admin-sidebar${menuOpen ? ' open' : ''}`}>
        <div className="logo">B &amp; E Admin</div>
        <nav>
          <NavLink to="/admin" end onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/admin/invites" onClick={closeMenu}>Convites</NavLink>
          <NavLink to="/admin/tags" onClick={closeMenu}>Grupos</NavLink>
          <NavLink to="/admin/gifts" onClick={closeMenu}>Presentes</NavLink>
          <NavLink to="/admin/templates" onClick={closeMenu}>Modelos de Mensagem</NavLink>
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <button className="admin-logout-btn" title="Sair" aria-label="Sair" onClick={logout}>
            <LogOut size={20} />
          </button>
          <button
            className="admin-menu-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
