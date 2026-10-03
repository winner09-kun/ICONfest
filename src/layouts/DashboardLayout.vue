<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import logo from '@/assets/logo-dashboard.svg'
import IconBell from '@/components/icons/IconBell.vue'
import IconUserCircle from '@/components/icons/IconUserCircle.vue'
import SidebarNav from '@/components/dashboard/SidebarNav.vue'
import ProfilePopup from '@/components/dashboard/ProfilePopup.vue'
import NotificationPopup from '@/components/dashboard/NotificationPopup.vue'

const isProfileOpen = ref(false)
const isNotificationOpen = ref(false)
const router = useRouter()
const { user, logout } = useAuth()

const notifications = ref([
  {
    id: 1,
    title: 'Tugas Baru Diterbitkan',
    desc: 'Tugas Pemrograman Perangkat Bergerak telah ditambahkan.',
    time: '10 menit lalu',
    read: false,
  },
  {
    id: 2,
    title: 'Hasil Evaluasi Kuis Keluar',
    desc: 'Nilai esai otomatis Anda untuk Bab 3 sudah selesai dihitung.',
    time: '1 jam lalu',
    read: false,
  },
  {
    id: 3,
    title: 'Pengumuman Kelas',
    desc: 'Pertemuan esok hari akan berlangsung daring via Google Meet.',
    time: 'Kemarin',
    read: true,
  },
])

function toggleNotification() {
  isNotificationOpen.value = !isNotificationOpen.value
  if (isNotificationOpen.value) {
    isProfileOpen.value = false
  }
}

function toggleProfile() {
  isProfileOpen.value = !isProfileOpen.value
  if (isProfileOpen.value) {
    isNotificationOpen.value = false
  }
}

function markAllNotificationsRead() {
  notifications.value.forEach((n) => {
    n.read = true
  })
}

function closeProfile() {
  isProfileOpen.value = false
}

// "Tambahkan Akun" -> ke halaman login (akun lama tetap tersimpan sampai login baru)
function handleAddAccount() {
  closeProfile()
  router.push('/login')
}

// "Keluar dari semua akun" -> hapus sesi lalu kembali ke login
function handleSignOut() {
  closeProfile()
  logout()
  router.push('/login')
}

// "Kelola Akun Google Anda" -> halaman akun Google di tab baru
function handleManageGoogle() {
  closeProfile()
  window.open('https://myaccount.google.com/', '_blank', 'noopener,noreferrer')
}

defineProps({
  noScroll: { type: Boolean, default: false },
})
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col bg-white">
    <!-- Header (Navbar Atas) - Fixed / Terkunci di atas -->
    <header
      class="sticky top-0 z-30 flex h-[56px] lg:h-[68px] shrink-0 items-center justify-between border-b border-[#bdbdbd] bg-white px-5 sm:px-8 lg:px-9"
    >
      <RouterLink to="/beranda" aria-label="KeyQuiz — Beranda">
        <img :src="logo" alt="KeyQuiz" class="h-8 w-auto sm:h-10 lg:h-11" />
      </RouterLink>

      <div class="flex items-center gap-3 sm:gap-5">
        <!-- Notifikasi -->
        <div class="relative">
          <button
            type="button"
            class="relative cursor-pointer text-[#33363F] transition hover:text-[#2864E8]"
            :class="{ 'text-[#2864E8]': isNotificationOpen }"
            aria-label="Notifikasi"
            :aria-expanded="isNotificationOpen"
            @click="toggleNotification"
          >
            <IconBell class="size-7 sm:size-9" />
            <span
              v-if="notifications.some((n) => !n.read)"
              class="absolute top-1 right-1 size-2.5 rounded-full bg-[#E53935] ring-2 ring-white sm:top-1.5 sm:right-1.5"
            />
          </button>

          <NotificationPopup
            v-model:open="isNotificationOpen"
            :notifications="notifications"
            @mark-all-read="markAllNotificationsRead"
          />
        </div>

        <!-- Profil -->
        <div class="relative">
          <button
            type="button"
            class="cursor-pointer text-[#222222] transition hover:text-[#2864E8]"
            :class="{ 'text-[#2864E8]': isProfileOpen }"
            aria-label="Profil"
            :aria-expanded="isProfileOpen"
            @click="toggleProfile"
          >
            <IconUserCircle class="size-8 sm:size-10" />
          </button>

          <ProfilePopup
            v-model:open="isProfileOpen"
            :name="user?.name || 'Pengguna'"
            :email="user?.email || 'Belum masuk'"
            @add-account="handleAddAccount"
            @sign-out="handleSignOut"
            @manage-google="handleManageGoogle"
          />
        </div>
      </div>
    </header>

    <!-- Body Layout: Sidebar + Main Area -->
    <div class="flex flex-1 min-h-0 overflow-hidden">
      <!-- Sidebar (desktop) / bottom nav (mobile) - Terkunci & tidak ikut scroll -->
      <aside
        class="hidden w-[156px] shrink-0 overflow-y-auto border-r border-[#ededed] bg-white md:block lg:w-[200px] xl:w-[240px]"
      >
        <SidebarNav />
      </aside>

      <!-- Bottom Nav untuk Mobile/Tablet -->
      <div class="md:hidden">
        <SidebarNav />
      </div>

      <!-- Konten Utama: Scrollable Mandiri dengan latar biru -->
      <main
        class="flex-1 bg-[#2864E8] p-3 pb-24 sm:p-5 sm:pb-24 lg:p-[25px] lg:pb-[25px] flex flex-col"
        :class="noScroll ? 'overflow-hidden' : 'overflow-y-auto'"
      >
        <div
          class="animate-content-fade flex-1 flex flex-col"
          :class="noScroll ? 'min-h-0' : 'min-h-max'"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@keyframes contentFade {
  from {
    opacity: 0.6;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-content-fade {
  animation: contentFade 0.22s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-content-fade {
    animation: none !important;
  }
}
</style>
