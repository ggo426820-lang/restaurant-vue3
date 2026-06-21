<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['toast', `toast--${t.type}`]"
          @click="dismiss(t.id)"
        >
          <span class="toast-icon">{{ icons[t.type] }}</span>
          <span class="toast-msg">{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'
const { toasts, dismiss } = useToast()
const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,.15);
  font-size: .9rem;
  font-weight: 500;
  cursor: pointer;
  pointer-events: all;
  max-width: 340px;
  color: #fff;
}
.toast--success { background: #10b981; }
.toast--error { background: #ef4444; }
.toast--info { background: #6366f1; }
.toast--warning { background: #f59e0b; }

.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(100%); opacity: 0; }
</style>
