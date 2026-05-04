// resume.js — particles.js and shared-ui.js are loaded before this

// BACK button
const btnBack = document.getElementById('action-prompt');
if (btnBack) {
  btnBack.addEventListener('click', () => {
    window.playSound('back');
    setTimeout(() => { window.location.href = '../index.html'; }, 250);
  });
}

// DOWNLOAD button
const btnDownload = document.getElementById('btn-download');
if (btnDownload) {
  btnDownload.addEventListener('click', () => {
    window.playSound('select');
    setTimeout(() => { window.open('Adebayo_Adesugba_Resume.pdf', '_blank'); }, 250);
  });
}
