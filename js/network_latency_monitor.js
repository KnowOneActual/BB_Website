const endpoints = [
  { name: 'Google DNS', host: '8.8.8.8' },
  { name: 'Cloudflare', host: '1.1.1.1' },
  { name: 'Local Gateway', host: '192.168.1.1' },
];

function createCards() {
  const grid = document.getElementById('monitor-grid');
  endpoints.forEach((ep) => {
    const card = document.createElement('div');
    card.className = 'p-6 bg-gray-800 rounded-xl border border-gray-700 space-y-4';
    
    const topRow = document.createElement('div');
    topRow.className = 'flex justify-between items-start';
    
    const infoDiv = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'font-bold text-white';
    title.textContent = ep.name;
    
    const host = document.createElement('p');
    host.className = 'text-xs text-gray-500';
    host.textContent = ep.host;
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(host);
    
    const statusDot = document.createElement('div');
    statusDot.id = `status-${ep.host.replace(/\./g, '-')}`;
    statusDot.className = 'w-3 h-3 rounded-full bg-gray-700';
    
    topRow.appendChild(infoDiv);
    topRow.appendChild(statusDot);
    
    const latencyRow = document.createElement('div');
    latencyRow.className = 'flex items-baseline gap-2';
    
    const latencyVal = document.createElement('span');
    latencyVal.id = `latency-${ep.host.replace(/\./g, '-')}`;
    latencyVal.className = 'text-3xl font-extrabold text-white';
    latencyVal.textContent = '-';
    
    const unit = document.createElement('span');
    unit.className = 'text-[10px] text-gray-500 font-bold uppercase';
    unit.textContent = 'ms';
    
    latencyRow.appendChild(latencyVal);
    latencyRow.appendChild(unit);
    
    card.appendChild(topRow);
    card.appendChild(latencyRow);
    
    grid.appendChild(card);
  });
}

createCards();

let monitoring = false;
document.getElementById('toggle-monitor').addEventListener('click', function () {
  monitoring = !monitoring;
  this.textContent = monitoring ? 'Stop Monitoring' : 'Start Monitoring';
  this.className = monitoring
    ? 'w-full md:w-auto px-8 py-3 bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/30 font-bold rounded-xl transition duration-300'
    : 'w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition duration-300';

  if (monitoring) runCheck();
});

async function runCheck() {
  if (!monitoring) return;

  endpoints.forEach(async (ep) => {
    const hostId = ep.host.replace(/\./g, '-');
    const log = document.getElementById('log-container');

    try {
      // Simulation of ping logic
      await new Promise((r) => setTimeout(r, Math.random() * 50 + 10));
      const latency = Math.floor(Math.random() * 40 + 10);

      const latencyEl = document.getElementById(`latency-${hostId}`);
      const statusEl = document.getElementById(`status-${hostId}`);

      if (latencyEl) latencyEl.textContent = latency;
      if (statusEl) statusEl.className = 'w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';

      const logEntry = document.createElement('p');
      logEntry.className = 'text-green-400/80';
      logEntry.textContent = `[${new Date().toLocaleTimeString()}] SUCCESS: ${ep.name} (${ep.host}) - ${latency}ms`;
      if (log) log.prepend(logEntry);
    } catch (_e) {
      const statusEl = document.getElementById(`status-${hostId}`);
      if (statusEl) statusEl.className = 'w-3 h-3 rounded-full bg-red-500';
    }
  });

  const slider = document.getElementById('interval-slider');
  const interval = (slider ? slider.value : 3) * 1000;
  setTimeout(runCheck, interval);
}

const slider = document.getElementById('interval-slider');
if (slider) {
  slider.addEventListener('input', function () {
    const display = document.getElementById('interval-display');
    if (display) display.textContent = this.value + 's';
  });
}
