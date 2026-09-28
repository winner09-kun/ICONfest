<template>
  <!-- Latar lingkaran yang dipakai bersama oleh Landing & Login (satu sumber, jadi selalu konsisten) -->
  <!-- MOBILE: semua berbasis vw agar skalanya proporsional -->
  <div class="absolute -left-[45vw] -top-[45vw] -z-10 size-[190vw] rounded-full bg-[#2864E8] sm:hidden" />
  <div class="absolute -left-[35vw] -top-[50vw] -z-10 size-[100vw] rounded-full bg-[#C2D4FF] sm:hidden" />

  <!-- TABLET/DESKTOP -->
  <div class="absolute -left-[43vw] -top-[48vw] -z-10 hidden size-[112vw] rounded-full bg-[#2864E8] sm:block" />
  <div class="absolute -left-[35vw] -top-[45vw] -z-10 hidden size-[110vw] rounded-full bg-white/[0.08] sm:block" />
  <div class="absolute -left-[15vw] -top-[38vw] -z-10 hidden size-[52vw] rounded-full bg-[#C2D4FF] sm:block" />
</template>
