// src/utils/effects.js - Modern Interactive Effects

/**
 * Modern Interactive Effects for FinanceTracker
 * Includes: Particles, Glitter, Ripple, Parallax, and more
 */

class ModernEffects {
  constructor() {
    this.init()
  }

  init() {
    this.setupParticles()
    this.setupRippleEffect()
    this.setupParallaxEffect()
    this.setupGlitterEffect()
    this.setupMorphingCards()
    this.setupSmoothScrolling()
    this.setupIntersectionObserver()
    this.setupCursorEffects()
  }

  // Floating Particles Background
  setupParticles() {
    const canvas = document.createElement('canvas')
    canvas.id = 'particles-canvas'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '-1'
    canvas.style.opacity = '0.6'
    
    document.body.appendChild(canvas)
    
    const ctx = canvas.getContext('2d')
    const particles = []
    const particleCount = 50
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = `hsla(${Math.random() * 60 + 140}, 70%, 60%, 0.3)`
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }
      
      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
  }

  // Ripple Effect on Click
  setupRippleEffect() {
    document.addEventListener('click', (e) => {
      const ripple = document.createElement('div')
      ripple.style.position = 'fixed'
      ripple.style.borderRadius = '50%'
      ripple.style.background = 'rgba(16, 185, 129, 0.3)'
      ripple.style.transform = 'scale(0)'
      ripple.style.animation = 'ripple 0.6s linear'
      ripple.style.left = (e.clientX - 25) + 'px'
      ripple.style.top = (e.clientY - 25) + 'px'
      ripple.style.width = '50px'
      ripple.style.height = '50px'
      ripple.style.pointerEvents = 'none'
      ripple.style.zIndex = '9999'
      
      document.body.appendChild(ripple)
      
      setTimeout(() => {
        document.body.removeChild(ripple)
      }, 600)
    })
    
    // Add ripple animation to CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  // Parallax Effect for Cards
  setupParallaxEffect() {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.card, .dashboard-card, .stat-card')
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      })
    }
    
    const handleMouseLeave = () => {
      const cards = document.querySelectorAll('.card, .dashboard-card, .stat-card')
      cards.forEach(card => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      })
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
  }

  // Glitter Effect for Success Actions
  setupGlitterEffect() {
    this.createGlitter = (element) => {
      const glitterCount = 12
      const rect = element.getBoundingClientRect()
      
      for (let i = 0; i < glitterCount; i++) {
        const glitter = document.createElement('div')
        glitter.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)]
        glitter.style.position = 'fixed'
        glitter.style.left = (rect.left + rect.width / 2) + 'px'
        glitter.style.top = (rect.top + rect.height / 2) + 'px'
        glitter.style.fontSize = '20px'
        glitter.style.pointerEvents = 'none'
        glitter.style.zIndex = '10000'
        glitter.style.animation = `glitterExplode 1s ease-out forwards`
        glitter.style.animationDelay = (i * 0.1) + 's'
        
        // Random direction
        const angle = (Math.PI * 2 * i) / glitterCount
        const distance = 100 + Math.random() * 50
        const endX = rect.left + rect.width / 2 + Math.cos(angle) * distance
        const endY = rect.top + rect.height / 2 + Math.sin(angle) * distance
        
        glitter.style.setProperty('--end-x', endX + 'px')
        glitter.style.setProperty('--end-y', endY + 'px')
        
        document.body.appendChild(glitter)
        
        setTimeout(() => {
          if (document.body.contains(glitter)) {
            document.body.removeChild(glitter)
          }
        }, 1000)
      }
    }
    
    // Add glitter animation CSS
    const glitterStyle = document.createElement('style')
    glitterStyle.textContent = `
      @keyframes glitterExplode {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: scale(1.2) rotate(180deg);
          opacity: 1;
        }
        100% {
          transform: scale(0.8) rotate(360deg) translateX(var(--end-x)) translateY(var(--end-y));
          opacity: 0;
        }
      }
    `
    document.head.appendChild(glitterStyle)
  }

  // Morphing Cards Animation
  setupMorphingCards() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'morphIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }
      })
    }, { threshold: 0.1 })
    
    // Observe all cards
    const observeCards = () => {
      const cards = document.querySelectorAll('.card, .dashboard-card, .stat-card')
      cards.forEach(card => observer.observe(card))
    }
    
    // Initial observation
    observeCards()
    
    // Re-observe when new cards are added
    const mutationObserver = new MutationObserver(observeCards)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    
    // Add morph animation CSS
    const morphStyle = document.createElement('style')
    morphStyle.textContent = `
      @keyframes morphIn {
        0% {
          transform: scale(0.8) rotateY(-30deg);
          opacity: 0;
          filter: blur(10px);
        }
        100% {
          transform: scale(1) rotateY(0deg);
          opacity: 1;
          filter: blur(0px);
        }
      }
    `
    document.head.appendChild(morphStyle)
  }

  // Smooth Scrolling with Easing
  setupSmoothScrolling() {
    // Enhanced smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault()
        const targetId = e.target.getAttribute('href').substring(1)
        const targetElement = document.getElementById(targetId)
        
        if (targetElement) {
          this.smoothScrollTo(targetElement.offsetTop, 800)
        }
      }
    })
  }

  // Custom smooth scroll with easing
  smoothScrollTo(target, duration) {
    const start = window.pageYOffset
    const distance = target - start
    let startTime = null
    
    const ease = (t, b, c, d) => {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    }
    
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const run = ease(timeElapsed, start, distance, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }
    
    requestAnimationFrame(animation)
  }

  // Intersection Observer for Animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target
          
          // Add entrance animation based on data attribute
          const animation = element.dataset.animation || 'fadeInUp'
          element.style.animation = `${animation} 0.6s ease-out forwards`
          element.style.opacity = '1'
          
          // Unobserve after animation
          observer.unobserve(element)
        }
      })
    }, observerOptions)
    
    // Observe elements with data-animation attribute
    const animatedElements = document.querySelectorAll('[data-animation]')
    animatedElements.forEach(el => {
      el.style.opacity = '0'
      observer.observe(el)
    })
  }

  // Enhanced Cursor Effects
  setupCursorEffects() {
    const cursor = document.createElement('div')
    cursor.id = 'custom-cursor'
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.3));
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.1s ease;
      mix-blend-mode: difference;
    `
    document.body.appendChild(cursor)
    
    const cursorFollower = document.createElement('div')
    cursorFollower.id = 'cursor-follower'
    cursorFollower.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(16, 185, 129, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.3s ease;
    `
    document.body.appendChild(cursorFollower)
    
    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      
      cursor.style.left = (mouseX - 10) + 'px'
      cursor.style.top = (mouseY - 10) + 'px'
    })
    
    // Smooth follower animation
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1
      
      cursorFollower.style.left = (followerX - 20) + 'px'
      cursorFollower.style.top = (followerY - 20) + 'px'
      
      requestAnimationFrame(animateFollower)
    }
    animateFollower()
    
    // Cursor interactions
    document.addEventListener('mouseenter', (e) => {
      if (e.target.matches('button, a, [role="button"]')) {
        cursor.style.transform = 'scale(1.5)'
        cursorFollower.style.transform = 'scale(1.5)'
      }
    })
    
    document.addEventListener('mouseleave', (e) => {
      if (e.target.matches('button, a, [role="button"]')) {
        cursor.style.transform = 'scale(1)'
        cursorFollower.style.transform = 'scale(1)'
      }
    })
  }

  // Floating Labels Effect
  setupFloatingLabels() {
    const inputs = document.querySelectorAll('.form-input')
    
    inputs.forEach(input => {
      const label = input.nextElementSibling
      if (label && label.classList.contains('form-label')) {
        
        const handleFocus = () => {
          label.style.transform = 'translateY(-1.5rem) scale(0.9)'
          label.style.color = '#10B981'
        }
        
        const handleBlur = () => {
          if (!input.value) {
            label.style.transform = 'translateY(0) scale(1)'
            label.style.color = '#64748B'
          }
        }
        
        input.addEventListener('focus', handleFocus)
        input.addEventListener('blur', handleBlur)
        
        // Check initial value
        if (input.value) {
          handleFocus()
        }
      }
    })
  }

  // Progress Animation
  animateProgress(element, targetWidth, duration = 1000) {
    const start = performance.now()
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentWidth = easeOut * targetWidth
      
      element.style.width = currentWidth + '%'
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }

  // Number Counter Animation
  animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0
    const range = target - start
    const startTime = performance.now()
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = start + (range * easeOut)
      
      element.textContent = Math.floor(current).toLocaleString()
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        element.textContent = target.toLocaleString()
      }
    }
    
    requestAnimationFrame(animate)
  }

  // Shake Animation for Errors
  shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out'
    
    // Remove animation after completion
    setTimeout(() => {
      element.style.animation = ''
    }, 500)
    
    // Add shake animation CSS if not exists
    if (!document.getElementById('shake-animation')) {
      const shakeStyle = document.createElement('style')
      shakeStyle.id = 'shake-animation'
      shakeStyle.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
      `
      document.head.appendChild(shakeStyle)
    }
  }

  // Success Celebration
  celebrate(element) {
    // Add celebration class
    element.classList.add('celebrating')
    
    // Create confetti
    this.createGlitter(element)
    
    // Add celebration animation
    element.style.animation = 'celebrate 0.6s ease-out'
    
    setTimeout(() => {
      element.classList.remove('celebrating')
      element.style.animation = ''
    }, 600)
    
    // Add celebration CSS if not exists
    if (!document.getElementById('celebrate-animation')) {
      const celebrateStyle = document.createElement('style')
      celebrateStyle.id = 'celebrate-animation'
      celebrateStyle.textContent = `
        @keyframes celebrate {
          0% { transform: scale(1); }
          50% { transform: scale(1.1) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `
      document.head.appendChild(celebrateStyle)
    }
  }

  // Cleanup method
  destroy() {
    // Remove custom elements
    const customCursor = document.getElementById('custom-cursor')
    const cursorFollower = document.getElementById('cursor-follower')
    const particlesCanvas = document.getElementById('particles-canvas')
    
    if (customCursor) document.body.removeChild(customCursor)
    if (cursorFollower) document.body.removeChild(cursorFollower)
    if (particlesCanvas) document.body.removeChild(particlesCanvas)
    
    // Remove event listeners would go here if needed
  }
}

// Initialize effects when DOM is loaded
if (typeof window !== 'undefined') {
  let effects
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      effects = new ModernEffects()
    })
  } else {
    effects = new ModernEffects()
  }
  
  // Make effects available globally
  window.ModernEffects = effects
}

export default ModernEffects