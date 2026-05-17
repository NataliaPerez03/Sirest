const BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('sirest_token')
}

async function request(method, path, body) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    localStorage.removeItem('sirest_token')
    localStorage.removeItem('sirest_user')
    window.dispatchEvent(new Event('sirest:unauthorized'))
    throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Error desconocido')
  }
  return res.json()
}

export const api = {
  login: (username, password) =>
    request('POST', '/auth/login', { username, password }),

  getMesas: () => request('GET', '/mesas'),
  updateMesaEstado: (id, estado) =>
    request('PATCH', `/mesas/${id}/estado`, { estado }),

  getCategorias: () => request('GET', '/categorias'),

  getMenu: () => request('GET', '/menu'),
  createProducto: (data) => request('POST', '/menu', data),
  updateProducto: (id, data) => request('PUT', `/menu/${id}`, data),
  deleteProducto: (id) => request('DELETE', `/menu/${id}`),
}
