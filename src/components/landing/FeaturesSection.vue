<script setup>
import { features } from '@/data/features'
import FeatureCard from '@/components/ui/FeatureCard.vue'
</script>

<template>
  <section id="fitur" class="relative mx-auto max-w-[1280px] px-5 pb-24 sm:px-10">
    <h2 class="text-center text-3xl font-bold text-[#222222] sm:text-4xl">
      Fitur-Fitur yang Siap Membantu Anda
    </h2>
    <div class="mt-20 grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4">
      <FeatureCard v-for="f in features" :key="f.title" :feature="f" />
    </div>
  </section>
</template>
