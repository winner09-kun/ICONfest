<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = useRouter()

// State: 'upload' | 'scanning' | 'result'
const currentStep = ref('upload')

const fileInput = ref(null)
const selectedFiles = ref([])

// Scanning animation state
const scanProgress = ref(0)
const scanStatusText = ref('Menganalisis dokumen...')
let scanInterval = null

// Modal simpan
const isSavedModalOpen = ref(false)

// Data soal hasil scan (frontend mock sesuai tampilan gambar pengguna)
const scannedQuestions = ref([
  {
    id: 1,
    soal: 'ICONFEST diselenggarakan dimana?',
    jawaban: 'di Unsil Tasikmalaya',
    checked: true,
  },
])

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(event) {
  const files = Array.from(event.target.files || [])
  if (files.length > 0) {
    selectedFiles.value = [...selectedFiles.value, ...files]
  }
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1)
  if (selectedFiles.value.length === 0 && fileInput.value) {
    fileInput.value.value = ''
  }
}

function clearAllFiles() {
  selectedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Mulai proses scanning dengan animasi loading
function startScanning() {
  if (selectedFiles.value.length === 0) {
    selectedFiles.value = [
      {
        name: 'Lembar_Soal_ICONFEST_1.png',
        size: 320000,
      },
    ]
  }

  currentStep.value = 'scanning'
  scanProgress.value = 0
  scanStatusText.value = 'Membaca dokumen dan foto soal...'

  if (scanInterval) clearInterval(scanInterval)

  const startTime = Date.now()
  const duration = 2000

  scanInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(100, Math.floor((elapsed / duration) * 100))
    scanProgress.value = progress

    if (progress < 35) {
      scanStatusText.value = 'Membaca teks dari lembar foto...'
    } else if (progress < 75) {
      scanStatusText.value = 'AI mengekstrak butir soal & kunci jawaban...'
    } else {
      scanStatusText.value = 'Menyiapkan hasil koreksi soal...'
    }

    if (progress >= 100) {
      clearInterval(scanInterval)
      scanInterval = null
      setTimeout(() => {
        currentStep.value = 'result'
      }, 250)
    }
  }, 40)
}

// Toggle status centang soal oleh guru
function toggleQuestionCheck(index) {
  scannedQuestions.value[index].checked = !scannedQuestions.value[index].checked
}

// Centang semua / batalkan centang semua
const allChecked = computed(() => {
  return scannedQuestions.value.length > 0 && scannedQuestions.value.every((q) => q.checked)
})

function toggleCheckAll() {
  const target = !allChecked.value
  scannedQuestions.value.forEach((q) => {
    q.checked = target
  })
}

// Hitung soal yang dicentang
const checkedCount = computed(() => {
  return scannedQuestions.value.filter((q) => q.checked).length
})

// Simpan soal
function handleSave() {
  isSavedModalOpen.value = true
}

// Reset dan scan file baru
function resetScan() {
  currentStep.value = 'upload'
  isSavedModalOpen.value = false
  clearAllFiles()
}

// Teks dinamis banner atas saat tahap upload
const bannerTitle = computed(() => {
  return selectedFiles.value.length > 0
    ? `${selectedFiles.value.length} Dokumen / Foto Terdeteksi`
    : 'Selamat datang di KeyQuiz'
})

const bannerSubtitle = computed(() => {
  return selectedFiles.value.length > 0
    ? 'File & foto Anda siap dipindai dan dievaluasi secara otomatis oleh AI.'
    : 'Kelola kelas dan kuis kamu di satu tempat.'
})

// Teks dinamis kartu bawah saat tahap upload
const cardTitle = computed(() => {
  return selectedFiles.value.length > 0
    ? `${selectedFiles.value.length} File Berhasil Ditambahkan!`
    : 'Koreksi Jawaban Menggunakan AI'
})

const cardSubtitle = computed(() => {
  return selectedFiles.value.length > 0
    ? 'Anda dapat menambahkan foto lagi atau klik tombol di bawah untuk mulai memindai.'
    : 'Mendukung multi-upload: JPG, PNG, PDF, Word'
})

const buttonText = computed(() => {
  return selectedFiles.value.length > 0
    ? 'Mulai Koreksi AI'
    : 'Tambahkan Foto / File Anda'
})
</script>

