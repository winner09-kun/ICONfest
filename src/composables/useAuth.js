import { computed, ref } from 'vue'

// Auth sementara (tanpa backend): data user disimpan di localStorage.
// Nanti tinggal ganti isi login()/logout() dengan panggilan API.
const STORAGE_KEY = 'keyquiz:user'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

// module-level: semua komponen berbagi state yang sama
const user = ref(load())

function nameFromEmail(email) {
  const base = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim()
  return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Pengguna'
}

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value)

  function login({ email, name, role }) {
    const existingRole = user.value?.email === email ? user.value.role : null
    user.value = {
      email,
      name: name || nameFromEmail(email),
      role: role || existingRole || 'teacher',
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    } catch {
      /* storage tidak tersedia */
    }
  }

  function logout() {
    user.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage tidak tersedia */
    }
  }

  return { user, isLoggedIn, login, logout }
}
