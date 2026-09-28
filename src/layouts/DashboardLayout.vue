<script setup>
import { ref } from 'vue'
import logo from '@/assets/logo-dashboard.svg'
import IconBell from '@/components/icons/IconBell.vue'
import IconUserCircle from '@/components/icons/IconUserCircle.vue'
import SidebarNav from '@/components/dashboard/SidebarNav.vue'
import ProfilePopup from '@/components/dashboard/ProfilePopup.vue'

const isProfileOpen = ref(false)
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 grid-rows-[56px_1fr] bg-white lg:grid-cols-[240px_1fr] lg:grid-rows-[68px_1fr]">
    <!-- Header -->
    <header class="z-20 flex items-center justify-between border-b border-[#bdbdbd] bg-white px-5 sm:px-8 lg:col-span-2 lg:px-9">
      <RouterLink to="/beranda" aria-label="KeyQuiz — Beranda">
        <img :src="logo" alt="KeyQuiz" class="h-8 w-auto sm:h-10 lg:h-11" />
      </RouterLink>

      <div class="flex items-center gap-3 sm:gap-5">
        <button type="button" class="cursor-pointer text-[#33363F] transition hover:text-[#2864E8]" aria-label="Notifikasi">
          <IconBell class="size-7 sm:size-9" />
        </button>

        <div class="relative">
          <button
            type="button"
            class="cursor-pointer text-[#222222] transition hover:text-[#2864E8]"
            :class="{ 'text-[#2864E8]': isProfileOpen }"
            aria-label="Profil"
            :aria-expanded="isProfileOpen"
            @click="isProfileOpen = !isProfileOpen"
          >
            <IconUserCircle class="size-8 sm:size-10" />
          </button>

          <ProfilePopup
            v-model:open="isProfileOpen"
            @add-account="isProfileOpen = false"
            @sign-out="isProfileOpen = false"
            @manage-google="isProfileOpen = false"
          />
        </div>
      </div>
    </header>

    <!-- Sidebar (desktop) / bottom nav (mobile) -->
    <aside class="bg-white">
      <SidebarNav />
    </aside>

    <!-- Konten: latar biru -->
    <main class="bg-[#2864E8] p-3 pb-24 sm:p-5 sm:pb-24 lg:p-[25px] lg:pb-[25px]">
      <slot />
    </main>
  </div>
</template>
