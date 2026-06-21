<template>
  <DefaultLayout>
    <div class="form-page">
      <div class="form-header">
        <button class="back-btn" @click="$router.back()">← Back</button>
        <h1 class="form-title">Add Restaurant</h1>
      </div>

      <div class="form-card">
        <form @submit.prevent="handleSubmit" class="form">
          <div class="field">
            <label>Restaurant Name *</label>
            <input v-model="form.name" type="text" placeholder="e.g. Pizza Palace" required />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>
          <div class="field">
            <label>Contact Number *</label>
            <input v-model="form.contact" type="text" placeholder="e.g. 0123456789" required />
            <span v-if="errors.contact" class="field-error">{{ errors.contact }}</span>
          </div>
          <div class="field">
            <label>Address *</label>
            <input v-model="form.address" type="text" placeholder="e.g. 123 Main St" required />
            <span v-if="errors.address" class="field-error">{{ errors.address }}</span>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="$router.back()">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <span v-if="submitting" class="btn-spinner"></span>
              {{ submitting ? 'Adding…' : '✅ Add Restaurant' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useRestaurantStore } from '../stores/restaurantStore'
import { useToast } from '../composables/useToast'

const store = useRestaurantStore()
const router = useRouter()
const toast = useToast()

const form = reactive({ name: '', contact: '', address: '' })
const errors = reactive({})
const submitting = ref(false)

function validate() {
  errors.name = form.name.trim() ? '' : 'Name is required'
  errors.contact = form.contact.trim() ? '' : 'Contact is required'
  errors.address = form.address.trim() ? '' : 'Address is required'
  return !errors.name && !errors.contact && !errors.address
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  const ok = await store.create({ name: form.name.trim(), contact: form.contact.trim(), address: form.address.trim() })
  submitting.value = false
  if (ok) {
    toast.success(`"${form.name}" added successfully!`)
    router.push({ name: 'Home' })
  } else {
    toast.error('Failed to add restaurant. Try again.')
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
.field input {
  padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--bg); color: var(--text); font-size: .95rem; transition: border-color .15s;
}
.field input:focus { outline: none; border-color: var(--primary); }
.field-error { color: #ef4444; font-size: .8rem; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
.btn-primary { padding: 11px 24px; background: var(--primary); color: #fff; border: none; border-radius: 10px; font-size: .95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: opacity .15s; }
.btn-primary:hover:not(:disabled) { opacity: .88; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-secondary { padding: 11px 24px; background: var(--bg); color: var(--text); border: 1.5px solid var(--border); border-radius: 10px; font-size: .95rem; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-secondary:hover { border-color: var(--primary); color: var(--primary); }
.btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
