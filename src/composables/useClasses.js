import { ref } from 'vue'
import { classes as initialClasses } from '@/data/classes.js'

const CLASSES_STORAGE_KEY = 'keyquiz:classes'
const classes = ref(loadClasses())

function loadClasses() {
  try {
    const storedClasses = JSON.parse(localStorage.getItem(CLASSES_STORAGE_KEY))
    return Array.isArray(storedClasses) ? storedClasses : [...initialClasses]
  } catch {
    return [...initialClasses]
  }
}

function saveClasses() {
  try {
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes.value))
  } catch {
    // Keep the in-memory class list available when storage is disabled.
  }
}

function membershipStorageKey(email) {
  return `keyquiz:joined-classes:${encodeURIComponent(email.trim().toLowerCase())}`
}

function getMemberships(email) {
  if (!email) return []

  try {
    const memberships = JSON.parse(localStorage.getItem(membershipStorageKey(email)))
    return Array.isArray(memberships) ? memberships : []
  } catch {
    return []
  }
}

function getClassesForStudent(email) {
  const memberships = new Set(getMemberships(email).map(String))
  return classes.value.filter((classItem) => memberships.has(String(classItem.id)))
}

function addClass(classItem) {
  let code = classItem.code
  while (!code || classes.value.some((existingClass) => existingClass.code === code)) {
    code = `KQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  }

  const newClass = { ...classItem, code }
  classes.value.unshift(newClass)
  saveClasses()
  return newClass
}

function joinClassByCode(email, code) {
  const classItem = classes.value.find(
    (item) => item.code?.toUpperCase() === code.trim().toUpperCase(),
  )

  if (!classItem) return { status: 'not-found' }

  const memberships = getMemberships(email)
  if (memberships.some((id) => String(id) === String(classItem.id))) {
    return { status: 'already-joined', classItem }
  }

  try {
    localStorage.setItem(
      membershipStorageKey(email),
      JSON.stringify([...memberships, classItem.id]),
    )
  } catch {
    return { status: 'storage-error' }
  }

  return { status: 'joined', classItem }
}

export { classes, addClass, getClassesForStudent, joinClassByCode }