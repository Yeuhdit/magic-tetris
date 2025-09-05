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
document.getElementById('instructions-btn').addEventListener('click', () => {
  window.location.href = 'tetris-instructions.html';
});


