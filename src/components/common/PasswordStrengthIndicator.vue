<template>
  <div v-if="password" class="password-strength">
    <div class="strength-bar">
      <div
        class="strength-fill"
        :class="strengthClass"
        :style="{ width: strengthPercentage + '%' }"
      ></div>
    </div>

    <div class="strength-text">
      <span :class="strengthClass">{{ strengthLabel }}</span>
    </div>

    <ul class="requirements-list">
      <li :class="{ valid: hasMinLength }">
        <span class="icon">{{ hasMinLength ? '✓' : '○' }}</span>
        At least 8 characters
      </li>
      <li :class="{ valid: hasUppercase }">
        <span class="icon">{{ hasUppercase ? '✓' : '○' }}</span>
        One uppercase letter
      </li>
      <li :class="{ valid: hasLowercase }">
        <span class="icon">{{ hasLowercase ? '✓' : '○' }}</span>
        One lowercase letter
      </li>
      <li :class="{ valid: hasNumber }">
        <span class="icon">{{ hasNumber ? '✓' : '○' }}</span>
        One number
      </li>
      <li :class="{ valid: hasSpecialChar }">
        <span class="icon">{{ hasSpecialChar ? '✓' : '○' }}</span>
        One special character (@$!%*?&#)
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  password: {
    type: String,
    default: ''
  }
})

// Password requirements
const hasMinLength = computed(() => props.password.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(props.password))
const hasLowercase = computed(() => /[a-z]/.test(props.password))
const hasNumber = computed(() => /\d/.test(props.password))
const hasSpecialChar = computed(() => /[@$!%*?&#]/.test(props.password))

// Calculate strength
const strength = computed(() => {
  let score = 0
  if (hasMinLength.value) score++
  if (hasUppercase.value) score++
  if (hasLowercase.value) score++
  if (hasNumber.value) score++
  if (hasSpecialChar.value) score++
  return score
})

const strengthPercentage = computed(() => (strength.value / 5) * 100)

const strengthLabel = computed(() => {
  if (strength.value === 5) return 'Strong'
  if (strength.value >= 3) return 'Medium'
  return 'Weak'
})

const strengthClass = computed(() => {
  if (strength.value === 5) return 'strong'
  if (strength.value >= 3) return 'medium'
  return 'weak'
})

// Expose isValid for parent component
const isValid = computed(() => strength.value === 5)

defineExpose({
  isValid
})
</script>

<style scoped>
.password-strength {
  margin-top: 0.75rem;
}

.strength-bar {
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 3px;
}

.strength-fill.weak {
  background: #EF4444;
}

.strength-fill.medium {
  background: #F59E0B;
}

.strength-fill.strong {
  background: #10B981;
}

.strength-text {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.strength-text .weak {
  color: #EF4444;
}

.strength-text .medium {
  color: #F59E0B;
}

.strength-text .strong {
  color: #10B981;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}

.requirements-list li {
  padding: 0.375rem 0;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.requirements-list li.valid {
  color: #10B981;
}

.requirements-list .icon {
  font-weight: bold;
  font-size: 1rem;
  width: 20px;
  text-align: center;
}
</style>
