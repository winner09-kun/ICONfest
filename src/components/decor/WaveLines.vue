<script setup lang="ts">
const scales = [1, 0.88, 0.76, 0.64, 0.52, 0.4, 0.28, 0.16]
</script>

<template>
  <svg viewBox="0 0 400 420" fill="none" aria-hidden="true" class="h-full w-full">
    <path
      v-for="s in scales"
      :key="s"
      d="M200 20C300 0 380 80 340 160C300 240 380 300 300 360C220 420 100 380 80 300C60 220 120 200 100 120C80 60 130 30 200 20Z"
      stroke="#222222"
      stroke-width="1"
      :transform="`translate(${200 * (1 - s)} ${210 * (1 - s)}) scale(${s})`"
    />
  </svg>
</template>
