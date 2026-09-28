<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: 'Pilih' },
  options: { type: Array, required: true }, // [{ value, label }]
})
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 block text-xs font-medium text-[#777777] sm:text-sm">{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        required
        class="h-12 w-full cursor-pointer appearance-none rounded-lg border border-[#8a8a8a] bg-white px-4 pr-11 text-sm outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/25 sm:h-14 sm:text-base"
        :class="model ? 'text-[#222222]' : 'text-[#777777]'"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o.value" :value="o.value" class="text-[#222222]">{{ o.label }}</option>
      </select>
      <svg
        class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#555555]"
        width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      >
        <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>
