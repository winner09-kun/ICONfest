<script setup>
import { useRoute } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const route = useRoute()
</script>

<template>
  <DashboardLayout>
    <section class="grid min-h-[50vh] place-items-center rounded-[1.5rem] bg-white p-8 text-center sm:rounded-[2rem]">
      <div>
        <h1 class="text-2xl font-bold text-[#222222]">{{ route.meta.title }}</h1>
        <p class="mt-2 text-[#808080]">Halaman ini belum dibuat.</p>
      </div>
    </section>
  </DashboardLayout>
</template>
