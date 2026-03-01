// Simplified speed test simulation for demonstration
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-test');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      const btn = this;
      btn.disabled = true;
      btn.textContent = 'Testing...';

      let speed = 0;
      const targetSpeed = Math.floor(Math.random() * 200) + 50;
      const speedVal = document.getElementById('speed-value');

      const interval = setInterval(() => {
        speed += Math.floor(Math.random() * 10) + 1;
        if (speed >= targetSpeed) {
          speed = targetSpeed;
          clearInterval(interval);
          finishTest(speed);
        }
        if (speedVal) speedVal.textContent = speed;
      }, 50);
    });
  }
});

function finishTest(speed) {
  const btn = document.getElementById('start-test');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Restart Test';
  }

  const latency = Math.floor(Math.random() * 30) + 5;
  const jitter = Math.floor(Math.random() * 5) + 1;

  const latencyVal = document.getElementById('latency-value');
  const jitterVal = document.getElementById('jitter-value');

  if (latencyVal) latencyVal.textContent = latency;
  if (jitterVal) jitterVal.textContent = jitter;

  addToHistory(speed, latency);
}

function addToHistory(speed, latency) {
  const body = document.getElementById('history-body');
  if (!body) return;

  const row = document.createElement('tr');
  row.className = 'border-b border-gray-800/50';

  const date = new Date().toLocaleTimeString();

  const dateCell = document.createElement('td');
  dateCell.className = 'py-4 text-sm';
  dateCell.textContent = date;

  const speedCell = document.createElement('td');
  speedCell.className = 'py-4 font-bold text-white';
  speedCell.textContent = `${speed} Mbps`;

  const latencyCell = document.createElement('td');
  latencyCell.className = 'py-4 text-sm';
  latencyCell.textContent = `${latency} ms`;

  row.appendChild(dateCell);
  row.appendChild(speedCell);
  row.appendChild(latencyCell);

  body.insertBefore(row, body.firstChild);
}
