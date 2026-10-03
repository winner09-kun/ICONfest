<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  variant: { type: String, default: 'solid' }, // 'solid' | 'outline'
  arrow: { type: Boolean, default: false },
  to: { type: String, default: undefined },
})
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    class="motion-control inline-flex cursor-pointer items-center justify-center gap-3 rounded-full px-6 py-3 font-semibold text-white no-underline transition hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    :class="variant === 'solid' ? 'bg-[#2864E8] hover:bg-[#1f52c4]' : 'border border-white bg-transparent uppercase hover:bg-white/10'"
  >
    <slot />
    <svg v-if="arrow" width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
      <path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </component>
</template>
