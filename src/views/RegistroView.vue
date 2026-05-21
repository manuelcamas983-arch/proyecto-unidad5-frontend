<template>
  <div class="auth-wrap">
    <div class="auth-box">
      <span class="auth-logo">NEXO</span>
      <p class="auth-title">Crear cuenta</p>
      <p class="auth-sub">Mínimo 3 caracteres para usuario, 6 para contraseña</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="exito" class="alert alert-success">{{ exito }}</div>

      <div class="field">
        <label>Usuario</label>
        <input v-model="form.nombre_de_usuario" type="text" placeholder="mínimo 3 caracteres" autocomplete="username" />
      </div>

      <div class="field">
        <label>Contraseña</label>
        <div class="pw-wrap">
          <input v-model="form.password" :type="ver1 ? 'text' : 'password'" placeholder="mínimo 6 caracteres" autocomplete="new-password" />
          <button type="button" class="pw-toggle" @click="ver1 = !ver1">{{ ver1 ? 'Ocultar' : 'Mostrar' }}</button>
        </div>
      </div>

      <div class="field">
        <label>Confirmar contraseña</label>
        <div class="pw-wrap">
          <input v-model="form.confirmar" :type="ver2 ? 'text' : 'password'" placeholder="repite la contraseña" autocomplete="new-password" />
          <button type="button" class="pw-toggle" @click="ver2 = !ver2">{{ ver2 ? 'Ocultar' : 'Mostrar' }}</button>
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%; margin-top:.25rem" :disabled="cargando" @click="enviar">
        {{ cargando ? 'Registrando…' : 'Crear cuenta' }}
      </button>

      <p style="text-align:center; margin-top:1.25rem; font-size:.8rem; font-family:var(--font-mono); color:var(--muted);">
        Ya tienes cuenta? <RouterLink to="/login">Ingresar</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref }       from 'vue'
import { useRouter } from 'vue-router'
import { getApiUrl } from '@/config/api'

const router   = useRouter()
const cargando = ref(false)
const error    = ref('')
const exito    = ref('')
const ver1     = ref(false)
const ver2     = ref(false)
const form     = ref({ nombre_de_usuario: '', password: '', confirmar: '' })

async function enviar() {
  error.value = ''
  exito.value = ''
  if (form.value.nombre_de_usuario.trim().length < 3) { error.value = 'El usuario debe tener al menos 3 caracteres'; return }
  if (form.value.password.length < 6)                 { error.value = 'La contraseña debe tener al menos 6 caracteres'; return }
  if (form.value.password !== form.value.confirmar)   { error.value = 'Las contraseñas no coinciden'; return }

  cargando.value = true
  try {
    const API_URL = await getApiUrl()
    const res  = await fetch(`${API_URL}/auth/registrar.php`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre_de_usuario: form.value.nombre_de_usuario, password: form.value.password })
    })
    const data = await res.json()
    if (data.success) {
      exito.value = 'Cuenta creada. Redirigiendo…'
      setTimeout(() => router.push('/login'), 1500)
    } else {
      error.value = data.message || 'Error al registrarse'
    }
  } catch {
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>
