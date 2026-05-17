import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TablesView from './components/TablesView'
import MenuView from './components/MenuView'
import Login from './components/Login'
import { ToastProvider } from './components/Toast'

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('sirest_user'))
  } catch {
    return null
  }
}

export default function App() {
  const [view, setView] = useState('mesas')
  const [user, setUser] = useState(() => (localStorage.getItem('sirest_token') ? getUser() : null))
  const [viewKey, setViewKey] = useState(0)

  useEffect(() => {
    const handler = () => setUser(null)
    window.addEventListener('sirest:unauthorized', handler)
    return () => window.removeEventListener('sirest:unauthorized', handler)
  }, [])

  const handleLogin = () => setUser(getUser())

  const handleLogout = () => {
    localStorage.removeItem('sirest_token')
    localStorage.removeItem('sirest_user')
    setUser(null)
  }

  const handleSelect = (v) => {
    if (v === view) return
    setView(v)
    setViewKey((k) => k + 1)
  }

  if (!user) return <ToastProvider><Login onLogin={handleLogin} /></ToastProvider>

  return (
    <ToastProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <Sidebar active={view} onSelect={handleSelect} user={user} onLogout={handleLogout} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} key={viewKey} className="anim-fade">
          {view === 'mesas' && <TablesView />}
          {view === 'menu'  && <MenuView user={user} />}
        </main>
      </div>
    </ToastProvider>
  )
}
