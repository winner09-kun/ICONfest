<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DeadlineModal from '@/components/ui/DeadlineModal.vue'
import aiBannerImg from '@/assets/images/bennerbuatsoal_ai.png'
import sendFillIcon from '@/assets/icons/Send_fill.svg'
import { addTaskToClass, classes } from '@/composables/useClasses.js'

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number(route.params.id) || 1)
const currentClass = computed(() => {
  return classes.value.find((c) => c.id === classId.value) || classes.value[0]
})

const defaultAiResponse = `Berikut contoh soal mengenai ICONFEST yang bisa digunakan untuk pengujian sistem penilaian esai dan pilihan ganda.

Soal Esai
1. Jelaskan apa yang dimaksud dengan ICONFEST dan apa tujuan utama diselenggarakannya kegiatan tersebut!
2. Menurut pendapat Anda, bagaimana kegiatan ICONFEST dapat membantu mahasiswa dalam mengembangkan kemampuan di bidang teknologi, kreativitas, dan inovasi?

Soal Pilihan Ganda

3. Salah satu tujuan utama kegiatan seperti ICONFEST adalah untuk mendorong peserta dalam mengembangkan...
A. Kemampuan bermain olahraga
B. Kreativitas dan inovasi teknologi
C. Kemampuan memasak
D. Kemampuan berbisnis secara konvensional

Jawaban: B

4. Peserta ICONFEST umumnya dapat mengembangkan kemampuan melalui kegiatan yang berkaitan dengan...
A. Teknologi dan inovasi
B. Pertanian tradisional saja
C. Seni bela diri
D. Olahraga profesional

Jawaban: A

5. Salah satu manfaat mengikuti kegiatan ICONFEST bagi mahasiswa adalah...

A. Mengurangi pengalaman dalam bekerja sama
B. Membatasi kemampuan dalam membuat proyek
C. Meningkatkan pengalaman, kreativitas, dan kemampuan berkolaborasi
D. Menghindari penggunaan teknologi

Jawaban: C`

// State Chat / Perintah
const inputPrompt = ref('')
const isSubmitted = ref(false)
const userMessage = ref('')
const isAgreed = ref(false)
const isDeadlineModalOpen = ref(false)
const isSuccessModalOpen = ref(false)
const chatScrollAreaRef = ref(null)
const fileInput = ref(null)
const attachedFiles = ref([])
const submittedAttachments = ref([])
const showScore = ref(true)
const showCorrectAnswers = ref(false)

function parseGeneratedQuestions(text) {
  const questions = []
  let currentQuestion = null

  function saveCurrentQuestion() {
    if (!currentQuestion) return
    if (currentQuestion.answerLetter) {
      currentQuestion.answerKey =
        currentQuestion.options[currentQuestion.answerLetter.charCodeAt(0) - 65] || ''
    }
    delete currentQuestion.answerLetter
    questions.push(currentQuestion)
    currentQuestion = null
  }

  for (const line of text.split('\n')) {
    const questionMatch = line.match(/^\s*\d+[.)]\s*(.+)$/)
    const optionMatch = line.match(/^\s*([A-D])[.)]\s*(.+)$/i)
    const answerMatch = line.match(/^\s*Jawaban:\s*([A-D])\s*$/i)

    if (questionMatch) {
      saveCurrentQuestion()
      currentQuestion = {
        id: Date.now() + questions.length,
        title: questionMatch[1].trim(),
        type: 'short_answer',
        options: [],
        answerKey: '',
        points: 10,
      }
    } else if (currentQuestion && optionMatch) {
      currentQuestion.type = 'multiple_choice'
      currentQuestion.options.push(optionMatch[2].trim())
    } else if (currentQuestion && answerMatch) {
      currentQuestion.answerLetter = answerMatch[1].toUpperCase()
    }
  }

  saveCurrentQuestion()
  return questions
}

function openFilePicker() {
  fileInput.value?.click()
}

function handleFileSelection(event) {
  const files = Array.from(event.target.files || [])
  attachedFiles.value = [...attachedFiles.value, ...files]
  event.target.value = ''
}

