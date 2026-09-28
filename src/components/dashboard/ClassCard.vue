<script setup>
defineProps({
  title: { type: String, required: true },
  major: { type: String, required: true },
  lecturer: { type: String, required: true },
})
</script>

<template>
  <article
    class="flex min-h-[200px] cursor-pointer flex-col rounded-lg border border-[#888888] bg-white p-5 shadow-[3px_3px_4px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[4px_5px_8px_rgba(0,0,0,0.3)] sm:min-h-[230px] lg:min-h-[255px] lg:p-6"
  >
    <h3 class="text-xl font-medium leading-snug text-black lg:text-2xl">{{ title }}</h3>
    <p class="mt-1 text-sm text-[#808080] lg:text-[15px]">{{ major }}</p>

    <div class="mt-auto flex items-center gap-2.5 pt-6">
      <!-- avatar placeholder -->
      <svg class="size-[30px] shrink-0" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r="15" fill="#D9D9D9" />
        <circle cx="15" cy="12" r="5" fill="#8a8a8a" />
        <path d="M5.5 25c1.2-4.2 5-6.5 9.5-6.5s8.3 2.3 9.5 6.5A15 15 0 0 1 15 30a15 15 0 0 1-9.5-5z" fill="#8a8a8a" />
      </svg>
      <span class="text-sm font-medium text-[#666666] lg:text-[15px]">{{ lecturer }}</span>
    </div>
  </article>
</template>
