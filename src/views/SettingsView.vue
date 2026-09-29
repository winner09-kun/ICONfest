<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuth } from '@/composables/useAuth.js'

import userIcon from '@/assets/icons/User.svg'
import messageIcon from '@/assets/icons/Message.svg'
import dateIcon from '@/assets/icons/Date_range.svg'
import phoneIcon from '@/assets/icons/Tablet.svg'

const { user } = useAuth()

const fileInputRef = ref(null)
const avatarUrl = ref(null)
const saveSuccess = ref(false)

const form = ref({
  fullName: user.value?.name || '',
  email: user.value?.email || '',
  birthDate: '',
  phone: '',
  gender: 'laki-laki',
})

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
  setTimeout(() => {
    saveSuccess.value = false
  }, 3000)
}
</script>

<template>
  <DashboardLayout>
    <div
      class="rounded-[1.5rem] bg-white p-6 sm:rounded-[2rem] sm:p-10 lg:rounded-[2.5rem] lg:p-12"
    >
      <!-- Input file tersembunyi untuk ganti foto profil -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handlePhotoChange"
      />

      <!-- Bagian Avatar & Tombol Ubah Foto -->
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
          <!-- Avatar Placeholder bawaan jika belum ada foto baru -->
          <svg
            v-else
            class="size-full text-[#757575]"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Kepala -->
            <circle cx="80" cy="62" r="28" fill="#757575" />
            <!-- Bahu / Badan -->
            <path
              d="M32 144C32 116 54 98 80 98C106 98 128 116 128 144"
              fill="#757575"
            />
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

      <!-- Form Pengaturan -->
      <form class="mt-8 space-y-6 sm:mt-12 sm:space-y-8" @submit.prevent="handleSave">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
          <!-- Nama Lengkap -->
          <div>
            <label for="fullName" class="mb-2 block text-sm font-normal text-[#222222] sm:text-base">
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
            <label for="birthDate" class="mb-2 block text-sm font-normal text-[#222222] sm:text-base">
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
              <label class="flex cursor-pointer items-center gap-2.5 text-sm font-normal text-[#222222] sm:text-base">
                <input
                  v-model="form.gender"
                  type="radio"
                  value="laki-laki"
                  class="size-4.5 cursor-pointer accent-[#2864E8]"
                />
                <span>Laki-Laki</span>
              </label>

              <label class="flex cursor-pointer items-center gap-2.5 text-sm font-normal text-[#222222] sm:text-base">
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

          <!-- Tombol Simpan & Status -->
          <div class="flex items-center gap-4">
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
  </DashboardLayout>
</template>