function removeAttachedFile(index) {
  attachedFiles.value.splice(index, 1)
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function handleSubmitPrompt() {
  const prompt = inputPrompt.value.trim()
  if (!prompt && attachedFiles.value.length === 0) return

  userMessage.value = prompt || 'Tolong analisis dokumen ini.'
  submittedAttachments.value = attachedFiles.value.map(({ name, size }) => ({ name, size }))
  attachedFiles.value = []
  isSubmitted.value = true
  inputPrompt.value = ''

  nextTick(() => {
    if (chatScrollAreaRef.value) {
      chatScrollAreaRef.value.scrollTop = chatScrollAreaRef.value.scrollHeight
    }
  })
}

function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmitPrompt()
  }
}

function handleAgree() {
  isAgreed.value = true
  isDeadlineModalOpen.value = true
}

function saveAiTask(deadline) {
  const deadlineDate = new Date(`${deadline.date}T12:00:00`)
  addTaskToClass(classId.value, {
    id: Date.now(),
    title: userMessage.value || 'Kuis AI',
    description: 'Soal dibuat dengan AI.',
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
    questions: parseGeneratedQuestions(defaultAiResponse),
    showScore: showScore.value,
    showCorrectAnswers: showCorrectAnswers.value,
  })
  isDeadlineModalOpen.value = false
  isSuccessModalOpen.value = true
}

function handleCloseSuccess() {
  isSuccessModalOpen.value = false
  router.push(`/kelas/${classId.value}`)
}
</script>

