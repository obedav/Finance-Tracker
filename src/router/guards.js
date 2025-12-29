// src/router/guards.js
import authService from '../services/authService'
import { STORAGE_KEYS } from '../utils/constants'

/**
 * Authentication Guard
 * Ensures user is authenticated before accessing protected routes
 */
export const authGuard = (to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  if (isAuthenticated) {
    // User is authenticated, allow access
    next()
  } else {
    // User is not authenticated, redirect to login
    
    // Store the intended destination
    const intendedRoute = to.fullPath
    if (intendedRoute && intendedRoute !== '/login') {
      localStorage.setItem('intended_route', intendedRoute)
    }
    
    next({
      name: 'Login',
      query: { 
        redirect: to.fullPath,
        reason: 'auth_required'
      }
    })
  }
}

/**
 * Guest Guard
 * Ensures user is NOT authenticated (for login/register pages)
 */
export const guestGuard = (to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  if (!isAuthenticated) {
    // User is not authenticated, allow access to guest pages
    next()
  } else {
    // User is already authenticated, redirect to dashboard
    
    // Check if there's an intended route to redirect to
    const intendedRoute = localStorage.getItem('intended_route')
    if (intendedRoute) {
      localStorage.removeItem('intended_route')
      next(intendedRoute)
    } else {
      next({ name: 'Dashboard' })
    }
  }
}

/**
 * Admin Guard (for future admin features)
 * Ensures user has admin privileges
 */
export const adminGuard = (to, from, next) => {
  const user = authService.getCurrentUserData()
  
  if (!user) {
    next({ name: 'Login' })
    return
  }
  
  if (user.role === 'admin' || user.isAdmin) {
    next()
  } else {
    next({ 
      name: 'Unauthorized',
      query: { reason: 'admin_required' }
    })
  }
}

/**
 * Email Verification Guard (for future email verification)
 * Ensures user has verified their email
 */
export const emailVerifiedGuard = (to, from, next) => {
  const user = authService.getCurrentUserData()
  
  if (!user) {
    next({ name: 'Login' })
    return
  }
  
  if (user.emailVerified) {
    next()
  } else {
    next({ 
      name: 'EmailVerification',
      query: { reason: 'email_verification_required' }
    })
  }
}

/**
 * Subscription Guard (for future premium features)
 * Ensures user has active subscription
 */
export const subscriptionGuard = (to, from, next) => {
  const user = authService.getCurrentUserData()
  
  if (!user) {
    next({ name: 'Login' })
    return
  }
  
  if (user.subscription?.status === 'active' || user.isPremium) {
    next()
  } else {
    next({ 
      name: 'Upgrade',
      query: { reason: 'subscription_required' }
    })
  }
}

/**
 * Role-based Guard Factory
 * Creates guards that check for specific user roles
 */
export const createRoleGuard = (requiredRoles) => {
  return (to, from, next) => {
    const user = authService.getCurrentUserData()
    
    if (!user) {
      next({ name: 'Login' })
      return
    }
    
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.role].filter(Boolean)
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role))
    
    if (hasRequiredRole) {
      next()
    } else {
      next({ 
        name: 'Unauthorized',
        query: { reason: 'insufficient_privileges' }
      })
    }
  }
}

/**
 * Feature Flag Guard Factory
 * Creates guards that check if a feature is enabled
 */
export const createFeatureGuard = (featureName) => {
  return (to, from, next) => {
    // In a real app, this would check feature flags from the backend or config
    const isFeatureEnabled = true // Replace with actual feature flag check
    
    if (isFeatureEnabled) {
      next()
    } else {
      next({ 
        name: 'NotFound',
        query: { reason: 'feature_disabled' }
      })
    }
  }
}

/**
 * Rate Limiting Guard
 * Prevents too many rapid navigation attempts
 */
export const rateLimitGuard = (() => {
  const navigationHistory = []
  const maxNavigations = 10
  const timeWindow = 60 * 1000 // 1 minute
  
  return (to, from, next) => {
    const now = Date.now()
    
    // Clean old navigation entries
    while (navigationHistory.length && navigationHistory[0] < now - timeWindow) {
      navigationHistory.shift()
    }
    
    // Check rate limit
    if (navigationHistory.length >= maxNavigations) {
      next({ 
        name: 'ServerError',
        query: { reason: 'rate_limit_exceeded' }
      })
      return
    }
    
    // Record this navigation
    navigationHistory.push(now)
    next()
  }
})()

