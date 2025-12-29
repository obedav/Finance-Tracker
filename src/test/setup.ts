/**
 * Vitest Test Setup File
 * Configures global test environment and utilities
 */

import { vi } from 'vitest'

// Mock environment variables
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000/api')

// Add custom matchers if needed in the future
// Example: expect.extend({ ... })

// Global test configuration
globalThis.console = {
  ...console,
  // Suppress console errors in tests (optional)
  // error: vi.fn(),
  // warn: vi.fn(),
}
