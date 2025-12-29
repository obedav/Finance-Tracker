<!-- src/views/Settings.vue -->
<template>
  <div class="min-h-screen bg-cream dark:bg-neutral-900 relative overflow-hidden transition-colors duration-200">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 blur-3xl animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 blur-3xl animate-float" style="animation-delay: -3s;"></div>
    </div>

    <div class="container-app relative z-10 p-6">
      <!-- Enhanced Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-glow-primary">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-bold text-slate-700">Settings</h1>
            <p class="text-lg text-slate-500">Customize your FinanceTracker experience</p>
          </div>
        </div>
      </div>

      <!-- Enhanced Settings Navigation -->
      <div class="dashboard-card mb-8">
        <div class="flex overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in settingsTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all duration-300 border-b-3 focus-ring relative group',
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 bg-gradient-to-r from-emerald-50 to-emerald-100'
                : 'border-transparent text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50'
            ]"
          >
            <div class="flex items-center justify-center relative z-10">
              <div 
                :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300',
                  activeTab === tab.id 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon"></path>
                </svg>
              </div>
              {{ tab.label }}
            </div>
            <!-- Active indicator -->
            <div 
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-slide-up"
            ></div>
          </button>
        </div>
      </div>

      <!-- Profile Settings -->
      <div v-if="activeTab === 'profile'" class="space-y-8 animate-slide-up">
        <div class="dashboard-card">
          <div class="flex items-center mb-8">
            <div class="category-icon category-icon-income mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-slate-700">Profile Information</h3>
              <p class="text-slate-500">Update your personal details and contact information</p>
            </div>
          </div>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input
                  v-model="profileForm.firstName"
                  type="text"
                  class="form-input hover-lift focus:scale-102 transition-all duration-300"
                  placeholder="Enter your first name"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input
                  v-model="profileForm.lastName"
                  type="text"
                  class="form-input hover-lift focus:scale-102 transition-all duration-300"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="form-input hover-lift focus:scale-102 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="form-input hover-lift focus:scale-102 transition-all duration-300"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div class="flex justify-end pt-4">
              <button type="submit" class="btn btn-primary hover-lift">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Preferences Settings -->
      <div v-if="activeTab === 'preferences'" class="space-y-8 animate-slide-up">
        <div class="dashboard-card">
          <div class="flex items-center mb-8">
            <div class="category-icon category-icon-expense mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-slate-700">Application Preferences</h3>
              <p class="text-slate-500">Customize how the application looks and behaves</p>
            </div>
          </div>
          
          <div class="space-y-8">
            <!-- Currency -->
            <div class="form-group">
              <label class="form-label">Default Currency</label>
              <select v-model="preferencesForm.currency" class="form-input hover-lift focus:scale-102 transition-all duration-300">
                <option value="USD">💵 USD - US Dollar</option>
                <option value="EUR">💶 EUR - Euro</option>
                <option value="GBP">💷 GBP - British Pound</option>
                <option value="CAD">🍁 CAD - Canadian Dollar</option>
                <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                <option value="JPY">💴 JPY - Japanese Yen</option>
              </select>
            </div>

            <!-- Date Format -->
            <div class="form-group">
              <label class="form-label">Date Format</label>
              <select v-model="preferencesForm.dateFormat" class="form-input hover-lift focus:scale-102 transition-all duration-300">
                <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (European Format)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
              </select>
            </div>

            <!-- Theme Selection -->
            <div class="form-group">
              <label class="form-label">Theme Preference</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  @click="preferencesForm.theme = 'light'"
                  :class="[
                    'p-6 rounded-xl border-3 transition-all duration-300 text-left focus-ring hover-lift group',
                    preferencesForm.theme === 'light'
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-glow-primary'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  ]"
                >
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl mr-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-slate-700 text-lg">Light Theme</div>
                      <div class="text-sm text-slate-500">Clean and bright interface</div>
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  @click="preferencesForm.theme = 'dark'"
                  :class="[
                    'p-6 rounded-xl border-3 transition-all duration-300 text-left focus-ring hover-lift group',
                    preferencesForm.theme === 'dark'
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-glow-primary'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  ]"
                >
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-slate-700 border-2 border-gray-200 rounded-xl mr-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-slate-700 text-lg">Dark Theme</div>
                      <div class="text-sm text-slate-500">Easy on the eyes</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Language -->
            <div class="form-group">
              <label class="form-label">Language</label>
              <select v-model="preferencesForm.language" class="form-input hover-lift focus:scale-102 transition-all duration-300">
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="pt">🇵🇹 Português</option>
              </select>
            </div>

            <div class="flex justify-end pt-4">
              <button @click="savePreferences" class="btn btn-primary hover-lift">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Settings -->
      <div v-if="activeTab === 'notifications'" class="space-y-8 animate-slide-up">
        <div class="dashboard-card">
          <div class="flex items-center mb-8">
            <div class="category-icon category-icon-income mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-slate-700">Notification Preferences</h3>
              <p class="text-slate-500">Control when and how you receive notifications</p>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="notification-item group">
              <div class="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 text-lg">Email Notifications</h4>
                    <p class="text-sm text-slate-500">Receive email updates about your transactions and account activity</p>
                  </div>
                </div>
                <label class="toggle-switch" :class="{ active: notificationsForm.email }">
                  <input
                    v-model="notificationsForm.email"
                    type="checkbox"
                    class="sr-only"
                  />
                </label>
              </div>
            </div>

            <div class="notification-item group">
              <div class="flex items-center justify-between p-6 bg-gradient-to-r from-gold-50 to-gold-100 rounded-xl border border-gold-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 text-lg">Budget Alerts</h4>
                    <p class="text-sm text-slate-500">Get notified when you exceed budget limits or spending thresholds</p>
                  </div>
                </div>
                <label class="toggle-switch" :class="{ active: notificationsForm.budgetAlerts }">
                  <input
                    v-model="notificationsForm.budgetAlerts"
                    type="checkbox"
                    class="sr-only"
                  />
                </label>
              </div>
            </div>

            <div class="notification-item group">
              <div class="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 text-lg">Monthly Reports</h4>
                    <p class="text-sm text-slate-500">Receive comprehensive monthly financial summary reports</p>
                  </div>
                </div>
                <label class="toggle-switch" :class="{ active: notificationsForm.monthlyReports }">
                  <input
                    v-model="notificationsForm.monthlyReports"
                    type="checkbox"
                    class="sr-only"
                  />
                </label>
              </div>
            </div>

            <!-- Goal Reminders (only show if feature is enabled) -->
            <div v-if="FEATURES.GOAL_TRACKING" class="notification-item group">
              <div class="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-700 text-lg">Goal Reminders</h4>
                    <p class="text-sm text-slate-500">Gentle reminders about your savings goals and financial milestones</p>
                  </div>
                </div>
                <label class="toggle-switch" :class="{ active: notificationsForm.goalReminders }">
                  <input
                    v-model="notificationsForm.goalReminders"
                    type="checkbox"
                    class="sr-only"
                  />
                </label>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button @click="saveNotifications" class="btn btn-primary hover-lift">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="space-y-8 animate-slide-up">
        <div class="dashboard-card">
          <div class="flex items-center mb-8">
            <div class="category-icon category-icon-expense mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-slate-700">Password & Security</h3>
              <p class="text-slate-500">Manage your account security and authentication</p>
            </div>
          </div>
          
          <form @submit.prevent="changePassword" class="space-y-6">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input
                v-model="securityForm.currentPassword"
                type="password"
                class="form-input hover-lift focus:scale-102 transition-all duration-300"
                placeholder="Enter current password"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input
                v-model="securityForm.newPassword"
                type="password"
                class="form-input hover-lift focus:scale-102 transition-all duration-300"
                placeholder="Enter new password"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Confirm New Password</label>
              <input
                v-model="securityForm.confirmPassword"
                type="password"
                class="form-input hover-lift focus:scale-102 transition-all duration-300"
                placeholder="Confirm new password"
              />
            </div>
            
            <div class="flex justify-end pt-4">
              <button type="submit" class="btn btn-secondary hover-lift">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-6-4h2a2 2 0 012 2m0 0V9a2 2 0 012-2m-2 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Change Password
              </button>
            </div>
          </form>
        </div>

        <!-- Two-Factor Authentication (only show if feature is enabled) -->
        <div v-if="FEATURES.TWO_FACTOR_AUTH" class="dashboard-card">
          <div class="flex items-center mb-6">
            <div class="category-icon category-icon-income mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-700">Two-Factor Authentication</h3>
              <p class="text-slate-500">Add an extra layer of security to your account</p>
            </div>
          </div>

          <div class="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300 group">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-slate-700 text-lg">Enable 2FA</h4>
                <p class="text-sm text-slate-500">Use an authenticator app for additional security</p>
              </div>
            </div>
            <button
              @click="toggle2FA"
              :class="[
                'btn hover-lift',
                twoFactorEnabled ? 'btn-secondary' : 'btn-primary'
              ]"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="twoFactorEnabled ? 'M6 18L18 6M6 6l12 12' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'"></path>
              </svg>
              {{ twoFactorEnabled ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>

        <!-- Coming Soon: Planned Security Features -->
        <div v-if="!FEATURES.TWO_FACTOR_AUTH" class="dashboard-card bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-dashed border-amber-300">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-amber-800">Additional Security Features Coming Soon</h3>
                <p class="text-sm text-amber-700">Two-factor authentication and advanced security options will be available in a future update</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data & Privacy Settings -->
      <div v-if="activeTab === 'data'" class="space-y-8 animate-slide-up">
        <div class="dashboard-card">
          <div class="flex items-center mb-8">
            <div class="category-icon category-icon-income mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-slate-700">Data Management</h3>
              <p class="text-slate-500">Control your data and privacy settings</p>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="data-action-item group">
              <div class="p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-start justify-between">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-700 text-lg">Export Data</h4>
                      <p class="text-sm text-slate-500">Download all your financial data in JSON or CSV format for backup</p>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <button 
                      @click="handleExportData('JSON')" 
                      class="btn btn-primary btn-sm hover-lift"
                      :disabled="loading.data"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                      </svg>
                      JSON
                    </button>
                    <button 
                      @click="handleExportData('CSV')" 
                      class="btn btn-outline btn-sm hover-lift"
                      :disabled="loading.data"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="data-action-item group">
              <div class="p-6 bg-gradient-to-r from-gold-50 to-gold-100 rounded-xl border border-gold-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-start justify-between">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-700 text-lg">Clear All Data</h4>
                      <p class="text-sm text-slate-500">Permanently delete all your transactions and data (irreversible)</p>
                    </div>
                  </div>
                  <button 
                    @click="showDeleteConfirm = true"
                    class="btn btn-secondary btn-sm hover-lift"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    Clear Data
                  </button>
                </div>
              </div>
            </div>

            <div class="data-action-item group">
              <div class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h2m0 0V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2m0 0v3m0 0v3m0-3h3M9 7h3m-3 0V5a2 2 0 012-2h3m-3 0h3m-3 0V3"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-700 text-lg">Auto Backup</h4>
                      <p class="text-sm text-slate-500">Automatically backup your data to secure cloud storage</p>
                    </div>
                  </div>
                  <label class="toggle-switch" :class="{ active: dataForm.autoBackup }">
                    <input
                      v-model="dataForm.autoBackup"
                      type="checkbox"
                      class="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="modal-overlay animate-fade-in">
        <div class="modal-content animate-slide-up max-w-lg">
          <div class="p-8">
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg class="w-10 h-10 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-slate-700 mb-2">Delete All Data</h3>
              <p class="text-slate-500">This action cannot be undone</p>
            </div>
            
            <div class="p-4 bg-gold-50 rounded-xl border border-gold-200 mb-6">
              <p class="text-slate-700 leading-relaxed">
                Are you sure you want to delete all your financial data? This will permanently remove:
              </p>
              <ul class="mt-3 space-y-1 text-sm text-slate-600">
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-gold-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All transactions and records
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-gold-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Custom categories and settings
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-gold-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Reports and analytics data
                </li>
              </ul>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="showDeleteConfirm = false"
                class="btn btn-ghost flex-1 hover-lift"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
              <button
                @click="confirmDeleteData"
                class="btn btn-secondary flex-1 hover-lift"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToast } from '@/composables/useToast'
import userService from '@/services/userService'
import settingsService from '@/services/settingsService'
import { FEATURES } from '@/utils/constants.js'


// Initialize stores and composables
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { showToast } = useToast()

// Reactive state
const activeTab = ref('profile')
const showDeleteConfirm = ref(false)
const twoFactorEnabled = ref(false)
const loading = ref({
  profile: false,
  preferences: false,
  notifications: false,
  security: false,
  data: false
})

// Settings tabs configuration
const settingsTabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
  },
  {
    id: 'data',
    label: 'Data & Privacy',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
  }
]

