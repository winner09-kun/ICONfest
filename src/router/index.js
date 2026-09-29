import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import AuthView from '@/views/AuthView.vue'
import DashboardView from '@/views/DashboardView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'
import ScanSoalView from '@/views/ScanSoalView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useLoading } from '@/composables/useLoading.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/login', name: 'login', component: AuthView },
    { path: '/daftar', name: 'register', component: AuthView },
    { path: '/beranda', name: 'beranda', component: DashboardView },
    {
      path: '/scan-soal',
      name: 'scan-soal',
      component: ScanSoalView,
      meta: { title: 'Scan Soal' },
    },
    {
      path: '/pengaturan',
      name: 'pengaturan',
      component: SettingsView,
      meta: { title: 'Pengaturan' },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

// Trigger loading screen pada navigasi antar halaman
router.beforeEach((to, from) => {
  const { triggerLoading } = useLoading()

  const isAuth = (path) => path === '/login' || path === '/daftar'
  const isDashboard = (path) => ['/beranda', '/scan-soal', '/pengaturan'].includes(path)

  // Initial load ditangani oleh onMounted di LoadingScreen
  if (!from.name) {
    return
  }

  // 1. Tiap masuk ke landing page
  if (to.path === '/') {
    triggerLoading('Menuju Halaman Utama...', 600)
    return
  }

  // 2. Pas pindah ke halaman login / daftar (dari luar auth, misal dari landing atau dashboard)
  if (isAuth(to.path) && !isAuth(from.path)) {
    triggerLoading(to.path === '/login' ? 'Menyiapkan Halaman Masuk...' : 'Menyiapkan Halaman Daftar...', 600)
    return
  }

  // 3. Pas masuk ke dashboard (misal setelah login atau dari halaman lain)
  if (isDashboard(to.path) && !isDashboard(from.path)) {
    triggerLoading('Menyiapkan Dashboard...', 650)
    return
  }
})

export default router
