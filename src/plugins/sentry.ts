/**
 * Sentry Error Tracking Configuration
 * Captures and monitors errors in production
 */

import * as Sentry from '@sentry/vue'
import type { App } from 'vue'
import type { Router } from 'vue-router'

interface SentryConfig {
  dsn: string
  environment: string
  release?: string
  tracesSampleRate: number
  replaysSessionSampleRate: number
  replaysOnErrorSampleRate: number
  enabled: boolean
}

/**
 * Initialize Sentry for error tracking
 * @param app - Vue app instance
 * @param router - Vue Router instance
 */
export function initSentry(app: App, router: Router): void {
  // Only initialize Sentry in production or if explicitly enabled
  const isProduction = import.meta.env.PROD
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN || ''
  const enableSentry = import.meta.env.VITE_ENABLE_SENTRY === 'true'

  // Skip initialization if no DSN or not enabled
  if (!sentryDsn || (!isProduction && !enableSentry)) {
    return
  }

  const config: SentryConfig = {
    dsn: sentryDsn,
    environment: import.meta.env.MODE || 'development',
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // Performance Monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0, // Capture 10% in production, 100% in dev

    // Session Replay
    replaysSessionSampleRate: 0.1, // Capture 10% of normal sessions
    replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors

    enabled: true
  }

  try {
    Sentry.init({
      app,
      dsn: config.dsn,
      environment: config.environment,
      release: config.release,

      // Integrations
      integrations: [
        // Browser Tracing for performance monitoring
        Sentry.browserTracingIntegration({ router }),

        // Session Replay for debugging
        Sentry.replayIntegration({
          maskAllText: true, // Mask sensitive text
          blockAllMedia: true, // Block images/videos
        }),

        // Breadcrumbs for context
        Sentry.breadcrumbsIntegration({
          console: true,
          dom: true,
          fetch: true,
          history: true,
          xhr: true,
        }),
      ],

      // Performance Monitoring
      tracesSampleRate: config.tracesSampleRate,
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/api\.yourdomain\.com/,
        /^\//,
      ],

      // Session Replay
      replaysSessionSampleRate: config.replaysSessionSampleRate,
      replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,

      // Error filtering
      beforeSend(event, hint) {
        // Filter out certain errors
        const error = hint.originalException as Error

        // Don't send errors from browser extensions
        if (error?.message?.includes('chrome-extension://')) {
          return null
        }

        // Don't send network errors that are expected
        if (error?.message?.includes('NetworkError') && !isProduction) {
          return null
        }

        // Don't send resize observer errors (common and harmless)
        if (error?.message?.includes('ResizeObserver loop')) {
          return null
        }

        return event
      },

      // Ignore certain errors
      ignoreErrors: [
        // Browser extension errors
        'chrome-extension://',
        'moz-extension://',

        // Random plugins/extensions
        'top.GLOBALS',

        // Network errors that are expected
        'Network request failed',
        'NetworkError',

        // ResizeObserver errors (harmless)
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
      ],

      // Debugging
      debug: !isProduction,

      // Normalize URLs
      normalizeDepth: 5,
    })


  } catch (error) {
  }
}

/**
 * Manually capture an exception
 * @param error - Error to capture
 * @param context - Additional context
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (context) {
    Sentry.setContext('custom', context)
  }
  Sentry.captureException(error)
}

/**
 * Manually capture a message
 * @param message - Message to capture
 * @param level - Severity level
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info'
): void {
  Sentry.captureMessage(message, level)
}

/**
 * Set user context for error tracking
 * @param user - User information
 */
export function setUser(user: { id: number | string; email?: string; username?: string } | null): void {
  if (user) {
    Sentry.setUser({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
    })
  } else {
    Sentry.setUser(null)
  }
}

/**
 * Add breadcrumb for debugging
 * @param message - Breadcrumb message
 * @param category - Category
 * @param level - Severity level
 */
export function addBreadcrumb(
  message: string,
  category = 'custom',
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info'
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  })
}

/**
 * Set custom context for errors
 * @param name - Context name
 * @param context - Context data
 */
export function setContext(name: string, context: Record<string, unknown>): void {
  Sentry.setContext(name, context)
}

/**
 * Add custom tag to errors
 * @param key - Tag key
 * @param value - Tag value
 */
export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value)
}

/**
 * Start a new transaction for performance monitoring
 * @param name - Transaction name
 * @param operation - Operation type
 */
export function startTransaction(name: string, operation = 'custom'): ReturnType<typeof Sentry.startTransaction> {
  return Sentry.startTransaction({
    name,
    op: operation,
  })
}

export default {
  initSentry,
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
  setContext,
  setTag,
  startTransaction,
}
