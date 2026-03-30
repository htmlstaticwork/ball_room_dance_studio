/* 1. Theme Toggle */
const toggleTheme = () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  const themeBtns = document.querySelectorAll('.theme-toggle');
  themeBtns.forEach(btn => btn.addEventListener('click', toggleTheme));
};

/* 2. RTL Toggle */
const toggleRTL = () => {
  const html = document.documentElement;
  const currentDir = html.getAttribute('dir');
  const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
  html.setAttribute('dir', newDir);
  localStorage.setItem('dir', newDir);
};

const initRTL = () => {
  const savedDir = localStorage.getItem('dir');
  if (savedDir) {
    document.documentElement.setAttribute('dir', savedDir);
  }
  
  const rtlBtns = document.querySelectorAll('.rtl-toggle');
  rtlBtns.forEach(btn => btn.addEventListener('click', toggleRTL));
};

/* 3. Navbar */
const initNavbar = () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Check on load
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
  }

  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const overlay = document.querySelector('.drawer-overlay');

  const openDrawer = () => {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
};

/* 4. Scroll Animations */
const initAnimations = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const animatedElements = document.querySelectorAll('.fade-in-up');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
};

/* 5. Particles */
const initParticles = () => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return; // Only on Home 1
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  };
  
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 80 + 20;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.07 + 0.08;
      this.isGold = Math.random() > 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      
      if (this.isGold) {
        gradient.addColorStop(0, `rgba(200, 151, 58, ${this.opacity})`);
      } else {
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      }
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const init = () => {
    particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle());
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  };

  init();
  animate();
};

/* 6. Form Validation */
const initFormValidation = () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    
    // Clear previous errors
    const errors = contactForm.querySelectorAll('.error-msg');
    errors.forEach(err => err.style.display = 'none');

    const name = document.getElementById('name');
    if (!name.value.trim()) {
      valid = false;
      document.getElementById('name-error').style.display = 'block';
    }

    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      valid = false;
      document.getElementById('email-error').style.display = 'block';
    }

    const message = document.getElementById('message');
    if (!message.value.trim()) {
      valid = false;
      document.getElementById('message-error').style.display = 'block';
    }

    if (valid) {
      // Show success msg or submit
      alert('Message sent successfully!');
      contactForm.reset();
    }
  });

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const eyeBtn = document.querySelector('.btn-eye');
    const passwordInput = document.getElementById('password');
    if (eyeBtn && passwordInput) {
      eyeBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          eyeBtn.textContent = '🙈';
        } else {
          passwordInput.type = 'password';
          eyeBtn.textContent = '👁️';
        }
      });
    }
  }
};

/* 7. Init */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initAnimations();
  initParticles();
  initFormValidation();
});
