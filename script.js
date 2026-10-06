const musicButton = document.querySelector('#musicButton');
const musicLabel = document.querySelector('#musicLabel');
const weddingSong = document.querySelector('#weddingSong');
const toast = document.querySelector('#toast');
const welcomeGate = document.querySelector('#welcomeGate');
const enterButton = document.querySelector('#enterButton');
let toastTimer;

weddingSong.volume = 0.72;

function setMusicState(isPlaying) {
  musicButton.setAttribute('aria-pressed', String(isPlaying));
  musicButton.setAttribute('aria-label', isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى');
  musicLabel.textContent = isPlaying ? 'إيقاف الموسيقى' : 'الموسيقى';
}

function closeWelcomeGate() {
  welcomeGate.classList.add('is-hidden');
  document.body.classList.remove('gate-open');
}

async function startMusic() {
  try {
    await weddingSong.play();
    setMusicState(true);
    closeWelcomeGate();
  } catch {
    showToast('اضغطوا مرة أخرى لتشغيل الموسيقى');
  }
}

document.body.classList.add('gate-open');
enterButton.addEventListener('click', startMusic);
weddingSong.addEventListener('playing', () => {
  setMusicState(true);
  closeWelcomeGate();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

musicButton.addEventListener('click', async () => {
  if (!weddingSong.currentSrc) {
    showToast('ملف الموسيقى غير متوفر');
    return;
  }
  if (weddingSong.paused) {
    try {
      await weddingSong.play();
      setMusicState(true);
    } catch {
      showToast('اضغطوا مرة أخرى لتشغيل الموسيقى');
    }
  } else {
    weddingSong.pause();
    setMusicState(false);
  }
});

weddingSong.addEventListener('ended', () => {
  setMusicState(false);
});

const countdownTarget = new Date('2026-10-18T16:00:00+01:00').getTime();
const countdownFields = {
  days: document.querySelector('#countDays'),
  hours: document.querySelector('#countHours'),
  minutes: document.querySelector('#countMinutes'),
  seconds: document.querySelector('#countSeconds')
};

function updateCountdown() {
  const remaining = Math.max(0, countdownTarget - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownFields.days.textContent = String(days).padStart(2, '0');
  countdownFields.hours.textContent = String(hours).padStart(2, '0');
  countdownFields.minutes.textContent = String(minutes).padStart(2, '0');
  countdownFields.seconds.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.section-heading, .details-intro, .detail-card, .location-panel').forEach((element) => {
  element.classList.add('reveal');
  element.style.animationPlayState = 'paused';
  revealObserver.observe(element);
});