<template>
  <!-- Gunakan :no-scroll="true" agar border/latar biru tetap terkunci dan tidak ikut bergeser -->
  <DashboardLayout :no-scroll="true">
    <input
      ref="fileInput"
      type="file"
      multiple
      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,image/*"
      class="hidden"
      @change="handleFileSelection"
    />
    <div class="flex flex-col flex-1 h-full min-h-0">
      <!-- Breadcrumb Navigasi Kembali: Tetap berada di atas / Statis tidak ikut scroll -->
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

        <span
          class="text-xs text-white/80 sm:text-sm font-medium truncate max-w-[200px] sm:max-w-md"
        >
          {{ currentClass.title }}
        </span>
      </div>

      <!-- TAMPILAN 1: SEBELUM USER INPUT PERINTAH (Sesuai Foto 1) -->
      <div
        v-if="!isSubmitted"
        class="flex-1 flex flex-col min-h-0 space-y-3 sm:space-y-4 overflow-y-auto pr-0.5"
      >
        <!-- Banner Manfaatkan AI Untuk Membuat Soal -->
        <section
          class="overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-sm sm:rounded-[2rem] shrink-0"
        >
          <img
            :src="aiBannerImg"
            alt="Manfaatkan AI Untuk Membuat Soal"
            class="block h-auto w-full select-none object-cover"
          />
        </section>

        <!-- Kotak Putih Tempat Chat / Prompt Awal -->
        <section
          class="flex-1 flex flex-col items-center justify-center rounded-[1.5rem] bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-12 min-h-[300px]"
        >
          <div class="w-full max-w-2xl text-center">
            <!-- Teks Tengah: Ada ide baru untuk hari ini? -->
            <h1 class="text-2xl font-bold text-[#666666] sm:text-3xl lg:text-4xl tracking-tight">
              Ada ide baru untuk hari ini?
            </h1>

            <!-- Input Bar Melengkung Pill -->
            <div class="mt-8 sm:mt-12 w-full">
              <div v-if="attachedFiles.length" class="mb-3 flex flex-wrap gap-2 text-left">
                <div
                  v-for="(file, index) in attachedFiles"
                  :key="`${file.name}-${file.size}-${index}`"
                  class="flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-[#444444]"
                >
                  <span class="truncate">{{ file.name }}</span>
                  <span class="shrink-0 text-[#888888]">{{ formatFileSize(file.size) }}</span>
                  <button
                    type="button"
                    class="shrink-0 text-[#888888] hover:text-red-600"
                    :aria-label="`Hapus lampiran ${file.name}`"
                    @click="removeAttachedFile(index)"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div
                class="flex items-center rounded-full border-2 border-[#2864E8] bg-white px-4 py-2 sm:px-6 sm:py-3 shadow-sm transition-all focus-within:shadow-md"
              >
                <!-- Tombol Plus Kiri -->
                <button
                  type="button"
                  class="flex items-center gap-2 cursor-pointer text-[#2864E8] transition hover:opacity-80 shrink-0"
                  @click="openFilePicker"
                  aria-label="Lampirkan dokumen"
                  title="Lampirkan dokumen"
                >
                  <svg
                    class="size-6 sm:size-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <!-- Input Text -->
                <input
                  v-model="inputPrompt"
                  type="text"
                  placeholder="Mulai berdiskusi"
                  class="w-full bg-transparent px-3 text-sm text-[#444444] placeholder-[#888888] outline-none sm:px-4 sm:text-base lg:text-lg"
                  @keydown="handleKeyDown"
                />

                <!-- Tombol Kirim Kanan (Icon Send Fill) -->
                <button
                  type="button"
                  class="motion-control cursor-pointer shrink-0 transition hover:scale-105 active:scale-95 text-[#2864E8] p-1"
                  aria-label="Kirim Perintah"
                  @click="handleSubmitPrompt"
                >
                  <img :src="sendFillIcon" alt="Kirim" class="size-6 sm:size-7" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- TAMPILAN 2: SETELAH USER INPUT PERINTAH (Sesuai Foto 2) -->
      <!-- Menggunakan layout Flex Col di mana container pesan bisa di-scroll, dan input bar POSISINYA TETAP di bawah -->
      <div
        v-else
        class="flex-1 flex flex-col min-h-0 overflow-hidden rounded-[1.5rem] border border-white/80 border-b-0 bg-[linear-gradient(180deg,#2563EB_0%,#808080_100%)] p-4 pb-8 shadow-sm sm:rounded-[2rem] sm:p-7 sm:pb-10 lg:p-9 lg:pb-14"
      >
        <!-- Area Percakapan Bubble Chat (Scrollable mandiri di dalam kotak putih) -->
        <div
          ref="chatScrollAreaRef"
          class="flex-1 min-h-0 overflow-y-auto space-y-6 px-2 py-2 pr-3 sm:px-3 sm:py-3 sm:pr-4"
        >
          <!-- Balon Chat User (Sisi Kanan Atas dengan Ekor Kanan Bawah Sesuai Foto 2) -->
          <div class="flex justify-end pt-2">
            <div class="relative max-w-[85%] sm:max-w-2xl">
              <!-- Kotak Balon User: Border biru melengkung, sudut kanan bawah menjadi pangkal ekor -->
              <div
                class="rounded-[24px] rounded-br-[4px] border-2 border-[#2864E8] bg-white px-5 py-3.5 sm:px-6 sm:py-4 text-sm sm:text-base font-medium text-[#222222] shadow-sm leading-relaxed"
              >
                {{ userMessage }}
                <div v-if="submittedAttachments.length" class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="(file, index) in submittedAttachments"
                    :key="`${file.name}-${file.size}-${index}`"
                    class="max-w-full truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-normal text-[#555555]"
                  >
                    {{ file.name }} · {{ formatFileSize(file.size) }}
                  </span>
                </div>
              </div>

              <!-- Ekor SVG Balon Chat User Sesuai Foto 2 (Kanan Bawah) -->
              <svg
                class="absolute -bottom-[9px] -right-[1px] w-[18px] h-[12px] pointer-events-none"
                viewBox="0 0 18 12"
                fill="none"
              >
                <!-- Isi Putih Balon -->
                <path d="M0 0C6 1 12 5 18 12C14 6 10 2 0 0Z" fill="white" />
                <!-- Border Garis Biru -->
                <path
                  d="M0 0C6 1 12 5 18 12"
                  stroke="#2864E8"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>

          <!-- Balon Chat AI (Sisi Kiri dengan Ekor Kiri Bawah Sesuai Foto 2) -->
          <div class="flex justify-start">
            <div class="relative max-w-[96%] sm:max-w-3xl w-full">
              <!-- Kotak Balon AI: Border biru melengkung, sudut kiri bawah menjadi pangkal ekor -->
              <div
                class="rounded-[28px] rounded-bl-[4px] border-2 border-[#2864E8] bg-white p-5 sm:p-8 text-xs sm:text-sm lg:text-[15px] font-normal text-[#222222] shadow-sm leading-relaxed whitespace-pre-line"
              >
                {{ defaultAiResponse }}
              </div>

              <!-- Ekor SVG Balon Chat AI Sesuai Foto 2 (Kiri Bawah) -->
              <svg
                class="absolute -bottom-[9px] -left-[1px] w-[18px] h-[12px] pointer-events-none"
                viewBox="0 0 18 12"
                fill="none"
              >
                <!-- Isi Putih Balon -->
                <path d="M18 0C12 1 6 5 0 12C4 6 8 2 18 0Z" fill="white" />
                <!-- Border Garis Biru -->
                <path
                  d="M18 0C12 1 6 5 0 12"
                  stroke="#2864E8"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  class="motion-control cursor-pointer rounded-xl bg-[#2864E8] px-8 py-2.5 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-[#1f50be] hover:shadow-lg active:scale-95 sm:px-10 sm:py-3 sm:text-base"
                  @click="handleAgree"
                >
                  Setuju
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tombol / Bar Ketik Perintah (Posisi Tetap / Pinned di Bagian Bawah Kotak) -->
        <div class="shrink-0 pt-3 sm:pt-4 border-t border-slate-100 mt-2">
          <div v-if="attachedFiles.length" class="mb-3 flex flex-wrap gap-2">
            <div
              v-for="(file, index) in attachedFiles"
              :key="`${file.name}-${file.size}-${index}`"
              class="flex max-w-full items-center gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-2 text-xs text-[#444444]"
            >
              <span class="truncate">{{ file.name }}</span>
              <span class="shrink-0 text-[#888888]">{{ formatFileSize(file.size) }}</span>
              <button
                type="button"
                class="shrink-0 text-[#888888] hover:text-red-600"
                :aria-label="`Hapus lampiran ${file.name}`"
                @click="removeAttachedFile(index)"
              >
                &times;
              </button>
            </div>
          </div>
          <div
            class="flex items-center rounded-full border-2 border-[#2864E8] bg-white px-4 py-2 sm:px-6 sm:py-3 shadow-sm transition-all focus-within:shadow-md"
          >
            <!-- Tombol Plus Kiri -->
            <button
              type="button"
              class="flex items-center gap-2 cursor-pointer text-[#2864E8] transition hover:opacity-80 shrink-0"
              @click="openFilePicker"
              aria-label="Lampirkan dokumen"
              title="Lampirkan dokumen"
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

            <!-- Input Text -->
            <input
              v-model="inputPrompt"
              type="text"
              placeholder="Mulai berdiskusi"
              class="w-full bg-transparent px-3 text-sm text-[#444444] placeholder-[#888888] outline-none sm:px-4 sm:text-base lg:text-lg"
              @keydown="handleKeyDown"
            />

            <!-- Tombol Kirim Kanan -->
            <button
              type="button"
              class="cursor-pointer shrink-0 transition hover:scale-105 active:scale-95 text-[#2864E8] p-1"
              aria-label="Kirim Perintah"
              @click="handleSubmitPrompt"
            >
              <img :src="sendFillIcon" alt="Kirim" class="size-6 sm:size-7" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <DeadlineModal
      :open="isDeadlineModalOpen"
      @close="isDeadlineModalOpen = false"
      @save="saveAiTask"
    />

    <!-- Modal Konfirmasi Soal Berhasil Disimpan -->
    <Transition name="modal-fade">
      <div
        v-if="isSuccessModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="handleCloseSuccess"
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

          <h3 class="mt-5 text-xl font-bold text-[#222222] sm:text-2xl">Soal Berhasil Disimpan!</h3>

          <p class="mt-2 text-sm text-[#666666] sm:text-base leading-relaxed">
            Butir soal esai dan pilihan ganda buatan AI telah disetujui dan ditambahkan ke tugas
            kelas <strong>{{ currentClass.title }}</strong
            >.
          </p>

          <div class="mt-7 flex justify-center">
            <button
              type="button"
              class="cursor-pointer rounded-xl bg-[#2864E8] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1f50be] active:scale-95 sm:text-base"
              @click="handleCloseSuccess"
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
</style>
