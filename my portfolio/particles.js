// --- OPTIMIZED PARTICLE SYSTEM ---
// Detects low-end devices and reduces or disables particles accordingly
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Detect low-end device: small screen OR low memory OR slow CPU hint
  const isLowEnd = (
    navigator.hardwareConcurrency <= 2 ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    window.innerWidth < 480
  );

  // On truly low-end, skip canvas entirely
  if (isLowEnd && window.innerWidth < 380) {
    canvas.style.display = 'none';
    return;
  }

  const COUNT = isLowEnd ? 25 : (window.innerWidth < 768 ? 40 : 70);
  let W = 0, H = 0;
  let animId = null;
  let lastTime = 0;
  // Target ~30fps on mobile, 60fps on desktop
  const FPS_INTERVAL = isLowEnd ? 1000 / 30 : 1000 / 60;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Debounce resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });
  resize();

  // Use typed arrays for better perf
  const px = new Float32Array(COUNT);
  const py = new Float32Array(COUNT);
  const pvx = new Float32Array(COUNT);
  const pvy = new Float32Array(COUNT);
  const psize = new Float32Array(COUNT);
  const palpha = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    px[i] = Math.random() * W;
    py[i] = Math.random() * H;
    pvx[i] = (Math.random() - 0.5) * 0.3;
    pvy[i] = (Math.random() - 0.5) * 0.3;
    psize[i] = Math.random() * 2 + 0.5;
    palpha[i] = Math.random() * 0.5 + 0.1;
  }

  function animate(now) {
    animId = requestAnimationFrame(animate);
    const elapsed = now - lastTime;
    if (elapsed < FPS_INTERVAL) return; // Throttle to target FPS
    lastTime = now - (elapsed % FPS_INTERVAL);

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < COUNT; i++) {
      px[i] += pvx[i];
      py[i] += pvy[i];
      if (px[i] < 0) px[i] = W;
      else if (px[i] > W) px[i] = 0;
      if (py[i] < 0) py[i] = H;
      else if (py[i] > H) py[i] = 0;

      ctx.globalAlpha = palpha[i];
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px[i], py[i], psize[i], 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Pause when tab not visible to save battery/CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else {
      if (!animId) {
        lastTime = 0;
        animId = requestAnimationFrame(animate);
      }
    }
  });

  animId = requestAnimationFrame(animate);
})();
