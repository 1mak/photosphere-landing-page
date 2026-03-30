// Nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 8) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Merkle tree ELI5 popover
const merkleTrigger = document.querySelector('.merkle-trigger');
const merklePopover = document.getElementById('merkle-popover');
const merkleClose   = document.querySelector('.merkle-close');

if (merkleTrigger && merklePopover) {
  merkleTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = merklePopover.classList.toggle('open');
    merkleTrigger.setAttribute('aria-expanded', isOpen);
    merklePopover.setAttribute('aria-hidden', !isOpen);
  });

  merkleClose.addEventListener('click', (e) => {
    e.stopPropagation();
    merklePopover.classList.remove('open');
    merkleTrigger.setAttribute('aria-expanded', 'false');
    merklePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('click', () => {
    merklePopover.classList.remove('open');
    merkleTrigger.setAttribute('aria-expanded', 'false');
    merklePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      merklePopover.classList.remove('open');
      merkleTrigger.setAttribute('aria-expanded', 'false');
      merklePopover.setAttribute('aria-hidden', 'true');
    }
  });
}

// Device popover
const deviceTrigger = document.querySelector('.device-trigger');
const devicePopover = document.getElementById('device-popover');
const deviceClose   = document.querySelector('.device-close');

if (deviceTrigger && devicePopover) {
  deviceTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = devicePopover.classList.toggle('open');
    deviceTrigger.setAttribute('aria-expanded', isOpen);
    devicePopover.setAttribute('aria-hidden', !isOpen);
  });

  deviceClose.addEventListener('click', (e) => {
    e.stopPropagation();
    devicePopover.classList.remove('open');
    deviceTrigger.setAttribute('aria-expanded', 'false');
    devicePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('click', () => {
    devicePopover.classList.remove('open');
    deviceTrigger.setAttribute('aria-expanded', 'false');
    devicePopover.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      devicePopover.classList.remove('open');
      deviceTrigger.setAttribute('aria-expanded', 'false');
      devicePopover.setAttribute('aria-hidden', 'true');
    }
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('text-[#4285F4]', 'font-semibold');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('text-[#4285F4]', 'font-semibold');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => observer.observe(section));
