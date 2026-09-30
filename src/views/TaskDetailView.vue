<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import StudentAvatar from '@/components/icons/StudentAvatar.vue'
import { classes as initialClasses } from '@/data/classes.js'
import { defaultStudents } from '@/data/students.js'

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number(route.params.id) || 1)
const taskId = computed(() => Number(route.params.taskId) || 1)

const currentClass = computed(() => {
  return initialClasses.find((c) => c.id === classId.value) || initialClasses[0]
})

const currentTask = computed(() => {
  const tasks = currentClass.value?.tasks || []
  return (
    tasks.find((t) => t.id === taskId.value) || {
      id: taskId.value,
      title: `Tugas ${taskId.value}`,
      date: 'Senin, 28 September 2026',
    }
  )
})

const students = defaultStudents
</script>

<template>
  <DashboardLayout>
    <div class="space-y-4 pb-16 sm:space-y-6 sm:pb-20">
      <!-- Breadcrumb Navigasi Kembali -->
      <div class="flex items-center gap-2 text-white/90">
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs font-medium text-white/80 transition hover:text-white sm:text-sm"
          @click="router.push(`/kelas/${classId}`)"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Detail Kelas
        </button>
      </div>

      <!-- Banner Kosong / Putih Atas (Sesuai Mockup Gambar Pengguna) -->
      <section
        class="min-h-[140px] rounded-[1.5rem] bg-white p-6 shadow-sm sm:min-h-[180px] sm:rounded-[2rem] sm:p-8 lg:min-h-[210px] lg:p-10 flex flex-col justify-end"
      >
        <div>
          <span
            class="inline-block rounded-full bg-[#2864E8]/10 px-3 py-1 text-xs font-semibold text-[#2864E8] sm:text-sm"
          >
            {{ currentClass.major || 'Teknik Informatika' }}
          </span>
          <h1 class="mt-2 text-xl font-bold text-[#222222] sm:text-2xl lg:text-3xl">
            {{ currentTask.title }} &bull; {{ currentClass.title }}
          </h1>
          <p class="mt-1 text-xs font-medium text-[#777777] sm:text-sm">
            Pengajar: {{ currentClass.lecturer || 'Fajerin Abdillah, M. Kom.' }} &bull; Tanggal: {{ currentTask.date }}
          </p>
        </div>
      </section>

      <!-- Kotak Putih Daftar Mahasiswa (Sesuai Mockup Gambar Pengguna) -->
      <section class="rounded-[1.5rem] bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8 lg:p-10">
        <!-- Judul Bagian -->
        <h2 class="text-xl font-bold text-[#666666] sm:text-2xl lg:text-3xl">
          Mahasiswa
        </h2>

        <!-- Divider Garis Abu-abu Tipis -->
        <div class="mt-4 mb-6 h-[1.5px] w-full bg-[#d9d9d9] sm:mt-5 sm:mb-8" />

        <!-- Grid Kartu Mahasiswa 2 Kolom -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <div
            v-for="student in students"
            :key="student.id"
            class="flex items-center justify-between rounded-[1.25rem] border border-[#d6d6d6] bg-white p-3 shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.1)] sm:rounded-[1.5rem] sm:p-3.5"
          >
            <!-- Sisi Kiri: Foto Avatar + Nama + Email -->
            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
              <!-- Avatar Siswi Berjilbab/Seragam Kuning Frame Merah/Pink -->
              <div class="relative size-14 shrink-0 overflow-hidden rounded-[14px] shadow-sm sm:size-16">
                <StudentAvatar />
              </div>

              <!-- Nama dan Email -->
              <div class="min-w-0">
                <h3 class="truncate text-base font-bold text-[#333333] sm:text-lg">
                  {{ student.name }}
                </h3>
                <p class="truncate text-xs font-normal text-[#888888] sm:text-sm">
                  {{ student.email }}
                </p>
              </div>
            </div>

            <!-- Sisi Kanan: Badge Nilai Biru -->
            <div
              class="flex flex-col items-center justify-center rounded-xl bg-[#2864E8] px-4 py-2 text-white shadow-sm sm:px-5 sm:py-2.5 shrink-0 ml-2"
            >
              <span class="text-[11px] font-semibold leading-tight sm:text-xs">Nilai</span>
              <span class="text-sm font-bold leading-tight sm:text-base">{{ student.score }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>
