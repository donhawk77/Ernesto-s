/* ==========================================================================
   ERNESTO'S RESTAURANT — Main JavaScript
   Handles: Navigation, scroll reveals, review carousel, heritage marquee
   No libraries — vanilla JS with IntersectionObserver
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- NAVIGATION: Sticky glassmorphism on scroll ----
  const nav = document.querySelector('.nav');
  const heroSection = document.querySelector('.hero');

  const handleScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- MOBILE NAVIGATION ----
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- SCROLL REVEAL ANIMATIONS ----
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for sibling elements
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all elements immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ---- REVIEWS CAROUSEL ----
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.review-dot');
  let currentSlide = 0;
  let autoRotateInterval;

  const showSlide = (index) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const startAutoRotate = () => {
    autoRotateInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  };

  const stopAutoRotate = () => {
    clearInterval(autoRotateInterval);
  };

  if (dots.length > 0) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoRotate();
        showSlide(i);
        startAutoRotate();
      });
    });

    startAutoRotate();
  }

  // ---- HERITAGE MARQUEE DUPLICATION ----
  // Duplicate the marquee content for seamless loop
  const marqueeTrack = document.querySelector('.heritage-marquee');
  if (marqueeTrack) {
    const content = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = content + content;
  }

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- EMAIL FORM (placeholder behavior) ----
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = signupForm.querySelector('input');
      const btn = signupForm.querySelector('button');
      const originalText = btn.textContent;

      if (input.value.trim() && input.value.includes('@')) {
        btn.textContent = '✓ Joined!';
        btn.style.background = '#2d6a4f';
        btn.style.color = '#faf8f4';
        input.value = '';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }
    });
  }

  // ---- PARALLAX EFFECT ON HERO (desktop only) ----
  if (window.innerWidth > 768) {
    const heroBg = document.querySelector('.hero-bg img');
    const heroSection = document.querySelector('.hero, .page-hero');
    if (heroBg) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;
        if (scrolled < heroHeight) {
          heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
        }
      }, { passive: true });
    }
  }

  // ---- BACK TO TOP BUTTON ----
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
