<template>
  <div>
    <div class="page-header">
      <div>
        <p class="page-title">Contactos</p>
        <p class="page-sub">Listado de tus contactos registrados</p>
      </div>
      <RouterLink to="/agenda/crear" class="btn btn-primary btn-sm">+ Nuevo contacto</RouterLink>
    </div>

    <div class="search-bar">
      <span class="search-label">Buscar</span>
      <input v-model="busqueda" type="search" placeholder="nombre, teléfono, email…" />
    </div>

    <div v-if="cargando" class="spinner"></div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>

    <template v-else>
      <p v-if="contactosFiltrados.length" class="count-badge">
        {{ contactosFiltrados.length }} resultado{{ contactosFiltrados.length !== 1 ? 's' : '' }}
      </p>

      <div v-if="contactosFiltrados.length === 0" class="empty">
        {{ busqueda ? '— sin resultados —' : '— sin contactos. Crea el primero. —' }}
      </div>

      <div v-else class="contact-list">
        <div v-for="c in contactosFiltrados" :key="c.id" class="contact-row">
          <img v-if="c.foto" :src="c.foto" :alt="c.nombre" class="contact-avatar" />
          <div v-else class="contact-av-placeholder">{{ c.nombre.charAt(0).toUpperCase() }}</div>

          <div>
            <div class="contact-info-name">{{ c.nombre }} {{ c.apellido }}</div>
            <div class="contact-info-meta">
              {{ c.telefono }}
              <template v-if="c.email"> · {{ c.email }}</template>
              <template v-if="c.direccion"> · {{ c.direccion }}</template>
            </div>
          </div>

          <div class="contact-actions">
            <RouterLink :to="`/agenda/${c.id}`" class="btn btn-ghost btn-sm">Editar</RouterLink>
            <button class="btn btn-danger btn-sm" @click="eliminar(c.id, c.nombre)">Eliminar</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore }             from '@/stores/auth'
import { getApiUrl }                from '@/config/api'

const auth      = useAuthStore()
const contactos = ref([])
const busqueda  = ref('')
const cargando  = ref(true)
const error     = ref('')

const contactosFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return contactos.value
  return contactos.value.filter(c =>
    c.nombre.toLowerCase().includes(q) ||
    (c.apellido || '').toLowerCase().includes(q) ||
    c.telefono.includes(q) ||
    (c.email || '').toLowerCase().includes(q)
  )
})

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/contactos/index.php`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    const data = await res.json()
    if (data.success) {
      contactos.value = data.contactos
    } else {
      error.value = data.message || 'Error al cargar contactos'
    }
  } catch {
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    cargando.value = false
  }
}

async function eliminar(id, nombre) {
  if (!confirm(`Eliminar a "${nombre}"?`)) return
  try {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/contactos/eliminar.php`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id })
    })
    const data = await res.json()
    if (data.success) {
      contactos.value = contactos.value.filter(c => c.id !== id)
    } else {
      alert(data.message || 'Error al eliminar')
    }
  } catch {
    alert('Error de conexión')
  }
}

onMounted(cargar)
</script>
