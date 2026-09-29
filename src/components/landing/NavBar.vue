<script setup>
import BrandLogo from '@/components/ui/BrandLogo.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <header class="relative z-20 mx-auto flex max-w-[1280px] items-center justify-between px-5 pt-4 sm:px-10 sm:pt-6">
    <BrandLogo />
    <!-- di mobile tombol berada di atas area biru, jadi diberi outline putih -->
    <BaseButton to="/login" class="border-2 border-white !px-8 !py-2.5 sm:border-transparent">Masuk</BaseButton>
  </header>
</template>
