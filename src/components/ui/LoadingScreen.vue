<script setup>
import { onMounted } from 'vue'
import logo from '@/assets/logo.svg'
import { useLoading } from '@/composables/useLoading.js'

const { isLoading, loadingText, triggerLoading } = useLoading()

onMounted(() => {
  // Sembunyikan loading awal setelah aset selesai dimuat
  triggerLoading('Memuat KeyQuiz...', 700)
})
</script>

<template>
  <Transition name="loading-fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-4 select-none"
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
    >
      <div class="flex flex-col items-center text-center">
        <!-- Logo KeyQuiz dengan animasi subtle pulse -->
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-4 rounded-full bg-[#2864E8]/10 blur-xl animate-pulse" />
          <img
            :src="logo"
            alt="KeyQuiz"
            class="relative w-44 sm:w-56 transition-transform duration-500 animate-scale-pulse"
          />
        </div>

        <!-- Progress Bar Elegan -->
        <div class="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 sm:w-56">
          <div class="h-full rounded-full bg-gradient-to-r from-[#2864E8] to-[#5a8bf5] shadow-[0_0_8px_#2864E8] animate-progress-bar" />
        </div>

        <!-- Teks Keterangan Dinamis -->
        <p class="mt-4 text-xs font-medium tracking-wide text-[#777777] sm:text-sm">
          {{ loadingText }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.35s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

@keyframes progress-load {
  0% {
    width: 0%;
    transform: translateX(-10%);
  }
  50% {
    width: 75%;
    transform: translateX(0%);
  }
  100% {
    width: 100%;
    transform: translateX(0%);
  }
}

.animate-progress-bar {
  animation: progress-load 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes scale-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.animate-scale-pulse {
  animation: scale-pulse 1.8s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: opacity 0.15s ease !important;
  }
  .animate-progress-bar,
  .animate-scale-pulse {
    animation: none !important;
  }
}
</style>
