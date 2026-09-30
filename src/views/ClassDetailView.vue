<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { classes } from '@/composables/useClasses.js'

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number(route.params.id) || 1)

// Ambil data kelas atau fallback ke kelas pertama
const currentClass = computed(() => {
  return classes.value.find((c) => c.id === classId.value) || classes.value[0]
})

const tasks = ref(
  currentClass.value?.tasks
    ? [...currentClass.value.tasks]
    : [
        {
          id: 1,
          title: 'Tugas 1',
          date: 'Senin, 28 September 2026',
        },
        {
          id: 2,
          title: 'Tugas 2',
          date: 'Senin, 28 September 2026',
        },
        {
          id: 3,
          title: 'Tugas 3',
          date: 'Senin, 28 September 2026',
        },
        {
          id: 4,
          title: 'Tugas 4',
          date: 'Senin, 28 September 2026',
        },
        {
          id: 5,
          title: 'Tugas 5',
          date: 'Senin, 28 September 2026',
        },
        {
          id: 6,
          title: 'Tugas 6 ',
          date: 'Senin, 28 September 2026',
        },
      ],
)

// Modal Pilihan Metode Pembuatan Soal (AI vs Manual)
const isChoiceModalOpen = ref(false)

// Modal Tambah Tugas Manual
const isAddTaskModalOpen = ref(false)
const newTaskTitle = ref('')
const newTaskDesc = ref('')

function handleFabClick() {
  isChoiceModalOpen.value = true
}

function handleChooseAi() {
  isChoiceModalOpen.value = false
  router.push(`/kelas/${classId.value}/buat-soal-ai`)
}

function handleChooseManual() {
  isChoiceModalOpen.value = false
  router.push(`/kelas/${classId.value}/buat-soal-manual`)
}

function openAddTaskModal() {
  newTaskTitle.value = `Tugas ${tasks.value.length + 1}`
  newTaskDesc.value = ''
  isAddTaskModalOpen.value = true
}

function closeAddTaskModal() {
  isAddTaskModalOpen.value = false
}

function handleAddTask() {
  if (!newTaskTitle.value.trim()) return

  const now = new Date()
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const formattedDate = now.toLocaleDateString('id-ID', options)

  tasks.value.push({
    id: Date.now(),
    title: newTaskTitle.value.trim(),
    date: formattedDate,
    description: newTaskDesc.value.trim(),
  })

  closeAddTaskModal()
}

function handleTaskClick(task) {
  router.push(`/kelas/${classId.value}/tugas/${task.id}`)
}
</script>

