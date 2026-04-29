 // --- 0. PARTICLE BACKGROUND SYSTEM ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Slow drifting velocity
        this.vx = (Math.random() - 0.5) * 0.3; 
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1; // Soft glow opacity
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create 70 particles
    for(let i=0; i<70; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --- 1. PROJECT DATA ---
    const projects = [
      {
        title: 'TFC',
        overview: 'We specialize in connecting you with your favorite movie stars and music artists.',
        features: ['User Authentication 🏆', 'Real-time Data Sync', 'Community Features', 'Secure Backend', 'Scalable Architecture'],
        tech: ['Tailwind', 'Express', 'React', 'Node.js', 'JavaScript'],
        image: 'images/TFC.png',
        link: 'https://adebayoadesugba.github.io/TFC-MANAGEMENT/'
      },
      {
        title: 'Cheap Flight Finder',
        overview: 'Automation tool tracking regression data to find optimal flight pricing.',
        features: ['Automated Web Scraping', 'API Integration', 'SMS Alerts', 'Live Data Sync'],
        tech: ['Python', 'Selenium', 'Sheety API', 'Twilio'],
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
        link: 'https://github.com/yourusername/flight-finder'
      },
      {
        title: 'Urban Realty Search',
        overview: 'High-performance real estate search engine with interactive map integration.',
        features: ['Mapbox Integration', 'Advanced Property Filtering', 'Interactive UI', 'Secure Backend'],
        tech: ['React', 'Next.js', 'PostgreSQL', 'Tailwind'],
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
        link: 'https://github.com/yourusername/urban-realty'
      },
      {
        title: 'ShopHub E-commerce',
        overview: 'A fully responsive modern e-commerce platform with shopping cart functionality and payment integration.',
        features: ['User Authentication', 'Payment Integration', 'Inventory Management', 'Order Processing', 'Admin Dashboard', 'Customer Reviews', 'Responsive Design', 'SEO Optimization', 'Inventory Management'],
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Tailwind'],
        image: 'images/shophub.png',
        link: 'https://github.com/yourusername/speed-bot'
      },
        {
        title: 'The Modern Blogger',
        overview: 'A Responsive Blog-Web Page for sharing info about mobile devices.',
        features: ['Responsive Design', 'Accessibility', 'Modern UI', 'SEO Optimization', 'Easy Content Management'],
        tech: ['React', 'Tailwind', 'TypeScript', 'Netlify'],
        image: 'images/modernblog.png',
        link: 'https://themodernblogger.netlify.app/'
      },
        {
        title: 'The Zonk Coin',
        overview: 'A community-driven crypto project for trading meme token from around the world.',
        features: ['Community Governance', 'Automated Trading', 'Data Logging', 'Real-time Price Tracking', 'Secure Wallet Integration', 'Cross-Chain Compatibility'],
        tech: ['React', 'Next.js', 'API', 'Tailwind',],
        image: 'images/zonk.png',
        link: 'https://thezonkcoin.netlify.app/'
      },
      

    ];

    // --- 2. DOM ELEMENTS & STATE ---
    const carousel = document.getElementById('carousel');
    const endSpacer = document.getElementById('end-spacer');
    const detailsPanel = document.getElementById('details-panel');
    const dynamicTitle = document.getElementById('dynamic-title');
    const overviewText = document.getElementById('overview-text');
    const featuresList = document.getElementById('features-list');
    const techList = document.getElementById('tech-list');
    const actionPrompt = document.getElementById('action-prompt');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const clockElement = document.getElementById('system-clock');
    const copyrightElement = document.getElementById('copyright-footer');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');

    let activeIndex = -1;
    let isSoundMuted = false;

    // --- 3. AUDIO SYSTEM ---
    const soundForward = new Audio('sounds/scroll-forward.mp3'); 
    const soundBackward = new Audio('sounds/scroll-backward.mp3');
    const soundSelect = new Audio('sounds/select-button.mp3');
    const soundMenu = new Audio('sounds/menu-sound.mp3');
    const soundNav = new Audio('sounds/home-button.mp3');

    const allSounds = [soundForward, soundBackward, soundSelect, soundMenu, soundNav];

    // Set initial volume based on slider (0.2 == 20%)
    allSounds.forEach(sound => sound.volume = volumeSlider.value);

    // Volume Slider Logic
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      allSounds.forEach(sound => sound.volume = vol);
      
      if (vol === 0) {
        isSoundMuted = true;
        muteBtn.textContent = '🔇';
      } else if (isSoundMuted) {
        isSoundMuted = false;
        muteBtn.textContent = '🔊';
      }
    });

    muteBtn.addEventListener('click', () => {
      isSoundMuted = !isSoundMuted;
      if (isSoundMuted) {
        muteBtn.textContent = '🔇';
        allSounds.forEach(sound => sound.muted = true);
      } else {
        muteBtn.textContent = '🔊';
        allSounds.forEach(sound => sound.muted = false);
        // Ensure volume isn't 0 when unmuting
        if (parseFloat(volumeSlider.value) === 0) {
          volumeSlider.value = 0.2;
          allSounds.forEach(sound => sound.volume = 0.2);
        }
      }
    });

    function playSound(type) {
      if (isSoundMuted) return;
      try {
        if (type === 'forward') { soundForward.currentTime = 0; soundForward.play().catch(e=>{}); } 
        else if (type === 'backward') { soundBackward.currentTime = 0; soundBackward.play().catch(e=>{}); } 
        else if (type === 'select') { soundSelect.currentTime = 0; soundSelect.play().catch(e=>{}); } 
        else if (type === 'menu') { soundMenu.currentTime = 0; soundMenu.play().catch(e=>{}); } 
        else if (type === 'nav') { soundNav.currentTime = 0; soundNav.play().catch(e=>{}); }
      } catch (err) {}
    }

    // --- 4. CLOCK & COPYRIGHT LOGIC ---
    function updateSystemClock() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      minutes = minutes < 10 ? '0' + minutes : minutes;
      clockElement.textContent = `${hours}:${minutes} ${ampm}`;
    }
    
    copyrightElement.textContent = `© ${new Date().getFullYear()} Adesugba Adebayo`;
    updateSystemClock();
    setInterval(updateSystemClock, 10000); 

    // --- 5. NAVIGATION LISENTERS ---
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
        } else {
          if(link.classList.contains('mobile-nav-item')) {
            setTimeout(() => {
              hamburger.classList.remove('active');
              mobileMenu.classList.remove('open');
            }, 200);
          }
        }
      });
    });

    // --- 6. INITIALIZE CAROUSEL ---
    function initCarousel() {
      projects.forEach((project, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';
        wrapper.dataset.index = index;
        
        wrapper.innerHTML = `
          <div class="card-box">
            <img src="${project.image}" alt="${project.title}">
          </div>
          `;

        wrapper.addEventListener('click', () => {
          wrapper.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });

        carousel.insertBefore(wrapper, endSpacer);
      });
    }

    // --- 7. UPDATE UI LOGIC ---
    function updateDetailsPanel(index) {
      if (index === activeIndex) return; 
      
      if (activeIndex !== -1) { 
        if (index > activeIndex) { playSound('forward'); } else { playSound('backward'); }
      }

      activeIndex = index;
      const data = projects[index];

      // Add fade out to whole panel
      detailsPanel.classList.add('fade-out');

      // Wait for CSS transition
      setTimeout(() => {
        // Update Title
        dynamicTitle.textContent = data.title;
        
        // Update Text
        overviewText.textContent = data.overview;
        
        // Update Features
        featuresList.innerHTML = '';
        data.features.forEach(feature => {
          const li = document.createElement('li');
          li.textContent = feature;
          featuresList.appendChild(li);
        });

        // Update Tech
        techList.innerHTML = '';
        data.tech.forEach(techItem => {
          const li = document.createElement('li');
          li.textContent = techItem;
          techList.appendChild(li);
        });

        // Trigger fade in by removing class
        detailsPanel.classList.remove('fade-out');
        
        // Retrigger the inner CSS keyframe animations
        const sections = document.querySelectorAll('.info-section');
        sections.forEach(sec => {
          sec.style.animation = 'none';
          sec.offsetHeight; // trigger reflow
          sec.style.animation = null; 
        });

      }, 300); // 300ms matches the CSS transition time
    }

    // --- 8. ACTION PROMPT NAVIGATION ---
    actionPrompt.addEventListener('click', () => {
      playSound('select');
      setTimeout(() => {
        if (activeIndex >= 0 && projects[activeIndex].link) {
          window.open(projects[activeIndex].link, '_blank');
        }
      }, 300);
    });

    // --- 9. INTERSECTION OBSERVER ---
    const observerOptions = {
      root: carousel,
      rootMargin: '0px -50% 0px -50%', 
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.card-wrapper').forEach(c => c.classList.remove('active'));
          entry.target.classList.add('active');
          const index = parseInt(entry.target.dataset.index, 10);
          updateDetailsPanel(index);
        }
      });
    }, observerOptions);

    // --- 10. START APP ---
    initCarousel();
    document.querySelectorAll('.card-wrapper').forEach(wrapper => observer.observe(wrapper));
