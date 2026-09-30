<script setup>
import { reactive, watch, onBeforeUnmount } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'
import { useAuth } from '@/composables/useAuth.js'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'create'])
const { user } = useAuth()

const form = reactive({
  title: '',
  major: '',
})

function close() {
  emit('update:open', false)
}

function handleSubmit() {
  if (!form.title.trim()) return

  emit('create', {
    title: form.title.trim(),
    major: form.major.trim() || 'Teknik Informatika',
    lecturer: user.value?.name || 'Fajerin Abdillah, M. Kom.',
  })

  // Reset formulir
  form.title = ''
  form.major = ''

  close()
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @click.self="close"
      >
        <div
          class="w-full max-w-[480px] overflow-hidden rounded-[20px] bg-white shadow-2xl transition-all animate-scale-up"
        >
          <!-- Header Biru (Sesuai Mockup Gambar) -->
          <div class="relative flex items-center justify-center bg-[#2864E8] px-6 py-4.5">
            <h2 id="modal-title" class="text-xl font-bold text-white tracking-wide sm:text-2xl">
              Buat Kelas
            </h2>
            <button
              type="button"
              class="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-white/90 transition hover:text-white hover:scale-110 active:scale-95"
              aria-label="Tutup popup"
              @click="close"
            >
              <IconClose class="size-6" />
            </button>
          </div>

          <!-- Body Formulir (Sesuai Mockup Gambar) -->
          <form class="p-6 sm:p-8" @submit.prevent="handleSubmit">
            <div class="space-y-4 sm:space-y-5">
              <!-- Field: Nama Kelas -->
              <div>
                <label for="nama-kelas" class="mb-2 block text-sm font-medium text-[#444444] sm:text-base">
                  Nama Kelas
                </label>
                <input
                  id="nama-kelas"
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Masukkan nama kelas"
                  class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-[#222222] outline-none transition placeholder:text-slate-400 focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-13 sm:text-base"
                />
              </div>

              <!-- Field: Deskripsi Kelas -->
              <div>
                <label for="deskripsi-kelas" class="mb-2 block text-sm font-medium text-[#444444] sm:text-base">
                  Deskripsi Kelas
                </label>
                <input
                  id="deskripsi-kelas"
                  v-model="form.major"
                  type="text"
                  placeholder="Contoh: Teknik Informatika / Biologi Dasar"
                  class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-[#222222] outline-none transition placeholder:text-slate-400 focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-13 sm:text-base"
                />
              </div>
            </div>

            <!-- Tombol Selesai di Kanan Bawah (Sesuai Mockup) -->
            <div class="mt-8 flex justify-end">
              <button
                type="submit"
                class="cursor-pointer rounded-xl bg-[#2864E8] px-8 py-3 text-base font-semibold text-white shadow-md transition duration-200 hover:bg-[#1f52c4] active:scale-95"
              >
                Selesai
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