/**
 * Maintenance Mode Guard
 * Blocks access during maintenance (except for admins)
 */
export const maintenanceGuard = (to, from, next) => {
  const isMaintenanceMode = process.env.VUE_APP_MAINTENANCE_MODE === 'true'
  
  if (!isMaintenanceMode) {
    next()
    return
  }
  
  const user = authService.getCurrentUserData()
  const isAdmin = user?.role === 'admin' || user?.isAdmin
  
  if (isAdmin) {
    next()
  } else {
    next({ 
      name: 'Maintenance',
      query: { reason: 'maintenance_mode' }
    })
  }
}

/**
 * Browser Support Guard
 * Checks for minimum browser requirements
 */
export const browserSupportGuard = (to, from, next) => {
  const isSupported = checkBrowserSupport()
  
  if (isSupported) {
    next()
  } else {
    next({ 
      name: 'BrowserNotSupported',
      query: { reason: 'browser_not_supported' }
    })
  }
}

/**
 * Check browser support
 */
function checkBrowserSupport() {
  // Check for essential modern browser features
  const requiredFeatures = [
    'localStorage' in window,
    'sessionStorage' in window,
    'fetch' in window,
    'Promise' in window,
    'Map' in window,
    'Set' in window
  ]
  
  return requiredFeatures.every(feature => feature)
}

/**
 * Token Validation Guard
 * Validates JWT token before allowing access
 */
export const tokenValidationGuard = async (to, from, next) => {
  const token = authService.getStoredToken()
  
  if (!token) {
    next()
    return
  }
  
  try {
    // Verify token is still valid
    const isValid = await authService.verifyToken()
    
    if (!isValid) {
      authService.clearAuthData()
      next({ 
        name: 'Login',
        query: { reason: 'token_expired' }
      })
    } else {
      next()
    }
  } catch (error) {
    next()
  }
}

/**
 * Permission Guard Factory
 * Creates guards that check for specific permissions
 */
export const createPermissionGuard = (requiredPermissions) => {
  return (to, from, next) => {
    const user = authService.getCurrentUserData()
    
    if (!user) {
      next({ name: 'Login' })
      return
    }
    
    const userPermissions = user.permissions || []
    const hasPermission = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )
    
    if (hasPermission) {
      next()
    } else {
      next({ 
        name: 'Unauthorized',
        query: { reason: 'insufficient_permissions' }
      })
    }
  }
}

/**
 * Setup Router Guards
 * Configures global guards for the router
 */
export const setupRouterGuards = (router) => {
  // Global before guards
  router.beforeEach(async (to, from, next) => {
    // Skip guards for error pages
    if (['NotFound', 'Unauthorized', 'ServerError'].includes(to.name)) {
      next()
      return
    }
    
    try {
      // Apply browser support guard
      browserSupportGuard(to, from, (result) => {
        if (result !== true) {
          next(result)
          return
        }
        
        // Apply maintenance guard
        maintenanceGuard(to, from, (result) => {
          if (result !== true) {
            next(result)
            return
          }
          
          // Apply rate limiting guard
          rateLimitGuard(to, from, (result) => {
            if (result !== true) {
              next(result)
              return
            }
            
            next()
          })
        })
      })
    } catch (error) {
      next({ name: 'ServerError' })
    }
  })
  
  // Global after guards
  router.afterEach((to, from) => {
    // Log navigation for debugging
    if (process.env.NODE_ENV === 'development') {
    }
    
    // Clear any temporary storage
    if (to.name === 'Dashboard' && from.name === 'Login') {
      localStorage.removeItem('intended_route')
    }
  })
  
  // Global error handler
  router.onError((error, to, from) => {
    
    // Handle chunk loading errors
    if (error.message.includes('Loading chunk')) {
      window.location.reload()
      return
    }
    
    // Handle other navigation errors
    router.push({ 
      name: 'ServerError',
      query: { reason: 'navigation_error' }
    })
  })
}

/**
 * Navigation Helpers
 */
