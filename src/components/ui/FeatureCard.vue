<script setup>
defineProps({ feature: { type: Object, required: true } })
</script>

<template>
  <article class="relative mt-9 rounded-2xl px-3 pb-5 pt-9 sm:mt-10 sm:px-4 sm:pb-7 sm:pt-12 text-center" :class="feature.cardClass">
    <div
      class="absolute -top-7 left-1/2 grid size-14 sm:-top-10 sm:size-20 -translate-x-1/2 place-items-center rounded-full"
      :class="feature.iconClass"
    >
      <img :src="feature.icon" :alt="feature.title" class="size-8 sm:size-11" />
    </div>
    <h3 class="text-sm font-bold sm:text-base text-[#222222]">{{ feature.title }}</h3>
    <p class="mx-auto mt-1.5 max-w-[13rem] text-xs sm:mt-2 sm:text-sm text-[#222222]">{{ feature.description }}</p>
  </article>
</template>
