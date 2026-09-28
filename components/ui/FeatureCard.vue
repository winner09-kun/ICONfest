<script setup lang="ts">
import type { Feature } from '@/data/features'
defineProps<{ feature: Feature }>()
</script>

<template>
  <article class="relative mt-10 rounded-2xl px-4 pb-7 pt-12 text-center" :class="feature.cardClass">
    <div
      class="absolute -top-10 left-1/2 grid size-20 -translate-x-1/2 place-items-center rounded-full"
      :class="feature.iconClass"
    >
      <img :src="feature.icon" :alt="feature.title" class="size-11" />
    </div>
    <h3 class="text-base font-bold text-ink">{{ feature.title }}</h3>
    <p class="mx-auto mt-2 max-w-[13rem] text-sm text-ink">{{ feature.description }}</p>
  </article>
</template>
