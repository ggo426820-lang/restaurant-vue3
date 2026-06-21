<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="navbar-brand">
        <span class="brand-icon">🍽️</span>
        <span class="brand-name">RestaurantHub</span>
      </div>
      <nav class="navbar-links">
        <router-link to="/" class="nav-link">
          <span class="nav-icon">🏠</span> Home
        </router-link>
        <router-link to="/add" class="nav-link">
          <span class="nav-icon">➕</span> Add
        </router-link>
      </nav>
      <div class="navbar-actions">
        <button class="icon-btn" @click="toggleDark" :title="dark ? 'Light mode' : 'Dark mode'">
          {{ dark ? '☀️' : '🌙' }}
        </button>
        <div class="user-menu" @click="menuOpen = !menuOpen" ref="userMenu">
          <div class="avatar">{{ initial }}</div>
          <span class="username">{{ auth.userName }}</span>
          <span class="caret">▾</span>
          <div class="dropdown" v-if="menuOpen">
            <div class="dropdown-item" @click="doLogout">🚪 Log out</div>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="app-footer">
      <span>Created by <strong>Issam Mohamed</strong> © 2025</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useDarkMode } from '../composables/useDarkMode'

const auth = useAuthStore()
const router = useRouter()
const { dark, toggle: toggleDark } = useDarkMode()
const menuOpen = ref(false)
const userMenu = ref(null)

const initial = computed(() => auth.userName?.charAt(0)?.toUpperCase() || '?')

function doLogout() {
  auth.logout()
  router.push({ name: 'Login' })
}

function handleClickOutside(e) {
  if (userMenu.value && !userMenu.value.contains(e.target)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
}

.navbar {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 16px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  flex-shrink: 0;
}
.brand-icon { font-size: 1.4rem; }

.navbar-links {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  font-size: .9rem;
  transition: all .15s;
}
.nav-link:hover, .nav-link.router-link-exact-active {
  background: var(--primary-light);
  color: var(--primary);
}
.nav-icon { font-size: .9rem; }

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.icon-btn {
  width: 38px; height: 38px;
  border: none;
  background: var(--bg);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.icon-btn:hover { background: var(--border); }

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  position: relative;
  transition: background .15s;
  user-select: none;
}
.user-menu:hover { background: var(--bg); }

.avatar {
  width: 34px; height: 34px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: .9rem;
}
.username { font-weight: 600; font-size: .9rem; }
.caret { font-size: .7rem; color: var(--text-muted); }

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  min-width: 140px;
  overflow: hidden;
  z-index: 200;
}
.dropdown-item {
  padding: 10px 16px;
  font-size: .9rem;
  cursor: pointer;
  transition: background .12s;
}
.dropdown-item:hover { background: var(--bg); }

.main-content {
  flex: 1;
  padding: 32px 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.app-footer {
  padding: 16px 24px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: .85rem;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .navbar { padding: 0 16px; }
  .username { display: none; }
  .main-content { padding: 16px; }
  .brand-name { display: none; }
}
</style>
