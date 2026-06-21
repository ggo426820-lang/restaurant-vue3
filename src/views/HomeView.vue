<template>
  <DefaultLayout>
    <div class="page-header">
      <div>
        <h1 class="page-title">Restaurants</h1>
        <p class="page-sub">{{ store.filtered.length }} restaurant{{ store.filtered.length !== 1 ? 's' : '' }} found</p>
      </div>
      <router-link to="/add" class="btn-primary">➕ Add Restaurant</router-link>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="store.searchQuery"
          class="search-input"
          placeholder="Search by name, address, contact…"
          @input="store.currentPage = 1"
        />
        <button v-if="store.searchQuery" class="clear-btn" @click="store.searchQuery = ''; store.currentPage = 1">✕</button>
      </div>
      <div class="view-toggle">
        <button :class="['toggle-btn', store.viewMode === 'grid' && 'active']" @click="store.setViewMode('grid')" title="Grid view">⊞</button>
        <button :class="['toggle-btn', store.viewMode === 'table' && 'active']" @click="store.setViewMode('table')" title="Table view">☰</button>
      </div>
    </div>

    <LoadingSpinner v-if="store.loading" :full="true" label="Loading restaurants…" />

    <template v-else-if="store.restaurants.length === 0">
      <div class="empty-state">
        <div class="empty-icon">🍴</div>
        <h3>No restaurants yet</h3>
        <p>Add your first restaurant to get started.</p>
        <router-link to="/add" class="btn-primary">Add Restaurant</router-link>
      </div>
    </template>

    <template v-else-if="store.filtered.length === 0">
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No results for "{{ store.searchQuery }}"</h3>
        <p>Try a different search term.</p>
        <button class="btn-secondary" @click="store.searchQuery = ''">Clear search</button>
      </div>
    </template>

    <template v-else>
      <div v-if="store.viewMode === 'grid'" class="grid">
        <RestaurantCard
          v-for="r in store.paginated"
          :key="r.id"
          :r="r"
          @delete="confirmDelete(r)"
        />
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Fav</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in store.paginated" :key="r.id">
              <td class="id-cell">#{{ r.id }}</td>
              <td>
                <span class="clickable" @click="$router.push({ name: 'RestaurantDetail', params: { id: r.id } })">{{ r.name }}</span>
              </td>
              <td>{{ r.contact }}</td>
              <td>{{ r.address }}</td>
              <td>
                <button class="fav-inline" @click="store.toggleFavorite(String(r.id))">
                  {{ store.isFavorite(String(r.id)) ? '❤️' : '🤍' }}
                </button>
              </td>
              <td class="actions-cell">
                <router-link :to="{ name: 'Update', params: { id: r.id } }" class="link-btn">Edit</router-link>
                <button class="del-btn" @click="confirmDelete(r)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="store.totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="store.currentPage <= 1" @click="store.currentPage--">← Prev</button>
        <span class="page-info">Page {{ store.currentPage }} of {{ store.totalPages }}</span>
        <button class="page-btn" :disabled="store.currentPage >= store.totalPages" @click="store.currentPage++">Next →</button>
      </div>
    </template>

    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>Delete Restaurant?</h3>
        <p>Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" @click="doDelete">Delete</button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import RestaurantCard from '../components/RestaurantCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useRestaurantStore } from '../stores/restaurantStore'
import { useToast } from '../composables/useToast'

const store = useRestaurantStore()
const toast = useToast()
const deleteTarget = ref(null)

onMounted(() => store.fetchAll())

function confirmDelete(r) { deleteTarget.value = r }

async function doDelete() {
  const name = deleteTarget.value.name
  const ok = await store.remove(deleteTarget.value.id)
  deleteTarget.value = null
  if (ok) toast.success(`"${name}" deleted successfully`)
  else toast.error('Failed to delete restaurant')
}
</script>

