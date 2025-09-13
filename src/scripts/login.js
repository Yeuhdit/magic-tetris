//src/scripts/login.js
// Login form
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const level = document.getElementById('level').value;
  const errorBox = document.getElementById('error-msg');

  // Reset error box
  errorBox.style.display = 'none';
  errorBox.textContent = '';

  if (!username) {
    errorBox.textContent = 'Please enter a name';
    errorBox.style.display = 'block';
    return;
  }

  if (username.includes("!")) {
    errorBox.textContent = 'The name cannot contain "!"';
    errorBox.style.display = 'block';
    return;
  }

  const userData = { username, level };
  localStorage.setItem('gameUser', JSON.stringify(userData));
  window.location.href = 'tetris.html';
});

// Game instructions button
document.getElementById('instructions-a').addEventListener('click', () => {
  window.location.href = 'tetris-instructions.html';
});

// Endless confetti
const confettiContainer = document.getElementById('confetti-container');

function createConfetti() {
  const colors = ['#ff5da2', '#ffd3e0', '#ffe0f7', '#ff9a9e', '#fbc2eb'];
  const span = document.createElement('span');
  const size = Math.random() * 10 + 6;
  const left = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = Math.random() * 5 + 5;

  span.style.left = `${left}%`;
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.background = colors[Math.floor(Math.random() * colors.length)];
  span.style.animationDelay = `${delay}s`;
  span.style.animationDuration = `${duration}s`;

  confettiContainer.appendChild(span);

  setTimeout(() => {
    confettiContainer.removeChild(span);
  }, (duration + delay) * 1000);
}

setInterval(createConfetti, 150);