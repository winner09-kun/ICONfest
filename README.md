# KeyQuiz

KeyQuiz adalah aplikasi frontend kuis untuk dosen dan mahasiswa. Dosen dapat mengelola kelas dan kuis, sementara mahasiswa dapat bergabung ke kelas, mengerjakan kuis, dan melihat hasilnya.

## Teknologi

- Vue 3 dengan Composition API dan `<script setup>`
- Vite untuk server pengembangan dan build
- Vue Router untuk navigasi halaman
- Tailwind CSS 4 untuk styling
- `localStorage` untuk menyimpan sesi pengguna, kelas, kuis, pengumpulan jawaban, dan keanggotaan kelas

## Persyaratan

- Node.js versi yang mendukung Vite 8
- npm

## Menjalankan proyek

Pasang dependensi:

```sh
npm install
```

Jalankan server pengembangan:

```sh
npm run dev
```

Buat build produksi:

```sh
npm run build
```

Pratinjau build produksi secara lokal:

```sh
npm run preview
```

## Alur aplikasi

### Dosen

1. Masuk atau daftar dengan peran **Dosen**.
2. Buat kelas dari halaman Beranda.
3. Buka kelas dan pilih tambah kuis.
4. Buat kuis secara manual atau gunakan halaman pembuatan kuis AI.
5. Atur pertanyaan, kunci jawaban, poin, opsi tampilan hasil, dan tenggat waktu.
6. Lihat pengumpulan mahasiswa pada detail kuis dan masukkan nilai untuk jawaban yang belum dinilai otomatis.

### Mahasiswa

1. Masuk atau daftar dengan peran **Mahasiswa**.
2. Gabung kelas menggunakan kode kelas dari dosen.
3. Buka kuis dari kelas atau pengingat tenggat di Beranda.
4. Jawab semua pertanyaan dan tekan **Kirim**.
5. Lihat konfirmasi pengiriman dan ringkasan jawaban. Nilai dan kunci jawaban ditampilkan sesuai pengaturan kuis.

## Struktur frontend

```text
src/
├── assets/       # Gambar, ikon, dan stylesheet
├── components/   # Komponen UI, navigasi, autentikasi, dan dashboard
├── composables/  # State dan operasi bersama (autentikasi, kelas, loading)
├── data/         # Data contoh kelas, kuis, dan mahasiswa
├── layouts/      # Layout dashboard
├── router/       # Definisi rute Vue Router
└── views/        # Halaman utama aplikasi
```

Rute utama:

| Rute | Halaman |
| --- | --- |
| `/` | Landing page |
| `/login` | Masuk |
| `/daftar` | Pendaftaran |
| `/beranda` | Dashboard dosen atau mahasiswa |
| `/kelas/:id` | Detail kelas, kuis, dan statistik |
| `/kelas/:id/buat-soal-manual` | Formulir pembuatan kuis manual |
| `/kelas/:id/buat-soal-ai` | Alur pembuatan kuis AI |
| `/kelas/:id/tugas/:taskId` | Detail kuis, pengumpulan, dan penilaian |
| `/scan-soal` | Alur pemindaian/koreksi soal untuk dosen |
| `/pengaturan` | Pengaturan pengguna |

## Batasan prototipe

- Aplikasi ini adalah frontend prototipe dan belum terhubung ke backend atau database jarak jauh.
- Login dan pendaftaran hanya menyimpan identitas serta peran lokal; kata sandi belum diautentikasi.
- Data aplikasi disimpan di `localStorage` browser. Data tidak dibagikan atau disinkronkan antarperangkat/pengguna.
- Halaman pembuatan kuis AI menggunakan respons contoh statis, bukan layanan AI yang terhubung.
- Validasi akses di Vue Router hanya untuk pengalaman antarmuka dan bukan pengamanan data. Aplikasi produksi memerlukan autentikasi, otorisasi, dan validasi di server.

## Pemeriksaan

Build produksi:

```sh
npm run build
```

Saat ini `package.json` belum menyediakan skrip unit test atau lint.