<template>
  <DashboardLayout>
    <!-- ========================================== -->
    <!-- TAHAP 1: UPLOAD DOKUMEN                    -->
    <!-- ========================================== -->
    <div v-if="currentStep === 'upload'" class="space-y-4 sm:space-y-[22px]">
      <!-- Input file tersembunyi dengan dukungan multiple file -->
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        @change="onFileChange"
      />

      <!-- Bagian Atas: Banner Teks Dinamis -->
      <section
        class="flex min-h-[140px] items-center rounded-[1.5rem] bg-white p-6 transition-all duration-300 sm:min-h-[200px] sm:rounded-[2rem] sm:p-10 lg:h-[245px]"
      >
        <div class="transition-all duration-300">
          <h1 class="text-xl font-bold text-[#222222] sm:text-3xl">
            {{ bannerTitle }}
          </h1>
          <p class="mt-1 text-sm text-[#808080] sm:text-base">
            {{ bannerSubtitle }}
          </p>
        </div>
      </section>

      <!-- Bagian Bawah: Koreksi Jawaban Menggunakan AI -->
      <section
        class="flex flex-col items-center justify-center rounded-[1.5rem] bg-white px-5 py-12 text-center transition-all duration-300 sm:rounded-[2rem] sm:px-10 sm:py-16 lg:rounded-[2.5rem] lg:py-20"
      >
        <h2 class="text-xl font-bold text-[#222222] transition-all duration-300 sm:text-3xl lg:text-4xl">
          {{ cardTitle }}
        </h2>

        <p class="mt-2 text-sm text-[#555555] transition-all duration-300 sm:mt-3 sm:text-base lg:text-lg">
          {{ cardSubtitle }}
        </p>

        <!-- Informasi file-file yang terpilih (Multi-upload Support) -->
        <div
          v-if="selectedFiles.length > 0"
          class="mt-6 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl animate-fade-in"
        >
          <div
            v-for="(f, fIdx) in selectedFiles"
            :key="fIdx"
            class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs sm:text-sm text-[#222222] shadow-xs"
          >
            <!-- Ikon Foto/Dokumen -->
            <svg class="size-4 text-[#2864E8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="max-w-[150px] sm:max-w-[200px] truncate font-medium">
              {{ f.name }}
            </span>
            <span class="text-[11px] text-[#777777]">
              ({{ formatFileSize(f.size) }})
            </span>
            <!-- Tombol Hapus Satuan -->
            <button
              type="button"
              class="ml-1 cursor-pointer text-slate-400 transition hover:text-red-500"
              title="Hapus foto ini"
              @click="removeFile(fIdx)"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Tombol Aksi -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          <button
            type="button"
            class="cursor-pointer rounded-xl bg-[#2864E8] px-8 py-3.5 text-base font-semibold text-white shadow-md transition duration-200 hover:bg-[#1f52c4] hover:shadow-lg active:scale-[0.98] sm:px-10 sm:py-4 sm:text-lg"
            @click="selectedFiles.length > 0 ? startScanning() : triggerFileInput()"
          >
            {{ buttonText }}
          </button>

          <!-- Opsi Tambah Foto Lagi saat sudah ada foto yang dipilih -->
          <button
            v-if="selectedFiles.length > 0"
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#555555] transition hover:bg-slate-50 sm:text-base sm:py-4"
            @click="triggerFileInput"
          >
            + Tambah Foto Lain
          </button>
        </div>
      </section>
    </div>

    <!-- ========================================== -->
    <!-- TAHAP 2: ANIMASI SCANNING & LOADING AI     -->
    <!-- ========================================== -->
    <div
      v-else-if="currentStep === 'scanning'"
      class="flex min-h-[500px] flex-col items-center justify-center rounded-[1.5rem] bg-white p-8 text-center shadow-lg transition-all duration-300 sm:rounded-[2rem] sm:p-14 lg:h-[calc(100vh-140px)]"
    >
      <div class="relative flex flex-col items-center max-w-md w-full">
        <!-- Visual scanner animasi -->
        <div class="relative mb-8 flex size-28 items-center justify-center sm:size-36">
          <div class="absolute inset-0 rounded-3xl bg-[#2864E8]/15 blur-xl animate-pulse"></div>

          <div class="relative flex size-24 items-center justify-center rounded-2xl border-2 border-[#2864E8]/30 bg-blue-50/50 shadow-inner sm:size-28 overflow-hidden">
            <svg class="size-12 text-[#2864E8] sm:size-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="scanner-beam pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2864E8] to-transparent shadow-[0_0_12px_#2864E8]"></div>
          </div>

          <div class="absolute inset-0 rounded-3xl border border-[#2864E8]/40 animate-ping opacity-40"></div>
        </div>

        <h2 class="text-xl font-bold text-[#222222] sm:text-2xl">
          Memindai Soal Kuis
        </h2>
        <p class="mt-2 text-sm text-[#777777] sm:text-base">
          {{ scanStatusText }}
        </p>

        <!-- Progress Bar & Persentase -->
        <div class="mt-7 w-full max-w-xs">
          <div class="flex items-center justify-between text-xs font-semibold text-[#2864E8] mb-2">
            <span>Proses AI</span>
            <span>{{ scanProgress }}%</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full bg-gradient-to-r from-[#2864E8] to-[#558cf7] transition-all duration-100 ease-out shadow-[0_0_8px_#2864E8]"
              :style="{ width: `${scanProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Nama Dokumen / Jumlah Foto yang diproses -->
        <div class="mt-6 flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs text-[#555555]">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="truncate max-w-[240px]">
            {{ selectedFiles.length > 1 ? `${selectedFiles.length} Foto Soal Diproses` : selectedFiles[0]?.name || 'Dokumen Kuis' }}
          </span>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAHAP 3: HASIL SCAN SOAL (PERSIS SESUAI FOTO MOCKUP PENGGUNA)   -->
    <!-- ============================================================== -->
    <div v-else-if="currentStep === 'result'" class="space-y-4 sm:space-y-[22px]">
      <!-- 1. KOTAK PUTIH KOSONG ATAS (Sesuai Mockup Gambar Terbaru Pengguna) -->
      <section
        class="min-h-[140px] rounded-[1.5rem] bg-white p-6 shadow-sm sm:min-h-[180px] sm:rounded-[2rem] sm:p-8 lg:min-h-[220px]"
      />

      <!-- 2. KARTU SOAL HASIL SCAN (Sesuai Mockup Gambar: Pertanyaan, Garis Tipis, Jawaban, & Kotak Centang Biru) -->
      <div class="space-y-4 sm:space-y-[18px]">
        <div
          v-for="(item, index) in scannedQuestions"
          :key="item.id"
          class="flex items-center justify-between rounded-[1.5rem] bg-white p-6 shadow-sm transition duration-200 hover:shadow-md sm:rounded-[2rem] sm:p-8"
        >
          <!-- Sisi Kiri: Soal, Garis Pembatas, dan Jawaban -->
          <div class="min-w-0 flex-1 pr-6 sm:pr-10">
            <!-- Teks Pertanyaan -->
            <h2 class="text-lg font-bold text-[#222222] sm:text-xl lg:text-[22px] tracking-tight">
              {{ item.soal }}
            </h2>

            <!-- Garis Abu-abu Pembatas Tipis Sesuai Mockup -->
            <div class="my-3.5 h-[1.5px] w-full bg-[#d9d9d9]"></div>

            <!-- Teks Jawaban -->
            <div class="space-y-0.5">
              <span class="text-xs font-normal text-[#888888] sm:text-sm">
                Jawaban:
              </span>
              <p class="text-sm font-semibold text-[#222222] sm:text-base">
                {{ item.jawaban }}
              </p>
            </div>
          </div>

          <!-- Sisi Kanan: Kotak Centang Rounded Putih dengan Garis Border Biru & Checkmark Biru Sesuai Mockup -->
          <button
            type="button"
            class="flex size-11 sm:size-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 transition duration-200 active:scale-95 bg-white"
            :class="item.checked ? 'border-[#2864E8] text-[#2864E8]' : 'border-[#d0d0d0] text-transparent hover:border-[#2864E8]'"
            :aria-label="item.checked ? 'Batalkan centang soal' : 'Centang soal'"
            @click="toggleQuestionCheck(index)"
          >
            <svg
              class="size-7 transition-all duration-200"
              :class="item.checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 3. TOMBOL SIMPAN DI POJOK KANAN BAWAH (Sesuai Foto Mockup Gambar) -->
      <div class="flex justify-end pt-4 sm:pt-6">
        <button
          type="button"
          class="cursor-pointer rounded-2xl bg-[#2864E8] border border-white/80 px-10 py-3 text-base font-bold text-white shadow-md transition duration-200 hover:bg-[#1f52c4] hover:shadow-lg active:scale-95 sm:px-12 sm:py-3.5 sm:text-lg"
          @click="handleSave"
        >
          Simpan
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL POPUP: BERHASIL DISIMPAN             -->
    <!-- ========================================== -->
    <div
      v-if="isSavedModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-fade-in"
      @click.self="isSavedModalOpen = false"
    >
      <div class="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl animate-scale-up">
        <!-- Ikon Sukses -->
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:size-20">
          <svg class="size-8 sm:size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 class="mt-5 text-xl font-bold text-[#222222] sm:text-2xl">
          Soal Berhasil Disimpan!
        </h3>

        <p class="mt-2 text-sm text-[#666666] sm:text-base">
          Sebanyak <strong class="text-[#2864E8]">{{ checkedCount }}</strong> dari {{ scannedQuestions.length }} butir soal telah berhasil diverifikasi dan disimpan ke bank kuis.
        </p>

        <!-- Tombol Aksi Modal -->
        <div class="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <button
            type="button"
            class="cursor-pointer rounded-xl bg-[#2864E8] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1f52c4] active:scale-95 sm:text-base"
            @click="router.push('/beranda')"
          >
            Lihat di Beranda
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#555555] transition hover:bg-slate-50 sm:text-base"
            @click="resetScan"
          >
            Scan Soal Baru
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
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
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scanSweep {
  0% {
    top: 0%;
    opacity: 0.2;
  }
  50% {
    top: 90%;
    opacity: 1;
  }
  100% {
    top: 0%;
    opacity: 0.2;
  }
}

.scanner-beam {
  animation: scanSweep 1.8s ease-in-out infinite;
}
</style>
