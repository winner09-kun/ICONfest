<script setup>
import { computed, ref, watch } from 'vue'
import calendarIcon from '@/assets/icons/Date_range.svg'
import clockIcon from '@/assets/icons/Clock.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])
const deadlineDate = ref('')
const deadlineTime = ref('23:59')

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const minDate = computed(() => formatDate(new Date()))

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return

    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 14)
    deadlineDate.value = formatDate(defaultDate)
    deadlineTime.value = '23:59'
  },
)

function saveDeadline() {
  if (!deadlineDate.value || !deadlineTime.value) return
  emit('save', { date: deadlineDate.value, time: deadlineTime.value })
}
</script>

<template>
  <Transition name="deadline-modal">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deadline-title"
      @click.self="emit('close')"
    >
      <form
        class="w-full max-w-[800px] overflow-hidden rounded-2xl bg-white shadow-2xl"
        @submit.prevent="saveDeadline"
      >
        <header
          class="relative flex min-h-20 items-center justify-center bg-[linear-gradient(105deg,#2864E8_0%,#173C87_100%)] px-14 py-5 text-center text-white sm:min-h-[104px] sm:px-20"
        >
          <h2 id="deadline-title" class="text-xl font-bold sm:text-2xl">Tentukan Tenggat Waktu</h2>
          <button
            type="button"
            class="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-white transition hover:scale-110 sm:right-8 sm:size-12"
            aria-label="Tutup pengaturan tenggat waktu"
            @click="emit('close')"
          >
            <svg class="size-8 sm:size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </header>

        <div class="space-y-5 px-5 py-7 sm:px-10 sm:py-9">
          <label class="block">
            <span class="mb-2 block text-base font-medium text-[#888888] sm:text-2xl">Tanggal</span>
            <span class="relative block">
              <input
                v-model="deadlineDate"
                type="date"
                :min="minDate"
                required
                class="h-[68px] w-full rounded-2xl border border-[#888888] bg-white px-4 pr-14 text-lg font-medium text-black outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-[78px] sm:px-5 sm:pr-20 sm:text-2xl"
              />
              <img
                :src="calendarIcon"
                alt=""
                class="pointer-events-none absolute right-4 top-1/2 size-7 -translate-y-1/2 sm:right-7 sm:size-10"
              />
            </span>
          </label>

          <label class="block">
            <span class="mb-2 block text-base font-medium text-[#888888] sm:text-2xl">Waktu</span>
            <span class="relative block">
              <input
                v-model="deadlineTime"
                type="time"
                required
                class="h-[68px] w-full rounded-2xl border border-[#888888] bg-white px-4 pr-24 text-lg font-medium text-black outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-[78px] sm:px-5 sm:pr-36 sm:text-2xl"
              />
              <span
                class="pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 text-sm font-medium text-[#888888] sm:right-[76px] sm:text-lg"
              >
                WITA
              </span>
              <img
                :src="clockIcon"
                alt=""
                class="pointer-events-none absolute right-4 top-1/2 size-7 -translate-y-1/2 sm:right-7 sm:size-10"
              />
            </span>
          </label>

          <div class="flex justify-end pt-1 sm:pt-2">
            <button
              type="submit"
              class="min-h-14 w-full rounded-2xl bg-[#2864E8] px-10 text-lg font-semibold text-white transition hover:bg-[#1f50be] active:scale-[0.98] sm:min-h-[60px] sm:w-auto sm:min-w-[180px] sm:text-xl"
            >
              Selesai
            </button>
          </div>
        </div>
      </form>
    </div>
  </Transition>
</template>

<style scoped>
.deadline-modal-enter-active,
.deadline-modal-leave-active {
  transition: opacity 0.2s ease;
}

.deadline-modal-enter-from,
.deadline-modal-leave-to {
  opacity: 0;
}

input[type='date']::-webkit-calendar-picker-indicator,
input[type='time']::-webkit-calendar-picker-indicator {
  opacity: 0;
}
</style>
