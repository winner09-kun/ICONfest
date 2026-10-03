<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import {
  addClass,
  classes,
  getClassesForStudent,
  joinClassByCode,
} from '@/composables/useClasses.js'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ClassCard from '@/components/dashboard/ClassCard.vue'
import CreateClassModal from '@/components/dashboard/CreateClassModal.vue'
import JoinClassModal from '@/components/dashboard/JoinClassModal.vue'
import bannerImg from '@/assets/images/dashboard-banner.png'

const router = useRouter()
const { user } = useAuth()
const isStudent = computed(() => user.value?.role === 'student')
const studentClasses = ref(getClassesForStudent(user.value?.email))
const classList = computed(() =>
  isStudent.value
    ? studentClasses.value.length > 0
      ? studentClasses.value
      : classes.value
    : classes.value,
)
const upcomingQuizzes = computed(() => {
  if (!isStudent.value) return []

  const now = Date.now()
  return classList.value
    .flatMap((classItem) =>
      (classItem.tasks || []).map((task) => {
        const dueAt =
          task.dueAt ||
          (task.deadlineDate ? `${task.deadlineDate}T${task.deadlineTime || '23:59'}:00+08:00` : '')
        return { classItem, task, dueAt, dueTimestamp: dueAt ? new Date(dueAt).getTime() : 0 }
      }),
    )
    .filter(({ task, dueTimestamp }) => {
      if (!dueTimestamp || dueTimestamp < now) return false
      const email = user.value?.email?.trim().toLowerCase()
      return !task.submissions?.some(
        (submission) => submission.email?.trim().toLowerCase() === email,
      )
    })
    .sort((first, second) => first.dueTimestamp - second.dueTimestamp)
})
const isCreateModalOpen = ref(false)
const isJoinModalOpen = ref(false)
const joinMessage = ref('')
const joinMessageIsError = ref(true)

function openCreateModal() {
  isCreateModalOpen.value = true
}

function openJoinModal() {
  joinMessage.value = ''
  isJoinModalOpen.value = true
}

function handleCreateClass(newClass) {
  addClass({
    id: Date.now(),
    ...newClass,
  })
}

function handleJoinClass(code) {
  const result = joinClassByCode(user.value?.email || '', code)

  if (result.status === 'not-found') {
    joinMessage.value = 'Kode kelas tidak ditemukan. Periksa kembali kode dari dosen.'
    joinMessageIsError.value = true
    return
  }

  if (result.status === 'already-joined') {
    joinMessage.value = 'Kamu sudah tergabung di kelas ini.'
    joinMessageIsError.value = true
    return
  }

  if (result.status === 'storage-error') {
    joinMessage.value = 'Kelas belum bisa disimpan di perangkat ini.'
    joinMessageIsError.value = true
    return
  }

  studentClasses.value = getClassesForStudent(user.value?.email)
  joinMessage.value = ''
  isJoinModalOpen.value = false
}

function handleClassClick(classItem) {
  router.push(`/kelas/${classItem.id}`)
}

function handleUpcomingQuizClick(reminder) {
  router.push(`/kelas/${reminder.classItem.id}/tugas/${reminder.task.id}`)
}

function formatDeadline(timestamp) {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <DashboardLayout>
    <div class="space-y-4 sm:space-y-[22px]">
      <!-- Banner Gambar Selamat Datang -->
      <section
        class="overflow-hidden rounded-[1.5rem] border-4 border-white sm:rounded-[2rem] bg-[#0e66f5] shadow-sm"
      >
        <img
          :src="bannerImg"
          alt="Selamat Datang di KeyQuiz - Esai Tepat, Nilai Cepat, Evaluasi Hemat Waktu Tanpa Subjetivitas"
          class="block h-auto w-full select-none"
        />
      </section>

      <section
        v-if="isStudent"
        class="rounded-[1rem] bg-white p-4 sm:rounded-2xl sm:p-5"
        aria-label="Kuis yang segera tenggat"
      >
        <h2 class="border-b border-[#d6d6d6] pb-2 text-base font-medium text-[#808080] sm:text-xl">
          Harus Dikerjakan Segera
        </h2>
        <button
          v-for="reminder in upcomingQuizzes"
          :key="`${reminder.classItem.id}-${reminder.task.id}`"
          type="button"
          class="motion-control mt-2 flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-[#888888] px-4 py-3 text-left transition hover:border-[#2864E8] hover:bg-blue-50/30"
          @click="handleUpcomingQuizClick(reminder)"
        >
          <span class="text-sm font-medium text-[#222222] sm:text-base">
            {{ reminder.task.title }} : {{ reminder.classItem.title }}
          </span>
          <span class="text-xs text-[#777777] sm:text-sm">
            {{ formatDeadline(reminder.dueTimestamp) }}
          </span>
        </button>
        <p v-if="upcomingQuizzes.length === 0" class="pt-3 text-sm text-[#777777]">
          Tidak ada kuis dengan tenggat mendatang.
        </p>
      </section>

      <!-- Kelas -->
      <section class="rounded-[1.5rem] bg-white p-3.5 sm:rounded-[2rem] sm:p-7 lg:p-[35px]">
        <div class="mb-4 flex items-center justify-between sm:mb-5">
          <h2 class="text-lg font-normal text-[#777777] sm:text-[22px]">Kelas</h2>
          <button
            type="button"
            class="motion-control cursor-pointer text-base font-medium text-[#2864E8] transition hover:underline sm:text-[22px]"
            @click="isStudent ? openJoinModal() : openCreateModal()"
          >
            {{ isStudent ? '+ Gabung Kelas' : '+ Tambah Kelas' }}
          </button>
        </div>

        <div class="motion-stagger grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 lg:gap-[13px]">
          <ClassCard
            v-for="c in classList"
            :key="c.id"
            :title="c.title"
            :major="c.major"
            :lecturer="c.lecturer"
            :code="isStudent ? '' : c.code"
            @click="handleClassClick(c)"
          />
        </div>
        <p
          v-if="isStudent && classList.length === 0"
          class="py-8 text-center text-sm text-[#777777]"
        >
          Belum ada kelas. Masukkan kode yang diberikan dosen untuk bergabung.
        </p>
        <p
          v-if="isStudent && joinMessage && !isJoinModalOpen"
          class="mt-3 text-sm text-red-600"
          role="status"
        >
          {{ joinMessage }}
        </p>
      </section>
    </div>

    <!-- Modal Buat Kelas -->
    <CreateClassModal v-model:open="isCreateModalOpen" @create="handleCreateClass" />
    <JoinClassModal
      v-model:open="isJoinModalOpen"
      :message="joinMessage"
      :is-error="joinMessageIsError"
      @join="handleJoinClass"
    />
  </DashboardLayout>
</template>