// Form reactive objects - initialized with empty/default values
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const preferencesForm = ref({
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  theme: 'light',
  language: 'en',
  timezone: 'America/New_York'
})

const notificationsForm = ref({
  email: false,
  budgetAlerts: false,
  monthlyReports: false,
  goalReminders: false,
  transactionReminders: false,
  lowBalanceAlerts: false
})

const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const dataForm = ref({
  autoBackup: false
})

// Load user settings on component mount
onMounted(async () => {
  try {
    
    // Load user profile if not already loaded
    if (!userStore.isLoaded) {
      await userStore.fetchUserProfile()
    }
    
    // Load settings if not already loaded
    if (!settingsStore.isLoaded) {
      await settingsStore.fetchSettings()
    }
    
    // Update local forms with data from stores
    if (userStore.user) {
      profileForm.value = {
        firstName: userStore.user.firstName || '',
        lastName: userStore.user.lastName || '',
        email: userStore.user.email || '',
        phone: userStore.user.phone || ''
      }
    }
    
    // Update preferences form
    preferencesForm.value = {
      currency: settingsStore.preferences.currency || 'USD',
      dateFormat: settingsStore.preferences.dateFormat || 'MM/DD/YYYY',
      theme: settingsStore.preferences.theme || 'light',
      language: settingsStore.preferences.language || 'en',
      timezone: settingsStore.preferences.timezone || 'America/New_York'
    }
    
    // Update notifications form
    notificationsForm.value = {
      email: settingsStore.notifications.email || false,
      budgetAlerts: settingsStore.notifications.budgetAlerts || false,
      monthlyReports: settingsStore.notifications.monthlyReports || false,
      goalReminders: settingsStore.notifications.goalReminders || false,
      transactionReminders: settingsStore.notifications.transactionReminders || false,
      lowBalanceAlerts: settingsStore.notifications.lowBalanceAlerts || false
    }
    
    // Update security settings
    twoFactorEnabled.value = settingsStore.security.twoFactorEnabled || false
    
    // Update data settings
    dataForm.value.autoBackup = settingsStore.data.autoBackup || false
    
  } catch (error) {
    showToast('Error loading settings', 'error')
  }
})

