 // --- 0. PARTICLE BACKGROUND SYSTEM ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5; this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.globalAlpha = this.alpha; ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }
    
    for(let i=0; i<70; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- SHARED LOGIC (Clock, Audio, Navigation) ---
    const clockElement = document.getElementById('system-clock');
    const copyrightElement = document.getElementById('copyright-footer');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const btnBack = document.getElementById('action-prompt');
    const btnDownload = document.getElementById('btn-download');

    let isSoundMuted = false;

    // AUDIO FILES
    const soundMenu = new Audio('../sounds/menu-sound.mp3');
    const soundNav = new Audio('../sounds/home-button.mp3');
    const soundBack = new Audio('../sounds/scroll-backward.mp3'); 
    const soundSelect = new Audio('../sounds/select-button.mp3'); 
    const allSounds = [soundMenu, soundNav, soundBack, soundSelect];

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
        else if (type === 'select') { soundSelect.currentTime = 0; soundSelect.play().catch(e=>{}); }
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

    // Buttons
    btnBack.addEventListener('click', () => {
      playSound('back');
      setTimeout(() => { window.location.href = '../index.html'; }, 300);
    });

   btnDownload.addEventListener('click', () => {
      playSound('select');
      
      setTimeout(() => { 
        // Put your exact PDF file name inside the quotes below
        window.open('Adebayo_Adesugba_Resume.pdf', '_blank'); 
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
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    scrollElements.forEach(el => scrollObserver.observe(el));
    