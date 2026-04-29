 // --- SHARED LOGIC (Clock, Audio, Navigation) ---
    const clockElement = document.getElementById('system-clock');
    const copyrightElement = document.getElementById('copyright-footer');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const actionPrompt = document.getElementById('action-prompt');

    let isSoundMuted = false;

    const soundMenu = new Audio('../sounds/menu-sound.mp3');
    const soundNav = new Audio('../sounds/home-button.mp3');
    const soundBack = new Audio('../sounds/scroll-backward.mp3'); 
    const allSounds = [soundMenu, soundNav, soundBack];

    allSounds.forEach(sound => sound.volume = volumeSlider.value);

    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      allSounds.forEach(sound => sound.volume = vol);
      if (vol === 0) { isSoundMuted = true; muteBtn.textContent = '🔇'; } 
      else if (isSoundMuted) { isSoundMuted = false; muteBtn.textContent = '🔊'; }
    });

    muteBtn.addEventListener('click', () => {
      isSoundMuted = !isSoundMuted;
      if (isSoundMuted) { muteBtn.textContent = '🔇'; allSounds.forEach(s => s.muted = true); } 
      else { 
        muteBtn.textContent = '🔊'; allSounds.forEach(s => s.muted = false); 
        if (parseFloat(volumeSlider.value) === 0) {
          volumeSlider.value = 0.2;
          allSounds.forEach(sound => sound.volume = 0.2);
        }
      }
    });

    function playSound(type) {
      if (isSoundMuted) return;
      try {
        if (type === 'menu') { soundMenu.currentTime = 0; soundMenu.play().catch(e=>{}); } 
        else if (type === 'nav') { soundNav.currentTime = 0; soundNav.play().catch(e=>{}); }
        else if (type === 'back') { soundBack.currentTime = 0; soundBack.play().catch(e=>{}); }
      } catch (err) {}
    }

    function updateSystemClock() {
      const now = new Date();
      let hours = now.getHours(); let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12; hours = hours ? hours : 12; 
      minutes = minutes < 10 ? '0' + minutes : minutes;
      clockElement.textContent = `${hours}:${minutes} ${ampm}`;
    }
    
    copyrightElement.textContent = `© ${new Date().getFullYear()} Adesugba Adebayo`;
    updateSystemClock(); setInterval(updateSystemClock, 10000); 

    hamburger.addEventListener('click', () => {
      playSound('menu');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        playSound('nav');
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          setTimeout(() => { window.location.href = href; }, 250);
        }
      });
    });

    actionPrompt.addEventListener('click', () => {
      playSound('back');
      setTimeout(() => {
        window.location.href = '../index.html'; 
      }, 300);
    });

    // --- SCROLL ANIMATION OBSERVER ---
    const scrollElements = document.querySelectorAll('.scroll-anim');
    
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, 
      rootMargin: "0px 0px -50px 0px" 
    });

    scrollElements.forEach(el => scrollObserver.observe(el));
    