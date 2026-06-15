/* ============================================================
   Sri Balaji Dental & Implant Centre — script.js
   ============================================================ */

// ─── NAVBAR SCROLL ────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }

  // Active nav link on scroll
  updateActiveNav();
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── HAMBURGER MENU ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ─── ACTIVE NAV ON SCROLL ─────────────────────────────────
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link[href^="#"]');
  let current = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

// ─── SMOOTH SCROLL ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 75;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── SCROLL ANIMATIONS ────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ─── IMAGE SLIDER ─────────────────────────────────────────
(function initSlider() {
  const slides     = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn    = document.getElementById('sliderPrev');
  const nextBtn    = document.getElementById('sliderNext');
  let current      = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4000);
  }

  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  startAuto();
})();

// ─── GALLERY LIGHTBOX ─────────────────────────────────────
(function initLightbox() {
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const closeBtn     = document.getElementById('lightboxClose');
  const prevBtn      = document.getElementById('lightboxPrev');
  const nextBtn      = document.getElementById('lightboxNext');
  const items        = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentIndex   = 0;

  function openAt(index) {
    currentIndex = index;
    lightboxImg.src = items[index].src;
    lightboxImg.alt = items[index].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    lightboxImg.src = items[currentIndex].src;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    lightboxImg.src = items[currentIndex].src;
  }

  items.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openAt(i));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
})();

// ─── APPOINTMENT FORM → WHATSAPP ──────────────────────────
function bookAppointment() {
  const name      = document.getElementById('patientName').value.trim();
  const phone     = document.getElementById('patientPhone').value.trim();
  const email     = document.getElementById('patientEmail').value.trim();
  const date      = document.getElementById('preferredDate').value;
  const time      = document.getElementById('preferredTime').value;
  const treatment = document.getElementById('treatmentType').value;
  const message   = document.getElementById('message').value.trim();

  // Basic validation
  if (!name) { alert('Please enter your name.'); return; }
  if (!phone) { alert('Please enter your phone number.'); return; }
  if (!date)  { alert('Please select a preferred date.'); return; }
  if (!time)  { alert('Please select a preferred time.'); return; }
  if (!treatment) { alert('Please select a treatment.'); return; }

  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Build WhatsApp message
  const waMessage = `🦷 *New Appointment Request*
━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${name}
📞 *Phone:* ${phone}${email ? `\n📧 *Email:* ${email}` : ''}
📅 *Date:* ${formattedDate}
⏰ *Time:* ${time}
🏥 *Treatment:* ${treatment}${message ? `\n💬 *Message:* ${message}` : ''}
━━━━━━━━━━━━━━━━━━━━
_Sri Balaji Dental & Implant Centre_`;

  const encodedMsg = encodeURIComponent(waMessage);
  const waURL = `https://wa.me/919912339995?text=${encodedMsg}`;

  window.open(waURL, '_blank');
}

// ─── ANIMATE STATS COUNTER ────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = el.textContent;
    const numericPart = parseFloat(target);
    const suffix = target.replace(/[\d.]/g, '');

    if (isNaN(numericPart)) return;

    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = numericPart / (duration / step);
    const isDecimal = target.includes('.');

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericPart) {
        start = numericPart;
        clearInterval(timer);
      }
      el.textContent = (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
    }, step);
  });
}

// Trigger counter on stats bar visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ─── SET MIN DATE FOR APPOINTMENT ────────────────────────
const dateInput = document.getElementById('preferredDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}
