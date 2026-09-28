<script setup lang="ts">
import { features } from '@/data/features'
import FeatureCard from '@/components/ui/FeatureCard.vue'
</script>

<template>
  <section class="relative mx-auto max-w-[1280px] px-5 pb-24 sm:px-10">
    <h2 class="text-center text-3xl font-bold text-ink sm:text-4xl">Fitur-Fitur yang Siap Membantu Anda</h2>
    <div class="mt-10 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      <FeatureCard v-for="f in features" :key="f.title" :feature="f" />
    </div>
  </section>
</template>
