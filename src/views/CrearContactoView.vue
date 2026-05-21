<template>
  <div>
    <div class="page-header">
      <div>
        <p class="page-title">Nuevo contacto</p>
        <p class="page-sub">Completa los campos requeridos</p>
      </div>
      <RouterLink to="/agenda" class="btn btn-ghost btn-sm">← Volver</RouterLink>
    </div>

    <div class="form-box">
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="exito" class="alert alert-success">{{ exito }}</div>

      <div class="form-grid">
        <div class="field">
          <label>Nombre *</label>
          <input v-model="form.nombre" type="text" placeholder="Nombre" />
        </div>
        <div class="field">
          <label>Apellido</label>
          <input v-model="form.apellido" type="text" placeholder="Apellido" />
        </div>
        <div class="field">
          <label>Teléfono *</label>
          <input v-model="form.telefono" type="tel" placeholder="+52 xxx xxx xxxx" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" />
        </div>
      </div>

      <div class="field">
        <label>Dirección</label>
        <input v-model="form.direccion" type="text" placeholder="Calle, colonia, ciudad…" />
      </div>

      <div class="field">
        <label>Notas</label>
        <textarea v-model="form.notas" placeholder="Notas adicionales…"></textarea>
      </div>

      <div class="field">
        <label>Foto del contacto</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="onFoto" />
        <img v-if="preview" :src="preview" class="foto-preview" />
      </div>

      <div style="display:flex; gap:.75rem; flex-wrap:wrap; margin-top:.25rem;">
        <button class="btn btn-primary" :disabled="cargando" @click="guardar">
          {{ cargando ? 'Guardando…' : 'Guardar contacto' }}
        </button>
        <RouterLink to="/agenda" class="btn btn-ghost">Cancelar</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref }          from 'vue'
import { useRouter }    from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getApiUrl }    from '@/config/api'

const router      = useRouter()
const auth        = useAuthStore()
const cargando    = ref(false)
const error       = ref('')
const exito       = ref('')
const preview     = ref(null)
let   archivoFoto = null

const form = ref({ nombre: '', apellido: '', telefono: '', email: '', direccion: '', notas: '' })

function onFoto(e) {
  archivoFoto = e.target.files[0] || null
  if (archivoFoto) preview.value = URL.createObjectURL(archivoFoto)
}

async function guardar() {
  error.value = ''
  exito.value = ''
  if (!form.value.nombre.trim())   { error.value = 'El nombre es obligatorio';   return }
  if (!form.value.telefono.trim()) { error.value = 'El teléfono es obligatorio'; return }

  cargando.value = true
  try {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (archivoFoto) fd.append('foto', archivoFoto)

    const res  = await fetch(`${API_URL}/contactos/crear.php`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body:    fd
    })
    const data = await res.json()
    if (data.success) {
      exito.value = 'Contacto creado correctamente'
      setTimeout(() => router.push('/agenda'), 1200)
    } else {
      error.value = data.message || 'Error al crear contacto'
    }
  } catch {
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>
