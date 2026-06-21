import { reactive } from 'vue'

const toasts = reactive([])
let id = 0

export function useToast() {
  function show(message, type = 'info', duration = 3500) {
    const toast = { id: id++, message, type }
    toasts.push(toast)
    setTimeout(() => {
      const i = toasts.findIndex(t => t.id === toast.id)
      if (i !== -1) toasts.splice(i, 1)
    }, duration)
  }

  return {
    toasts,
    success: (msg, d) => show(msg, 'success', d),
    error: (msg, d) => show(msg, 'error', d),
    info: (msg, d) => show(msg, 'info', d),
    warning: (msg, d) => show(msg, 'warning', d),
    dismiss: (toastId) => {
      const i = toasts.findIndex(t => t.id === toastId)
      if (i !== -1) toasts.splice(i, 1)
    }
  }
}
