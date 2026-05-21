<template>
  <div class="home-wrap">
    <div class="home-inner">
      <p class="home-tag">v1.0 — sistema de agenda</p>
      <h1 class="home-title">Tu agenda.<br><em>Sin ruido.</em></h1>
      <p class="home-desc">
        Gestiona tus contactos de forma rápida y segura. Acceso con token, datos protegidos por usuario.
      </p>
      <div class="home-btns">
        <RouterLink to="/login"    class="btn btn-primary">Entrar al sistema</RouterLink>
        <RouterLink to="/registro" class="btn btn-ghost">Crear cuenta</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter }    from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()
if (auth.estaAutenticado) router.replace('/agenda')
</script>
