// src/router/index.js - Updated with Analytics route
import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/authService.js'

// Lazy load components for better performance
const Dashboard = () => import('../views/Dashboard.vue')
const Analytics = () => import('../views/Analytics.vue')  // Add this line
const Transactions = () => import('../views/Transactions.vue')
const Categories = () => import('../views/Categories.vue')
const Reports = () => import('../views/Reports.vue')
const Settings = () => import('../views/Settings.vue')
const About = () => import('../views/About.vue')
const Budgets = () => import('../views/Budgets.vue')

// Auth views - Updated paths to match your structure
const Login = () => import('../views/auth/Login.vue')
const Register = () => import('../views/auth/Register.vue')
const ForgotPassword = () => import('../views/auth/ForgotPassword.vue')
const ResetPassword = () => import('../views/auth/ResetPassword.vue')

// Error views
const NotFound = () => import('../views/errors/NotFound.vue')
const Unauthorized = () => import('../views/errors/Unauthorized.vue')
const ServerError = () => import('../views/errors/ServerError.vue')

// SIMPLIFIED AUTH GUARD - only uses authService
const authGuard = (to, from, next) => {
  console.log('🔒 Auth guard checking...', { to: to.name, from: from.name })
  
  // Simple check using only authService
  const isAuthenticated = authService.isAuthenticated()
  const hasToken = authService.getStoredToken()
  const hasUser = authService.getStoredUser()
  
  console.log('Auth check:', { 
    isAuthenticated, 
    hasToken: !!hasToken, 
    hasUser: !!hasUser,
    tokenValue: hasToken?.substring(0, 20) + '...' 
  })
  
  if (isAuthenticated && hasToken && hasUser) {
    console.log('✅ Auth guard: User authenticated, allowing access')
    next()
  } else {
    console.log('❌ Auth guard: User not authenticated, redirecting to login')
    
    // Store intended route
    if (to.fullPath !== '/login') {
      localStorage.setItem('intended_route', to.fullPath)
    }
    
    next({
      path: '/login',
      query: { 
        redirect: to.fullPath,
        reason: 'auth_required'
      }
    })
  }
}

// SIMPLIFIED GUEST GUARD - only uses authService
const guestGuard = (to, from, next) => {
  console.log('👤 Guest guard checking...', { to: to.name, from: from.name })
  
  const isAuthenticated = authService.isAuthenticated()
  const hasToken = authService.getStoredToken()
  const hasUser = authService.getStoredUser()
  
  console.log('Guest check:', { 
    isAuthenticated, 
    hasToken: !!hasToken, 
    hasUser: !!hasUser 
  })
  
  if (!isAuthenticated || !hasToken || !hasUser) {
    console.log('✅ Guest guard: User not authenticated, allowing access to login')
    next()
  } else {
    console.log('❌ Guest guard: User already authenticated, redirecting to dashboard')
    
    // Check for intended route
    const intendedRoute = localStorage.getItem('intended_route')
    if (intendedRoute) {
      localStorage.removeItem('intended_route')
      console.log('Redirecting to intended route:', intendedRoute)
      next(intendedRoute)
    } else {
      console.log('Redirecting to dashboard')
      next('/dashboard')
    }
  }
}

