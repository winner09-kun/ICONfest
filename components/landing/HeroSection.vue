<script setup lang="ts">
import heroImg from '@/assets/images/student-hero.webp'
import NavBar from './NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DotPattern from '@/components/decor/DotPattern.vue'
</script>

<template>
  <section class="relative isolate overflow-hidden pb-16 lg:pb-24">
    <!-- Background organik biru -->
    <div class="absolute -left-[25vw] -top-[45vw] -z-10 size-[150vw] rounded-full bg-primary sm:-left-[43vw] sm:-top-[50vw] sm:size-[120vw]" />
    <div class="absolute -left-[30vw] -top-[60vw] -z-10 size-[80vw] rounded-full bg-[#C2D4FF] sm:-left-[20vw] sm:-top-[55vw] sm:size-[55vw]" />
    <div class="absolute -left-[45vw] -top-[35vw] -z-10 hidden size-[100vw] rounded-full bg-white/[0.06] sm:block" />

    <NavBar />

    <div class="mx-auto mt-6 grid max-w-[1280px] items-center gap-10 px-5 sm:px-10 lg:grid-cols-[1.25fr_1fr]">
      <div class="text-white">
        <h1 class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl lg:leading-[1.35]">
          Esai Tepat<br />Nilai Cepat<br />Evaluasi Hemat Waktu
        </h1>
        <p class="mt-4 max-w-xl text-xs leading-relaxed sm:text-sm">
          Platform PJJ terpadu yang memadukan ekosistem pembelajaran jarak jauh dengan AI Assessment Engine untuk
          mengeliminasi subjektivitas, menjaga konsistensi nilai esai, dan memangkas waktu koreksi secara signifikan.
        </p>
        <BaseButton variant="outline" arrow class="mt-6">Mulai Sekarang</BaseButton>
      </div>

      <div class="relative mx-auto w-64 sm:w-80 lg:ml-auto lg:mr-0 lg:w-[22rem]">
        <div class="absolute -right-6 top-6 h-2/3 w-1/2 sm:-right-10"><DotPattern id="dots-hero" /></div>
        <div class="absolute -left-8 bottom-16 size-28 rounded-full border-2 border-primary bg-transparent" />
        <img :src="heroImg" alt="Mahasiswa membaca buku" class="relative w-full" />
      </div>
    </div>
  </section>
</template>
