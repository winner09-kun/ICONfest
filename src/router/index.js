import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/daftar', name: 'register', component: RegisterView },
    { path: '/beranda', name: 'beranda', component: DashboardView },
    { path: '/scan-soal', name: 'scan-soal', component: PlaceholderView, meta: { title: 'Scan Soal' } },
    { path: '/pengaturan', name: 'pengaturan', component: PlaceholderView, meta: { title: 'Pengaturan' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
