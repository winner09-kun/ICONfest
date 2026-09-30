<script setup>
import logo from '@/assets/logo.svg'

const currentYear = new Date().getFullYear()
const footerContent = {
  description:
    'Platform evaluasi esai yang membantu pengajar memberi penilaian lebih konsisten dan mahasiswa belajar dengan lebih terarah.',
  groups: [
    {
      title: 'Jelajahi',
      links: [
        { label: 'Beranda', href: '/' },
        { label: 'Tentang KeyQuiz', href: '/#tentang' },
        { label: 'Fitur', href: '/#fitur' },
      ],
    },
    {
      title: 'Akun',
      links: [
        { label: 'Masuk', href: '/login' },
        { label: 'Daftar', href: '/daftar' },
      ],
    },
  ],
}
</script>

<template>
  <footer class="border-t-4 border-[#2864E8] bg-[#162B55] text-white">
    <div
      class="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-8 gap-y-10 px-5 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-16"
    >
      <div class="col-span-2 lg:col-span-1">
        <a
          href="/"
          aria-label="KeyQuiz, beranda"
          class="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <img :src="logo" alt="KeyQuiz" class="h-9 w-auto brightness-0 invert sm:h-10" />
        </a>
        <p class="mt-5 max-w-md text-sm leading-6 text-white/75">
          {{ footerContent.description }}
        </p>
      </div>

      <nav
        v-for="group in footerContent.groups"
        :key="group.title"
        :aria-label="group.title"
        class="space-y-4"
      >
        <h2 class="text-sm font-semibold text-white">{{ group.title }}</h2>
        <ul class="space-y-3">
          <li v-for="link in group.links" :key="link.href">
            <a
              :href="link.href"
              class="text-sm text-white/70 transition hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="border-t border-white/15">
      <p class="mx-auto max-w-[1280px] px-5 py-5 text-xs text-white/60 sm:px-10 sm:text-sm">
        &copy; {{ currentYear }} KeyQuiz. Hak cipta dilindungi.
      </p>
    </div>
  </footer>
</template>
