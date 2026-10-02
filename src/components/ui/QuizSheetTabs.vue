<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select'])

const tabs = [
  { id: 'questions', label: 'Lembar Soal' },
  { id: 'results', label: 'Lembar Hasil' },
]
</script>

<template>
  <div
    class="grid grid-cols-2 gap-1 rounded-xl border border-white bg-white p-1 shadow-sm"
    role="tablist"
    aria-label="Lembar soal dan hasil"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :aria-selected="activeTab === tab.id"
      class="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold transition sm:text-base"
      :class="
        activeTab === tab.id
          ? 'bg-[linear-gradient(90deg,#2563EB_0%,#808080_100%)] text-white shadow-sm'
          : 'text-[#808080] hover:bg-slate-50'
      "
      @click="emit('select', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
