<template>
  <div v-if="auth.estaAutenticado" class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
        NEXO <span>/ agenda</span>
      </div>
      <nav class="sidebar-nav">
        <RouterLink to="/agenda"        class="nav-item"><span class="nav-icon nav-icon-list"></span> Contactos</RouterLink>
        <RouterLink to="/agenda/crear"  class="nav-item"><span class="nav-icon nav-icon-add"></span> Nuevo</RouterLink>
        <RouterLink to="/perfil"        class="nav-item"><span class="nav-icon nav-icon-user"></span> Perfil</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="user-chip">
          <img v-if="auth.usuario?.foto" :src="auth.usuario.foto" />
          <div v-else class="avatar-sm">{{ auth.usuario?.nombre_de_usuario?.charAt(0).toUpperCase() }}</div>
          <span class="user-name">{{ auth.usuario?.nombre_de_usuario }}</span>
        </div>
        <button class="btn btn-ghost" style="width:100%; font-size:.7rem;" @click="cerrarSesion">
          Cerrar sesion
        </button>
      </div>
    </aside>
    <main class="main-content">
      <RouterView />
    </main>
  </div>

  <RouterView v-else />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter }    from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()

async function cerrarSesion() {
  await auth.logout()
  router.push('/login')
}
</script>