// Save profile information
const saveProfile = async () => {
  try {
    loading.value.profile = true
    await userStore.updateUserProfile(profileForm.value)
    showToast('Profile updated successfully', 'success')
  } catch (error) {
    showToast('Failed to update profile', 'error')
  } finally {
    loading.value.profile = false
  }
}

// Save application preferences
// In Settings.vue
const savePreferences = async () => {
  try {
    loading.value.preferences = true
    
    const result = await settingsStore.updatePreferences(preferencesForm.value)
    
    if (result && result.success) {
      showToast(result.message || 'Preferences updated successfully!', 'success')
    } else {
      showToast('Update completed but no confirmation received', 'warning')
    }
  } catch (error) {
    showToast('Failed to update preferences', 'error')
  } finally {
    loading.value.preferences = false
  }
}

// Save notification settings
const saveNotifications = async () => {
  try {
    loading.value.notifications = true
    await settingsStore.updateNotifications(notificationsForm.value)
    showToast('Notification settings updated successfully', 'success')
  } catch (error) {
    showToast('Failed to update notification settings', 'error')
  } finally {
    loading.value.notifications = false
  }
}

// Change user password
const changePassword = async () => {
  // Validate password inputs
  if (securityForm.value.newPassword !== securityForm.value.confirmPassword) {
    showToast('Passwords do not match!', 'error')
    return
  }
  
  if (securityForm.value.newPassword.length < 8) {
    showToast('Password must be at least 8 characters long!', 'error')
    return
  }
  
  try {
    loading.value.security = true
    await userService.changePassword({
      currentPassword: securityForm.value.currentPassword,
      newPassword: securityForm.value.newPassword
    })
    
    // Clear form after success
    securityForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    showToast('Password changed successfully', 'success')
  } catch (error) {
    showToast('Failed to change password', 'error')
  } finally {
    loading.value.security = false
  }
}

