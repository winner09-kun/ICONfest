<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import studentImg from '@/assets/images/student-hero.webp'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import HeroBackdrop from '@/components/decor/HeroBackdrop.vue'
import LoginCard from '@/components/auth/LoginCard.vue'
import RegisterCard from '@/components/auth/RegisterCard.vue'

const route = useRoute()
const isLogin = computed(() => route.path === '/login' || route.name === 'login')

// Animasi transisi terarah (directional slide + fade)
const transitionName = ref('auth-card-forward')

watch(
  () => route.path,
  (to, from) => {
    if (to === '/daftar' && from === '/login') {
      transitionName.value = 'auth-card-forward'
    } else if (to === '/login' && from === '/daftar') {
      transitionName.value = 'auth-card-backward'
    } else {
      transitionName.value = to === '/daftar' ? 'auth-card-forward' : 'auth-card-backward'
    }
  },
  { immediate: true }
)
</script>

<template>
  <!-- Struktur sengaja sama dengan HeroSection landing: latar, header/logo, ukuran judul, container -->
  <main class="relative isolate overflow-x-clip bg-white pb-28 sm:pb-16 sm:min-h-[70vw] lg:min-h-[68vw]">
    <HeroBackdrop />

    <header class="relative z-20 mx-auto max-w-[1280px] px-5 pt-4 sm:px-10 sm:pt-6">
      <BrandLogo />
    </header>

    <div class="mx-auto mt-10 grid max-w-[1280px] items-start gap-10 px-5 sm:mt-12 sm:px-10 lg:mt-8 lg:grid-cols-2 lg:gap-8">
      <div class="text-white pt-2 sm:pt-4 lg:pt-14">
        <h1 class="text-[7.2vw] font-bold leading-[1.3] sm:text-5xl lg:whitespace-nowrap lg:text-[clamp(2.5rem,4.2vw,3.75rem)]">
          Permudah Anda<br />Membuat Kuis
        </h1>

        <!-- di mockup login, foto dicerminkan (menghadap ke kartu) -->
        <img
          :src="studentImg"
          alt="Mahasiswa membaca buku"
          class="mt-6 hidden w-[20rem] -scale-x-100 lg:ml-[6vw] lg:block xl:w-[22rem]"
          style="mask-image: linear-gradient(to bottom, #000 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent 100%)"
        />
      </div>

      <div class="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto lg:max-w-none">
        <Transition :name="transitionName" mode="out-in">
          <LoginCard v-if="isLogin" key="login" />
          <RegisterCard v-else key="register" />
        </Transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Transisi kartu Login -> Daftar (slide ke kiri) */
.auth-card-forward-enter-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}
.auth-card-forward-leave-active {
  transition: opacity 0.16s cubic-bezier(0.4, 0, 1, 1),
              transform 0.16s cubic-bezier(0.4, 0, 1, 1);
  will-change: opacity, transform;
}
.auth-card-forward-enter-from {
  opacity: 0;
  transform: translateX(24px) scale(0.98);
}
.auth-card-forward-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.98);
}

/* Transisi kartu Daftar -> Login (slide ke kanan) */
.auth-card-backward-enter-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}
.auth-card-backward-leave-active {
  transition: opacity 0.16s cubic-bezier(0.4, 0, 1, 1),
              transform 0.16s cubic-bezier(0.4, 0, 1, 1);
  will-change: opacity, transform;
}
.auth-card-backward-enter-from {
  opacity: 0;
  transform: translateX(-24px) scale(0.98);
}
.auth-card-backward-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.98);
}

/* Aksesibilitas: reduksi gerak bagi pengguna yang mengaktifkan preferensi reduced motion */
@media (prefers-reduced-motion: reduce) {
  .auth-card-forward-enter-active,
  .auth-card-forward-leave-active,
  .auth-card-backward-enter-active,
  .auth-card-backward-leave-active {
    transition: opacity 0.15s ease !important;
    transform: none !important;
  }
}
</style>
