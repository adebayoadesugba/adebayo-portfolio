// contact.js — particles.js and shared-ui.js are loaded before this

const actionPrompt = document.getElementById('action-prompt');
if (actionPrompt) {
  actionPrompt.addEventListener('click', () => {
    window.playSound('back');
    setTimeout(() => { window.location.href = '../index.html'; }, 250);
  });
}

// Form submission
const contactForm = document.getElementById('ps4-contact-form');
const sendBtn = document.getElementById('send-btn');

if (contactForm && sendBtn) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    window.playSound('submit');
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'SENDING...';
    sendBtn.style.pointerEvents = 'none';

    try {
      const response = await fetch('https://formspree.io/f/xlgaqzpz', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        alert('Message Sent Successfully! I will get back to you shortly.');
        contactForm.reset();
      } else {
        alert('Error sending message. Please try again.');
      }
    } catch {
      alert('Network error. Check your connection.');
    } finally {
      sendBtn.textContent = originalText;
      sendBtn.style.pointerEvents = 'auto';
    }
  });
}