// Toggle two-factor authentication
const toggle2FA = async () => {
  try {
    loading.value.security = true
    const newState = !twoFactorEnabled.value
    
    if (newState) {
      // Enable 2FA
      await userService.enable2FA()
    } else {
      // Disable 2FA
      await userService.disable2FA()
    }
    
    twoFactorEnabled.value = newState
    
    // Update the store
    settingsStore.security.twoFactorEnabled = newState
    
    showToast(`Two-factor authentication ${newState ? 'enabled' : 'disabled'}`, 'success')
  } catch (error) {
    showToast(`Failed to ${twoFactorEnabled.value ? 'disable' : 'enable'} two-factor authentication`, 'error')
  } finally {
    loading.value.security = false
  }
}

// Export user data
const exportData = async (format) => {
  try {
    loading.value.data = true
    const response = await settingsService.exportData(format)
    
    // Create and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data || JSON.stringify(response)]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `finance-data.${format.toLowerCase()}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    showToast(`Data exported successfully as ${format}`, 'success')
  } catch (error) {
    showToast(`Failed to export data as ${format}`, 'error')
  } finally {
    loading.value.data = false
  }
}

// Handle data export button clicks
const handleExportData = (format) => {
  exportData(format)
}

// Confirm and delete all user data
const confirmDeleteData = async () => {
  try {
    loading.value.data = true
    await settingsService.deleteAllData()
    showDeleteConfirm.value = false
    
    // Reset stores
    await userStore.fetchUserProfile()
    await settingsStore.fetchSettings()
    
    showToast('All data has been deleted successfully', 'success')
  } catch (error) {
    showToast('Failed to delete data', 'error')
  } finally {
    loading.value.data = false
  }
}
</script>


<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.btn-sm {
  @apply px-3 py-1.5 text-xs;
}

.scale-102 {
  transform: scale(1.02);
}
</style>