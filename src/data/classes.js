// Data contoh — ganti dengan data dari backend nanti.
const defaultTasks = [
  {
    id: 1,
    title: 'Kuis 1',
    date: 'Senin, 28 September 2026',
    description: 'Implementasi antarmuka pengguna Flutter dan integrasi API sederhana.',
  },
  {
    id: 2,
    title: 'Kuis 2',
    date: 'Jumat, 2 Oktober 2026',
    description: 'Evaluasi model esai dan pengujian unit pada aplikasi.',
  },
  {
    id: 3,
    title: 'Kuis 3',
    date: 'Jumat, 2 Oktober 2026',
    description: 'Kuis evaluasi materi kelas.',
  },
]

const classDefinitions = [
  { title: 'Pemrograman Perangkat Bergerak', lecturer: 'Fajerin Abdillah, M. Kom.' },
  { title: 'Machine Learning', lecturer: 'Achmad Fanany, S.T., M.T' },
  { title: 'Keamanan Data dan Informasi', lecturer: 'Taufiq, S.Tr.Kom., M.Tr.Kom' },
  { title: 'Pemrograman Web', lecturer: 'Rheo Malani, S.Kom., M.Kom' },
  { title: 'Jaringan Komputer', lecturer: 'Mulyanto, S.Kom., M.Cs' },
  { title: 'Sistem Operasi', lecturer: 'Aam Sodiqful Munir, S.Kom., M.Kom' },
]

export const classes = classDefinitions.map((classDefinition, index) => ({
  id: index + 1,
  ...classDefinition,
  major: 'Teknik Informatika',
  code: `KQ-PBM0${index + 1}`,
  tasks: defaultTasks.map((task) => ({
    ...task,
    ...(classDefinition.title === 'Machine Learning' && task.id === 1
      ? {
          title: 'Kuis 1',
          date: 'Jumat, 16 Oktober 2026',
          deadlineDate: '2026-10-16',
          deadlineTime: '23:59',
          deadlineTimezone: 'WITA',
          dueAt: '2026-10-16T23:59:00+08:00',
        }
      : {}),
    ...(classDefinition.title === 'Pemrograman Perangkat Bergerak' && task.id === 3
      ? {
          date: 'Jumat, 16 Oktober 2026',
          deadlineDate: '2026-10-16',
          deadlineTime: '23:59',
          deadlineTimezone: 'WITA',
          dueAt: '2026-10-16T23:59:00+08:00',
        }
      : {}),
  })),
}))
