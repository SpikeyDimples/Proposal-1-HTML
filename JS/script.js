/* =========================================================
   LOCAL CHILLAS — script.js
   One shared file, linked from every page. Each block checks
   for its own elements first, so it's safe to include on
   pages that don't have that feature.
   ========================================================= */

/* ---------- 1. Nav dropdown ("Our Menu") ---------- */
(function () {
  const dropdownItems = document.querySelectorAll('.has-dropdown');
  if (dropdownItems.length === 0) return;

  dropdownItems.forEach((item) => {
    const toggleBtn = item.querySelector('.dropdown-toggle');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');

      dropdownItems.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Click anywhere outside a dropdown closes it
  document.addEventListener('click', () => {
    dropdownItems.forEach((item) => {
      item.classList.remove('open');
      item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  });

  // Escape key closes it too
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach((item) => {
        item.classList.remove('open');
        item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });
})();

/* ---------- 2. Homepage hero slider ---------- */
(function () {
  const track = document.getElementById('heroSliderTrack');
  if (!track) return; // only present on index.html

  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const dotsWrap = document.getElementById('heroSliderDots');
  const slider = document.getElementById('heroSlider');

  let current = 0;
  const AUTOPLAY_MS = 4500;
  let autoplayTimer;

  // One dot per slide
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    current = (index + slides.length) % slides.length; // wraps both directions
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Pause on hover so people can actually look at a photo
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  goTo(0);
  startAutoplay();
})();

/* ---------- 3. Contact form validation ---------- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return; // only present on contact.html

  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => (value.trim().length === 0 ? 'Please enter your name.' : ''),
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => {
        if (value.trim().length === 0) return 'Please enter your email.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) return 'Please enter a valid email address.';
        return '';
      },
    },
    contact: {
      input: document.getElementById('contact'),
      error: document.getElementById('contact-error'),
      validate: (value) => {
        if (value.trim().length === 0) return 'Please enter a contact number.';
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 7) return 'Please enter a valid contact number.';
        return '';
      },
    },
  };

  function validateField(field) {
    const errorText = field.validate(field.input.value);
    field.input.classList.toggle('invalid', Boolean(errorText));
    field.error.textContent = errorText;
    return errorText === '';
  }

  // Validate a field as soon as the user leaves it
  Object.values(fields).forEach((field) => {
    field.input.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.hidden = true;

    const results = Object.values(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (allValid) {
      // Hook your real submission here, e.g.:
      // fetch('your-endpoint-or-form-service', { method: 'POST', body: new FormData(form) })
      successMsg.hidden = false;
      form.reset();
    } else {
      const firstInvalid = Object.values(fields).find((f) => f.input.classList.contains('invalid'));
      if (firstInvalid) firstInvalid.input.focus();
    }
  });
})();