// Define routes
const routes = [
  // Root redirect
  {
    path: '/',
    redirect: '/dashboard'
  },

  // Authentication routes (guest only)
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: guestGuard,
    meta: {
      title: 'Login',
      description: 'Sign in to your FinanceTracker account',
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: guestGuard,
    meta: {
      title: 'Create Account',
      description: 'Create your FinanceTracker account',
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    beforeEnter: guestGuard,
    meta: {
      title: 'Forgot Password',
      description: 'Reset your password',
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPassword,
    beforeEnter: guestGuard,
    props: true,
    meta: {
      title: 'Reset Password',
      description: 'Set your new password',
      requiresAuth: false,
      layout: 'auth'
    }
  },

  // Main application routes (authenticated)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: authGuard,
    meta: {
      title: 'Dashboard',
      description: 'Overview of your financial status',
      requiresAuth: true,
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      showInNav: true,
      order: 1
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    beforeEnter: authGuard,
    meta: {
      title: 'Analytics',
      description: 'Deep insights into your financial patterns',
      requiresAuth: true,
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      showInNav: true,
      order: 2
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
    beforeEnter: authGuard,
    meta: {
      title: 'Transactions',
      description: 'Manage your income and expenses',
      requiresAuth: true,
      icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      showInNav: true,
      order: 3
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    beforeEnter: authGuard,
    meta: {
      title: 'Categories',
      description: 'Manage your transaction categories',
      requiresAuth: true,
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      showInNav: true,
      order: 4
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    beforeEnter: authGuard,
    meta: {
      title: 'Reports',
      description: 'View financial reports and analytics',
      requiresAuth: true,
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      showInNav: true,
      order: 5
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    beforeEnter: authGuard,
    meta: {
      title: 'Settings',
      description: 'Manage your account and preferences',
      requiresAuth: true,
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      showInNav: true,
      order: 6
    }
  },
  
  {
    path: '/budgets',
    name: 'Budgets',
    component: Budgets,
    beforeEnter: authGuard,
    meta: {
      title: 'Budgets',
      description: 'Manage your spending budgets and track expenses',
      requiresAuth: true,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      showInNav: true,
      order: 7
    }
  },

  {
  path: '/profile',
  name: 'Profile',
  component: () => import('@/views/Profile.vue'),
  meta: { requiresAuth: true }
  },

  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'About',
      description: 'Learn more about FinanceTracker',
      requiresAuth: false,
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      showInNav: true,
      order: 7
    }
  },

  // Transaction specific routes
  {
    path: '/transactions/new',
    name: 'NewTransaction',
    component: () => import('../components/transactions/TransactionForm.vue'),
    beforeEnter: authGuard,
    meta: {
      title: 'Add Transaction',
      description: 'Add a new income or expense transaction',
      requiresAuth: true,
      showInNav: false,
      parent: 'Transactions'
    }
  },

  // Error routes
  {
    path: '/401',
    name: 'Unauthorized',
    component: Unauthorized,
    meta: {
      title: 'Unauthorized',
      description: 'You are not authorized to access this page',
      requiresAuth: false,
      showInNav: false
    }
  },
  {
    path: '/500',
    name: 'ServerError',
    component: ServerError,
    meta: {
      title: 'Server Error',
      description: 'Something went wrong on our end',
      requiresAuth: false,
      showInNav: false
    }
  },

  // Catch-all 404 route - must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist',
      requiresAuth: false,
      showInNav: false
    }
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position if available (browser back/forward)
    if (savedPosition) {
      return savedPosition
    }
    
    // Scroll to anchor if present
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    
    // Scroll to top for new pages
    return { top: 0, behavior: 'smooth' }
  }
})

// SIMPLIFIED Global navigation guards - no auth store dependency
router.beforeEach((to, from, next) => {
  console.log(`🧭 Navigating from ${from.name || 'unknown'} to ${to.name || 'unknown'}`)
  
  // Update document title
  const appName = 'FinanceTracker'
  const pageTitle = to.meta?.title
  document.title = pageTitle ? `${pageTitle} | ${appName}` : appName
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && to.meta?.description) {
    metaDescription.setAttribute('content', to.meta.description)
  }
  
  // Add loading state
  document.body.classList.add('page-loading')
  
  next()
})

router.afterEach((to, from) => {
  console.log(`✅ Navigation completed: ${to.name || 'unknown'}`)
  
  // Remove loading state
  document.body.classList.remove('page-loading')
  
  // Analytics tracking (if enabled)
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_TRACKING_ID', {
      page_path: router.currentRoute.value.path
    })
  }
})

// Error handling
router.onError((error) => {
  console.error('Router error:', error)
  
  // Handle chunk load errors (lazy loading failures)
  if (error.message.includes('Loading chunk')) {
    console.warn('Chunk loading failed, reloading page...')
    window.location.reload()
  }
})

// Export navigation helper functions
export const getNavigationRoutes = () => {
  return routes
    .filter(route => route.meta?.showInNav)
    .sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999))
    .map(route => ({
      name: route.name,
      path: route.path,
      title: route.meta.title,
      icon: route.meta.icon
    }))
}

export const getBreadcrumbs = (currentRoute) => {
  const breadcrumbs = []
  let route = currentRoute
  
  while (route) {
    if (route.meta?.title) {
      breadcrumbs.unshift({
        name: route.name,
        title: route.meta.title,
        path: route.path,
        active: route === currentRoute
      })
    }
    
    // Find parent route
    if (route.meta?.parent) {
      route = routes.find(r => r.name === route.meta.parent)
    } else {
      break
    }
  }
  
  return breadcrumbs
}

export const isRouteActive = (routeName, currentRoute) => {
  if (currentRoute.name === routeName) return true
  
  // Check if current route is a child of the given route
  let route = currentRoute
  while (route?.meta?.parent) {
    if (route.meta.parent === routeName) return true
    route = routes.find(r => r.name === route.meta.parent)
  }
  
  return false
}

// Add debug helpers to window for testing
if (typeof window !== 'undefined') {
  window.routerDebug = {
    checkAuth: () => {
      const isAuth = authService.isAuthenticated()
      const token = authService.getStoredToken()
      const user = authService.getStoredUser()
      
      console.log('Router Auth Check:', {
        isAuthenticated: isAuth,
        hasToken: !!token,
        hasUser: !!user,
        currentRoute: router.currentRoute.value.name
      })
      
      return { isAuth, hasToken: !!token, hasUser: !!user }
    },
    
    forceLogin: () => {
      router.push('/login')
    },
    
    forceDashboard: () => {
      router.push('/dashboard')
    },
    
    clearAuth: () => {
      authService.clearAuthData()
      localStorage.removeItem('intended_route')
      console.log('Auth cleared, redirecting to login')
      router.push('/login')
    }
  }
}

export default router