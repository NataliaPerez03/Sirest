import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import Modal from './Modal'
import { Select, SelectItem } from './Select'
import { useToast } from './Toast'

const ESTADOS = ['LIBRE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO']

const STATUS = {
  LIBRE:         { color: 'var(--success)',  bg: 'var(--success-bg)',  border: 'var(--success-border)',  label: 'Libre'         },
  OCUPADA:       { color: 'var(--danger)',   bg: 'var(--danger-bg)',   border: 'var(--danger-border)',   label: 'Ocupada'       },
  RESERVADA:     { color: 'var(--blue)',     bg: 'var(--blue-bg)',     border: 'var(--blue-border)',     label: 'Reservada'     },
  MANTENIMIENTO: { color: 'var(--warning)',  bg: 'var(--warning-bg)', border: 'var(--warning-border)', label: 'Mantenimiento' },
}

function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  )
}

function TableCard({ mesa, onEdit }) {
  const s = STATUS[mesa.estado] || { color: 'var(--text-muted)', bg: 'var(--surface-hover)', border: 'var(--border)', label: mesa.estado }

  return (
    <div
      className="table-card anim-up"
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '22px',
        display: 'flex', flexDirection: 'column', gap: 14,
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>Mesa</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)', lineHeight: 1 }}>
            {String(mesa.numero).padStart(2, '0')}
          </div>
        </div>
        <span style={{
          fontSize: 11.5, fontWeight: 600,
          padding: '5px 10px', borderRadius: 99,
          background: s.bg, color: s.color,
          border: `1px solid ${s.border}`,
          letterSpacing: '0.1px',
        }}>
          {s.label}
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 13, color: 'var(--text-muted)',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{mesa.capacidad}</span>
        <span>personas</span>
      </div>

      <button
        onClick={() => onEdit(mesa)}
        className="btn-change"
        style={{
          padding: '9px 0',
          background: 'var(--surface-hover)',
          color: 'var(--text-muted)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '-0.1px',
        }}
      >
        Cambiar estado
      </button>
    </div>
  )
}

export default function TablesView() {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [newEstado, setNewEstado] = useState('')
  const [saving, setSaving] = useState(false)
  const showToast = useToast()

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await api.getMesas()
      setMesas(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openEdit = (mesa) => { setEditing(mesa); setNewEstado(mesa.estado) }

  const handleSave = async () => {
    if (!newEstado || newEstado === editing.estado) { setEditing(null); return }
    setSaving(true)
    try {
      await api.updateMesaEstado(editing.id_mesa, newEstado)
      showToast(`Mesa #${editing.numero} → ${STATUS[newEstado]?.label ?? newEstado}`)
      setEditing(null)
      await load()
    } catch (e) {
      showToast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const summary = ESTADOS.map((e) => ({
    estado: e, s: STATUS[e],
    count: mesas.filter((m) => m.estado === e).length,
  }))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '28px 32px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.6px', color: 'var(--text)' }}>Mesas</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 3, fontSize: 14 }}>
            {mesas.length} mesas registradas
          </p>
        </div>
        <button
          onClick={load}
          className="btn-secondary"
          style={{
            padding: '9px 16px',
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text)',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          <IconRefresh />
          Actualizar
        </button>
      </div>

      {/* Summary pills */}
      {mesas.length > 0 && (
        <div style={{ padding: '16px 32px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {summary.map(({ estado, s, count }) => (
            <div key={estado} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: count > 0 ? s.bg : 'var(--surface)',
              border: `1.5px solid ${count > 0 ? s.border : 'var(--border)'}`,
              borderRadius: 99,
              padding: '5px 12px 5px 10px',
              fontSize: 12.5,
              transition: 'all 0.2s ease',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: count > 0 ? s.color : 'var(--border-strong)',
                display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{ color: count > 0 ? s.color : 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
              <span style={{
                color: count > 0 ? s.color : 'var(--text-subtle)',
                fontWeight: 700, fontSize: 13,
              }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 32px 32px' }}>
        {loading && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 100, fontSize: 14 }}>
            Cargando mesas…
          </div>
        )}
        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1.5px solid var(--danger-border)',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
            color: 'var(--danger)',
            fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
        {!loading && !error && (
          <div
            className="card-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}
          >
            {mesas.map((mesa) => (
              <TableCard key={mesa.id_mesa} mesa={mesa} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal title={`Mesa ${String(editing.numero).padStart(2, '0')}`} onClose={() => setEditing(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: 'var(--text-muted)',
            }}>
              Estado actual:
              <span style={{
                fontSize: 12, fontWeight: 600,
                padding: '3px 10px', borderRadius: 99,
                background: STATUS[editing.estado]?.bg,
                color: STATUS[editing.estado]?.color,
                border: `1px solid ${STATUS[editing.estado]?.border}`,
              }}>
                {STATUS[editing.estado]?.label ?? editing.estado}
              </span>
            </div>
            <div>
              <label style={{
                display: 'block', marginBottom: 7,
                fontSize: 12, fontWeight: 600, color: 'var(--text)',
                letterSpacing: '0.2px',
              }}>
                Nuevo estado
              </label>
              <Select value={newEstado} onValueChange={setNewEstado}>
                {ESTADOS.map((e) => (
                  <SelectItem key={e} value={e}>{STATUS[e]?.label ?? e}</SelectItem>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setEditing(null)}
                className="btn-secondary"
                style={{
                  flex: 1, padding: '11px',
                  background: 'var(--surface-hover)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 14, fontWeight: 500,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{
                  flex: 1, padding: '11px',
                  background: 'var(--accent)', color: 'var(--accent-fg)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 14, fontWeight: 600,
                  opacity: saving ? 0.65 : 1,
                }}
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}
