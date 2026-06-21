<template>
  <div class="card" @click="$router.push({ name: 'RestaurantDetail', params: { id: r.id } })">
    <div class="card-header">
      <div class="card-avatar">{{ r.name?.charAt(0) || '🍴' }}</div>
      <button class="fav-btn" @click.stop="store.toggleFavorite(String(r.id))" :title="isFav ? 'Remove favorite' : 'Add favorite'">
        {{ isFav ? '❤️' : '🤍' }}
      </button>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ r.name }}</h3>
      <p class="card-meta">📞 {{ r.contact }}</p>
      <p class="card-meta">📍 {{ r.address }}</p>
    </div>
    <div class="card-actions" @click.stop>
      <router-link :to="{ name: 'Update', params: { id: r.id } }" class="btn btn-sm btn-outline">Edit</router-link>
      <button class="btn btn-sm btn-danger" @click="$emit('delete', r.id)">Delete</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRestaurantStore } from '../stores/restaurantStore'

const props = defineProps({ r: Object })
defineEmits(['delete'])

const store = useRestaurantStore()
const isFav = computed(() => store.isFavorite(String(props.r.id)))
</script>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card:hover {
  box-shadow: 0 8px 28px rgba(79,70,229,.12);
  transform: translateY(-2px);
  border-color: var(--primary);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-avatar {
  width: 48px; height: 48px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
}
.fav-btn {
  background: none; border: none; cursor: pointer; font-size: 1.2rem;
  padding: 4px; border-radius: 6px; transition: transform .15s;
}
.fav-btn:hover { transform: scale(1.2); }
.card-title {
  margin: 0; font-size: 1rem; font-weight: 700; color: var(--text);
}
.card-meta {
  margin: 0; font-size: .85rem; color: var(--text-muted);
}
.card-actions {
  display: flex; gap: 8px; margin-top: 4px;
}
.btn { padding: 7px 14px; border-radius: 8px; font-size: .85rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-flex; align-items: center; transition: all .15s; }
.btn-sm { padding: 6px 12px; font-size: .8rem; }
.btn-outline { background: var(--bg); border: 1px solid var(--border); color: var(--text); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-danger { background: #fee2e2; color: #ef4444; }
.btn-danger:hover { background: #ef4444; color: #fff; }
</style>
