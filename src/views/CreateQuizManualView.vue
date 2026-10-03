<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DeadlineModal from '@/components/ui/DeadlineModal.vue'
import QuizSheetTabs from '@/components/ui/QuizSheetTabs.vue'
import aiBannerImg from '@/assets/images/bennerbuatsoal_ai.png'
import { addTaskToClass, classes } from '@/composables/useClasses.js'

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number(route.params.id) || 1)
const currentClass = computed(() => {
  return classes.value.find((c) => c.id === classId.value) || classes.value[0]
})

// Header Formulir
const formTitle = ref('Formulir Tanpa Judul')
const formDesc = ref('Deskripsi Formulir')
const showScore = ref(true)
const showCorrectAnswers = ref(false)
const activeSheet = ref('questions')
const classSubmissions = computed(() =>
  (currentClass.value?.tasks || []).flatMap((task) =>
    (task.submissions || []).map((submission) => ({
      ...submission,
      taskId: task.id,
      taskTitle: task.title,
    })),
  ),
)

// Tipe Soal: 'multiple_choice' | 'short_answer'
const questionTypes = [
  { value: 'multiple_choice', label: 'Pilihan Ganda' },
  { value: 'short_answer', label: 'Esai / Jawaban Singkat' },
]

// State Daftar Pertanyaan
const questions = ref([
  {
    id: 1,
    title: 'Pertanyaan Tanpa Judul',
    type: 'multiple_choice',
    options: ['Opsi 1'],
    answerKey: '',
    points: 10,
    showAnswerKeyModal: false,
  },
  {
    id: 2,
    title: 'Pertanyaan Tanpa Judul',
    type: 'short_answer',
    options: [],
    answerKey: '',
    points: 10,
    showAnswerKeyModal: false,
  },
])

// Modal Kunci Jawaban
const activeQuestionForModal = ref(null)

// Tambah Pertanyaan Baru
function addQuestion() {
  questions.value.push({
    id: Date.now(),
    title: 'Pertanyaan Tanpa Judul',
    type: 'multiple_choice',
    options: ['Opsi 1'],
    answerKey: '',
    points: 10,
    showAnswerKeyModal: false,
  })
}

// Hapus Pertanyaan
function removeQuestion(index) {
  if (questions.value.length > 1) {
    questions.value.splice(index, 1)
  }
}

// Tambah Opsi pada Pilihan Ganda
function addOption(q) {
  q.options.push(`Opsi ${q.options.length + 1}`)
}

// Hapus Opsi
function removeOption(q, optIndex) {
  if (q.options.length > 1) {
    q.options.splice(optIndex, 1)
  }
}

// Buka Modal Kunci Jawaban
function openAnswerKey(q) {
  activeQuestionForModal.value = q
}

function closeAnswerKey() {
  activeQuestionForModal.value = null
}

// Simpan Formulir ke Daftar Tugas Kelas
const isSavedModalOpen = ref(false)
const isDeadlineModalOpen = ref(false)

function handleSaveForm() {
  isDeadlineModalOpen.value = true
}

function saveForm(deadline) {
  const deadlineDate = new Date(`${deadline.date}T12:00:00`)
  addTaskToClass(classId.value, {
    id: Date.now(),
    title: formTitle.value.trim() || 'Tugas tanpa judul',
    description: formDesc.value.trim(),
    date: deadlineDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    deadlineDate: deadline.date,
    deadlineTime: deadline.time,
    deadlineTimezone: 'WITA',
    dueAt: `${deadline.date}T${deadline.time}:00+08:00`,
    questions: questions.value.map(({ id, title, type, options, answerKey, points }) => ({
      id,
      title,
      type,
      options: [...options],
      answerKey,
      points: Number(points) || 0,
    })),
    showScore: showScore.value,
    showCorrectAnswers: showCorrectAnswers.value,
  })
  isDeadlineModalOpen.value = false
  isSavedModalOpen.value = true
}

function handleCloseSaved() {
  isSavedModalOpen.value = false
  router.push(`/kelas/${classId.value}`)
}
</script>

