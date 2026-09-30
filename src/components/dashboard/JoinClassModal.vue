<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  message: { type: String, default: '' },
  isError: { type: Boolean, default: true },
})

const emit = defineEmits(['update:open', 'join'])
const code = ref('')

function close() {
  emit('update:open', false)
}

function submit() {
  if (code.value.trim()) emit('join', code.value.trim())
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      code.value = ''
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-class-title"
        @click.self="close"
      >
        <div class="w-full max-w-[480px] overflow-hidden rounded-[20px] bg-white shadow-2xl animate-scale-up">
          <div class="relative flex items-center justify-center bg-[#2864E8] px-6 py-4.5">
            <h2 id="join-class-title" class="text-xl font-bold text-white sm:text-2xl">
              Gabung Kelas
            </h2>
            <button
              type="button"
              class="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-white/90 transition hover:text-white"
              aria-label="Tutup popup"
              @click="close"
            >
              <IconClose class="size-6" />
            </button>
          </div>

          <form class="p-6 sm:p-8" @submit.prevent="submit">
            <label for="class-code" class="mb-2 block text-sm font-medium text-[#444444] sm:text-base">
              Kode Kelas
            </label>
            <input
              id="class-code"
              v-model="code"
              type="text"
              required
              autocomplete="off"
              placeholder="Contoh: KQ-PBM01"
              class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm uppercase text-[#222222] outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:text-base"
            />
            <p v-if="message" class="mt-3 text-sm" :class="isError ? 'text-red-600' : 'text-green-700'" role="status">
              {{ message }}
            </p>
            <div class="mt-8 flex justify-end">
              <button
                type="submit"
                class="cursor-pointer rounded-xl bg-[#2864E8] px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#1f52c4] active:scale-95"
              >
                Gabung
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>