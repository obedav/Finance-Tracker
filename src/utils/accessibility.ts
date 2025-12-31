/**
 * Accessibility utility functions
 * Helps ensure WCAG 2.1 AA compliance throughout the application
 */

/**
 * Generate unique IDs for ARIA relationships
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Trap focus within an element (for modals/dialogs)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  // Focus first element
  firstElement?.focus()

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Check if element is visible to screen readers
 */
export function isAccessible(element: HTMLElement): boolean {
  if (!element) return false

  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true'
  )
}

/**
 * Get accessible name for an element
 */
export function getAccessibleName(element: HTMLElement): string {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent ||
    ''
  ).trim()
}

/**
 * Handle Escape key to close dialogs/modals
 */
export function handleEscapeKey(callback: () => void): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback()
    }
  }
}

/**
 * Ensure element has accessible label
 */
export function ensureAccessibleLabel(element: HTMLElement, label: string): void {
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label)
  }
}

/**
 * Create visually hidden but screen-reader accessible text
 */
export function createScreenReaderText(text: string): HTMLSpanElement {
  const span = document.createElement('span')
  span.className = 'sr-only'
  span.textContent = text
  return span
}

/**
 * Manage focus restoration
 */
export class FocusManager {
  private previousFocus: HTMLElement | null = null

  saveFocus(): void {
    this.previousFocus = document.activeElement as HTMLElement
  }

  restoreFocus(): void {
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus()
    }
  }
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
} as const

/**
 * Check if key event should activate element
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === KeyboardKeys.ENTER || event.key === KeyboardKeys.SPACE
}

/**
 * Prevent default for activation keys
 */
export function handleActivation(event: KeyboardEvent, callback: () => void): void {
  if (isActivationKey(event)) {
    event.preventDefault()
    callback()
  }
}

/**
 * ARIA live region helper
 */
export class LiveRegion {
  private region: HTMLDivElement | null = null

  constructor(priority: 'polite' | 'assertive' = 'polite') {
    this.region = document.createElement('div')
    this.region.setAttribute('role', 'status')
    this.region.setAttribute('aria-live', priority)
    this.region.setAttribute('aria-atomic', 'true')
    this.region.className = 'sr-only'
    document.body.appendChild(this.region)
  }

  announce(message: string): void {
    if (this.region) {
      this.region.textContent = message
    }
  }

  destroy(): void {
    if (this.region && this.region.parentNode) {
      this.region.parentNode.removeChild(this.region)
      this.region = null
    }
  }
}

/**
 * Skip navigation link helper
 */
export function createSkipLink(targetId: string, label: string = 'Skip to main content'): HTMLAnchorElement {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.className = 'skip-link'
  skipLink.textContent = label
  skipLink.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.setAttribute('tabindex', '-1')
      target.focus()
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex')
      }, { once: true })
    }
  })
  return skipLink
}
