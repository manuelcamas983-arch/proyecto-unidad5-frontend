import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
  { path: '/registro', name: 'Registro', component: () => import('@/views/RegistroView.vue') },
  { path: '/agenda', name: 'Agenda', component: () => import('@/views/AgendaView.vue'), meta: { requiereAuth: true } },
  { path: '/agenda/crear', name: 'CrearContacto', component: () => import('@/views/CrearContactoView.vue'), meta: { requiereAuth: true } },
  { path: '/agenda/:id', name: 'EditarContacto', component: () => import('@/views/EditarContactoView.vue'), meta: { requiereAuth: true } },
  { path: '/perfil', name: 'Perfil', component: () => import('@/views/PerfilView.vue'), meta: { requiereAuth: true } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiereAuth && !auth.estaAutenticado) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
