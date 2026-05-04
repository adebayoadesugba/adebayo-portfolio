// --- HOMEPAGE SCRIPT ---
// particles.js and shared-ui.js are loaded before this

const projects = [
  { title: 'TFC', overview: 'We specialize in connecting you with your favorite movie stars and music artists.', features: ['User Authentication 🏆', 'Real-time Data Sync', 'Community Features', 'Secure Backend', 'Scalable Architecture'], tech: ['Tailwind', 'Express', 'React', 'Node.js', 'JavaScript'], image: 'images/TFC.png', link: 'https://adebayoadesugba.github.io/TFC-MANAGEMENT/' },
  { title: 'Cheap Flight Finder', overview: 'Automation tool tracking regression data to find optimal flight pricing.', features: ['Automated Web Scraping', 'API Integration', 'SMS Alerts', 'Live Data Sync'], tech: ['Python', 'Selenium', 'Sheety API', 'Twilio'], image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800', link: 'https://github.com/yourusername/flight-finder' },
  { title: 'Urban Realty Search', overview: 'High-performance real estate search engine with interactive map integration.', features: ['Mapbox Integration', 'Advanced Property Filtering', 'Interactive UI', 'Secure Backend'], tech: ['React', 'Next.js', 'PostgreSQL', 'Tailwind'], image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800', link: 'https://github.com/yourusername/urban-realty' },
  { title: 'ShopHub E-commerce', overview: 'A fully responsive modern e-commerce platform with shopping cart and payment integration.', features: ['User Authentication', 'Payment Integration', 'Inventory Management', 'Order Processing', 'Admin Dashboard', 'Responsive Design', 'SEO Optimization'], tech: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Tailwind'], image: 'images/shophub.png', link: 'https://github.com/yourusername/speed-bot' },
  { title: 'The Modern Blogger', overview: 'A Responsive Blog-Web Page for sharing info about mobile devices.', features: ['Responsive Design', 'Accessibility', 'Modern UI', 'SEO Optimization', 'Easy Content Management'], tech: ['React', 'Tailwind', 'TypeScript', 'Netlify'], image: 'images/modernblog.png', link: 'https://themodernblogger.netlify.app/' },
  { title: 'The Zonk Coin', overview: 'A community-driven crypto project for trading meme token from around the world.', features: ['Community Governance', 'Automated Trading', 'Data Logging', 'Real-time Price Tracking', 'Secure Wallet Integration', 'Cross-Chain Compatibility'], tech: ['React', 'Next.js', 'API', 'Tailwind'], image: 'images/zonk.png', link: 'https://thezonkcoin.netlify.app/' },
];

const carousel    = document.getElementById('carousel');
const endSpacer   = document.getElementById('end-spacer');
const detailsPanel= document.getElementById('details-panel');
const dynamicTitle= document.getElementById('dynamic-title');
const overviewText= document.getElementById('overview-text');
const featuresList= document.getElementById('features-list');
const techList    = document.getElementById('tech-list');
const actionPrompt= document.getElementById('action-prompt');

let activeIndex = -1;
let updateTimer = null;

function initCarousel() {
  const frag = document.createDocumentFragment();
  projects.forEach((p, i) => {
    const w = document.createElement('div');
    w.className = 'card-wrapper';
    w.dataset.index = i;
    w.innerHTML = `<div class="card-box"><img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async"></div>`;
    w.addEventListener('click', () => w.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }));
    frag.appendChild(w);
  });
  carousel.insertBefore(frag, endSpacer);
}

function updateDetailsPanel(index) {
  if (index === activeIndex) return;
  if (activeIndex !== -1) window.playSound(index > activeIndex ? 'forward' : 'backward');
  activeIndex = index;
  if (updateTimer) clearTimeout(updateTimer);
  detailsPanel.classList.add('fade-out');
  updateTimer = setTimeout(() => {
    const d = projects[index];
    dynamicTitle.textContent = d.title;
    overviewText.textContent = d.overview;
    const ff = document.createDocumentFragment();
    d.features.forEach(f => { const li = document.createElement('li'); li.textContent = f; ff.appendChild(li); });
    featuresList.replaceChildren(ff);
    const ft = document.createDocumentFragment();
    d.tech.forEach(t => { const li = document.createElement('li'); li.textContent = t; ft.appendChild(li); });
    techList.replaceChildren(ft);
    detailsPanel.classList.remove('fade-out');
    detailsPanel.querySelectorAll('.info-section').forEach(s => { s.style.animation='none'; s.offsetHeight; s.style.animation=null; });
  }, 280);
}

actionPrompt.addEventListener('click', () => {
  window.playSound('select');
  setTimeout(() => { if (activeIndex >= 0 && projects[activeIndex].link) window.open(projects[activeIndex].link, '_blank'); }, 250);
});

function initObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        carousel.querySelectorAll('.card-wrapper.active').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        updateDetailsPanel(parseInt(e.target.dataset.index, 10));
      }
    });
  }, { root: carousel, rootMargin: '0px -45% 0px -45%', threshold: 0 });
  carousel.querySelectorAll('.card-wrapper').forEach(w => obs.observe(w));
}

initCarousel();
initObserver();
