<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = useRouter()

// State: 'upload' | 'scanning' | 'result'
const currentStep = ref('upload')

const fileInput = ref(null)
const selectedFile = ref(null)

// Scanning animation state
const scanProgress = ref(0)
const scanStatusText = ref('Menganalisis dokumen...')
let scanInterval = null

// Modal simpan
const isSavedModalOpen = ref(false)

// Data soal hasil scan (frontend mock)
const scannedQuestions = ref([
  {
    id: 1,
    title: 'Soal 1',
    soal: 'Jelaskan fungsi utama mitokondria di dalam sel eukariotik dan sebutkan zat energi yang dihasilkannya!',
    jawaban: 'Mitokondria berfungsi sebagai pusat respirasi seluler yang menghasilkan energi kimia dalam bentuk Adenosin Trifosfat (ATP).',
    checked: true,
  },
  {
    id: 2,
    title: 'Soal 2',
    soal: 'Sebutkan 3 perbedaan utama antara sel tumbuhan dan sel hewan yang dapat diamati secara struktural!',
    jawaban: '1) Sel tumbuhan memiliki dinding sel kaku, 2) memiliki kloroplas untuk fotosintesis, dan 3) memiliki vakuola sentral yang berukuran besar.',
    checked: true,
  },
  {
    id: 3,
    title: 'Soal 3',
    soal: 'Apa yang dimaksud dengan proses osmosis pada membran semipermeabel sel?',
    jawaban: 'Osmosis adalah perpindahan molekul pelarut (seperti air) dari larutan berkonsentrasi rendah (hipotonik) menuju larutan berkonsentrasi lebih tinggi (hipertonik) melalui membran semipermeabel.',
    checked: false,
  },
])

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