<style scoped>
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
}
.page-title { margin: 0; font-size: 1.8rem; font-weight: 800; color: var(--text); }
.page-sub { margin: 4px 0 0; color: var(--text-muted); font-size: .9rem; }

.toolbar {
  display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; align-items: center;
}
.search-wrap {
  flex: 1; min-width: 200px; position: relative; display: flex; align-items: center;
}
.search-icon { position: absolute; left: 12px; font-size: .95rem; pointer-events: none; }
.search-input {
  width: 100%; padding: 10px 14px 10px 36px; border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--surface); color: var(--text); font-size: .9rem; transition: border-color .15s; box-sizing: border-box;
}
.search-input:focus { outline: none; border-color: var(--primary); }
.clear-btn {
  position: absolute; right: 10px; background: none; border: none; cursor: pointer;
  color: var(--text-muted); font-size: .9rem; padding: 4px;
}
.view-toggle { display: flex; gap: 4px; }
.toggle-btn {
  width: 38px; height: 38px; border: 1.5px solid var(--border); background: var(--surface);
  border-radius: 8px; cursor: pointer; font-size: 1.1rem; color: var(--text-muted); transition: all .15s;
}
.toggle-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }

.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid var(--border); background: var(--surface); }
.table { width: 100%; border-collapse: collapse; }
.table th {
  background: var(--bg); padding: 12px 16px; text-align: left; font-size: .78rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); border-bottom: 1px solid var(--border);
}
.table td { padding: 13px 16px; border-bottom: 1px solid var(--border); font-size: .9rem; color: var(--text); }
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover { background: var(--bg); }
.id-cell { color: var(--text-muted); font-size: .8rem; }
.clickable { cursor: pointer; font-weight: 600; color: var(--primary); }
.clickable:hover { text-decoration: underline; }
.fav-inline { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 2px; }
.actions-cell { display: flex; gap: 8px; align-items: center; }
.link-btn { color: var(--primary); font-weight: 600; text-decoration: none; font-size: .85rem; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--primary); }
.link-btn:hover { background: var(--primary); color: #fff; }
.del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: .85rem; font-weight: 600; transition: all .15s; }
.del-btn:hover { background: #ef4444; color: #fff; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 28px; }
.page-btn { padding: 8px 18px; border: 1.5px solid var(--border); background: var(--surface); color: var(--text); border-radius: 8px; cursor: pointer; font-size: .9rem; font-weight: 600; transition: all .15s; }
.page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-info { font-size: .9rem; color: var(--text-muted); }

.empty-state { text-align: center; padding: 80px 24px; color: var(--text-muted); }
.empty-icon { font-size: 4rem; margin-bottom: 16px; }
.empty-state h3 { margin: 0 0 8px; font-size: 1.2rem; color: var(--text); }
.empty-state p { margin: 0 0 20px; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex;
  align-items: center; justify-content: center; z-index: 500; padding: 16px;
}
.modal {
  background: var(--surface); border-radius: 16px; padding: 28px; max-width: 380px; width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
}
.modal h3 { margin: 0 0 10px; font-size: 1.2rem; color: var(--text); }
.modal p { margin: 0 0 24px; color: var(--text-muted); font-size: .9rem; line-height: 1.5; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

.btn-primary { padding: 10px 20px; background: var(--primary); color: #fff; border: none; border-radius: 10px; font-size: .9rem; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: opacity .15s; }
.btn-primary:hover { opacity: .88; }
.btn-secondary { padding: 10px 20px; background: var(--bg); color: var(--text); border: 1.5px solid var(--border); border-radius: 10px; font-size: .9rem; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-secondary:hover { border-color: var(--primary); color: var(--primary); }
.btn-danger { padding: 10px 20px; background: #ef4444; color: #fff; border: none; border-radius: 10px; font-size: .9rem; font-weight: 700; cursor: pointer; transition: opacity .15s; }
.btn-danger:hover { opacity: .88; }
</style>
