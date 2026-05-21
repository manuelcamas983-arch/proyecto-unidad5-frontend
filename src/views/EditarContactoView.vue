<template>
  <div>
    <div class="page-header">
      <div>
        <p class="page-title">Editar contacto</p>
        <p class="page-sub">ID #{{ route.params.id }}</p>
      </div>
      <RouterLink to="/agenda" class="btn btn-ghost btn-sm">← Volver</RouterLink>
    </div>

    <div v-if="cargandoInicial" class="spinner"></div>

    <div v-else class="form-box">
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="exito" class="alert alert-success">{{ exito }}</div>

      <div class="form-grid">
        <div class="field">
          <label>Nombre *</label>
          <input v-model="form.nombre" type="text" />
        </div>
        <div class="field">
          <label>Apellido</label>
          <input v-model="form.apellido" type="text" />
        </div>
        <div class="field">
          <label>Teléfono *</label>
          <input v-model="form.telefono" type="tel" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" />
        </div>
      </div>

      <div class="field">
        <label>Dirección</label>
        <input v-model="form.direccion" type="text" />
      </div>

      <div class="field">
        <label>Notas</label>
        <textarea v-model="form.notas"></textarea>
      </div>

      <div class="field">
        <label>Foto del contacto</label>
        <img v-if="preview || form.foto" :src="preview || form.foto" class="foto-preview" />
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="onFoto" style="margin-top:.5rem;" />
      </div>

      <div style="display:flex; gap:.75rem; flex-wrap:wrap; margin-top:.25rem;">
        <button class="btn btn-primary" :disabled="guardando" @click="guardar">
          {{ guardando ? 'Guardando…' : 'Actualizar contacto' }}
        </button>
        <RouterLink to="/agenda" class="btn btn-ghost">Cancelar</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted }          from 'vue'
import { useRouter, useRoute }     from 'vue-router'
import { useAuthStore }            from '@/stores/auth'
import { getApiUrl }               from '@/config/api'

const router          = useRouter()
const route           = useRoute()
const auth            = useAuthStore()
const cargandoInicial = ref(true)
const guardando       = ref(false)
const error           = ref('')
const exito           = ref('')
const preview         = ref(null)
let   archivoFoto     = null

const form = ref({ id: '', nombre: '', apellido: '', telefono: '', email: '', direccion: '', notas: '', foto: '' })

function onFoto(e) {
  archivoFoto = e.target.files[0] || null
  if (archivoFoto) preview.value = URL.createObjectURL(archivoFoto)
}

async function cargar() {
  try {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/contactos/detalle.php?id=${route.params.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    const data = await res.json()
    if (data.success) {
      Object.assign(form.value, data.contacto)
    } else {
      error.value = data.message || 'Contacto no encontrado'
    }
  } catch {
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    cargandoInicial.value = false
  }
}

async function guardar() {
  error.value = ''
  exito.value = ''
  if (!form.value.nombre.trim())   { error.value = 'El nombre es obligatorio';   return }
  if (!form.value.telefono.trim()) { error.value = 'El teléfono es obligatorio'; return }

  guardando.value = true
  try {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    fd.append('id',        form.value.id)
    fd.append('nombre',    form.value.nombre)
    fd.append('apellido',  form.value.apellido  || '')
    fd.append('telefono',  form.value.telefono)
    fd.append('email',     form.value.email     || '')
    fd.append('direccion', form.value.direccion || '')
    fd.append('notas',     form.value.notas     || '')
    if (archivoFoto) fd.append('foto', archivoFoto)

    const res  = await fetch(`${API_URL}/contactos/actualizar.php`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body:    fd
    })
    const data = await res.json()
    if (data.success) {
      exito.value = 'Contacto actualizado'
      setTimeout(() => router.push('/agenda'), 1200)
    } else {
      error.value = data.message || 'Error al actualizar'
    }
  } catch {
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    guardando.value = false
  }
}

onMounted(cargar)
</script>
