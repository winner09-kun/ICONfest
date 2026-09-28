<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ClassCard from '@/components/dashboard/ClassCard.vue'
import { classes } from '@/data/classes.js'

// TODO: tambah kelas (modal / halaman baru) setelah backend siap.
function addClass() {
  /* belum ada logic */
}
</script>

<template>
  <DashboardLayout>
    <div class="space-y-4 sm:space-y-[22px]">
      <!-- Banner (di desain masih kosong; slot untuk ringkasan/pengumuman) -->
      <section class="flex min-h-[140px] items-center rounded-[1.5rem] bg-white p-6 sm:min-h-[200px] sm:rounded-[2rem] sm:p-10 lg:h-[245px]">
        <div>
          <h1 class="text-xl font-bold text-[#222222] sm:text-3xl">Selamat datang di KeyQuiz</h1>
          <p class="mt-1 text-sm text-[#808080] sm:text-base">Kelola kelas dan kuis kamu di satu tempat.</p>
        </div>
      </section>

      <!-- Kelas -->
      <section class="rounded-[1.5rem] bg-white p-4 sm:rounded-[2rem] sm:p-7 lg:p-[35px]">
        <div class="mb-4 flex items-center justify-between sm:mb-5">
          <h2 class="text-lg font-normal text-[#777777] sm:text-[22px]">Kelas</h2>
          <button
            type="button"
            class="cursor-pointer text-base font-medium text-[#2864E8] transition hover:underline sm:text-[22px]"
            @click="addClass"
          >
            + Tambah Kelas
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[13px]">
          <ClassCard v-for="c in classes" :key="c.id" :title="c.title" :major="c.major" :lecturer="c.lecturer" />
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>