<template>
  <DashboardLayout>
    <div class="relative space-y-4 pb-20 sm:space-y-6 sm:pb-24">
      <!-- Breadcrumb / Tombol Kembali -->
      <div class="flex items-center gap-2 text-white/90">
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs font-medium text-white/80 transition hover:text-white sm:text-sm"
          @click="router.push('/beranda')"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Kelas
        </button>
      </div>

      <!-- Banner Header Putih (Sesuai Gambar Mockup Pengguna) -->
      <section
        class="min-h-[170px] rounded-[1.5rem] bg-white p-6 shadow-sm sm:min-h-[220px] sm:rounded-[2rem] sm:p-8 lg:p-10 flex flex-col justify-end"
      >
        <div>
          <span
            class="inline-block rounded-full bg-[#2864E8]/10 px-3 py-1 text-xs font-semibold text-[#2864E8] sm:text-sm"
          >
            {{ currentClass.major || 'Teknik Informatika' }}
          </span>
          <h1 class="mt-2 text-xl font-bold text-[#222222] sm:text-2xl lg:text-3xl">
            {{ currentClass.title || 'Pemrograman Perangkat Bergerak' }}
          </h1>
          <p class="mt-1 text-xs font-medium text-[#777777] sm:text-sm">
            Pengajar: {{ currentClass.lecturer || 'Fajerin Abdillah, M. Kom.' }}
          </p>
        </div>
      </section>

      <!-- Daftar Tugas: Kotak Putih dengan Garis Pemisah Tipis -->
      <section class="space-y-4 sm:space-y-5">
        <article
          v-for="task in tasks"
          :key="task.id"
          class="group cursor-pointer rounded-[1.5rem] border border-[#e3e3e3] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:rounded-[2rem] sm:p-7"
          @click="handleTaskClick(task)"
        >
          <!-- Judul Tugas -->
          <h2
            class="text-lg font-bold text-[#777777] transition group-hover:text-[#2864E8] sm:text-xl lg:text-2xl"
          >
            {{ task.title }}
          </h2>

          <!-- Garis Pemisah (Divider) -->
          <div class="my-3 h-[1px] w-full bg-[#d9d9d9] sm:my-3.5" />

          <!-- Tanggal Tugas -->
          <p class="text-xs font-normal text-[#888888] sm:text-sm lg:text-[15px]">
            {{ task.date }}
          </p>
        </article>
      </section>

      <!-- Floating Action Button (FAB) Tambah Tugas (+) Sesuai Mockup Gambar -->
      <button
        type="button"
        class="fixed bottom-20 right-6 z-30 flex size-14 cursor-pointer items-center justify-center rounded-full bg-white text-[#2864E8] shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition duration-200 hover:scale-105 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] active:scale-95 sm:bottom-8 sm:right-10 sm:size-16"
        aria-label="Tambah Tugas"
        @click="handleFabClick"
      >
        <svg class="size-8 sm:size-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>

    <!-- Modal Popup Pilihan: Buat Soal dengan AI atau Manual -->
    <Transition name="modal-fade">
      <div
        v-if="isChoiceModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="isChoiceModalOpen = false"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-[28px] border border-[#e3e3e3] bg-white p-6 sm:p-8 shadow-2xl animate-scale-up"
        >
          <div class="flex items-center justify-between pb-3 border-b border-[#eee]">
            <div>
              <h3 class="text-lg font-bold text-[#222222] sm:text-xl">Buat Soal Kuis Baru</h3>
              <p class="text-xs text-[#777777] mt-0.5">
                Pilih metode pembuatan soal untuk kelas ini
              </p>
            </div>
            <button
              type="button"
              class="flex size-8 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100 transition"
              @click="isChoiceModalOpen = false"
            >
              ✕
            </button>
          </div>

          <!-- Pilihan Opsi AI atau Manual -->
          <div class="mt-6 grid grid-cols-1 gap-3.5 sm:gap-4">
            <!-- Opsi 1: Buat Soal dengan AI (Rekomendasi Utama) -->
            <button
              type="button"
              class="group relative flex items-center gap-4 rounded-2xl border-2 border-[#2864E8] bg-blue-50/40 p-4 text-left transition duration-200 hover:bg-[#2864E8] hover:text-white hover:shadow-lg active:scale-[0.98] cursor-pointer"
              @click="handleChooseAi"
            >
              <!-- Ikon AI Sparkle / Generator -->
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#2864E8] text-white shadow-sm transition group-hover:bg-white group-hover:text-[#2864E8]"
              >
                <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-base font-bold text-[#222222] group-hover:text-white transition">
                    Buat Soal dengan AI
                  </h4>
                  <span
                    class="rounded-full bg-[#2864E8] px-2 py-0.5 text-[10px] font-semibold text-white group-hover:bg-white group-hover:text-[#2864E8] transition"
                  >
                    Cepat
                  </span>
                </div>
                <p class="mt-0.5 text-xs text-[#666666] group-hover:text-white/90 transition">
                  Ketik topik atau materi, AI akan otomatis menghasilkan butir soal esai & pilihan
                  ganda.
                </p>
              </div>

              <!-- Panah Kanan -->
              <svg
                class="size-5 shrink-0 text-[#2864E8] group-hover:text-white group-hover:translate-x-1 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <!-- Opsi 2: Buat Soal Manual -->
            <button
              type="button"
              class="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] cursor-pointer"
              @click="handleChooseManual"
            >
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#555] transition group-hover:bg-[#2864E8] group-hover:text-white"
              >
                <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <h4 class="text-base font-bold text-[#333333]">Buat Soal Manual</h4>
                <p class="mt-0.5 text-xs text-[#777777]">
                  Tulis judul tugas dan butir soal secara langsung tanpa bantuan generator AI.
                </p>
              </div>

              <svg
                class="size-5 shrink-0 text-slate-400 group-hover:text-[#2864E8] group-hover:translate-x-1 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Tambah Tugas Sederhana -->
    <Transition name="modal-fade">
      <div
        v-if="isAddTaskModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-md rounded-[28px] border border-[#e3e3e3] bg-white p-6 shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b border-[#eee]">
            <h3 class="text-lg font-bold text-[#222222]">Tambah Tugas Baru</h3>
            <button
              type="button"
              class="flex size-7 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100"
              @click="closeAddTaskModal"
            >
              ✕
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#555] mb-1">Judul Tugas</label>
              <input
                v-model="newTaskTitle"
                type="text"
                placeholder="Contoh: Tugas 3"
                class="w-full rounded-xl border border-[#ccc] px-3.5 py-2.5 text-sm outline-none focus:border-[#2864E8]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#555] mb-1"
                >Catatan / Deskripsi (Opsional)</label
              >
              <textarea
                v-model="newTaskDesc"
                rows="3"
                placeholder="Instruksi tugas atau materi terkait..."
                class="w-full rounded-xl border border-[#ccc] px-3.5 py-2.5 text-sm outline-none focus:border-[#2864E8]"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-full px-5 py-2 text-xs font-semibold text-[#666] hover:bg-gray-100"
              @click="closeAddTaskModal"
            >
              Batal
            </button>
            <button
              type="button"
              class="rounded-full bg-[#2864E8] px-6 py-2 text-xs font-semibold text-white shadow hover:bg-[#1f50be]"
              @click="handleAddTask"
            >
              Simpan Tugas
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </DashboardLayout>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
