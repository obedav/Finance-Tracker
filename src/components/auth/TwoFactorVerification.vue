<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Two-Factor Authentication</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          {{ useRecoveryCode ? 'Enter a recovery code' : 'Enter the 6-digit code from your authenticator app' }}
        </p>
      </div>

      <!-- TOTP Code Input -->
      <div v-if="!useRecoveryCode" class="mb-6">
        <div class="flex gap-2 justify-center mb-4">
          <input
            v-for="i in 6"
            :key="i"
            :ref="el => { if (el) codeInputs[i - 1] = el }"
            v-model="code[i - 1]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            @input="handleCodeInput(i - 1)"
            @keydown="handleKeyDown($event, i - 1)"
            @paste="handlePaste($event, i - 1)"
            class="w-12 h-14 text-center text-2xl font-bold form-input focus:scale-110 transition-all duration-200"
            :class="{ 'border-red-300 dark:border-red-600': error }"
            :disabled="loading"
          />
        </div>
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 text-center mb-2">{{ error }}</p>
        <button
          @click="useRecoveryCode = true"
          class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline w-full text-center"
        >
          Use a recovery code instead
        </button>
      </div>

      <!-- Recovery Code Input -->
      <div v-else class="mb-6">
        <input
          ref="recoveryInput"
          v-model="recoveryCodeInput"
          type="text"
          class="form-input text-center font-mono text-lg uppercase"
          :class="{ 'border-red-300 dark:border-red-600': error }"
          placeholder="XXXXXXXX"
          maxlength="8"
          @keyup.enter="verifyCode"
          :disabled="loading"
        />
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 text-center mt-2 mb-2">{{ error }}</p>
        <button
          @click="useRecoveryCode = false; recoveryCodeInput = ''"
          class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline w-full text-center mt-3"
        >
          Use authenticator code instead
        </button>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="close"
          :disabled="loading"
          class="btn btn-ghost hover-lift flex-1"
        >
          Cancel
        </button>
        <button
          @click="verifyCode"
          :disabled="loading || (!useRecoveryCode && code.join('').length !== 6) || (useRecoveryCode && recoveryCodeInput.length !== 8)"
          class="btn btn-primary hover-lift flex-1"
        >
          <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Verify
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

// Props
const props = defineProps<{
  show: boolean
  userId: number
}>()

// Emits
const emit = defineEmits<{
  (e: 'verify', code: string): void
  (e: 'close'): void
}>()

// State
const code = ref<string[]>(new Array(6).fill(''))
const codeInputs = ref<Array<HTMLInputElement>>([])
const recoveryInput = ref<HTMLInputElement | null>(null)
const recoveryCodeInput = ref('')
const useRecoveryCode = ref(false)
const loading = ref(false)
const error = ref('')

// Methods
const handleCodeInput = (index: number) => {
  // Only allow digits
  code.value[index] = code.value[index].replace(/[^0-9]/g, '')

  // Auto-focus next input
  if (code.value[index] && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }

  // Auto-submit if all filled
  if (index === 5 && code.value.every(c => c)) {
    verifyCode()
  }

  error.value = ''
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6)

  if (digits.length > 0) {
    for (let i = 0; i < digits.length && index + i < 6; i++) {
      code.value[index + i] = digits[i]
    }

    // Focus last filled input or next empty
    const nextIndex = Math.min(index + digits.length, 5)
    codeInputs.value[nextIndex]?.focus()

    // Auto-submit if complete
    if (digits.length === 6) {
      nextTick(() => verifyCode())
    }
  }
}

const verifyCode = () => {
  const verificationCode = useRecoveryCode.value
    ? recoveryCodeInput.value.toUpperCase()
    : code.value.join('')

  if (!verificationCode || (useRecoveryCode.value ? verificationCode.length !== 8 : verificationCode.length !== 6)) {
    error.value = 'Please enter a valid code'
    return
  }

  emit('verify', verificationCode)
}

const close = () => {
  emit('close')
}

const reset = () => {
  code.value = new Array(6).fill('')
  recoveryCodeInput.value = ''
  error.value = ''
  loading.value = false
  useRecoveryCode.value = false
}

// Watch for show changes
watch(() => props.show, async (newVal) => {
  if (newVal) {
    reset()
    await nextTick()
    if (codeInputs.value[0]) {
      codeInputs.value[0].focus()
    }
  }
})

// Watch for recovery code mode changes
watch(useRecoveryCode, async (newVal) => {
  error.value = ''
  await nextTick()
  if (newVal && recoveryInput.value) {
    recoveryInput.value.focus()
  } else if (!newVal && codeInputs.value[0]) {
    codeInputs.value[0].focus()
  }
})

// Expose setLoading and setError for parent component
defineExpose({
  setLoading: (value: boolean) => { loading.value = value },
  setError: (message: string) => { error.value = message }
})
</script>

<style scoped>
/* Custom animations */
@keyframes pulse-border {
  0%, 100% {
    border-color: rgb(16, 185, 129);
  }
  50% {
    border-color: rgb(5, 150, 105);
  }
}

input:focus:not(.border-red-300) {
  animation: pulse-border 1.5s ease-in-out infinite;
}

/* Ensure dark mode styles */
@media (prefers-color-scheme: dark) {
  input:focus:not(.dark\:border-red-600) {
    animation: pulse-border 1.5s ease-in-out infinite;
  }
}
</style>