function removeFile() {
  selectedFile.value = null
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
  // Jika belum ada file yang dipilih, gunakan dokumen contoh agar guru bisa langsung coba
  if (!selectedFile.value) {
    selectedFile.value = {
      name: 'Lembar_Ujian_Biologi_X.pdf',
      size: 245000,
    }
  }

  currentStep.value = 'scanning'
  scanProgress.value = 0
  scanStatusText.value = 'Membaca struktur lembar kuis...'

  if (scanInterval) clearInterval(scanInterval)

  const startTime = Date.now()
  const duration = 2000 // 2 detik loading animation

  scanInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(100, Math.floor((elapsed / duration) * 100))
    scanProgress.value = progress

    if (progress < 35) {
      scanStatusText.value = 'Membaca struktur lembar dokumen...'
    } else if (progress < 75) {
      scanStatusText.value = 'AI mengekstrak butir soal & kunci jawaban...'
    } else {
      scanStatusText.value = 'Menyiapkan lembar koreksi untuk guru...'
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
  removeFile()
}

// Teks dinamis banner atas saat tahap upload
const bannerTitle = computed(() => {
  return selectedFile.value
    ? 'Dokumen Kuis Terdeteksi'
    : 'Selamat datang di KeyQuiz'
})

const bannerSubtitle = computed(() => {
  return selectedFile.value
    ? 'File Anda siap dipindai dan dievaluasi secara otomatis oleh AI.'
    : 'Kelola kelas dan kuis kamu di satu tempat.'
})

// Teks dinamis kartu bawah saat tahap upload
const cardTitle = computed(() => {
  return selectedFile.value
    ? 'File Berhasil Ditambahkan!'
    : 'Koreksi Jawaban Menggunakan AI'
})

const cardSubtitle = computed(() => {
  return selectedFile.value
    ? 'Klik tombol di bawah untuk memulai penilaian dan koreksi otomatis.'
    : 'Mendukung file PDF, Word, PNG, JPG'
})

const buttonText = computed(() => {
  return selectedFile.value
    ? 'Mulai Koreksi AI'
    : 'Tambahkan File Anda'
})
</script>

<template>
  <DashboardLayout>
    <!-- ========================================== -->
    <!-- TAHAP 1: UPLOAD DOKUMEN                    -->
    <!-- ========================================== -->
    <div v-if="currentStep === 'upload'" class="space-y-4 sm:space-y-[22px]">
      <!-- Input file tersembunyi -->
      <input
        ref="fileInput"
        type="file"
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

        <!-- Informasi file yang terpilih -->
        <div
          v-if="selectedFile"
          class="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm text-[#222222] shadow-sm animate-fade-in"
        >
          <!-- Ikon Dokumen -->
          <svg class="size-5 text-[#2864E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="max-w-[220px] truncate font-medium sm:max-w-sm">
            {{ selectedFile.name }}
          </span>
          <span class="text-xs text-[#777777]">
            ({{ formatFileSize(selectedFile.size) }})
          </span>
          <!-- Tombol Hapus / Batal -->
          <button
            type="button"
            class="ml-2 cursor-pointer text-slate-400 transition hover:text-red-500"
            title="Hapus file"
            @click="removeFile"
          >
            <svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tombol Aksi -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          <button
            type="button"
            class="cursor-pointer rounded-xl bg-[#2864E8] px-8 py-3.5 text-base font-semibold text-white shadow-md transition duration-200 hover:bg-[#1f52c4] hover:shadow-lg active:scale-[0.98] sm:px-10 sm:py-4 sm:text-lg"
            @click="selectedFile ? startScanning() : triggerFileInput()"
          >
            {{ buttonText }}
          </button>

          <!-- Opsi ganti file saat file sudah dipilih -->
          <button
            v-if="selectedFile"
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#555555] transition hover:bg-slate-50 sm:text-base sm:py-4"
            @click="triggerFileInput"
          >
            Ganti File
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
          <!-- Glow pulsing background -->
          <div class="absolute inset-0 rounded-3xl bg-[#2864E8]/15 blur-xl animate-pulse"></div>

          <!-- Document icon frame -->
          <div class="relative flex size-24 items-center justify-center rounded-2xl border-2 border-[#2864E8]/30 bg-blue-50/50 shadow-inner sm:size-28 overflow-hidden">
            <!-- Icon Document -->
            <svg class="size-12 text-[#2864E8] sm:size-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>

            <!-- Laser Scanning Beam Animation -->
            <div class="scanner-beam pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2864E8] to-transparent shadow-[0_0_12px_#2864E8]"></div>
          </div>

          <!-- Circular radar ping -->
          <div class="absolute inset-0 rounded-3xl border border-[#2864E8]/40 animate-ping opacity-40"></div>
        </div>

        <!-- Judul Proses -->
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

        <!-- Nama Dokumen yang diproses -->
        <div class="mt-6 flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs text-[#555555]">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="truncate max-w-[240px]">{{ selectedFile?.name || 'Dokumen Kuis' }}</span>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAHAP 3: HASIL SCAN SOAL (Mockup Layout)    -->
    <!-- ========================================== -->
    <div v-else-if="currentStep === 'result'" class="space-y-4 sm:space-y-[22px]">
      <!-- 1. KOTAK PUTIH ATAS (Sesuai Mockup Gambar) -->
      <section
        class="flex flex-col justify-between rounded-[1.5rem] bg-white p-6 sm:rounded-[2rem] sm:p-8 lg:min-h-[220px] shadow-sm transition-all"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2864E8]">
                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Hasil Pindai Selesai
              </span>
              <span class="text-xs text-[#777777]">
                {{ selectedFile?.name || 'Dokumen Kuis' }}
              </span>
            </div>
            <h1 class="mt-2 text-xl font-bold text-[#222222] sm:text-2xl lg:text-3xl">
              Verifikasi Butir Soal & Kunci Jawaban
            </h1>
            <p class="mt-1 text-sm text-[#777777] sm:text-base">
              Centang butir soal yang sesuai untuk disimpan ke bank kuis. Anda juga dapat meninjau langsung hasil koreksi AI.
            </p>
          </div>

          <!-- Tombol Navigasi / Kontrol Atas -->
          <div class="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <button
              type="button"
              class="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#555555] transition hover:bg-slate-50 hover:text-[#2864E8] sm:text-sm"
              @click="toggleCheckAll"
            >
              {{ allChecked ? 'Batal Centang Semua' : 'Centang Semua' }}
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#555555] transition hover:bg-slate-50 hover:text-red-500 sm:text-sm"
              @click="resetScan"
            >
              Scan Ulang
            </button>
          </div>
        </div>

        <!-- Status Bar Ringkasan di dalam kotak atas -->
        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs sm:text-sm text-[#666666]">
          <div class="flex items-center gap-4">
            <span>Total Soal: <strong class="text-[#222222]">{{ scannedQuestions.length }}</strong></span>
            <span>Tercentang: <strong class="text-[#2864E8]">{{ checkedCount }}</strong></span>
          </div>
          <span class="text-xs text-[#888888]">Tips: Klik tombol centang di sebelah kanan tiap kartu soal</span>
        </div>
      </section>

      <!-- 2. KARTU-KARTU SOAL (Sesuai Mockup Gambar) -->
      <div class="space-y-4 sm:space-y-[18px]">
        <div
          v-for="(item, index) in scannedQuestions"
          :key="item.id"
          class="flex items-center justify-between rounded-[1.5rem] bg-white p-6 shadow-sm transition duration-200 hover:shadow-md sm:rounded-[2rem] sm:p-7"
          :class="{ 'ring-2 ring-white/60': item.checked }"
        >
          <!-- Konten Kiri: Soal, Garis Pembatas, dan Jawaban -->
          <div class="min-w-0 flex-1 pr-4 sm:pr-8">
            <!-- Bagian Soal -->
            <div>
              <div class="text-lg font-bold text-[#222222] sm:text-xl">
                {{ item.title }}
              </div>
              <p class="mt-1 text-sm text-[#444444] sm:text-base leading-relaxed">
                {{ item.soal }}
              </p>
            </div>

            <!-- Garis Abu-abu Pembatas (Sesuai Mockup) -->
            <div class="my-3.5 h-[1px] w-full bg-slate-200"></div>

            <!-- Bagian Jawaban -->
            <div>
              <div class="text-xs font-semibold uppercase tracking-wider text-[#888888]">
                Jawaban
              </div>
              <p class="mt-0.5 text-sm font-medium text-[#2864E8] sm:text-base leading-relaxed">
                {{ item.jawaban }}
              </p>
            </div>
          </div>

          <!-- Konten Kanan: Kotak Centang Rounded (Sesuai Mockup) -->
          <button
            type="button"
            class="relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl transition duration-200 sm:size-12 sm:rounded-2xl active:scale-95"
            :class="[
              item.checked
                ? 'bg-[#2864E8] text-white shadow-md shadow-[#2864E8]/30 ring-2 ring-[#2864E8]/20'
                : 'bg-[#d8dfea] text-transparent hover:bg-[#cbd5e1]'
            ]"
            :aria-label="item.checked ? 'Batalkan centang soal ' + item.title : 'Centang soal ' + item.title"
            @click="toggleQuestionCheck(index)"
          >
            <!-- Ikon Centang (Checkmark) -->
            <svg
              class="size-6 transition-transform duration-200"
              :class="item.checked ? 'scale-100' : 'scale-50 opacity-0'"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 3. TOMBOL SIMPAN DI POJOK KANAN BAWAH (Sesuai Mockup Gambar) -->
      <div class="flex justify-end pt-2 sm:pt-4">
        <button
          type="button"
          class="cursor-pointer rounded-xl border border-white bg-[#2864E8] px-8 py-3 text-base font-semibold text-white shadow-md transition duration-200 hover:bg-[#1f52c4] hover:shadow-lg active:scale-95 sm:px-10 sm:py-3.5 sm:text-lg"
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
