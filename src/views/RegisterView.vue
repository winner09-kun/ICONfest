<script setup>
import studentImg from '@/assets/images/student-hero.webp'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import HeroBackdrop from '@/components/decor/HeroBackdrop.vue'
import RegisterCard from '@/components/auth/RegisterCard.vue'
</script>

<template>
  <!-- Struktur sengaja sama dengan HeroSection landing: latar, header/logo, ukuran judul, container -->
  <main class="relative isolate overflow-x-clip bg-white pb-28 sm:pb-16 sm:min-h-[70vw] lg:min-h-[68vw]">
    <HeroBackdrop />

    <header class="relative z-20 mx-auto max-w-[1280px] px-5 pt-2 sm:px-10">
      <BrandLogo />
    </header>

    <div class="mx-auto mt-8 grid max-w-[1280px] items-start gap-10 px-5 sm:px-10 lg:mt-4 lg:grid-cols-2 lg:gap-8">
      <div class="text-white lg:pt-10">
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
        <RegisterCard />
      </div>
    </div>
  </main>
</template>
