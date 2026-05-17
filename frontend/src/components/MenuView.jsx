import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import Modal from './Modal'
import { Select, SelectItem } from './Select'
import { useToast } from './Toast'
import * as Label from '@radix-ui/react-label'

function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function Badge({ children, color, bg, border }) {
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 600,
      padding: '3px 9px', borderRadius: 99,
      background: bg, color,
      border: `1px solid ${border}`,
      letterSpacing: '0.1px',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

function ProductRow({ producto, canEdit, onEdit, onDelete }) {
  const stockAlert = producto.alerta_stock_critico
  const available = producto.disponible

  return (
    <div
      className="product-row anim-up"
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px',
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.2px' }}>{producto.nombre}</span>
          {!available && (
            <Badge color="var(--danger)" bg="var(--danger-bg)" border="var(--danger-border)">Sin stock</Badge>
          )}
          {stockAlert && available && (
            <Badge color="var(--warning)" bg="var(--warning-bg)" border="var(--warning-border)">Stock crítico</Badge>
          )}
          {available && !stockAlert && (
            <Badge color="var(--success)" bg="var(--success-bg)" border="var(--success-border)">Disponible</Badge>
          )}
        </div>
        {producto.descripcion && (
          <p style={{
            color: 'var(--text-muted)', fontSize: 13, marginBottom: 6,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {producto.descripcion}
          </p>
        )}
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)' }}>
          <span>
            Stock:{' '}
            <b style={{ color: stockAlert ? 'var(--warning)' : 'var(--text)', fontWeight: 600 }}>
              {producto.stock_actual}
            </b>
          </span>
          <span>
            Crítico:{' '}
            <b style={{ color: 'var(--text)', fontWeight: 600 }}>{producto.stock_critico}</b>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>
            ${Number(producto.precio).toLocaleString('es-CO')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2, fontWeight: 500 }}>COP</div>
        </div>

        {canEdit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => onEdit(producto)}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                background: 'var(--surface-hover)',
                border: '1.5px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text)',
                fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '-0.1px',
              }}
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(producto)}
              style={{
                padding: '6px 14px',
                background: 'transparent',
                border: '1.5px solid var(--danger-border)',
                borderRadius: 6,
                color: 'var(--danger)',
                fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '-0.1px',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-bg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const EMPTY_FORM = { nombre: '', precio: '', id_categoria: '', stock_actual: '', stock_critico: 5, descripcion: '' }

export default function MenuView({ user }) {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const showToast = useToast()

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_FORM)
  const [createError, setCreateError] = useState(null)
  const [creating, setCreating] = useState(false)

  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editError, setEditError] = useState(null)
  const [editing, setEditing] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const canEdit = user?.id_rol === 1 || user?.id_rol === 2

  const load = useCallback(async () => {
    try {
      setError(null)
      const [data, cats] = await Promise.all([api.getMenu(), api.getCategorias()])
      setProductos(data)
      setCategorias(cats)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const catOptions = categorias

  const openCreate = () => {
    setCreateForm({ ...EMPTY_FORM, id_categoria: categorias[0]?.id_categoria ?? '' })
    setCreateError(null)
    setShowCreate(true)
  }

  const handleCreate = async () => {
    setCreateError(null)
    if (!createForm.nombre.trim()) return setCreateError('El nombre es requerido.')
    if (!createForm.precio || Number(createForm.precio) <= 0) return setCreateError('El precio debe ser mayor a cero.')
    if (createForm.stock_actual === '' || Number(createForm.stock_actual) < 0) return setCreateError('El stock no puede ser negativo.')
    setCreating(true)
    try {
      await api.createProducto({
        nombre: createForm.nombre.trim(),
        precio: Number(createForm.precio),
        id_categoria: Number(createForm.id_categoria),
        stock_actual: Number(createForm.stock_actual),
        stock_critico: Number(createForm.stock_critico),
        descripcion: createForm.descripcion.trim() || null,
      })
      showToast(`"${createForm.nombre}" agregado al menú`)
      setShowCreate(false)
      await load()
    } catch (e) {
      setCreateError(e.message)
    } finally {
      setCreating(false)
    }
  }

  const openEdit = (p) => {
    setEditTarget(p)
    setEditForm({
      nombre: p.nombre,
      precio: p.precio,
      id_categoria: p.id_categoria ?? categorias[0]?.id_categoria ?? '',
      stock_actual: p.stock_actual,
      stock_critico: p.stock_critico,
      descripcion: p.descripcion ?? '',
    })
    setEditError(null)
  }

  const handleEdit = async () => {
    setEditError(null)
    if (!editForm.nombre.trim()) return setEditError('El nombre es requerido.')
    if (!editForm.precio || Number(editForm.precio) <= 0) return setEditError('El precio debe ser mayor a cero.')
    if (editForm.stock_actual === '' || Number(editForm.stock_actual) < 0) return setEditError('El stock no puede ser negativo.')
    setEditing(true)
    try {
      await api.updateProducto(editTarget.id_producto, {
        nombre: editForm.nombre.trim(),
        precio: Number(editForm.precio),
        id_categoria: Number(editForm.id_categoria),
        stock_actual: Number(editForm.stock_actual),
        stock_critico: Number(editForm.stock_critico),
        descripcion: editForm.descripcion.trim() || null,
      })
      showToast(`"${editForm.nombre}" actualizado`)
      setEditTarget(null)
      await load()
    } catch (e) {
      setEditError(e.message)
    } finally {
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteProducto(deleteTarget.id_producto)
      showToast(`"${deleteTarget.nombre}" desactivado`)
      setDeleteTarget(null)
      await load()
    } catch (e) {
      showToast(e.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )
  const criticalCount = productos.filter((p) => p.alerta_stock_critico).length
  const unavailableCount = productos.filter((p) => !p.disponible).length

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '28px 32px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.6px', color: 'var(--text)' }}>Menú</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 3, fontSize: 14 }}>
            {productos.length} productos
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={load}
            className="btn-secondary"
            style={{
              padding: '9px 16px',
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text)',
              fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            <IconRefresh />
            Actualizar
          </button>
          {canEdit && (
            <button
              onClick={openCreate}
              className="btn-primary"
              style={{
                padding: '9px 18px',
                background: 'var(--accent)', color: 'var(--accent-fg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 7,
                letterSpacing: '-0.1px',
              }}
            >
              <IconPlus />
              Nuevo producto
            </button>
          )}
        </div>
      </div>

      {/* Alert strip */}
      {(criticalCount > 0 || unavailableCount > 0) && (
        <div style={{ padding: '14px 32px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {criticalCount > 0 && (
            <div style={{
              background: 'var(--warning-bg)',
              border: '1.5px solid var(--warning-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px', fontSize: 12.5, color: 'var(--warning)',
              display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {criticalCount} producto{criticalCount > 1 ? 's' : ''} con stock crítico
            </div>
          )}
          {unavailableCount > 0 && (
            <div style={{
              background: 'var(--danger-bg)',
              border: '1.5px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px', fontSize: 12.5, color: 'var(--danger)',
              display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {unavailableCount} producto{unavailableCount > 1 ? 's' : ''} sin stock
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div style={{ padding: '16px 32px 0' }}>
        <div style={{ maxWidth: 360, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
          }}>
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder="Buscar producto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflow: 'auto',
        padding: '16px 32px 32px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {loading && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 80, fontSize: 14 }}>
            Cargando menú…
          </div>
        )}
        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1.5px solid var(--danger-border)',
            borderRadius: 'var(--radius)',
            padding: '16px 20px', color: 'var(--danger)', fontSize: 14,
          }}>
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 80, fontSize: 14 }}>
            {search ? 'Sin resultados para tu búsqueda.' : 'No hay productos en el menú.'}
          </div>
        )}
        {!loading && !error && filtered.map((p) => (
          <ProductRow key={p.id_producto} producto={p} canEdit={canEdit} onEdit={openEdit} onDelete={setDeleteTarget} />
        ))}
      </div>

      {/* CREATE modal */}
      {showCreate && (
        <Modal title="Nuevo producto" onClose={() => setShowCreate(false)}>
          <ProductForm
            form={createForm}
            onChange={(f, v) => setCreateForm((prev) => ({ ...prev, [f]: v }))}
            catOptions={catOptions}
            error={createError}
            saving={creating}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            saveLabel="Crear producto"
          />
        </Modal>
      )}

      {/* EDIT modal */}
      {editTarget && (
        <Modal title={`Editar: ${editTarget.nombre}`} onClose={() => setEditTarget(null)}>
          <ProductForm
            form={editForm}
            onChange={(f, v) => setEditForm((prev) => ({ ...prev, [f]: v }))}
            catOptions={catOptions}
            error={editError}
            saving={editing}
            onSave={handleEdit}
            onCancel={() => setEditTarget(null)}
            saveLabel="Guardar cambios"
          />
        </Modal>
      )}

      {/* DELETE confirm */}
      {deleteTarget && (
        <Modal title="Eliminar producto" onClose={() => setDeleteTarget(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>
              ¿Desactivar{' '}
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{deleteTarget.nombre}</span>?
              El producto quedará marcado como sin stock y no podrá ser seleccionado en nuevos pedidos.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeleteTarget(null)}
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
                onClick={handleDelete}
                disabled={deleting}
                className="btn-danger"
                style={{
                  flex: 1, padding: '11px',
                  background: 'var(--danger)', color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 14, fontWeight: 600,
                  opacity: deleting ? 0.65 : 1,
                }}
              >
                {deleting ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <Label.Root className="field-label">{label}</Label.Root>
      {children}
    </div>
  )
}

function ProductForm({ form, onChange, catOptions, error, saving, onSave, onCancel, saveLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Nombre">
        <input placeholder="Ej. Hamburguesa Clásica" value={form.nombre} onChange={(e) => onChange('nombre', e.target.value)} />
      </Field>
      <Field label="Descripción (opcional)">
        <textarea rows={2} placeholder="Descripción breve…" value={form.descripcion} onChange={(e) => onChange('descripcion', e.target.value)} style={{ resize: 'vertical' }} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Precio (COP)">
          <input type="number" min="0" placeholder="0" value={form.precio} onChange={(e) => onChange('precio', e.target.value)} />
        </Field>
        <Field label="Categoría">
          <Select value={form.id_categoria} onValueChange={(v) => onChange('id_categoria', v)}>
            {catOptions.map((c) => (
              <SelectItem key={c.id_categoria} value={c.id_categoria}>{c.nombre}</SelectItem>
            ))}
          </Select>
        </Field>
        <Field label="Stock actual">
          <input type="number" min="0" placeholder="0" value={form.stock_actual} onChange={(e) => onChange('stock_actual', e.target.value)} />
        </Field>
        <Field label="Stock crítico">
          <input type="number" min="0" value={form.stock_critico} onChange={(e) => onChange('stock_critico', e.target.value)} />
        </Field>
      </div>
      {error && (
        <div style={{
          color: 'var(--danger)', fontSize: 13,
          background: 'var(--danger-bg)',
          border: '1.5px solid var(--danger-border)',
          borderRadius: 6, padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button
          onClick={onCancel}
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
          onClick={onSave}
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
          {saving ? 'Guardando…' : saveLabel}
        </button>
      </div>
    </div>
  )
}