export const navigationHelpers = {
  // Check if user can access a route
  canAccess(routeName, user = null) {
    const currentUser = user || authService.getCurrentUserData()
    
    // Add logic to check route permissions
    // This is a simplified example
    const protectedRoutes = ['Dashboard', 'Transactions', 'Categories', 'Reports', 'Settings']
    
    if (protectedRoutes.includes(routeName)) {
      return !!currentUser
    }
    
    return true
  },
  
  // Get redirect URL after login
  getRedirectAfterLogin() {
    const intendedRoute = localStorage.getItem('intended_route')
    if (intendedRoute && intendedRoute !== '/login') {
      localStorage.removeItem('intended_route')
      return intendedRoute
    }
    return '/dashboard'
  },
  
  // Set intended route for after login
  setIntendedRoute(route) {
    if (route && route !== '/login') {
      localStorage.setItem('intended_route', route)
    }
  },
  
  // Clear intended route
  clearIntendedRoute() {
    localStorage.removeItem('intended_route')
  },
  
  // Check if route requires authentication
  requiresAuth(route) {
    return route.meta?.requiresAuth === true
  },
  
  // Check if route is for guests only
  isGuestOnly(route) {
    return route.meta?.requiresAuth === false && 
           ['Login', 'Register', 'ForgotPassword', 'ResetPassword'].includes(route.name)
  }
}

/**
 * Route Meta Validators
 */
export const routeValidators = {
  // Validate route permissions
  validatePermissions(to, user) {
    const requiredPermissions = to.meta?.permissions || []
    if (requiredPermissions.length === 0) return true
    
    const userPermissions = user?.permissions || []
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )
  },
  
  // Validate route roles
  validateRoles(to, user) {
    const requiredRoles = to.meta?.roles || []
    if (requiredRoles.length === 0) return true
    
    const userRoles = Array.isArray(user?.roles) ? user.roles : [user?.role].filter(Boolean)
    return requiredRoles.some(role => userRoles.includes(role))
  },
  
  // Validate feature flags
  validateFeatures(to) {
    const requiredFeatures = to.meta?.features || []
    if (requiredFeatures.length === 0) return true
    
    // In a real app, check feature flags from config or API
    return requiredFeatures.every(feature => {
      // Mock feature flag check - replace with real implementation
      return true
    })
  },
  
  // Validate subscription requirements
  validateSubscription(to, user) {
    const requiresSubscription = to.meta?.requiresSubscription
    if (!requiresSubscription) return true
    
    return user?.subscription?.status === 'active' || user?.isPremium
  }
}

/**
 * Navigation Analytics
 */
export const navigationAnalytics = {
  // Track page views
  trackPageView(to, from) {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_TRACKING_ID', {
        page_path: to.path,
        page_title: to.meta?.title || to.name
      })
    }
    
    // Custom analytics tracking
    if (window.analytics) {
      window.analytics.page(to.meta?.title || to.name, {
        path: to.path,
        referrer: from?.path
      })
    }
  },
  
  // Track navigation events
  trackNavigation(to, from, duration) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_navigation', {
        from_page: from?.name || 'unknown',
        to_page: to.name || 'unknown',
        navigation_duration: duration
      })
    }
  },
  
  // Track authentication events
  trackAuthEvent(event, user = null) {
    if (typeof gtag !== 'undefined') {
      gtag('event', event, {
        user_id: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      })
    }
  }
}

/**
 * Security Utilities
 */
export const securityUtils = {
  // Check for suspicious navigation patterns
  detectSuspiciousActivity(to, from) {
    const suspiciousPatterns = [
      // Rapid navigation between sensitive pages
      /\/settings\/security$/,
      /\/profile\/delete$/,
      /\/admin\//
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(to.path))
  },
  
  // Log security events
  logSecurityEvent(event, details = {}) {
    const securityLog = {
      event,
      timestamp: new Date().toISOString(),
      user: authService.getCurrentUserData()?.id || 'anonymous',
      userAgent: navigator.userAgent,
      ip: 'client-side', // Would be set by backend
      ...details
    }
    
    
    // In a real app, send to security monitoring service
    // securityService.logEvent(securityLog)
  },
  
  // Validate CSRF token (for future implementation)
  validateCSRFToken(token) {
    // Mock implementation - replace with real CSRF validation
    return true
  },
  
  // Check for session fixation
  checkSessionSecurity() {
    const sessionId = localStorage.getItem('session_id')
    const sessionCreated = localStorage.getItem('session_created')
    
    if (!sessionId || !sessionCreated) return true
    
    const sessionAge = Date.now() - parseInt(sessionCreated)
    const maxSessionAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (sessionAge > maxSessionAge) {
      localStorage.removeItem('session_id')
      localStorage.removeItem('session_created')
      return false
    }
    
    return true
  }
}

