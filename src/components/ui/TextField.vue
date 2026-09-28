<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: undefined },
})
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 block text-xs font-medium text-[#777777] sm:text-sm">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :autocomplete="autocomplete"
      required
      class="h-12 w-full rounded-lg border border-[#8a8a8a] bg-white px-4 text-sm text-[#222222] outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/25 sm:h-14 sm:text-base"
    />
  </div>
</template>
