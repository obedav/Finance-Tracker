/**
 * Frontend Rate Limiter
 *
 * Prevents brute force attacks and excessive API calls from the client side.
 * Works in conjunction with backend rate limiting for defense in depth.
 */

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs?: number
}

interface RateLimitEntry {
  attempts: number
  firstAttempt: number
  blockedUntil?: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  /**
   * Check if an action is rate limited
   */
  isRateLimited(key: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    // No entry, allow
    if (!entry) {
      this.recordAttempt(key, now)
      return false
    }

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return true
    }

    // Check if window has expired
    if (now - entry.firstAttempt > config.windowMs) {
      // Reset the window
      this.limits.delete(key)
      this.recordAttempt(key, now)
      return false
    }

    // Check if max attempts exceeded
    if (entry.attempts >= config.maxAttempts) {
      // Block for specified duration
      entry.blockedUntil = now + (config.blockDurationMs || config.windowMs)
      return true
    }

    // Increment attempts
    entry.attempts++
    return false
  }

  /**
   * Get remaining attempts before rate limit
   */
  getRemainingAttempts(key: string, config: RateLimitConfig): number {
    const entry = this.limits.get(key)
    if (!entry) return config.maxAttempts

    const now = Date.now()

    // If blocked, return 0
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return 0
    }

    // If window expired, return max
    if (now - entry.firstAttempt > config.windowMs) {
      return config.maxAttempts
    }

    return Math.max(0, config.maxAttempts - entry.attempts)
  }

  /**
   * Get time until rate limit resets (in ms)
   */
  getResetTime(key: string, config: RateLimitConfig): number {
    const entry = this.limits.get(key)
    if (!entry) return 0

    const now = Date.now()

    // If blocked, return time until unblocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return entry.blockedUntil - now
    }

    // Return time until window expires
    const windowEnd = entry.firstAttempt + config.windowMs
    return Math.max(0, windowEnd - now)
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key)
  }

  /**
   * Record an attempt
   */
  private recordAttempt(key: string, now: number): void {
    this.limits.set(key, {
      attempts: 1,
      firstAttempt: now,
    })
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    this.limits.forEach((entry, key) => {
      // Remove entries that are no longer blocked and window has expired
      if (
        (!entry.blockedUntil || now > entry.blockedUntil) &&
        now - entry.firstAttempt > 300000 // 5 minutes
      ) {
        toDelete.push(key)
      }
    })

    toDelete.forEach(key => this.limits.delete(key))
  }

  /**
   * Destroy the rate limiter and clean up
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.limits.clear()
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

/**
 * Pre-configured rate limit configs
 */
export const RateLimitConfigs = {
  // Login attempts: 5 attempts per 5 minutes, block for 15 minutes
  LOGIN: {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
  },

  // Password reset: 3 attempts per 15 minutes, block for 30 minutes
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },

  // 2FA verification: 5 attempts per 10 minutes, block for 30 minutes
  TWO_FACTOR: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },

  // API calls: 60 requests per minute
  API: {
    maxAttempts: 60,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 60 * 1000, // 1 minute
  },

  // Form submission: 10 submissions per minute
  FORM: {
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 2 * 60 * 1000, // 2 minutes
  },
} as const

/**
 * Check if action is rate limited
 */
export function checkRateLimit(key: string, config: RateLimitConfig): {
  allowed: boolean
  remaining: number
  resetIn: number
} {
  const allowed = !rateLimiter.isRateLimited(key, config)
  const remaining = rateLimiter.getRemainingAttempts(key, config)
  const resetIn = rateLimiter.getResetTime(key, config)

  return { allowed, remaining, resetIn }
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimiter.reset(key)
}

/**
 * Get human-readable time until reset
 */
export function getResetTimeString(resetInMs: number): string {
  const seconds = Math.ceil(resetInMs / 1000)

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }

  const minutes = Math.ceil(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  const hours = Math.ceil(minutes / 60)
  return `${hours} hour${hours !== 1 ? 's' : ''}`
}

/**
 * Composable for Vue components
 */
export function useRateLimit(key: string, config: RateLimitConfig) {
  return {
    check: () => checkRateLimit(key, config),
    reset: () => resetRateLimit(key),
    isAllowed: () => checkRateLimit(key, config).allowed,
    getRemaining: () => checkRateLimit(key, config).remaining,
    getResetTime: () => checkRateLimit(key, config).resetIn,
    getResetString: () => getResetTimeString(checkRateLimit(key, config).resetIn),
  }
}

export default rateLimiter
