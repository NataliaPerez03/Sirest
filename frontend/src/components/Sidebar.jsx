function IconTables() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="18" x2="14" y2="18"/>
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

const NAV = [
  { id: 'mesas', icon: <IconTables />, label: 'Mesas' },
  { id: 'menu',  icon: <IconMenu />,   label: 'Menú'  },
]

import * as Avatar from '@radix-ui/react-avatar'

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'
}

export default function Sidebar({ active, onSelect, user, onLogout }) {
  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      height: '100%',
      background: 'var(--sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0 16px',
    }}>
      {/* Brand */}
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="6" fill="white"/>
              <circle cx="12" cy="12" r="2.5" fill="#18181B"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.4px', color: 'var(--text)', lineHeight: 1.2 }}>
              SIREST
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1px' }}>
              Sistema de Restaurante
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 10px' }}>
        {NAV.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => onSelect(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--surface-hover)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                marginBottom: 2,
                letterSpacing: '-0.1px',
                border: 'none',
                position: 'relative',
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute',
                  left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 18,
                  background: 'var(--accent)',
                  borderRadius: '0 2px 2px 0',
                }} />
              )}
              <span style={{ opacity: isActive ? 1 : 0.6, display: 'flex' }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '14px 16px 0', borderTop: '1px solid var(--border)' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Avatar.Root className="avatar-root">
              <Avatar.Fallback className="avatar-fallback">
                {getInitials(user.nombre)}
              </Avatar.Fallback>
            </Avatar.Root>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: 'var(--text)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                letterSpacing: '-0.2px',
              }}>
                {user.nombre}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                {user.rol_label}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="btn-ghost"
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            fontWeight: 500,
          }}
        >
          <IconLogout />
          Cerrar sesión
        </button>
      </div>

      <div style={{
        marginTop: 14,
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--text-subtle)',
        paddingBottom: 4,
      }}>
        Univ. Central · Arq. Software
      </div>
    </aside>
  )
}
