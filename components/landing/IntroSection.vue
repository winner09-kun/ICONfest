<script setup lang="ts">
import introImg from '@/assets/images/student-intro.webp'
import DotPattern from '@/components/decor/DotPattern.vue'
import WaveLines from '@/components/decor/WaveLines.vue'
</script>

<template>
  <section class="relative mx-auto max-w-[1280px] px-5 pb-24 pt-10 sm:px-10 lg:pt-20">
    <h2 class="max-w-xl text-3xl font-bold leading-snug text-ink sm:text-4xl">
      Platform Konsistensi Nilai Esai dan Mengeliminasi Subjektif
    </h2>

    <div class="relative mt-8 w-72 sm:w-96">
      <div class="absolute -top-2 left-2 h-1/3 w-1/2"><DotPattern id="dots-intro" /></div>
      <div class="absolute bottom-2 left-0 aspect-square w-4/5 rounded-full bg-primary" />
      <!-- Segitiga dekoratif -->
      <svg class="absolute right-0 top-1/4 w-1/3" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <path d="M50 4L96 92H4Z" fill="#162B55" />
        <path d="M60 2L100 84H56" stroke="#2864E8" stroke-width="2" />
      </svg>
      <img :src="introImg" alt="Mahasiswa merayakan hasil belajar" class="relative w-full" />
    </div>

    <div class="pointer-events-none absolute -right-24 bottom-0 hidden h-[28rem] w-[26rem] md:block lg:-right-10 lg:h-[34rem] lg:w-[32rem]">
      <WaveLines />
    </div>
  </section>
</template>
