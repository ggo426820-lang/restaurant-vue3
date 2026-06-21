<template>
  <DefaultLayout>
    <LoadingSpinner v-if="loading" :full="true" label="Loading restaurant…" />
    <div v-else-if="restaurant" class="detail-page">
      <button class="back-btn" @click="$router.back()">← Back to restaurants</button>

      <div class="detail-hero">
        <div class="hero-avatar">{{ restaurant.name?.charAt(0) || '🍴' }}</div>
        <div class="hero-info">
          <div class="hero-top">
            <h1 class="hero-title">{{ restaurant.name }}</h1>
            <button class="fav-btn" @click="store.toggleFavorite(String(restaurant.id))">
              {{ isFav ? '❤️ Favorited' : '🤍 Add to Favorites' }}
            </button>
          </div>
          <p class="hero-id">Restaurant #{{ restaurant.id }}</p>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-card">
          <div class="detail-icon">📞</div>
          <div>
            <p class="detail-label">Contact</p>
            <p class="detail-value">{{ restaurant.contact }}</p>
          </div>
        </div>
        <div class="detail-card">
          <div class="detail-icon">📍</div>
          <div>
            <p class="detail-label">Address</p>
            <p class="detail-value">{{ restaurant.address }}</p>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <router-link :to="{ name: 'Update', params: { id: restaurant.id } }" class="btn-primary">✏️ Edit Restaurant</router-link>
        <button class="btn-danger" @click="showDelete = true">🗑️ Delete</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">❓</div>
      <h3>Restaurant not found</h3>
      <router-link to="/" class="btn-primary">Go Home</router-link>
    </div>

    <div v-if="showDelete" class="modal-overlay" @click.self="showDelete = false">
      <div class="modal">
        <h3>Delete Restaurant?</h3>
        <p>Are you sure you want to delete <strong>{{ restaurant?.name }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showDelete = false">Cancel</button>
          <button class="btn-danger" @click="doDelete">Delete</button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useRestaurantStore } from '../stores/restaurantStore'
import { useToast } from '../composables/useToast'

const store = useRestaurantStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const restaurant = ref(null)
const showDelete = ref(false)

const isFav = computed(() => store.isFavorite(String(route.params.id)))

onMounted(async () => {
  restaurant.value = await store.fetchById(route.params.id)
  loading.value = false
})

async function doDelete() {
  const ok = await store.remove(route.params.id)
  if (ok) {
    toast.success('Restaurant deleted')
    router.push({ name: 'Home' })
  } else {
    toast.error('Failed to delete')
    showDelete.value = false
  }
}
</script>

<style scoped>
.detail-page { max-width: 680px; margin: 0 auto; }
.back-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: .9rem; margin-bottom: 24px; padding: 0; display: block; }
.back-btn:hover { color: var(--primary); }

.detail-hero {
  background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
  padding: 28px; display: flex; align-items: center; gap: 20px; margin-bottom: 20px;
}
.hero-avatar {
  width: 80px; height: 80px; background: var(--primary-light); color: var(--primary);
  border-radius: 20px; display: flex; align-items: center; justify-content: center;
  font-size: 2.2rem; font-weight: 800; flex-shrink: 0;
}
.hero-info { flex: 1; }
.hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.hero-title { margin: 0 0 6px; font-size: 1.5rem; font-weight: 800; color: var(--text); }
.hero-id { margin: 0; color: var(--text-muted); font-size: .85rem; }
.fav-btn { background: var(--bg); border: 1.5px solid var(--border); padding: 8px 14px; border-radius: 10px; cursor: pointer; font-size: .85rem; font-weight: 600; color: var(--text); transition: all .15s; white-space: nowrap; }
.fav-btn:hover { border-color: #ef4444; color: #ef4444; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.detail-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
  padding: 20px; display: flex; align-items: flex-start; gap: 14px;
}
.detail-icon { font-size: 1.4rem; flex-shrink: 0; }
.detail-label { margin: 0 0 4px; font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); }
.detail-value { margin: 0; font-size: .95rem; font-weight: 600; color: var(--text); }

.detail-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-primary { padding: 11px 24px; background: var(--primary); color: #fff; border: none; border-radius: 10px; font-size: .9rem; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: opacity .15s; }
.btn-primary:hover { opacity: .88; }
.btn-secondary { padding: 11px 24px; background: var(--bg); color: var(--text); border: 1.5px solid var(--border); border-radius: 10px; font-size: .9rem; font-weight: 600; cursor: pointer; }
.btn-secondary:hover { border-color: var(--primary); color: var(--primary); }
.btn-danger { padding: 11px 24px; background: #fee2e2; color: #ef4444; border: none; border-radius: 10px; font-size: .9rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all .15s; }
.btn-danger:hover { background: #ef4444; color: #fff; }

.empty-state { text-align: center; padding: 80px 24px; color: var(--text-muted); }
.empty-icon { font-size: 4rem; margin-bottom: 16px; }
.empty-state h3 { margin: 0 0 20px; font-size: 1.2rem; color: var(--text); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 16px; }
.modal { background: var(--surface); border-radius: 16px; padding: 28px; max-width: 380px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.modal h3 { margin: 0 0 10px; font-size: 1.2rem; color: var(--text); }
.modal p { margin: 0 0 24px; color: var(--text-muted); font-size: .9rem; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

@media (max-width: 480px) {
  .detail-grid { grid-template-columns: 1fr; }
  .detail-hero { flex-direction: column; }
}
</style>
