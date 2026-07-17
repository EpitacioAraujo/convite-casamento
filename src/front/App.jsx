import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './CartContext'
import Navbar from './components/public/Navbar'
import HeroSection from './components/public/HeroSection'
import CountdownSection from './components/public/CountdownSection'
import EventDetailsSection from './components/public/EventDetailsSection'
import CollageSection from './components/public/CollageSection'
import RSVPSection from './components/public/RSVPSection'
import GiftsSection from './components/public/GiftsSection'
import CartDrawer from './components/public/CartDrawer'
import InfoSection from './components/public/InfoSection'
import Footer from './components/public/Footer'
import AdminLayout from './components/admin/AdminLayout'
import LoginPage from './components/admin/LoginPage'
import DashboardPage from './components/admin/DashboardPage'
import InvitesPage from './components/admin/InvitesPage'
import TagsPage from './components/admin/TagsPage'
import GiftsPage from './components/admin/GiftsPage'
import TemplatesPage from './components/admin/TemplatesPage'

function RequireAuth({ children }) {
  return localStorage.getItem('admin_token') ? children : <Navigate to="/admin/login" replace />
}

const CONFETTI_COLORS = ['#c9a227','#b5651d','#2e7d67','#7b5ea7','#c05579','#8FA8C8','#C5A880']
const CONFETTI = Array.from({ length: 48 }, (_, i) => ({
  left: `${(i * 13 + 7) % 100}%`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  duration: `${2.5 + (i % 7) * 0.4}s`,
  delay: `-${(i * 0.37) % 5}s`,
  width: `${6 + (i % 4) * 3}px`,
}))

function ThankYou() {
  return (
    <section className="section-hero" style={{ overflow: 'hidden' }}>
      <div className="hero-bg-wrapper">
        <div className="hero-bg" />
        <div className="hero-overlay" />
      </div>
      {CONFETTI.map((c, i) => (
        <div key={i} className="confetti-piece" style={{
          left: c.left, background: c.color,
          animationDuration: c.duration, animationDelay: c.delay, width: c.width,
        }} />
      ))}
      <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255,253,247,0.92)', borderRadius: 20,
          border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)',
          padding: '50px 40px', maxWidth: 440, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
        }}>
          <img src="/icons/hearts.png" alt="" style={{ width: 48, opacity: 0.8 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Muito obrigado!</h2>
          <p>Seu presente chegou com muito carinho. Estamos felizes em celebrar este momento especial com você.</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>💛</p>
        </div>
      </div>
    </section>
  )
}

function ComingSoon() {
  return (
    <section className="section-hero">
      <div className="hero-bg-wrapper">
        <div className="hero-bg" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <div style={{
          background: 'rgba(255,253,247,0.92)', borderRadius: 20,
          border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)',
          padding: '50px 40px', maxWidth: 440, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
        }}>
          <img src="/icons/hearts.png" alt="" style={{ width: 48, opacity: 0.7 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Em breve</h2>
          <p>Os convites estão sendo preparados com carinho.</p>
        </div>
      </div>
    </section>
  )
}

function PublicSite() {
  const hasCode = new URLSearchParams(location.search).has('code')
  if (!hasCode) return <ComingSoon />

  return (
    <CartProvider>
      <Navbar />
      <HeroSection />
      <CountdownSection />
      <EventDetailsSection />
      <CollageSection />
      <RSVPSection />
      <GiftsSection />
      <InfoSection />
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/obrigado" element={<ThankYou />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<DashboardPage />} />
        <Route path="invites" element={<InvitesPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="gifts" element={<GiftsPage />} />
        <Route path="templates" element={<TemplatesPage />} />
      </Route>
    </Routes>
  )
}
