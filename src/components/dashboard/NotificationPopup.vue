<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconBell from '@/components/icons/IconBell.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  notifications: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: 'Tugas Baru Diterbitkan',
        desc: 'Tugas Pemrograman Perangkat Bergerak telah ditambahkan.',
        time: '10 menit lalu',
        read: false,
      },
      {
        id: 2,
        title: 'Hasil Evaluasi Kuis Keluar',
        desc: 'Nilai esai otomatis Anda untuk Bab 3 sudah selesai dihitung.',
        time: '1 jam lalu',
        read: false,
      },
      {
        id: 3,
        title: 'Pengumuman Kelas',
        desc: 'Pertemuan esok hari akan berlangsung daring via Google Meet.',
        time: 'Kemarin',
        read: true,
      },
    ],
  },
})

const emit = defineEmits(['update:open', 'mark-all-read', 'clear-all'])

const panelRef = ref(null)

function close() {
  emit('update:open', false)
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

function onClickOutside(e) {
  if (panelRef.value && !panelRef.value.contains(e.target)) close()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onKeydown)
      window.addEventListener('mousedown', onClickOutside)
    } else {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('mousedown', onClickOutside)
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('mousedown', onClickOutside)
})
</script>

<template>
  <Transition name="np-backdrop">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] sm:hidden" aria-hidden="true" />
  </Transition>

  <Transition name="np-panel">
    <div
      v-if="open"
      ref="panelRef"
      class="absolute right-0 top-[calc(100%+10px)] z-50 w-[88vw] max-w-[340px] origin-top-right rounded-[28px] border border-[#e3e3e3] bg-white p-4 shadow-[0_18px_40px_-12px_rgba(34,34,34,0.25)] sm:w-[340px]"
      role="dialog"
      aria-modal="true"
      aria-label="Pemberitahuan Notifikasi"
    >
      <!-- Header popup -->
      <div class="flex items-center justify-between pb-3">
        <div class="flex items-center gap-2">
          <span class="text-[16px] font-semibold text-[#222222]">Notifikasi</span>
          <span
            v-if="notifications.some((n) => !n.read)"
            class="flex h-5 items-center justify-center rounded-full bg-[#2864E8]/10 px-2 text-[11px] font-semibold text-[#2864E8]"
          >
            {{ notifications.filter((n) => !n.read).length }} Baru
          </span>
        </div>

        <button
          type="button"
          class="flex size-7 cursor-pointer items-center justify-center rounded-full text-[#222222] transition hover:bg-black/5 hover:rotate-90"
          aria-label="Tutup"
          @click="close"
        >
          <IconClose class="size-4" />
        </button>
      </div>

      <!-- Card List Container -->
      <div class="overflow-hidden rounded-2xl border border-[#e3e3e3]">
        <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-8 text-center text-[#767676]">
          <IconBell class="mb-2 size-8 text-[#bdbdbd]" />
          <p class="text-[13px]">Belum ada notifikasi baru</p>
        </div>

        <div v-else class="max-h-[280px] divide-y divide-[#e3e3e3] overflow-y-auto">
          <div
            v-for="(item, idx) in notifications"
            :key="item.id"
            class="np-row flex cursor-pointer items-start gap-3 p-3.5 text-left transition hover:bg-black/[0.02]"
            :class="{ 'bg-[#f4f7ff]/70': !item.read }"
            :style="{ '--np-delay': `${40 + idx * 40}ms` }"
            @click="item.read = true"
          >
            <span
              class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full"
              :class="item.read ? 'bg-[#EDEFF3] text-[#5B5F6B]' : 'bg-[#2864E8]/15 text-[#2864E8]'"
            >
              <IconBell class="size-4" />
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <p class="truncate text-[13px] font-semibold text-[#222222]">
                  {{ item.title }}
                </p>
                <span v-if="!item.read" class="size-2 shrink-0 rounded-full bg-[#2864E8]" />
              </div>
              <p class="mt-0.5 text-[12px] leading-relaxed text-[#666666] line-clamp-2">
                {{ item.desc }}
              </p>
              <p class="mt-1 text-[10px] text-[#999999]">{{ item.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <button
        v-if="notifications.length > 0"
        type="button"
        class="np-row mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#e3e3e3] py-2.5 text-center transition hover:bg-black/[0.03]"
        style="--np-delay: 180ms"
        @click="emit('mark-all-read')"
      >
        <span class="text-[13px] font-medium text-[#2864E8]">Tandai Semua Sudah Dibaca</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade */
.np-backdrop-enter-active,
.np-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.np-backdrop-enter-from,
.np-backdrop-leave-to {
  opacity: 0;
}

/* Panel: soft pop + slide matching ProfilePopup */
.np-panel-enter-active {
  transition:
    opacity 0.22s ease-out,
    transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.np-panel-leave-active {
  transition:
    opacity 0.15s ease-in,
    transform 0.18s ease-in;
}
.np-panel-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}
.np-panel-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-6px);
}

/* Rows cascade in */
.np-row {
  animation: np-row-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--np-delay, 0ms);
}
@keyframes np-row-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .np-panel-enter-active,
  .np-panel-leave-active,
  .np-row {
    transition: none !important;
    animation: none !important;
  }
}
</style>
