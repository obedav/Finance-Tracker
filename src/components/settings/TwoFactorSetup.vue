<template>
  <div class="two-factor-setup">
    <!-- 2FA Not Enabled State -->
    <div v-if="!twoFactorEnabled && !setupMode" class="setup-prompt">
      <div class="p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-700">
        <div class="flex items-start justify-between">
          <div class="flex items-start">
            <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-700 dark:text-slate-200 text-lg mb-2">Two-Factor Authentication</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
                You'll need to enter a code from your authenticator app when signing in.
              </p>
              <button
                @click="startSetup"
                :disabled="loading"
                class="btn btn-primary hover-lift"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Setup Mode -->
    <div v-if="setupMode && !twoFactorEnabled" class="setup-process space-y-6">
      <!-- Step 1: Scan QR Code -->
      <div class="dashboard-card">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3 text-white font-bold">1</div>
          <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200">Scan QR Code</h4>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
        </p>
        <div v-if="qrCode" class="flex justify-center p-4 bg-white dark:bg-slate-800 rounded-lg">
          <img :src="qrCode" alt="QR Code" class="w-64 h-64" />
        </div>
        <div v-else class="flex justify-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>

      <!-- Step 2: Manual Entry (Alternative) -->
      <div class="dashboard-card">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3 text-white font-bold">2</div>
          <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200">Manual Entry (Alternative)</h4>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
          If you can't scan the QR code, enter this secret key manually:
        </p>
        <div class="flex items-center space-x-2">
          <code class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 font-mono text-sm break-all">
            {{ secret }}
          </code>
          <button
            @click="copySecret"
            class="btn btn-outline btn-sm hover-lift flex-shrink-0"
            title="Copy secret"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Step 3: Save Recovery Codes -->
      <div class="dashboard-card">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center mr-3 text-white font-bold">3</div>
          <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200">Save Recovery Codes</h4>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Save these recovery codes in a safe place. You can use them to access your account if you lose your device.
        </p>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div
            v-for="(code, index) in recoveryCodes"
            :key="index"
            class="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm text-center"
            :class="code.used ? 'opacity-50 line-through' : 'text-slate-700 dark:text-slate-300'"
          >
            {{ code.code }}
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="copyRecoveryCodes"
            class="btn btn-outline hover-lift flex-1"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy Codes
          </button>
          <button
            @click="downloadRecoveryCodes"
            class="btn btn-outline hover-lift flex-1"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download
          </button>
          <button
            @click="emailRecoveryCodes"
            :disabled="loading"
            class="btn btn-outline hover-lift flex-1"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Email
          </button>
        </div>
      </div>

      <!-- Step 4: Verify Setup -->
      <div class="dashboard-card">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3 text-white font-bold">4</div>
          <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200">Verify Setup</h4>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Enter the 6-digit code from your authenticator app to complete setup:
        </p>
        <div class="max-w-md">
          <div class="flex gap-2 mb-4">
            <input
              v-for="i in 6"
              :key="i"
              :ref="el => { if (el) codeInputs[i - 1] = el }"
              v-model="verificationCode[i - 1]"
              type="text"
              maxlength="1"
              @input="handleCodeInput(i - 1)"
              @keydown="handleKeyDown($event, i - 1)"
              class="w-12 h-14 text-center text-2xl font-bold form-input focus:scale-110 transition-all duration-200"
              :class="{ 'border-red-300': error }"
            />
          </div>
          <p v-if="error" class="text-sm text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <div class="flex gap-3">
            <button
              @click="cancelSetup"
              :disabled="loading"
              class="btn btn-ghost hover-lift flex-1"
            >
              Cancel
            </button>
            <button
              @click="confirmSetup"
              :disabled="loading || verificationCode.join('').length !== 6"
              class="btn btn-primary hover-lift flex-1"
            >
              <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Confirm & Enable
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2FA Enabled State -->
    <div v-if="twoFactorEnabled && !setupMode" class="enabled-state space-y-6">
      <div class="dashboard-card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-700 dark:text-slate-200 text-lg">Two-Factor Authentication Enabled</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Your account is protected with 2FA</p>
            </div>
          </div>
          <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>

      <div class="dashboard-card">
        <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Recovery Codes</h4>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          You have <strong>{{ unusedRecoveryCodesCount }}</strong> unused recovery codes remaining.
        </p>
        <div class="flex gap-3">
          <button
            @click="regenerateCodes"
            :disabled="loading"
            class="btn btn-outline hover-lift flex-1"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Regenerate Codes
          </button>
          <button
            @click="emailCodes"
            :disabled="loading"
            class="btn btn-outline hover-lift flex-1"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Email Codes
          </button>
        </div>
      </div>

      <div class="dashboard-card bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-700">
        <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Disable Two-Factor Authentication</h4>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Disabling 2FA will make your account less secure. You'll need to enter your password to confirm.
        </p>
        <div v-if="!showDisableForm">
          <button
            @click="showDisableForm = true"
            class="btn btn-secondary hover-lift"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Disable 2FA
          </button>
        </div>
        <div v-else class="max-w-md">
          <div class="form-group mb-4">
            <label class="form-label">Confirm Password</label>
            <input
              v-model="disablePassword"
              type="password"
              class="form-input"
              placeholder="Enter your password"
              @keyup.enter="disableTwoFactor"
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="showDisableForm = false; disablePassword = ''"
              :disabled="loading"
              class="btn btn-ghost hover-lift flex-1"
            >
              Cancel
            </button>
            <button
              @click="disableTwoFactor"
              :disabled="loading || !disablePassword"
              class="btn btn-secondary hover-lift flex-1"
            >
              <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Disable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import authService from '@/services/authService'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

