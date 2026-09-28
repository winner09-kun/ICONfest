<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import IconUserCircle from '@/components/icons/IconUserCircle.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconSignOut from '@/components/icons/IconSignOut.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconGoogle from '@/components/icons/IconGoogle.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  name: { type: String, default: 'Nama' },
  email: { type: String, default: 'Email@gmail.com' },
})

const emit = defineEmits(['update:open', 'add-account', 'sign-out', 'manage-google'])

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

// Only listen while the popup is actually open.
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onKeydown)
      // mousedown (not click) so the same click that opens the popup can't also close it
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
  <Transition name="pp-backdrop">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] sm:hidden" aria-hidden="true" />
  </Transition>

  <Transition name="pp-panel">
    <div
      v-if="open"
      ref="panelRef"
      class="absolute right-0 top-[calc(100%+10px)] z-50 w-[88vw] max-w-[300px] origin-top-right rounded-[28px] border border-[#e3e3e3] bg-white p-3.5 shadow-[0_18px_40px_-12px_rgba(34,34,34,0.25)] sm:w-[300px]"
      role="dialog"
      aria-modal="true"
      aria-label="Menu profil"
    >
      <!-- Close -->
      <button
        type="button"
        class="pp-row absolute right-3.5 top-3.5 flex size-7 cursor-pointer items-center justify-center rounded-full text-[#222222] transition hover:bg-black/5 hover:rotate-90"
        style="--pp-delay: 0ms"
        aria-label="Tutup"
        @click="close"
      >
        <IconClose class="size-4" />
      </button>

      <!-- Account card -->
      <div class="mt-8 overflow-hidden rounded-2xl border border-[#e3e3e3]">
        <div class="pp-row flex items-center gap-3 px-4 py-3.5" style="--pp-delay: 40ms">
          <IconUserCircle class="size-11 shrink-0 text-[#222222]" />
          <div class="min-w-0">
            <p class="truncate text-[15px] font-semibold text-[#222222]">{{ name }}</p>
            <p class="truncate text-[13px] font-normal text-[#767676]">{{ email }}</p>
          </div>
        </div>

        <div class="h-px bg-[#e3e3e3]" />

        <button
          type="button"
          class="pp-row flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-black/[0.03]"
          style="--pp-delay: 90ms"
          @click="emit('add-account')"
        >
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EDEFF3] text-[#5B5F6B]">
            <IconPlus class="size-3.5" />
          </span>
          <span class="text-[14px] font-medium text-[#222222]">Tambahkan Akun</span>
        </button>

        <div class="h-px bg-[#e3e3e3]" />

        <button
          type="button"
          class="pp-row flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition hover:bg-black/[0.03]"
          style="--pp-delay: 140ms"
          @click="emit('sign-out')"
        >
          <IconSignOut class="size-[26px] shrink-0 text-[#222222]" />
          <span class="text-[14px] font-medium text-[#222222]">Keluar dari semua akun</span>
        </button>
      </div>

      <!-- Manage Google account -->
      <button
        type="button"
        class="pp-row mt-3 flex w-full cursor-pointer items-center gap-3 rounded-full border border-[#e3e3e3] px-4 py-3 text-left transition hover:bg-black/[0.03]"
        style="--pp-delay: 190ms"
        @click="emit('manage-google')"
      >
        <IconGoogle class="size-[18px] shrink-0" />
        <span class="text-[14px] font-medium text-[#222222]">Kelola Akun Google Anda</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade (mobile only, since desktop closes via outside click without a dimmer) */
.pp-backdrop-enter-active,
.pp-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.pp-backdrop-enter-from,
.pp-backdrop-leave-to {
  opacity: 0;
}

/* Panel: soft pop + slide from the profile icon, gentle overshoot on the way in */
.pp-panel-enter-active {
  transition:
    opacity 0.22s ease-out,
    transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pp-panel-leave-active {
  transition:
    opacity 0.15s ease-in,
    transform 0.18s ease-in;
}
.pp-panel-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}
.pp-panel-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-6px);
}

/* Rows cascade in just after the panel starts appearing */
.pp-row {
  animation: pp-row-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--pp-delay, 0ms);
}
@keyframes pp-row-in {
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
  .pp-panel-enter-active,
  .pp-panel-leave-active,
  .pp-row {
    transition: none !important;
    animation: none !important;
  }
}
</style>