/**
 * Error Recovery
 */
export const errorRecovery = {
  // Attempt to recover from navigation errors
  recoverFromError(error, to, from, router) {
    
    // Handle specific error types
    if (error.message.includes('Loading chunk')) {
      // Chunk loading failed - try reloading
      window.location.reload()
      return
    }
    
    if (error.message.includes('Network Error')) {
      // Network error - redirect to offline page
      router.push({ name: 'Offline' })
      return
    }
    
    // Generic error recovery
    router.push({ 
      name: 'ServerError',
      query: { 
        reason: 'navigation_error',
        original_path: to.path
      }
    })
  },
  
  // Retry failed navigation
  retryNavigation(router, to, maxRetries = 3) {
    let retryCount = 0
    
    const attemptNavigation = () => {
      router.push(to).catch(error => {
        retryCount++
        if (retryCount < maxRetries) {
          setTimeout(attemptNavigation, 1000 * retryCount)
        } else {
          this.recoverFromError(error, to, null, router)
        }
      })
    }
    
    attemptNavigation()
  }
}

/**
 * Performance Monitoring
 */
export const performanceMonitor = {
  navigationStartTime: null,
  
  // Start timing navigation
  startTiming() {
    this.navigationStartTime = performance.now()
  },
  
  // End timing and log performance
  endTiming(to, from) {
    if (!this.navigationStartTime) return
    
    const duration = performance.now() - this.navigationStartTime
    
    // Log slow navigations
    if (duration > 1000) {
    }
    
    // Track in analytics
    navigationAnalytics.trackNavigation(to, from, duration)
    
    this.navigationStartTime = null
  },
  
  // Monitor route performance
  monitorRoute(routeName, loadTime) {
    const performanceData = JSON.parse(localStorage.getItem('route_performance') || '{}')
    
    if (!performanceData[routeName]) {
      performanceData[routeName] = {
        count: 0,
        totalTime: 0,
        averageTime: 0,
        maxTime: 0,
        minTime: Infinity
      }
    }
    
    const routeData = performanceData[routeName]
    routeData.count++
    routeData.totalTime += loadTime
    routeData.averageTime = routeData.totalTime / routeData.count
    routeData.maxTime = Math.max(routeData.maxTime, loadTime)
    routeData.minTime = Math.min(routeData.minTime, loadTime)
    
    localStorage.setItem('route_performance', JSON.stringify(performanceData))
  }
}

/**
 * Development Helpers
 */
export const devHelpers = {
  // Log all navigation events in development
  enableDebugMode() {
    if (process.env.NODE_ENV !== 'development') return
    
    window.routerDebug = {
      logNavigation: true,
      logGuards: true,
      logPerformance: true
    }
  },
  
  // Get navigation statistics
  getNavigationStats() {
    return JSON.parse(localStorage.getItem('route_performance') || '{}')
  },
  
  // Clear navigation data
  clearNavigationData() {
    localStorage.removeItem('route_performance')
    localStorage.removeItem('intended_route')
  },
  
  // Test route guards
  testGuards(router) {
    const testRoutes = [
      { name: 'Dashboard', shouldRequireAuth: true },
      { name: 'Login', shouldRequireAuth: false },
      { name: 'Settings', shouldRequireAuth: true }
    ]
    
    testRoutes.forEach(test => {
      const route = router.resolve({ name: test.name })
      const requiresAuth = navigationHelpers.requiresAuth(route)
      
    })
  }
}

// Export all guards and utilities
export default {
  // Guards
  authGuard,
  guestGuard,
  adminGuard,
  emailVerifiedGuard,
  subscriptionGuard,
  createRoleGuard,
  createFeatureGuard,
  rateLimitGuard,
  maintenanceGuard,
  browserSupportGuard,
  tokenValidationGuard,
  createPermissionGuard,
  
  // Setup
  setupRouterGuards,
  
  // Helpers
  navigationHelpers,
  routeValidators,
  navigationAnalytics,
  securityUtils,
  errorRecovery,
  performanceMonitor,
  devHelpers
}