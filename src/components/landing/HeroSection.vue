<script setup>
import heroImg from '@/assets/images/student-hero.webp'
import NavBar from './NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DotPattern from '@/components/decor/DotPattern.vue'
import HeroBackdrop from '@/components/decor/HeroBackdrop.vue'
</script>

<template>
  <!-- overflow-x-clip: hanya potong sisi kiri/kanan, bagian bawah lingkaran tetap utuh -->
  <section class="relative isolate overflow-x-clip bg-white pb-16 sm:min-h-[70vw] lg:min-h-[68vw]">
    <HeroBackdrop />

    <NavBar />

    <div class="mx-auto mt-10 grid max-w-[1280px] items-start gap-10 px-5 sm:mt-12 sm:px-10 lg:mt-8 lg:grid-cols-[1.5fr_1fr]">
      <div class="text-white pt-2 sm:pt-4 lg:pt-14">
        <h1 class="text-[7.2vw] font-bold leading-[1.3] sm:text-5xl lg:whitespace-nowrap lg:text-[clamp(2.5rem,4.2vw,3.75rem)]">
          Esai Tepat<br />Nilai Cepat<br />Evaluasi Hemat Waktu
        </h1>
        <p class="mt-4 max-w-xl text-[3.4vw] leading-relaxed sm:text-sm">
          Platform PJJ terpadu yang memadukan ekosistem pembelajaran jarak jauh dengan AI Assessment Engine untuk
          mengeliminasi subjektivitas, menjaga konsistensi nilai esai, dan memangkas waktu koreksi secara signifikan.
        </p>
        <BaseButton to="/login" variant="outline" arrow class="mt-6">Mulai Sekarang</BaseButton>
      </div>

      <div class="relative mx-auto w-[58vw] sm:w-72 lg:ml-auto lg:mr-0 lg:w-[20rem]">
        <div class="absolute -right-6 top-6 h-2/3 w-1/2 sm:-right-10"><DotPattern id="dots-hero" /></div>
        <!-- ukuran & posisi pakai persen dari lebar foto, jadi ikut mengecil/membesar -->
        <div class="absolute -left-[20%] bottom-[22%] aspect-square w-[36%] rounded-full border-2 border-[#2864E8]" />
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
