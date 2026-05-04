// about.js — particles.js and shared-ui.js are loaded before this

const actionPrompt = document.getElementById('action-prompt');
if (actionPrompt) {
  actionPrompt.addEventListener('click', () => {
    window.playSound('back');
    setTimeout(() => { window.location.href = '../index.html'; }, 250);
  });
}