<template>
  <!-- Gunakan :no-scroll="true" agar border/latar biru tetap terkunci dan tidak ikut bergeser -->
  <DashboardLayout :no-scroll="true">
    <div class="flex flex-col flex-1 h-full min-h-0">
      <!-- Breadcrumb Navigasi Kembali: Statis di atas tidak ikut scroll -->
      <div class="flex items-center justify-between pb-3 sm:pb-3.5 text-white/90 shrink-0">
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-white/90 transition hover:text-white hover:translate-x-[-2px] sm:text-sm"
          @click="router.push(`/kelas/${classId}`)"
        >
          <svg class="size-4 sm:size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Kelas
        </button>

        <div class="flex items-center gap-2">
          <button
            v-if="activeSheet === 'questions'"
            type="button"
            class="motion-control cursor-pointer rounded-xl bg-white px-4 py-1.5 text-xs sm:text-sm font-bold text-[#2864E8] shadow-sm transition hover:bg-white/90 active:scale-95"
            @click="handleSaveForm"
          >
            Simpan Formulir
          </button>
        </div>
      </div>

      <!-- Area Konten yang Scrollable Mandiri di dalam border biru -->
      <div class="relative flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 pb-20 sm:space-y-5">
        <!-- Banner Manfaatkan AI Untuk Membuat Soal (Sesuai Foto Mockup) -->
        <section
          class="overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-sm sm:rounded-[2rem] shrink-0"
        >
          <img
            :src="aiBannerImg"
            alt="Manfaatkan AI Untuk Membuat Soal"
            class="block h-auto w-full select-none object-cover"
          />
        </section>

        <QuizSheetTabs :active-tab="activeSheet" @select="activeSheet = $event" />

        <template v-if="activeSheet === 'questions'">
          <!-- KARTU 1: Formulir Tanpa Judul & Deskripsi Formulir (Header Form Google) -->
          <section
            class="rounded-[1.5rem] bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8 lg:p-9 space-y-4 border border-[#e3e3e3]"
          >
            <!-- Input Judul Formulir -->
            <input
              v-model="formTitle"
              type="text"
              placeholder="Formulir Tanpa Judul"
              class="w-full border-b border-[#cccccc] pb-2 text-2xl font-bold text-[#444444] outline-none transition focus:border-[#2864E8] sm:text-3xl"
            />

            <!-- Input Deskripsi Formulir -->
            <input
              v-model="formDesc"
              type="text"
              placeholder="Deskripsi Formulir"
              class="w-full text-sm font-medium text-[#777777] outline-none placeholder:text-[#999999] sm:text-base"
            />

            <div class="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <label class="flex items-start gap-2 text-sm text-[#555555]">
                <input v-model="showScore" type="checkbox" class="mt-0.5 accent-[#2864E8]" />
                <span>Tampilkan nilai kepada siswa</span>
              </label>
              <label class="flex items-start gap-2 text-sm text-[#555555]">
                <input
                  v-model="showCorrectAnswers"
                  type="checkbox"
                  class="mt-0.5 accent-[#2864E8]"
                />
                <span>Tampilkan kunci dan benar/salah setelah dikumpulkan</span>
              </label>
            </div>
          </section>

          <!-- KARTU DAFTAR PERTANYAAN (Mirip Google Form) -->
          <TransitionGroup tag="div" name="question-card" appear class="space-y-4">
            <section
              v-for="(q, qIndex) in questions"
              :key="q.id"
              class="motion-surface group relative rounded-[1.5rem] bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8 lg:p-9 border border-[#e3e3e3] space-y-6 transition hover:shadow-md"
              :style="{ transitionDelay: `${Math.min(qIndex, 4) * 70}ms` }"
            >
              <!-- Baris Atas: Input Pertanyaan (Kiri) + Dropdown Tipe (Kanan) -->
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <!-- Input Judul Pertanyaan -->
                <div class="flex-1">
                  <input
                    v-model="q.title"
                    type="text"
                    placeholder="Pertanyaan Tanpa Judul"
                    class="w-full border-b border-[#cccccc] pb-1.5 text-base sm:text-lg lg:text-xl font-bold text-[#444444] outline-none transition focus:border-[#2864E8]"
                  />
                </div>

                <!-- Dropdown Tipe Soal (Pilihan Ganda / Esai) -->
                <div class="w-full sm:w-[220px] shrink-0">
                  <div class="relative">
                    <select
                      v-model="q.type"
                      class="w-full appearance-none rounded-xl border border-[#cccccc] bg-white px-4 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-[#444444] outline-none transition focus:border-[#2864E8] cursor-pointer"
                    >
                      <option v-for="t in questionTypes" :key="t.value" :value="t.value">
                        {{ t.label }}
                      </option>
                    </select>
                    <!-- Ikon Dropdown -->
                    <div
                      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Baris Tengah: Pilihan Opsi / Teks Jawaban (Kiri) + Tombol Kunci Jawaban (Kanan) -->
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <!-- SISI KIRI: Jawaban Sesuai Tipe -->
                <div class="flex-1 space-y-3">
                  <!-- Tipe 1: Pilihan Ganda -->
                  <div v-if="q.type === 'multiple_choice'" class="space-y-3">
                    <!-- Item-item Opsi -->
                    <div
                      v-for="(opt, optIndex) in q.options"
                      :key="optIndex"
                      class="flex items-center gap-3"
                    >
                      <!-- Radio Icon Lingkaran -->
                      <div class="size-4 rounded-full border-2 border-[#888888] shrink-0"></div>

                      <input
                        v-model="q.options[optIndex]"
                        type="text"
                        class="flex-1 text-sm sm:text-base font-normal text-[#444444] outline-none border-b border-transparent focus:border-slate-300 pb-0.5"
                      />

                      <!-- Tombol Hapus Opsi jika lebih dari 1 -->
                      <button
                        v-if="q.options.length > 1"
                        type="button"
                        class="text-slate-400 hover:text-red-500 text-xs p-1"
                        @click="removeOption(q, optIndex)"
                        title="Hapus opsi"
                      >
                        ✕
                      </button>
                    </div>

                    <!-- Baris Tambahkan Opsi -->
                    <div class="flex items-center gap-3 pt-1">
                      <div class="size-4 rounded-full border-2 border-[#888888] shrink-0"></div>
                      <button
                        type="button"
                        class="cursor-pointer text-sm font-normal text-[#888888] transition hover:text-[#2864E8]"
                        @click="addOption(q)"
                      >
                        Tambahkan Opsi
                      </button>
                    </div>
                  </div>

                  <!-- Tipe 2: Esai / Teks Jawaban -->
                  <div v-else class="pt-2">
                    <input
                      type="text"
                      placeholder="Teks Jawaban"
                      disabled
                      class="w-full border-b border-[#cccccc] pb-1 text-sm sm:text-base text-[#888888] bg-transparent cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <!-- SISI KANAN: Tombol Kotak Kunci Jawaban (Sesuai Foto Mockup) -->
                <div class="w-full sm:w-[220px] shrink-0 flex flex-col gap-2">
                  <button
                    type="button"
                    class="w-full rounded-xl border border-[#cccccc] bg-white py-2.5 text-center text-xs sm:text-sm font-semibold text-[#444444] shadow-xs transition hover:border-[#2864E8] hover:text-[#2864E8] hover:bg-blue-50/30 active:scale-95 cursor-pointer"
                    @click="openAnswerKey(q)"
                  >
                    Kunci Jawaban
                  </button>

                  <!-- Indikator Kunci Jawaban yang sudah diatur -->
                  <div v-if="q.answerKey" class="text-[11px] text-emerald-600 font-medium px-1">
                    ✓ Kunci: <span class="font-bold">{{ q.answerKey }}</span> ({{ q.points }} Poin)
                  </div>

                  <!-- Tombol Hapus Pertanyaan di Bawah jika pertanyaan > 1 -->
                  <button
                    v-if="questions.length > 1"
                    type="button"
                    class="self-end text-xs text-slate-400 hover:text-red-500 mt-1 flex items-center gap-1 cursor-pointer"
                    @click="removeQuestion(qIndex)"
                  >
                    <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Hapus Soal
                  </button>
                </div>
              </div>
            </section>
          </TransitionGroup>
        </template>

        <section
          v-else
          class="space-y-4 rounded-[1.5rem] bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8"
        >
          <h2 class="text-lg font-bold text-[#333333] sm:text-xl">Mahasiswa</h2>
          <p v-if="classSubmissions.length === 0" class="text-sm text-[#777777]">
            Belum ada siswa yang mengumpulkan tugas.
          </p>
          <div v-else class="grid gap-3 sm:grid-cols-2">
            <article
              v-for="submission in classSubmissions"
              :key="`${submission.taskId}-${submission.email}`"
              class="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#e5e5e5] p-3"
            >
              <div class="min-w-0">
                <h3 class="truncate font-semibold text-[#777777]">
                  {{ submission.name || submission.email }}
                </h3>
                <p class="truncate text-xs text-[#888888]">{{ submission.email }}</p>
              </div>
              <span
                v-if="submission.graded && submission.score != null"
                class="shrink-0 rounded-lg bg-[#2563EB] px-3 py-1.5 text-center text-sm font-semibold text-white"
              >
                Nilai<br />{{ submission.score }}
              </span>
              <span v-else class="shrink-0 text-xs font-medium text-[#808080]">Belum dinilai</span>
            </article>
          </div>
        </section>
      </div>

      <!-- Tombol Tambah Pertanyaan (+) Mirip Google Form: Posisinya Tetap (Fixed/Pinned) di Pojok Kanan Bawah Sesuai Foto -->
      <button
        v-if="activeSheet === 'questions'"
        type="button"
        class="motion-control fixed bottom-6 right-6 z-30 flex size-12 sm:size-14 cursor-pointer items-center justify-center rounded-full bg-white text-[#444444] border-2 border-[#b5b5b5] shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition duration-200 hover:scale-105 hover:border-[#2864E8] hover:text-[#2864E8] active:scale-95 sm:bottom-8 sm:right-10"
        aria-label="Tambah Pertanyaan"
        @click="addQuestion"
      >
        <svg class="size-6 sm:size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>

    <!-- Modal Atur Kunci Jawaban & Poin -->
    <Transition name="modal-fade">
      <div
        v-if="activeQuestionForModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        @click.self="closeAnswerKey"
      >
        <div class="w-full max-w-md rounded-[24px] bg-white p-6 sm:p-7 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-lg font-bold text-[#222222]">Atur Kunci Jawaban</h3>
            <button
              type="button"
              class="size-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              @click="closeAnswerKey"
            >
              ✕
            </button>
          </div>

          <!-- Poin Soal -->
          <div>
            <label class="block text-xs font-semibold text-[#555] mb-1">Poin Nilai</label>
            <input
              v-model.number="activeQuestionForModal.points"
              type="number"
              min="1"
              class="w-24 rounded-xl border border-[#ccc] px-3 py-1.5 text-sm outline-none focus:border-[#2864E8]"
            />
          </div>

          <!-- Pilihan Kunci untuk Pilihan Ganda -->
          <div v-if="activeQuestionForModal.type === 'multiple_choice'">
            <label class="block text-xs font-semibold text-[#555] mb-2"
              >Pilih Opsi yang Benar</label
            >
            <div class="space-y-2">
              <label
                v-for="opt in activeQuestionForModal.options"
                :key="opt"
                class="flex items-center gap-2.5 rounded-xl border p-2.5 text-xs sm:text-sm cursor-pointer transition"
                :class="
                  activeQuestionForModal.answerKey === opt
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200'
                "
              >
                <input
                  v-model="activeQuestionForModal.answerKey"
                  type="radio"
                  :value="opt"
                  class="accent-emerald-600"
                />
                <span class="font-medium">{{ opt }}</span>
              </label>
            </div>
          </div>

          <!-- Kunci Jawaban untuk Esai -->
          <div v-else>
            <label class="block text-xs font-semibold text-[#555] mb-1"
              >Kunci Jawaban Esai / Kata Kunci</label
            >
            <textarea
              v-model="activeQuestionForModal.answerKey"
              rows="3"
              placeholder="Masukkan jawaban benar atau poin kunci esai..."
              class="w-full rounded-xl border border-[#ccc] p-3 text-sm outline-none focus:border-[#2864E8]"
            />
          </div>

          <div class="flex justify-end pt-3">
            <button
              type="button"
              class="cursor-pointer rounded-xl bg-[#2864E8] px-6 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#1f50be]"
              @click="closeAnswerKey"
            >
              Simpan Kunci
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <DeadlineModal
      :open="isDeadlineModalOpen"
      @close="isDeadlineModalOpen = false"
      @save="saveForm"
    />

    <!-- Modal Sukses Simpan Formulir -->
    <Transition name="modal-fade">
      <div
        v-if="isSavedModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="handleCloseSaved"
      >
        <div class="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-8 text-center shadow-2xl">
          <div
            class="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:size-20"
          >
            <svg class="size-8 sm:size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 class="mt-5 text-xl font-bold text-[#222222] sm:text-2xl">Formulir Soal Disimpan!</h3>

          <p class="mt-2 text-sm text-[#666666] sm:text-base leading-relaxed">
            Formulir <strong>{{ formTitle }}</strong> dengan {{ questions.length }} butir pertanyaan
            telah berhasil ditambahkan ke kelas <strong>{{ currentClass.title }}</strong
            >.
          </p>

          <div class="mt-7 flex justify-center">
            <button
              type="button"
              class="cursor-pointer rounded-xl bg-[#2864E8] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1f50be] active:scale-95 sm:text-base"
              @click="handleCloseSaved"
            >
              Kembali ke Daftar Tugas
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

.question-card-enter-active,
.question-card-leave-active,
.question-card-move {
  transition:
    opacity 0.38s ease,
    transform 0.38s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.question-card-enter-from,
.question-card-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
}

.question-card-leave-active {
  position: absolute;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .question-card-enter-active,
  .question-card-leave-active,
  .question-card-move {
    transition: none;
  }
}
</style>
