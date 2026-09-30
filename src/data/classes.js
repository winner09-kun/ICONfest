// Data contoh — ganti dengan data dari backend nanti.
const defaultTasks = [
  {
    id: 1,
    title: 'Tugas 1',
    date: 'Senin, 28 September 2026',
    description: 'Implementasi antarmuka pengguna Flutter dan integrasi API sederhana.',
  },
  {
    id: 2,
    title: 'Tugas 2',
    date: 'Senin, 28 September 2026',
    description: 'Evaluasi model esai dan pengujian unit pada aplikasi.',
  },
]

const base = {
  title: 'Pemrograman Perangkat Bergerak',
  major: 'Teknik Informatika',
  lecturer: 'Fajerin Abdillah, M. Kom.',
  tasks: [...defaultTasks],
}

export const classes = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  ...base,
  code: `KQ-PBM0${i + 1}`,
  tasks: defaultTasks.map((t) => ({ ...t })),
}))
