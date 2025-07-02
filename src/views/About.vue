<!-- About.vue - Mobile-First Responsive Design -->
<template>
  <div class="min-h-screen bg-cream relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl animate-float" style="animation-delay: -6s;"></div>
    </div>

    <div class="container-app relative z-10 p-3 sm:p-4 lg:p-6">
      <!-- Mobile-First Enhanced Header -->
      <div class="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
        <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 animate-float shadow-glow-primary">
          <svg class="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-700 mb-3 sm:mb-4 lg:mb-6">
          About <span class="text-gradient-emerald">Finance</span>Tracker
        </h1>
        <p class="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
          Your comprehensive personal finance management solution built with modern technology and user experience in mind
        </p>
      </div>

      <!-- Mobile-First Hero Section -->
      <div class="dashboard-card mb-8 sm:mb-10 lg:mb-12 animate-slide-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div class="order-2 lg:order-1">
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-700 mb-4 sm:mb-6">
              Take Control of Your <span class="text-gradient-emerald">Financial Future</span>
            </h2>
            <p class="text-slate-500 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">
              FinanceTracker is a comprehensive personal finance management application 
              designed to help you track your income, expenses, and achieve your financial goals. 
              Built with cutting-edge web technologies for a seamless, secure, and delightful user experience.
            </p>
            <div class="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span class="badge-success text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-lg hover-scale text-xs sm:text-sm">Vue.js 3</span>
              <span class="badge-warning text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-lg hover-scale text-xs sm:text-sm">Tailwind CSS</span>
              <span class="badge-success text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-lg hover-scale text-xs sm:text-sm">Chart.js</span>
              <span class="badge-warning text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-lg hover-scale text-xs sm:text-sm">PostgreSQL</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button class="btn btn-primary hover-lift">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Get Started
              </button>
              <button class="btn btn-ghost hover-lift">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Watch Demo
              </button>
            </div>
          </div>
          <div class="text-center order-1 lg:order-2">
            <div class="relative">
              <div class="inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 animate-float shadow-glow-primary group">
                <svg class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-emerald-600 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <!-- Mobile-optimized Floating Elements -->
              <div class="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p class="text-slate-500 font-semibold text-sm sm:text-base">Secure & Reliable Platform</p>
          </div>
        </div>
      </div>

      <!-- Mobile-First Features Grid -->
      <div class="mb-12 sm:mb-14 lg:mb-16">
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-700 mb-3 sm:mb-4">
            Powerful Features for <span class="text-gradient-gold">Smart Finance</span>
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-slate-500 max-w-2xl mx-auto px-4">
            Everything you need to manage your finances effectively in one beautiful, intuitive application
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div class="dashboard-card card-interactive group">
            <div class="category-icon category-icon-income mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3">Data Visualization</h3>
            <p class="text-slate-500 leading-relaxed text-sm sm:text-base">
              Beautiful interactive charts and graphs to visualize your spending patterns, income trends, and financial insights with stunning clarity.
            </p>
          </div>

          <div class="dashboard-card card-interactive group">
            <div class="category-icon category-icon-expense mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3">Smart Categories</h3>
            <p class="text-slate-500 leading-relaxed text-sm sm:text-base">
              Organize transactions with intelligent, customizable categories powered by AI suggestions for better financial insights and planning.
            </p>
          </div>

          <div class="dashboard-card card-interactive group">
            <div class="category-icon category-icon-income mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3">Lightning Fast</h3>
            <p class="text-slate-500 leading-relaxed text-sm sm:text-base">
              Blazing fast performance with instant transaction recording, real-time updates, and seamless synchronization across all devices.
            </p>
          </div>

          <div class="dashboard-card card-interactive group">
            <div class="category-icon category-icon-expense mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3">Detailed Reports</h3>
            <p class="text-slate-500 leading-relaxed text-sm sm:text-base">
              Comprehensive monthly, quarterly, and yearly reports with advanced analytics to understand your complete financial picture.
            </p>
          </div>

          <div class="dashboard-card card-interactive group">
            <div class="category-icon category-icon-income mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3">User Centric</h3>
            <p class="text-slate-500 leading-relaxed text-sm sm:text-base">
              Designed with user experience at the core, making financial management not just powerful but genuinely enjoyable to use daily.
            </p>
          </div>

          <div class="dashboard-card card-interactive group">
            <div class="category-icon category-icon-expense mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3">Bank-Level Security</h3>
            <p class="text-slate-500 leading-relaxed text-sm sm:text-base">
              Your financial data is protected with enterprise-grade encryption, secure authentication, and industry-standard security protocols.
            </p>
          </div>
        </div>
      </div>

      <!-- Mobile-First Technology Stack Section -->
      <div class="dashboard-card mb-8 sm:mb-10 lg:mb-12">
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-700 mb-3 sm:mb-4">
            Built with <span class="text-gradient-emerald">Modern Technology</span>
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-slate-500">
            Powered by the latest and most reliable technologies in the industry
          </p>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
          <div class="hover-lift group cursor-pointer">
            <div class="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:shadow-glow-primary transition-all duration-300">
              <span class="text-xl sm:text-2xl font-bold text-emerald-600">V3</span>
            </div>
            <div class="text-gradient-emerald text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">Vue 3</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Progressive Framework</div>
          </div>
          
          <div class="hover-lift group cursor-pointer">
            <div class="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:shadow-glow-secondary transition-all duration-300">
              <span class="text-xl sm:text-2xl font-bold text-gold-600">TW</span>
            </div>
            <div class="text-gradient-gold text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">Tailwind</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Utility-First CSS</div>
          </div>
          
          <div class="hover-lift group cursor-pointer">
            <div class="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
              <span class="text-xl sm:text-2xl font-bold text-blue-600">CJ</span>
            </div>
            <div class="text-gradient-emerald text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">Chart.js</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Data Visualization</div>
          </div>
          
          <div class="hover-lift group cursor-pointer">
            <div class="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
              <span class="text-xl sm:text-2xl font-bold text-purple-600">PG</span>
            </div>
            <div class="text-gradient-gold text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">PostgreSQL</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Reliable Database</div>
          </div>
        </div>
      </div>

      <!-- Mobile-First Statistics Section -->
      <div class="dashboard-card mb-8 sm:mb-10 lg:mb-12">
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-700 mb-3 sm:mb-4">
            Trusted by <span class="text-gradient-emerald">Thousands</span>
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-slate-500">
            Join the growing community of users taking control of their finances
          </p>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
          <div class="hover-lift group">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-emerald mb-1 sm:mb-2 group-hover:scale-110 transition-transform">10K+</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Active Users</div>
          </div>
          <div class="hover-lift group">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-gold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">500K+</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Transactions Tracked</div>
          </div>
          <div class="hover-lift group">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-emerald mb-1 sm:mb-2 group-hover:scale-110 transition-transform">99.9%</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Uptime</div>
          </div>
          <div class="hover-lift group">
            <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-gold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">24/7</div>
            <div class="text-slate-500 font-medium text-xs sm:text-sm">Support</div>
          </div>
        </div>
      </div>

      <!-- Mobile-First Contact Section -->
      <div class="dashboard-card text-center">
        <div class="max-w-2xl mx-auto">
          <div class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg sm:rounded-xl mb-4 sm:mb-6 shadow-glow-primary">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-700 mb-3 sm:mb-4">
            Questions or Feedback?
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-slate-500 mb-6 sm:mb-8 px-4">
            We'd love to hear from you! Our dedicated support team is here to help you succeed with your financial goals.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button class="btn btn-primary hover-lift">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Contact Support
            </button>
            <button class="btn btn-ghost hover-lift">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No reactive data needed for this static page
