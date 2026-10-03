<script>
// State di level module: tersimpan di memori JavaScript selama sesi SPA,
// sehingga saat halaman berpindah dan komponen di-remount, posisi sebelumnya tetap diingat!
let prevNavIndex = 0
</script>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import IconHome from '@/components/icons/IconHome.vue'
import IconScan from '@/components/icons/IconScan.vue'
import IconSettings from '@/components/icons/IconSettings.vue'

const route = useRoute()
const { user } = useAuth()

const teacherItems = [
  { to: '/beranda', label: 'Beranda', icon: IconHome },
  { to: '/scan-soal', label: 'Scan Soal', icon: IconScan },
  { to: '/pengaturan', label: 'Pengaturan', icon: IconSettings },
]
const studentItems = [
  { to: '/beranda', label: 'Beranda', icon: IconHome },
  { to: '/pengaturan', label: 'Pengaturan', icon: IconSettings },
]
const items = computed(() => (user.value?.role === 'student' ? studentItems : teacherItems))

// Index target berdasarkan rute aktif saat ini
const targetIndex = computed(() => {
  const index = items.value.findIndex((item) => route.path.startsWith(item.to))
  return index < 0 ? 0 : index
})

// Posisi pill desktop (dimulai dari posisi sebelumnya untuk menganimasikan perpindahan)
const desktopPillIndex = ref(prevNavIndex)
const isAnimated = ref(false)

// Item yang sedang di-hover
const hoveredIndex = ref(null)

onMounted(() => {
  // Jika datang dari tab berbeda, mulai dari posisi lama lalu glide ke posisi baru
  desktopPillIndex.value = prevNavIndex

  nextTick(() => {
    // Aktifkan transisi halus setelah frame pertama
    requestAnimationFrame(() => {
      isAnimated.value = true
      desktopPillIndex.value = targetIndex.value
      prevNavIndex = targetIndex.value
    })
  })
})

// Pantau perubahan rute jika navigasi terjadi tanpa remount
watch(targetIndex, (newIdx) => {
  desktopPillIndex.value = newIdx
  prevNavIndex = newIdx
})

// Helper untuk cek apakah item sedang aktif (termasuk sub-halaman)
function isItemActive(index) {
  return targetIndex.value === index
}

function handleItemClick(index) {
  prevNavIndex = index
  desktopPillIndex.value = index
}
</script>

<template>
  <!-- Desktop: Sidebar Kiri dengan Sliding Active Pill & Micro-animations -->
  <nav
    class="relative hidden select-none flex-col gap-[12px] px-[14px] pt-[22px] md:flex lg:px-[26px] lg:pt-[30px]"
    aria-label="Menu utama"
  >
    <!-- Sliding Active Pill Background -->
    <div
      class="pointer-events-none absolute right-[14px] left-[14px] h-[42px] rounded-xl bg-[#2864E8] shadow-[0_4px_14px_rgba(40,100,232,0.35)] lg:right-[26px] lg:left-[26px]"
      :class="
        isAnimated ? 'transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.3,1)]' : ''
      "
      :style="{ transform: `translateY(${desktopPillIndex * 54}px)` }"
    />

    <!-- Nav Items -->
    <RouterLink
      v-for="(item, index) in items"
      :key="item.to"
      :to="item.to"
      v-slot="{ href, navigate }"
      custom
    >
      <a
        :href="href"
        class="group relative z-10 flex h-[42px] items-center gap-3 rounded-xl px-3.5 text-[15px] font-normal no-underline transition-all duration-200 active:scale-[0.98]"
        :class="[
          isItemActive(index) ? 'font-medium text-white' : 'text-[#808080] hover:text-[#2864E8]',
        ]"
        :aria-current="isItemActive(index) ? 'page' : undefined"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        @click="
          (e) => {
            handleItemClick(index)
            navigate(e)
          }
        "
      >
        <!-- Hover indicator halus untuk item yang tidak aktif -->
        <span
          v-if="!isItemActive(index)"
          class="pointer-events-none absolute inset-0 rounded-xl bg-[#2864E8]/8 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />

        <!-- Icon dengan animasi pop saat aktif -->
        <component
          :is="item.icon"
          class="relative z-10 size-[23px] shrink-0 transition-all duration-300"
          :class="[
            isItemActive(index)
              ? 'scale-105 text-white animate-nav-pop'
              : 'text-[#808080] group-hover:scale-105 group-hover:text-[#2864E8]',
          ]"
          :style="{ '--icon-door': isItemActive(index) ? '#2864E8' : '#ffffff' }"
        />

        <!-- Label text -->
        <span class="relative z-10 transition-colors duration-200">
          {{ item.label }}
        </span>
      </a>
    </RouterLink>
  </nav>

  <!-- Mobile / Tablet: Bottom Navigation dengan Sliding Active Indicator -->
  <nav
    class="fixed inset-x-0 bottom-0 z-30 flex select-none items-stretch justify-around border-t border-[#dddddd] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    aria-label="Menu utama"
  >
    <!-- Sliding indicator bar di bagian atas bottom nav -->
    <div
      class="pointer-events-none absolute top-0 h-1 rounded-full bg-[#2864E8] shadow-[0_0_8px_#2864E8] transition-all duration-350 ease-[cubic-bezier(0.25,1,0.3,1)]"
      :style="{
        width: '36px',
        left: `calc(${(desktopPillIndex + 0.5) * (100 / items.length)}% - 18px)`,
      }"
    />

    <!-- Mobile Nav Items -->
    <RouterLink
      v-for="(item, index) in items"
      :key="item.to"
      :to="item.to"
      v-slot="{ href, navigate }"
      custom
    >
      <a
        :href="href"
        class="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] no-underline transition-all duration-200 active:scale-95"
        :class="
          isItemActive(index)
            ? 'font-semibold text-[#2864E8]'
            : 'text-[#808080] hover:text-[#2864E8]'
        "
        :aria-current="isItemActive(index) ? 'page' : undefined"
        @click="
          (e) => {
            handleItemClick(index)
            navigate(e)
          }
        "
      >
        <!-- Icon dengan micro bounce saat aktif -->
        <div class="relative flex items-center justify-center">
          <component
            :is="item.icon"
            class="size-6 transition-all duration-300"
            :class="
              isItemActive(index) ? 'scale-110 text-[#2864E8] animate-nav-pop' : 'text-[#808080]'
            "
            style="--icon-door: #ffffff"
          />
        </div>

        <span>{{ item.label }}</span>
      </a>
    </RouterLink>
  </nav>
</template>

<style scoped>
@keyframes navPop {
  0% {
    transform: scale(0.88);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.05);
  }
}

.animate-nav-pop {
  animation: navPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-nav-pop {
    animation: none !important;
  }
  .transition-transform {
    transition: none !important;
  }
}
</style>
