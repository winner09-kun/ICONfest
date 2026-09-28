<script setup>
import IconHome from '@/components/icons/IconHome.vue'
import IconScan from '@/components/icons/IconScan.vue'
import IconSettings from '@/components/icons/IconSettings.vue'

const items = [
  { to: '/beranda', label: 'Beranda', icon: IconHome },
  { to: '/scan-soal', label: 'Scan Soal', icon: IconScan },
  { to: '/pengaturan', label: 'Pengaturan', icon: IconSettings },
]
</script>

<template>
  <!-- Desktop: sidebar kiri -->
  <nav class="hidden flex-col gap-[15px] px-[37px] pt-[34px] lg:flex" aria-label="Menu utama">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      v-slot="{ isActive, href, navigate }"
      custom
    >
      <a
        :href="href"
        class="flex h-[35px] items-center gap-2.5 rounded-lg px-3 text-[13px] font-normal no-underline transition"
        :class="isActive ? 'bg-[#2864E8] text-white' : 'text-[#808080] hover:bg-[#2864E8]/10'"
        :aria-current="isActive ? 'page' : undefined"
        @click="navigate"
      >
        <component :is="item.icon" class="size-[21px] shrink-0" :style="{ '--icon-door': isActive ? '#2864E8' : '#ffffff' }" />
        {{ item.label }}
      </a>
    </RouterLink>
  </nav>

  <!-- Mobile/tablet: bottom nav -->
  <nav
    class="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-[#dddddd] bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    aria-label="Menu utama"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      v-slot="{ isActive, href, navigate }"
      custom
    >
      <a
        :href="href"
        class="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] no-underline transition"
        :class="isActive ? 'font-semibold text-[#2864E8]' : 'text-[#808080]'"
        :aria-current="isActive ? 'page' : undefined"
        @click="navigate"
      >
        <component :is="item.icon" class="size-6" style="--icon-door: #ffffff" />
        {{ item.label }}
      </a>
    </RouterLink>
  </nav>
</template>