</script>

<style scoped>
/* Mobile-First Responsive Styles */

/* Animation keyframes */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animation classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out forwards;
}

/* Utility classes - Mobile-first */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-lift {
  transition: transform 0.2s ease;
}

/* Only apply hover effects on devices that support hover */
@media (hover: hover) {
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
  }
}

/* Container responsive styles */
.container-app {
  max-width: 80rem;
  margin: 0 auto;
}

/* Dashboard card responsive styles */
.dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .dashboard-card {
    padding: 1.5rem;
    border-radius: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-card {
    padding: 2rem;
  }
}

.card-interactive {
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fade-in 0.6s ease-out forwards;
}

.card-interactive:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

/* Category icon responsive styles */
.category-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .category-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
  }
}

@media (min-width: 1024px) {
  .category-icon {
    width: 3rem;
    height: 3rem;
  }
}

.category-icon-income {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.category-icon-expense {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

/* Button styles - Mobile-first */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

@media (min-width: 640px) {
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 1rem;
  }
}

@media (min-width: 1024px) {
  .btn {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  color: #64748b;
  border: 2px solid rgba(100, 116, 139, 0.2);
}

.btn-ghost:hover {
  background: rgba(100, 116, 139, 0.1);
  border-color: rgba(100, 116, 139, 0.3);
  color: #475569;
}

/* Badge styles - Mobile-first */
.badge-success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.badge-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

/* Color utilities */
.bg-cream {
  background-color: #fefcf3;
}

.text-gradient-emerald {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-gold {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Gold color utilities for Tailwind compatibility */
.text-gold-600 {
  color: #d97706;
}

.bg-gold-100 {
  background-color: #fef3c7;
}

.bg-gold-200 {
  background-color: #fde68a;
}

.from-gold-100 {
  --tw-gradient-from: #fef3c7;
}

.to-gold-200 {
  --tw-gradient-to: #fde68a;
}

.from-gold-400 {
  --tw-gradient-from: #fbbf24;
}

.to-gold-600 {
  --tw-gradient-to: #d97706;
}

/* Shadow utilities */
.shadow-glow-primary {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.shadow-glow-secondary {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

/* Focus improvements for keyboard navigation */
button:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Enhanced button states */
button:active {
  transform: scale(0.98);
}

/* Print styles */
@media print {
  .hover-lift,
  .hover-scale,
  .animate-float {
    transform: none !important;
    animation: none !important;
  }
  
  .dashboard-card::before {
    display: none !important;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up,
  .animate-float,
  .hover-lift,
  .hover-scale {
    animation: none !important;
    transition: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .dashboard-card {
    border: 2px solid #000;
  }
  
  .text-slate-400 {
    color: #666;
  }
  
  .text-slate-500 {
    color: #555;
  }
  
  .text-slate-600 {
    color: #333;
  }
}

/* Extra small screens (320px and up) */
@media (min-width: 320px) {
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
}

/* Medium screens adjustments */
@media (min-width: 768px) {
  .hover-lift:hover {
    transform: translateY(-4px);
  }
}

/* Large screens optimization */
@media (min-width: 1024px) {
  .card-interactive:hover {
    transform: translateY(-5px);
  }
}
</style>