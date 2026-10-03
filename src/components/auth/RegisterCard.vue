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
  { value: 'teacher', label: 'Dosen' },
  { value: 'student', label: 'Mahasiswa' },
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
        class="motion-control mt-2 h-12 w-full cursor-pointer rounded-lg border border-[#1f52c4] bg-[#2864E8] text-base font-semibold text-white transition hover:bg-[#1f52c4] sm:h-14 sm:text-lg"
      >
        Daftar
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
