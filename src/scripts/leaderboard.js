function loadScores() {
      const dataRaw = localStorage.getItem('tetrisGameData');
      const highscore = JSON.parse(localStorage.getItem('tetrisHighscore')) || 0;
      const highsteps = JSON.parse(localStorage.getItem('tetrisStepsHigh')) || 0;

      if (!dataRaw) {
        document.getElementById('scoreData').innerHTML = '<p>No scores saved.</p>';
        return;
      }

      const data = JSON.parse(dataRaw);
      const timeStr = new Date(data.timestamp).toLocaleString();

      document.getElementById('scoreData').innerHTML = `
        <p><strong>Last Score:</strong> ${data.score}</p>
        <p><strong>High Score:</strong> ${highscore}</p>
        <p><strong>Last Steps:</strong> ${data.steps}</p>
        <p><strong>High Steps:</strong> ${highsteps}</p>
        <p><strong>Level:</strong> ${data.level === 'hard' ? 'Hard' : 'Medium'}</p>
        <p><strong>Saved On:</strong> ${timeStr}</p>
      `;

      drawChart(data.score, highscore, data.steps, highsteps);
    }

    function drawChart(score, highscore, steps, highsteps) {
      const ctx = document.getElementById('scoreChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Last Score', 'High Score', 'Last Steps', 'High Steps'],
          datasets: [{
            label: 'Score Data',
            data: [score, highscore, steps, highsteps],
            backgroundColor: ['#ff6fa9', '#ff3e84', '#ff9bbd', '#ff69b4'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#ffe3ef',
              titleColor: '#ff3e84',
              bodyColor: '#6d004c'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 10
              }
            }
          }
        }
      });
    }

    document.getElementById('clearBtn').addEventListener('click', () => {
      localStorage.removeItem('tetrisGameData');
      localStorage.removeItem('tetrisHighscore');
      localStorage.removeItem('tetrisStepsHigh');
      document.getElementById('scoreData').innerHTML = '<p>Scores cleared.</p>';
      document.getElementById('scoreChart').remove();
    });

    loadScores();