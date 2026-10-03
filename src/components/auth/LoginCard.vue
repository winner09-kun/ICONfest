<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import TextField from '@/components/ui/TextField.vue'
import SelectField from '@/components/ui/SelectField.vue'

const email = ref('')
const password = ref('')
const role = ref('teacher')
const roles = [
  { value: 'teacher', label: 'Dosen' },
  { value: 'student', label: 'Mahasiswa' },
]

const router = useRouter()
const { login } = useAuth()

// Sementara tanpa backend: anggap login berhasil, simpan user, lalu ke beranda.
// TODO: ganti dengan panggilan API autentikasi.
function onSubmit() {
  login({ email: email.value, role: role.value })
  router.push('/beranda')
}
</script>

<template>
  <div
    class="w-full rounded-[2rem] border border-[#222222] bg-white p-6 sm:rounded-[2.75rem] sm:p-10"
  >
    <h2 class="text-xl font-semibold text-[#111111] sm:text-3xl">Masuk ke KeyQuiz</h2>

    <form class="mt-6 space-y-4 sm:mt-8 sm:space-y-5" @submit.prevent="onSubmit">
      <TextField id="email" v-model="email" label="Email" type="email" autocomplete="email" />
      <TextField
        id="password"
        v-model="password"
        label="Kata Sandi"
        type="password"
        autocomplete="current-password"
      />
      <SelectField id="login-role" v-model="role" label="Masuk sebagai" :options="roles" />

      <div class="text-right">
        <a href="#" class="text-sm font-semibold text-[#2864E8] hover:underline sm:text-base"
          >Lupa kata sandi</a
        >
      </div>

      <button
        type="submit"
        class="motion-control h-12 w-full cursor-pointer rounded-lg border border-[#1f52c4] bg-[#2864E8] text-base font-semibold text-white transition hover:bg-[#1f52c4] sm:h-14 sm:text-lg"
      >
        Masuk
      </button>

      <p class="text-center text-sm text-[#777777]">
        Belum punya akun?
        <RouterLink to="/daftar" class="font-semibold text-[#2864E8] hover:underline"
          >Daftar</RouterLink
        >
      </p>
    </form>
  </div>
</template>
