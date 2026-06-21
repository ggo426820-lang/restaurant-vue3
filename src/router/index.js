import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import('../views/SignUpView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantDetail',
    component: () => import('../views/RestaurantDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/add',
    name: 'Add',
    component: () => import('../views/AddRestaurantView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/update/:id',
    name: 'Update',
    component: () => import('../views/EditRestaurantView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login' }
  }
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'Home' }
  }
})

export default router
