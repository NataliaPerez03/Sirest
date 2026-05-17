import { useState } from 'react'
import { api } from '../api/client'
import * as Label from '@radix-ui/react-label'

const ROL_LABEL = { 1: 'Administrador', 2: 'Chef', 3: 'Mesero' }

function IconMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#18181B"/>
      <path d="M8 14.5C8 11.46 10.46 9 13.5 9H20v1.5h-6.5C11.29 10.5 9.5 12.29 9.5 14.5S11.29 18.5 13.5 18.5H20V20h-6.5C10.46 20 8 17.54 8 14.5Z" fill="white"/>
      <circle cx="13.5" cy="14.5" r="2" fill="white"/>
    </svg>
  )
}

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password) return
    setError(null)
    setLoading(true)
    try {
      const data = await api.login(form.username.trim(), form.password)
      localStorage.setItem('sirest_token', data.access_token)
      localStorage.setItem('sirest_user', JSON.stringify({
        nombre: data.nombre,
        id_rol: data.id_rol,
        rol_label: ROL_LABEL[data.id_rol] || 'Usuario',
      }))
      onLogin()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: 'var(--bg)',
    }}>
      {/* Left panel — branding */}
      <div style={{
        display: 'none',
        flex: 1,
        background: 'var(--accent)',
        padding: '48px',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }} className="login-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="rgba(255,255,255,0.15)"/>
            <circle cx="14" cy="14" r="5" fill="white"/>
          </svg>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>SIREST</span>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            Sistema de gestión de restaurante
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}>
        <div className="anim-scale" style={{ width: '100%', maxWidth: 380 }}>
          {/* Logo */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <IconMark />
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>SIREST</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.6px', color: 'var(--text)', marginBottom: 6 }}>
              Bienvenido de vuelta
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Label.Root className="field-label" htmlFor="login-username">
                Usuario
              </Label.Root>
              <input
                id="login-username"
                type="text"
                placeholder="Ej. admin"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                autoFocus
              />
            </div>

            <div>
              <Label.Root className="field-label" htmlFor="login-password">
                Contraseña
              </Label.Root>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--danger)',
                fontSize: 13,
                background: 'var(--danger-bg)',
                border: '1.5px solid var(--danger-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                marginTop: 4,
                padding: '12px',
                background: 'var(--accent)',
                color: 'var(--accent-fg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 14,
                fontWeight: 600,
                opacity: loading ? 0.65 : 1,
                letterSpacing: '-0.1px',
              }}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <div style={{
            marginTop: 28,
            padding: '14px 16px',
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12.5,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 12 }}>Cuentas de prueba</span><br />
            <span style={{ fontFamily: 'monospace', fontSize: 12 }}>admin / admin123 · chef1 / chef123 · mesero1 / 123456</span>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-subtle)' }}>
            Universidad Central · Arquitectura de Software
          </div>
        </div>
      </div>
    </div>
  )
}
