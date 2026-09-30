<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuth } from '@/composables/useAuth.js'

import userIcon from '@/assets/icons/User.svg'
import messageIcon from '@/assets/icons/Message.svg'
import dateIcon from '@/assets/icons/Date_range.svg'
import phoneIcon from '@/assets/icons/Tablet.svg'

const router = useRouter()
const { user, login } = useAuth()

// Mode: false = Tampilan Info Profil, true = Mode Edit Formulir
const isEditing = ref(false)

const fileInputRef = ref(null)
const avatarUrl = ref(null)
const saveSuccess = ref(false)

const form = ref({
  fullName: user.value?.name || 'Ahmad Fauzi, M.Kom.',
  email: user.value?.email || 'ahmad.fauzi@unsil.ac.id',
  birthDate: '12/08/1992',
  phone: '081234567890',
  gender: 'laki-laki',
})
const savedForm = ref({ ...form.value })

function triggerPhotoUpload() {
  fileInputRef.value?.click()
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    if (avatarUrl.value) {
      URL.revokeObjectURL(avatarUrl.value)
    }
    avatarUrl.value = URL.createObjectURL(file)
  }
}

function handleSave() {
  saveSuccess.value = true
  // Update state auth sederhana
  if (user.value) {
    login({ email: form.value.email, name: form.value.fullName, role: user.value.role })
  }

  setTimeout(() => {
    saveSuccess.value = false
    isEditing.value = false
  }, 800)
}

function startEditing() {
  savedForm.value = { ...form.value }
  isEditing.value = true
}

function cancelEditing() {
  Object.assign(form.value, savedForm.value)
  isEditing.value = false
}
</script>

