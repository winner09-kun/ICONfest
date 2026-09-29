import { ref } from 'vue'

const isLoading = ref(true)
const loadingText = ref('Memuat KeyQuiz...')
let timer = null

export function useLoading() {
  function triggerLoading(text = 'Memuat...', duration = 650) {
    if (timer) clearTimeout(timer)
    loadingText.value = text
    isLoading.value = true

    timer = setTimeout(() => {
      isLoading.value = false
      timer = null
    }, duration)
  }

  function hideLoading() {
    if (timer) clearTimeout(timer)
    isLoading.value = false
  }

  return {
    isLoading,
    loadingText,
    triggerLoading,
    hideLoading,
  }
}
