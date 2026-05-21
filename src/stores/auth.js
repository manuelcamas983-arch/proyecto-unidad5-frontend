import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getApiUrl } from '@/config/api'

export const useAuthStore = defineStore('auth', () => {
  const token   = ref(sessionStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(sessionStorage.getItem('usuario') || 'null'))

  const estaAutenticado = computed(() => !!token.value)

  async function login(nombre_de_usuario, password) {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/auth/login.php`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre_de_usuario, password })
    })
    const data = await res.json()
    if (data.success) {
      token.value   = data.token
      usuario.value = data.usuario
      sessionStorage.setItem('token',   data.token)
      sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
    }
    return data
  }

  async function logout() {
    try {
      const API_URL = await getApiUrl()
      await fetch(`${API_URL}/auth/logout.php`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token.value}` }
      })
    } catch (_) {}
    token.value   = null
    usuario.value = null
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuario')
  }

  async function obtenerPerfil() {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/auth/perfil.php`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    const data = await res.json()
    if (data.success) {
      usuario.value = data.usuario
      sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
    }
    return data
  }

  return { token, usuario, estaAutenticado, login, logout, obtenerPerfil }
})