// Props
const props = defineProps<{
  enabled: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'updated', enabled: boolean): void
}>()

// State
const loading = ref(false)
const setupMode = ref(false)
const twoFactorEnabled = ref(props.enabled)
const qrCode = ref('')
const secret = ref('')
const recoveryCodes = ref<Array<{ code: string; used: boolean }>>([])
const verificationCode = ref<string[]>(new Array(6).fill(''))
const codeInputs = ref<Array<HTMLInputElement>>([])
const error = ref('')
const showDisableForm = ref(false)
const disablePassword = ref('')

// Computed
const unusedRecoveryCodesCount = computed(() => {
  return recoveryCodes.value.filter(code => !code.used).length
})

// Methods
const startSetup = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await authService.enable2FA()

    qrCode.value = response.qr_code
    secret.value = response.secret
    recoveryCodes.value = response.recovery_codes
    setupMode.value = true

    // Auto-focus first input
    await nextTick()
    if (codeInputs.value[0]) {
      codeInputs.value[0].focus()
    }
  } catch (err: any) {
    showToast(err.message || 'Failed to start 2FA setup', 'error')
  } finally {
    loading.value = false
  }
}

const handleCodeInput = (index: number) => {
  // Only allow digits
  verificationCode.value[index] = verificationCode.value[index].replace(/[^0-9]/g, '')

  // Auto-focus next input
  if (verificationCode.value[index] && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }

  error.value = ''
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

const confirmSetup = async () => {
  try {
    loading.value = true
    error.value = ''

    const code = verificationCode.value.join('')
    await authService.confirm2FA(code)

    twoFactorEnabled.value = true
    setupMode.value = false
    emit('updated', true)
    showToast('Two-factor authentication enabled successfully!', 'success')
  } catch (err: any) {
    error.value = err.message || 'Invalid verification code'
    verificationCode.value = new Array(6).fill('')
    await nextTick()
    if (codeInputs.value[0]) {
      codeInputs.value[0].focus()
    }
  } finally {
    loading.value = false
  }
}

const cancelSetup = () => {
  setupMode.value = false
  qrCode.value = ''
  secret.value = ''
  recoveryCodes.value = []
  verificationCode.value = new Array(6).fill('')
  error.value = ''
}

const copySecret = async () => {
  try {
    await navigator.clipboard.writeText(secret.value)
    showToast('Secret key copied to clipboard', 'success')
  } catch (err) {
    showToast('Failed to copy secret key', 'error')
  }
}

const copyRecoveryCodes = async () => {
  try {
    const codes = recoveryCodes.value.map(c => c.code).join('\n')
    await navigator.clipboard.writeText(codes)
    showToast('Recovery codes copied to clipboard', 'success')
  } catch (err) {
    showToast('Failed to copy recovery codes', 'error')
  }
}

const downloadRecoveryCodes = () => {
  const codes = recoveryCodes.value.map(c => c.code).join('\n')
  const blob = new Blob([codes], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'recovery-codes.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast('Recovery codes downloaded', 'success')
}

const regenerateCodes = async () => {
  try {
    loading.value = true
    const response = await authService.regenerateRecoveryCodes()
    recoveryCodes.value = response.recovery_codes
    showToast('Recovery codes regenerated successfully', 'success')
  } catch (err: any) {
    showToast(err.message || 'Failed to regenerate recovery codes', 'error')
  } finally {
    loading.value = false
  }
}

const disableTwoFactor = async () => {
  try {
    loading.value = true
    await authService.disable2FA(disablePassword.value)

    twoFactorEnabled.value = false
    showDisableForm.value = false
    disablePassword.value = ''
    emit('updated', false)
    showToast('Two-factor authentication disabled', 'success')
  } catch (err: any) {
    showToast(err.message || 'Failed to disable 2FA', 'error')
  } finally {
    loading.value = false
  }
}

const emailRecoveryCodes = async () => {
  try {
    loading.value = true
    await authService.emailRecoveryCodes()
    showToast('Recovery codes sent to your email', 'success')
  } catch (err: any) {
    showToast(err.message || 'Failed to email recovery codes', 'error')
  } finally {
    loading.value = false
  }
}

const emailCodes = async () => {
  try {
    loading.value = true
    await authService.emailRecoveryCodes()
    showToast('Recovery codes sent to your email', 'success')
  } catch (err: any) {
    showToast(err.message || 'Failed to email recovery codes', 'error')
  } finally {
    loading.value = false
  }
}

// Watch for prop changes
onMounted(() => {
  twoFactorEnabled.value = props.enabled
})
</script>

<style scoped>
/* Custom animations for code inputs */
@keyframes pulse-border {
  0%, 100% {
    border-color: rgb(16, 185, 129);
  }
  50% {
    border-color: rgb(5, 150, 105);
  }
}

input:focus {
  animation: pulse-border 1.5s ease-in-out infinite;
}
</style>
