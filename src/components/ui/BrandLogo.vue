<script setup>
import logo from '@/assets/logo.svg'
</script>

<template>
  <RouterLink to="/" aria-label="KeyQuiz" class="inline-block">
    <img :src="logo" alt="KeyQuiz" class="relative top-3 -my-8 w-44 sm:top-4 sm:w-56" />
  </RouterLink>
</template>
