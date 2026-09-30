<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import TextField from '@/components/ui/TextField.vue'
import SelectField from '@/components/ui/SelectField.vue'

const email = ref('')
const fullName = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')
const router = useRouter()
const { login } = useAuth()

const roles = [
  { value: 'teacher', label: 'Guru / Dosen' },
  { value: 'student', label: 'Siswa / Mahasiswa' },
]

const mismatch = computed(
  () => confirmPassword.value !== '' && password.value !== confirmPassword.value,
)

// TODO: sambungkan ke backend nanti. Untuk sekarang hanya validasi dasar di sisi klien.
function onSubmit() {
  if (mismatch.value || !role.value) return
  login({ email: email.value, name: fullName.value, role: role.value })
  router.push('/beranda')
}
</script>

<template>
  <div
    class="w-full rounded-[2rem] border border-[#222222] bg-white p-6 sm:rounded-[2.75rem] sm:p-10"
  >
    <h2 class="text-xl font-semibold text-[#111111] sm:text-3xl">Daftar ke KeyQuiz</h2>

    <form class="mt-6 space-y-4 sm:mt-8 sm:space-y-5" @submit.prevent="onSubmit">
      <TextField id="email" v-model="email" label="Email" type="email" autocomplete="email" />
      <TextField id="fullName" v-model="fullName" label="Nama Lengkap" autocomplete="name" />

      <!-- kata sandi & konfirmasi berdampingan (bertumpuk di layar sangat kecil) -->
      <div class="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-3">
        <TextField
          id="password"
          v-model="password"
          label="Kata Sandi"
          type="password"
          autocomplete="new-password"
        />
        <TextField
          id="confirmPassword"
          v-model="confirmPassword"
          label="Konfirmasi Kata Sandi"
          type="password"
          autocomplete="new-password"
        />
      </div>
      <p v-if="mismatch" class="-mt-2 text-sm text-red-600" role="alert">
        Kata sandi dan konfirmasi belum sama.
      </p>

      <SelectField
        id="role"
        v-model="role"
        label="Pilih Peran"
        placeholder="Pilih Peran"
        :options="roles"
      />

      <button
        type="submit"
        class="mt-2 h-12 w-full cursor-pointer rounded-lg border border-[#1f52c4] bg-[#2864E8] text-base font-semibold text-white transition hover:bg-[#1f52c4] sm:h-14 sm:text-lg"
      >
        Daftar
      </button>

      <div class="flex items-center gap-3 text-sm text-[#777777]">
        <span class="h-px flex-1 bg-[#8a8a8a]" /> Atau <span class="h-px flex-1 bg-[#8a8a8a]" />
      </div>

      <button
        type="button"
        class="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#8a8a8a] bg-white text-base font-semibold text-[#111111] transition hover:bg-gray-50 sm:h-14 sm:text-lg"
      >
        <svg width="26" height="26" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        Google
      </button>

      <p class="text-center text-sm text-[#777777]">
        Sudah punya akun?
        <RouterLink to="/login" class="font-semibold text-[#2864E8] hover:underline"
          >Masuk</RouterLink
        >
      </p>
    </form>
  </div>
</template>
