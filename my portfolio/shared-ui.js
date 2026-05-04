// --- SHARED UI MODULE (clock, audio, nav, hamburger) ---
(function() {
  // --- CLOCK ---
  const clockEl = document.getElementById('system-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    clockEl.textContent = `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  // --- COPYRIGHT ---
  const copy = document.getElementById('copyright-footer');
  if (copy) copy.textContent = `© ${new Date().getFullYear()} Adesugba Adebayo`;

  // --- LAZY AUDIO: only create Audio objects when first needed ---
  let isMuted = false;
  const volSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  let currentVol = volSlider ? parseFloat(volSlider.value) : 0.2;

  // Sound cache
  const soundCache = {};
  const soundPaths = {
    forward:  '../sounds/scroll-forward.mp3',
    backward: '../sounds/scroll-backward.mp3',
    select:   '../sounds/select-button.mp3',
    menu:     '../sounds/menu-sound.mp3',
    nav:      '../sounds/home-button.mp3',
    back:     '../sounds/scroll-backward.mp3',
    submit:   '../sounds/select-button.mp3',
  };
  // Homepage sounds use different relative path
  const isHomepage = !window.location.pathname.includes('/about/') &&
                     !window.location.pathname.includes('/resume/') &&
                     !window.location.pathname.includes('/contact/');
  if (isHomepage) {
    Object.keys(soundPaths).forEach(k => {
      soundPaths[k] = soundPaths[k].replace('../sounds/', 'sounds/');
    });
  }

  window.playSound = function(type) {
    if (isMuted) return;
    const path = soundPaths[type];
    if (!path) return;
    try {
      if (!soundCache[type]) {
        soundCache[type] = new Audio(path);
      }
      const snd = soundCache[type];
      snd.volume = currentVol;
      snd.currentTime = 0;
      snd.play().catch(() => {});
    } catch (e) {}
  };

  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      currentVol = parseFloat(e.target.value);
      Object.values(soundCache).forEach(s => s.volume = currentVol);
      if (currentVol === 0) { isMuted = true; if (muteBtn) muteBtn.textContent = '🔇'; }
      else if (isMuted) { isMuted = false; if (muteBtn) muteBtn.textContent = '🔊'; }
    }, { passive: true });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        muteBtn.textContent = '🔇';
        Object.values(soundCache).forEach(s => s.muted = true);
      } else {
        muteBtn.textContent = '🔊';
        Object.values(soundCache).forEach(s => s.muted = false);
        if (currentVol === 0 && volSlider) {
          volSlider.value = currentVol = 0.2;
          Object.values(soundCache).forEach(s => s.volume = 0.2);
        }
      }
    });
  }

  // --- HAMBURGER / MOBILE NAV ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      window.playSound('menu');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
  }

  // Nav links with sound + delayed navigation
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        window.playSound('nav');
        setTimeout(() => { window.location.href = href; }, 200);
      }
    });
  });

  // --- SCROLL ANIMATION (shared IntersectionObserver) ---
  const scrollEls = document.querySelectorAll('.scroll-anim');
  if (scrollEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    scrollEls.forEach(el => obs.observe(el));
  }
})();
