<template>
  <div>
    <div class="page-header">
      <div>
        <p class="page-title">Mi perfil</p>
        <p class="page-sub">Edita tu usuario y contraseña</p>
      </div>
    </div>

    <div class="form-box" style="max-width:420px;">
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="exito" class="alert alert-success">{{ exito }}</div>

      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
        <img v-if="preview || auth.usuario?.foto" :src="preview || auth.usuario?.foto" class="foto-preview" style="margin-top:0;" />
        <div v-else class="contact-av-placeholder" style="width:64px; height:64px; font-size:1.2rem;">
          {{ auth.usuario?.nombre_de_usuario?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p style="font-family:var(--font-mono); font-size:.85rem; color:var(--text);">{{ auth.usuario?.nombre_de_usuario }}</p>
          <p style="font-family:var(--font-mono); font-size:.7rem; color:var(--muted);">usuario activo</p>
        </div>
      </div>

      <div class="field">
        <label>Nombre de usuario</label>
        <input v-model="form.nombre_de_usuario" type="text" autocomplete="username" />
      </div>

      <div class="field">
        <label>Nueva contraseña <span style="color:var(--muted); font-size:.65rem;">(dejar vacío para no cambiar)</span></label>
        <div class="pw-wrap">
          <input v-model="form.password" :type="ver ? 'text' : 'password'" placeholder="••••••" autocomplete="new-password" />
          <button type="button" class="pw-toggle" @click="ver = !ver">{{ ver ? 'Ocultar' : 'Mostrar' }}</button>
        </div>
      </div>

      <div class="field">
        <label>Foto de perfil</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" @change="onFoto" />
      </div>

      <button class="btn btn-primary" style="width:100%;" :disabled="cargando" @click="guardar">
        {{ cargando ? 'Guardando…' : 'Guardar cambios' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref }          from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getApiUrl }    from '@/config/api'

const auth        = useAuthStore()
const cargando    = ref(false)
const error       = ref('')
const exito       = ref('')
const preview     = ref(null)
const ver         = ref(false)
let   archivoFoto = null

const form = ref({
  nombre_de_usuario: auth.usuario?.nombre_de_usuario || '',
  password: ''
})

function onFoto(e) {
  archivoFoto = e.target.files[0] || null
  if (archivoFoto) preview.value = URL.createObjectURL(archivoFoto)
}

async function guardar() {
  error.value = ''
  exito.value = ''
  if (form.value.nombre_de_usuario.trim().length < 3) { error.value = 'El usuario debe tener al menos 3 caracteres'; return }
  if (form.value.password && form.value.password.length < 6) { error.value = 'La contraseña debe tener al menos 6 caracteres'; return }

  cargando.value = true
  try {
    const API_URL = await getApiUrl()
    const fd = new FormData()
    fd.append('nombre_de_usuario', form.value.nombre_de_usuario)
    if (form.value.password) fd.append('password', form.value.password)
    if (archivoFoto)         fd.append('foto', archivoFoto)

    const res  = await fetch(`${API_URL}/auth/editar.php`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body:    fd
    })
    const data = await res.json()
    if (data.success) {
      auth.usuario = data.usuario
      sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
      exito.value = 'Perfil actualizado correctamente'
      form.value.password = ''
      preview.value = null
      archivoFoto = null
    } else {
      error.value = data.message || 'Error al actualizar perfil'
    }
  } catch {
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>
