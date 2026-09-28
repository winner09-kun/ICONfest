<script setup lang="ts">
withDefaults(defineProps<{ id?: string; size?: number }>(), { id: 'dots', size: 14 })
</script>

<template>
  <svg class="h-full w-full" aria-hidden="true">
    <defs>
      <pattern :id="id" :width="size" :height="size" patternUnits="userSpaceOnUse">
        <circle :cx="size / 2" :cy="size / 2" r="1.8" fill="#222222" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${id})`" />
  </svg>
</template>
