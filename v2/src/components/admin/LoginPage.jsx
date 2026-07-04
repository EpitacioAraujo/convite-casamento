import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'

export default function LoginPage() {
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    const { username, password } = Object.fromEntries(new FormData(e.target))
    setLoading(true)
    setErr('')
    try {
      const { token } = await api.login(username, password)
      localStorage.setItem('admin_token', token)
      nav('/admin')
    } catch {
      setErr('Usuário ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Painel Admin</h2>
        <form className="login-form" onSubmit={submit}>
          <input name="username" placeholder="Usuário" required />
          <input name="password" type="password" placeholder="Senha" required />
          {err && <p className="login-error">{err}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
