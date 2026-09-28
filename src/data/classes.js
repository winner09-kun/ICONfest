// Data contoh — ganti dengan data dari backend nanti.
const base = { title: 'Pemrograman Perangkat Bergerak', major: 'Teknik Informatika', lecturer: 'Fajerin Abdillah, M. Kom.' }

export const classes = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, ...base }))
