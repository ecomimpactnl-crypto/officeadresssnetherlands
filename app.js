/* app.js — BeCenter.nl */
(function () {
  'use strict';

  /* ─── Sticky Nav ─── */
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    const heroBottom = hero ? hero.offsetHeight - 100 : 300;

    if (scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ─── Mobile Hamburger ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Menu openen');
        document.body.style.overflow = '';
      });
    });
  }


  /* ─── Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ─── Scroll Reveal (Intersection Observer) ─── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ─── Contact Form via Web3Forms ─── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('.form__submit');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = 'Versturen...';
      btn.disabled = true;

      const data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            btn.innerHTML = '&#10003; Verstuurd!';
            btn.style.background = '#2d7a3a';
            btn.style.borderColor = '#2d7a3a';
            form.reset();
            setTimeout(function () {
              btn.innerHTML = originalHTML;
              btn.style.background = '';
              btn.style.borderColor = '';
              btn.disabled = false;
            }, 4000);
          } else {
            throw new Error('Mislukt');
          }
        })
        .catch(function () {
          btn.innerHTML = 'Er ging iets mis — probeer opnieuw';
          btn.style.background = '#8b2020';
          btn.style.borderColor = '#8b2020';
          btn.disabled = false;
          setTimeout(function () {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.borderColor = '';
          }, 4000);
        });
    });
  }


  /* ─── Active Nav Link Highlight on Scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(function (item) {
          item.style.color = '';
          if (item.getAttribute('href') === '#' + id) {
            item.style.color = 'var(--color-text)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
