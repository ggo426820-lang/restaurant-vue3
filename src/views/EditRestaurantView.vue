<template>
  <DefaultLayout>
    <div class="form-page">
      <div class="form-header">
        <button class="back-btn" @click="$router.back()">← Back</button>
        <h1 class="form-title">Edit Restaurant</h1>
      </div>

      <LoadingSpinner v-if="loading" :full="true" label="Loading restaurant…" />

      <div v-else class="form-card">
        <form @submit.prevent="handleSubmit" class="form">
          <div class="field">
            <label>Restaurant Name *</label>
            <input v-model="form.name" type="text" placeholder="Restaurant name" required />
          </div>
          <div class="field">
            <label>Contact Number *</label>
            <input v-model="form.contact" type="text" placeholder="Contact number" required />
          </div>
          <div class="field">
            <label>Address *</label>
            <input v-model="form.address" type="text" placeholder="Address" required />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="$router.back()">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <span v-if="submitting" class="btn-spinner"></span>
              {{ submitting ? 'Saving…' : '💾 Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
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
const submitting = ref(false)
const form = reactive({ name: '', contact: '', address: '' })

onMounted(async () => {
  const data = await store.fetchById(route.params.id)
  if (data) {
    form.name = data.name
    form.contact = data.contact
    form.address = data.address
  } else {
    toast.error('Restaurant not found')
    router.push({ name: 'Home' })
  }
  loading.value = false
})

async function handleSubmit() {
  if (!form.name.trim() || !form.contact.trim() || !form.address.trim()) {
    toast.warning('All fields are required')
    return
  }
  submitting.value = true
  const ok = await store.update(route.params.id, {
    name: form.name.trim(),
    contact: form.contact.trim(),
    address: form.address.trim()
  })
  submitting.value = false
  if (ok) {
    toast.success('Restaurant updated successfully!')
    router.push({ name: 'Home' })
  } else {
    toast.error('Failed to update. Try again.')
  }
}
</script>

<style scoped>
.form-page { max-width: 580px; margin: 0 auto; }
.form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.back-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: .9rem; padding: 6px 0; }
.back-btn:hover { color: var(--primary); }
.form-title { margin: 0; font-size: 1.6rem; font-weight: 800; color: var(--text); }
.form-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
.form { display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: .85rem; font-weight: 600; color: var(--text); }
.field input { padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg); color: var(--text); font-size: .95rem; transition: border-color .15s; }
.field input:focus { outline: none; border-color: var(--primary); }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
.btn-primary { padding: 11px 24px; background: var(--primary); color: #fff; border: none; border-radius: 10px; font-size: .95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: opacity .15s; }
.btn-primary:hover:not(:disabled) { opacity: .88; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-secondary { padding: 11px 24px; background: var(--bg); color: var(--text); border: 1.5px solid var(--border); border-radius: 10px; font-size: .95rem; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-secondary:hover { border-color: var(--primary); color: var(--primary); }
.btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
