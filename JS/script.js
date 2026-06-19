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
  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      successMsg.hidden = false;
      form.reset();
    } else {
      alert('Something went wrong. Please try again.');
    }
  })
  .catch(() => {
    alert('Could not send message. Please check your internet connection.');
  });
} else {
  const firstInvalid = Object.values(fields).find((f) => f.input.classList.contains('invalid'));
  if (firstInvalid) firstInvalid.input.focus();
}
  });
})();
/* ---------- 4. "Interested" button ---------- */
(function () {
  const btn = document.getElementById('interestedBtn');
  if (!btn) return;

  const successMsg = document.getElementById('interestedSuccess');

  btn.addEventListener('click', function () {
    successMsg.hidden = false;
    btn.textContent = 'NOTED!';
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'default';
  });
})();
/* ---------- 5. Enquiry form ---------- */
(function () {
  const form = document.getElementById('enquiryForm');
  if (!form) return; // only on enquiry.html

  const responseBox   = document.getElementById('enquiryResponse');
  const responseTitle = document.getElementById('responseTitle');
  const responseBody  = document.getElementById('responseBody');

  // What we say back based on enquiry type
  const responses = {
    services: {
      title: 'Services & Pricing Enquiry',
      body: 'Thank you for your interest! We offer food, drinks, hookah, and entertainment packages. Our pricing starts from R25 for light meals up to R1800+ for VIP packages. Please check our full menu page for detailed pricing, or we will follow up with you directly.',
    },
    vip: {
      title: 'VIP & Packages Enquiry',
      body: 'Great choice! Our VIP packages start from R800 (Bronze) and go up to R1800+ (Gold), including reserved seating, bottles, and mixers. We will contact you to confirm availability and discuss your preferred date.',
    },
    volunteer: {
      title: 'Volunteering Enquiry',
      body: 'We love community involvement! Volunteering opportunities are available for events and operations. We will reach out to you with more details about current openings and requirements.',
    },
    sponsor: {
      title: 'Sponsorship Enquiry',
      body: 'Thank you for considering sponsoring Local Chillas! We offer brand visibility at events and on our platforms. A member of our team will contact you to discuss sponsorship packages and benefits.',
    },
  };

  const fields = {
    name: {
      input: document.getElementById('enq-name'),
      error: document.getElementById('enq-name-error'),
      validate: (v) => v.trim() === '' ? 'Please enter your full name.' : '',
    },
    email: {
      input: document.getElementById('enq-email'),
      error: document.getElementById('enq-email-error'),
      validate: (v) => {
        if (v.trim() === '') return 'Please enter your email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
        return '';
      },
    },
    contact: {
      input: document.getElementById('enq-contact'),
      error: document.getElementById('enq-contact-error'),
      validate: (v) => {
        if (v.trim() === '') return 'Please enter your contact number.';
        if (v.replace(/\D/g, '').length < 7) return 'Please enter a valid contact number.';
        return '';
      },
    },
    type: {
      input: document.getElementById('enq-type'),
      error: document.getElementById('enq-type-error'),
      validate: (v) => v === '' ? 'Please select an enquiry type.' : '',
    },
    message: {
      input: document.getElementById('enq-message'),
      error: document.getElementById('enq-message-error'),
      validate: (v) => v.trim() === '' ? 'Please enter a message.' : '',
    },
  };

  function validateField(field) {
    const errorText = field.validate(field.input.value);
    field.input.classList.toggle('invalid', Boolean(errorText));
    field.error.textContent = errorText;
    return errorText === '';
  }

  Object.values(fields).forEach((field) => {
    field.input.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    responseBox.hidden = true;

    const allValid = Object.values(fields).map(validateField).every(Boolean);

    if (allValid) {
      const type = fields.type.input.value;
      const res  = responses[type];

      responseTitle.textContent = res.title;
      responseBody.textContent  = res.body;
      responseBox.hidden = false;
      responseBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

      form.reset();
    } else {
      const first = Object.values(fields).find((f) => f.input.classList.contains('invalid'));
      if (first) first.input.focus();
    }
  });
})();

/* ---------- 6. Menu search/filter ---------- */
(function () {
  const searchInput = document.getElementById('menuSearch');
  if (!searchInput) return; // only on services.html

  const sections = document.querySelectorAll('.menu-section');
  const noResults = document.getElementById('menuNoResults');

  searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    let visibleCount = 0;

    sections.forEach((section) => {
      const text = section.textContent.toLowerCase();
      if (query === '' || text.includes(query)) {
        section.classList.remove('hidden');
        visibleCount++;
      } else {
        section.classList.add('hidden');
      }
    });

    noResults.hidden = visibleCount > 0;
  });
})();
const galleryImages = document.querySelectorAll('.gallery-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

if(lightbox && lightboxImg){

    galleryImages.forEach(img => {

        img.addEventListener('click', () => {

            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;

        });

    });

    lightbox.addEventListener('click', () => {

        lightbox.style.display = 'none';

    });

}
const accordions =
document.querySelectorAll('.accordion');

accordions.forEach(item => {

    item.addEventListener('click', () => {

        item.classList.toggle('active');

        const panel =
        item.nextElementSibling;

        if(panel.style.display === 'block'){

            panel.style.display = 'none';

        }else{

            panel.style.display = 'block';

        }

    });

});