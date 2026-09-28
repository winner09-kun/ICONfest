<script setup lang="ts">
import logo from '@/assets/logo.svg'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <header class="relative z-20 mx-auto flex max-w-[1280px] items-center justify-between px-5 pt-2 sm:px-10">
    <a href="#" aria-label="KeyQuiz">
      <img :src="logo" alt="KeyQuiz" class="-my-8 w-44 sm:w-56" />
    </a>
    <BaseButton class="!px-8 !py-2.5">Masuk</BaseButton>
  </header>
</template>