<template>
  <DashboardLayout>
    <div
      class="rounded-[1.5rem] bg-white p-6 sm:rounded-[2rem] sm:p-10 lg:rounded-[2.5rem] lg:p-12 transition-all duration-300"
    >
      <!-- ======================================================== -->
      <!-- MODE 1: TAMPILAN PROFIL / PENGATURAN (READ-ONLY + EDIT)  -->
      <!-- ======================================================== -->
      <div v-if="!isEditing" class="space-y-8 animate-fade-in">
        <!-- Header Judul dan Tombol Edit Profil -->
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ededed] pb-5"
        >
          <div>
            <h1 class="text-2xl font-bold text-[#222222] sm:text-3xl">Pengaturan Profil</h1>
            <p class="mt-1 text-xs text-[#777777] sm:text-sm">
              Kelola informasi data diri dan akun KeyQuiz Anda
            </p>
          </div>

          <!-- Tombol Edit Profil -->
          <button
            type="button"
            class="flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-[#2864E8] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f52c4] active:scale-95 self-start sm:self-auto"
            @click="startEditing"
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profil
          </button>
        </div>

        <!-- Kartu Identitas Akun -->
        <div
          class="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7 rounded-2xl bg-blue-50/40 border border-[#2864E8]/20 p-5 sm:p-6"
        >
          <div
            class="relative flex size-24 sm:size-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D9D9D9] shadow-inner"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Foto Profil"
              class="size-full object-cover"
            />
            <svg
              v-else
              class="size-full text-[#757575]"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="80" cy="62" r="28" fill="#757575" />
              <path d="M32 144C32 116 54 98 80 98C106 98 128 116 128 144" fill="#757575" />
            </svg>
          </div>

          <div class="text-center sm:text-left min-w-0 flex-1">
            <h2 class="text-xl font-bold text-[#222222] sm:text-2xl truncate">
              {{ form.fullName }}
            </h2>
            <p class="text-sm font-medium text-[#666666] truncate mt-0.5">{{ form.email }}</p>
            <span
              class="inline-block mt-2.5 rounded-full bg-[#2864E8] px-3 py-1 text-xs font-semibold text-white"
            >
              {{
                user?.role === 'student'
                  ? 'Siswa / Mahasiswa'
                  : 'Dosen Pengajar / Akun Terverifikasi'
              }}
            </span>
          </div>
        </div>

        <!-- Detail Informasi (Read-Only Fields) -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 pt-2">
          <!-- Nama Lengkap -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <span class="text-xs font-semibold text-[#888888] uppercase tracking-wider"
              >Nama Lengkap</span
            >
            <p class="mt-1 text-sm sm:text-base font-semibold text-[#222222]">
              {{ form.fullName }}
            </p>
          </div>

          <!-- Email -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <span class="text-xs font-semibold text-[#888888] uppercase tracking-wider">Email</span>
            <p class="mt-1 text-sm sm:text-base font-semibold text-[#222222]">{{ form.email }}</p>
          </div>

          <!-- Tanggal Lahir -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <span class="text-xs font-semibold text-[#888888] uppercase tracking-wider"
              >Tanggal Lahir</span
            >
            <p class="mt-1 text-sm sm:text-base font-semibold text-[#222222]">
              {{ form.birthDate || '-' }}
            </p>
          </div>

          <!-- No. HP -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <span class="text-xs font-semibold text-[#888888] uppercase tracking-wider"
              >No. Handphone</span
            >
            <p class="mt-1 text-sm sm:text-base font-semibold text-[#222222]">
              {{ form.phone || '-' }}
            </p>
          </div>

          <!-- Jenis Kelamin -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:col-span-2">
            <span class="text-xs font-semibold text-[#888888] uppercase tracking-wider"
              >Jenis Kelamin</span
            >
            <p class="mt-1 text-sm sm:text-base font-semibold text-[#222222] capitalize">
              {{ form.gender }}
            </p>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- MODE 2: FORM EDIT PROFIL (PERSIS SESUAI FOTO PENGGUNA)   -->
      <!-- ======================================================== -->
      <div v-else class="animate-fade-in">
        <!-- Tombol Kembali ke Ringkasan Profil -->
        <div class="mb-4 flex items-center justify-between border-b border-[#eee] pb-3">
          <button
            type="button"
            class="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2864E8] hover:underline cursor-pointer"
            @click="cancelEditing"
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Pengaturan
          </button>
          <span class="text-xs text-[#888888]">Mode Edit Profil</span>
        </div>

        <!-- Input file tersembunyi untuk ganti foto profil -->
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handlePhotoChange"
        />

        <!-- Bagian Avatar & Tombol Ubah Foto (Sesuai Foto) -->
        <div class="flex flex-col items-center justify-center text-center">
          <div
            class="relative flex size-36 items-center justify-center overflow-hidden rounded-full bg-[#D9D9D9] sm:size-44 shadow-inner"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Foto Profil"
              class="size-full object-cover"
            />
            <svg
              v-else
              class="size-full text-[#757575]"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="80" cy="62" r="28" fill="#757575" />
              <path d="M32 144C32 116 54 98 80 98C106 98 128 116 128 144" fill="#757575" />
            </svg>
          </div>

          <button
            type="button"
            class="mt-4 cursor-pointer rounded-xl bg-[#2864E8] px-7 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f52c4] active:scale-[0.98] sm:text-base"
            @click="triggerPhotoUpload"
          >
            Ubah Foto
          </button>
        </div>

        <!-- Form Pengaturan (Sesuai Foto) -->
        <form class="mt-8 space-y-6 sm:mt-12 sm:space-y-8" @submit.prevent="handleSave">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
            <!-- Nama Lengkap -->
            <div>
              <label
                for="fullName"
                class="mb-2 block text-sm font-normal text-[#222222] sm:text-base"
              >
                Nama Lengkap
              </label>
              <div class="relative flex items-center">
                <img
                  :src="userIcon"
                  alt=""
                  class="pointer-events-none absolute left-4 size-6 select-none opacity-60"
                />
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  class="h-12 w-full rounded-xl border border-[#808080] bg-white pl-13 pr-4 text-sm text-[#222222] outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-14 sm:text-base"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="mb-2 block text-sm font-normal text-[#222222] sm:text-base">
                Email
              </label>
              <div class="relative flex items-center">
                <img
                  :src="messageIcon"
                  alt=""
                  class="pointer-events-none absolute left-4 size-6 select-none opacity-60"
                />
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="Masukkan email"
                  class="h-12 w-full rounded-xl border border-[#808080] bg-white pl-13 pr-4 text-sm text-[#222222] outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-14 sm:text-base"
                />
              </div>
            </div>

            <!-- Tanggal Lahir -->
            <div>
              <label
                for="birthDate"
                class="mb-2 block text-sm font-normal text-[#222222] sm:text-base"
              >
                Tanggal Lahir
              </label>
              <div class="relative flex items-center">
                <img
                  :src="dateIcon"
                  alt=""
                  class="pointer-events-none absolute left-4 size-6 select-none opacity-60"
                />
                <input
                  id="birthDate"
                  v-model="form.birthDate"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  class="h-12 w-full rounded-xl border border-[#808080] bg-white pl-13 pr-4 text-sm text-[#222222] outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-14 sm:text-base"
                />
              </div>
            </div>

            <!-- No. HP -->
            <div>
              <label for="phone" class="mb-2 block text-sm font-normal text-[#222222] sm:text-base">
                No. HP
              </label>
              <div class="relative flex items-center">
                <img
                  :src="phoneIcon"
                  alt=""
                  class="pointer-events-none absolute left-4 size-6 select-none opacity-60"
                />
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  class="h-12 w-full rounded-xl border border-[#808080] bg-white pl-13 pr-4 text-sm text-[#222222] outline-none transition focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/20 sm:h-14 sm:text-base"
                />
              </div>
            </div>
          </div>

          <!-- Bagian Bawah: Jenis Kelamin & Tombol Simpan -->
          <div class="flex flex-col gap-6 pt-2 sm:flex-row sm:items-end sm:justify-between">
            <!-- Pilihan Jenis Kelamin -->
            <div>
              <label class="mb-3 block text-sm font-normal text-[#222222] sm:text-base">
                Jenis Kelamin
              </label>
              <div class="flex items-center gap-6">
                <label
                  class="flex cursor-pointer items-center gap-2.5 text-sm font-normal text-[#222222] sm:text-base"
                >
                  <input
                    v-model="form.gender"
                    type="radio"
                    value="laki-laki"
                    class="size-4.5 cursor-pointer accent-[#2864E8]"
                  />
                  <span>Laki-Laki</span>
                </label>

                <label
                  class="flex cursor-pointer items-center gap-2.5 text-sm font-normal text-[#222222] sm:text-base"
                >
                  <input
                    v-model="form.gender"
                    type="radio"
                    value="perempuan"
                    class="size-4.5 cursor-pointer accent-[#2864E8]"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>

            <!-- Tombol Batal & Simpan & Status -->
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="cursor-pointer rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#555555] transition hover:bg-slate-50 sm:text-base sm:py-3.5"
                @click="cancelEditing"
              >
                Batal
              </button>

              <span v-if="saveSuccess" class="text-sm font-semibold text-emerald-600 transition">
                ✓ Berhasil disimpan
              </span>

              <button
                type="submit"
                class="cursor-pointer rounded-xl bg-[#2864E8] px-10 py-3 text-base font-semibold text-white shadow-md transition duration-200 hover:bg-[#1f52c4] hover:shadow-lg active:scale-[0.98] sm:px-12 sm:py-3.5"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
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
  animation: fadeIn 0.22s ease-out forwards;
}
</style>
