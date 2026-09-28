<script setup lang="ts">
import heroImg from '@/assets/images/student-hero.webp'
import NavBar from './NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DotPattern from '@/components/decor/DotPattern.vue'
</script>

<template>
  <!-- overflow-x-clip: hanya potong sisi kiri/kanan, bagian bawah lingkaran tetap utuh -->
  <section class="relative isolate overflow-x-clip bg-white pb-16 sm:min-h-[70vw] lg:min-h-[68vw]">
    <!-- Background organik biru -->
    <div class="absolute -left-[45vw] -top-[55vw] -z-10 size-[145vw] rounded-full bg-[#2864E8] sm:-left-[43vw] sm:-top-[48vw] sm:size-[112vw]" />
    <div class="absolute -left-[35vw] -top-[45vw] -z-10 hidden size-[110vw] rounded-full bg-white/[0.08] sm:block" />
    <div class="absolute -left-[22vw] -top-[62vw] -z-10 size-[60vw] rounded-full bg-[#C2D4FF] sm:-left-[15vw] sm:-top-[38vw] sm:size-[52vw]" />

    <NavBar />

    <div class="mx-auto mt-8 grid max-w-[1280px] items-start gap-10 px-5 sm:px-10 lg:mt-4 lg:grid-cols-[1.35fr_1fr]">
      <div class="text-white lg:pt-10">
        <h1 class="text-4xl font-bold leading-[1.3] sm:text-5xl lg:text-[3.5rem]">
          Esai Tepat<br />Nilai Cepat<br />Evaluasi Hemat Waktu
        </h1>
        <p class="mt-4 max-w-xl text-xs leading-relaxed sm:text-sm">
          Platform PJJ terpadu yang memadukan ekosistem pembelajaran jarak jauh dengan AI Assessment Engine untuk
          mengeliminasi subjektivitas, menjaga konsistensi nilai esai, dan memangkas waktu koreksi secara signifikan.
        </p>
        <BaseButton variant="outline" arrow class="mt-6">Mulai Sekarang</BaseButton>
      </div>

      <div class="relative mx-auto w-60 sm:w-72 lg:ml-auto lg:mr-0 lg:w-[20rem]">
        <div class="absolute -right-6 top-6 h-2/3 w-1/2 sm:-right-10"><DotPattern id="dots-hero" /></div>
        <div class="absolute -left-10 bottom-10 size-24 rounded-full border-2 border-[#2864E8] bg-transparent" />
        <img
          :src="heroImg"
          alt="Mahasiswa membaca buku"
          class="relative w-full"
          style="mask-image: linear-gradient(to bottom, #000 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent 100%)"
        />
      </div>
    </div>
  </section>
</template>
