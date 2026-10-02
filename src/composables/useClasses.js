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

function addTaskToClass(classId, task) {
  const classItem = classes.value.find((item) => String(item.id) === String(classId))
  if (!classItem) return null

  classItem.tasks ||= []
  classItem.tasks.push({
    showScore: true,
    showCorrectAnswers: false,
    submissions: [],
    ...task,
  })
  saveClasses()
  return classItem.tasks[classItem.tasks.length - 1]
}

function updateTask(classId, taskId, update) {
  const classItem = classes.value.find((item) => String(item.id) === String(classId))
  const task = classItem?.tasks?.find((item) => String(item.id) === String(taskId))
  if (!task) return null

  update(task)
  saveClasses()
  return task
}

function saveTaskSubmission(classId, taskId, submission) {
  return updateTask(classId, taskId, (task) => {
    task.submissions ||= []
    const email = submission.email.trim().toLowerCase()
    const existingIndex = task.submissions.findIndex(
      (item) => item.email.trim().toLowerCase() === email,
    )

    if (existingIndex === -1) task.submissions.push(submission)
    else task.submissions[existingIndex] = submission
  })
}

function updateTaskSettings(classId, taskId, settings) {
  return updateTask(classId, taskId, (task) => Object.assign(task, settings))
}

function updateSubmissionScore(classId, taskId, email, score) {
  return updateTask(classId, taskId, (task) => {
    const submission = task.submissions?.find(
      (item) => item.email.trim().toLowerCase() === email.trim().toLowerCase(),
    )
    if (!submission) return

    submission.score = score
    submission.graded = true
  })
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

export {
  classes,
  addClass,
  addTaskToClass,
  getClassesForStudent,
  joinClassByCode,
  saveTaskSubmission,
  updateSubmissionScore,
  updateTaskSettings,
}
