<script setup lang="ts">
import introImg from '@/assets/images/student-intro.webp'
import wave from '@/assets/wave.svg'
import DotPattern from '@/components/decor/DotPattern.vue'
</script>

<template>
  <section class="relative overflow-x-clip">
    <div class="relative mx-auto max-w-[1280px] px-5 pb-24 pt-12 sm:px-10 lg:pt-16">
      <h2 class="max-w-xl text-3xl font-bold leading-snug text-[#222222] sm:text-4xl">
        Platform Konsistensi Nilai Esai dan Mengeliminasi Subjektif
      </h2>

      <div class="relative mt-8 w-72 sm:w-96">
        <div class="absolute -top-2 left-2 h-1/3 w-1/2"><DotPattern id="dots-intro" /></div>
        <!-- lingkaran biru = sama besar dengan foto (foto sudah dipotong bulat) -->
        <div class="absolute bottom-0 left-0 aspect-square w-full rounded-full bg-[#2864E8]" />
        <svg class="absolute right-0 top-1/4 w-1/3" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <path d="M50 4L96 92H4Z" fill="#162B55" />
          <path d="M60 2L100 84H56" stroke="#2864E8" stroke-width="2" />
        </svg>
        <img :src="introImg" alt="Mahasiswa merayakan hasil belajar" class="relative w-full" />
      </div>
    </div>

    <!-- Dekorasi gelombang di tepi kanan, menjorok ke section fitur -->
    <img
      :src="wave"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute -right-8 bottom-[-9rem] hidden w-[24rem] select-none md:block lg:-right-4 lg:w-[30vw] lg:max-w-[34rem]"
    />
  </section>
</template>
