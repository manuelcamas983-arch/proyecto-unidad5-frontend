<template>
  <div class="auth-wrap">
    <div class="auth-box">
      <span class="auth-logo">NEXO</span>
      <p class="auth-title">Iniciar sesión</p>
      <p class="auth-sub">Ingresa tus credenciales para continuar</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <div class="field">
        <label>Usuario</label>
        <input v-model="form.nombre_de_usuario" type="text" placeholder="tu_usuario" autocomplete="username" @keyup.enter="enviar" />
      </div>

      <div class="field">
        <label>Contraseña</label>
        <div class="pw-wrap">
          <input v-model="form.password" :type="ver ? 'text' : 'password'" placeholder="••••••" autocomplete="current-password" @keyup.enter="enviar" />
          <button type="button" class="pw-toggle" @click="ver = !ver">{{ ver ? 'Ocultar' : 'Mostrar' }}</button>
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%; margin-top:.25rem" :disabled="cargando" @click="enviar">
        {{ cargando ? 'Verificando…' : 'Entrar' }}
      </button>

      <p style="text-align:center; margin-top:1.25rem; font-size:.8rem; font-family:var(--font-mono); color:var(--muted);">
        Sin cuenta? <RouterLink to="/registro">Registrarse</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref }          from 'vue'
import { useRouter }    from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router   = useRouter()
const auth     = useAuthStore()
const cargando = ref(false)
const error    = ref('')
const ver      = ref(false)
const form     = ref({ nombre_de_usuario: '', password: '' })

async function enviar() {
  error.value = ''
  if (!form.value.nombre_de_usuario.trim()) { error.value = 'El usuario es obligatorio'; return }
  if (!form.value.password.trim())          { error.value = 'La contraseña es obligatoria'; return }

  cargando.value = true
  try {
    const data = await auth.login(form.value.nombre_de_usuario, form.value.password)
    if (data.success) {
      router.push('/agenda')
    } else {
      error.value = data.message || 'Credenciales inválidas'
    }
  } catch {
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>
