const state = {
  profiles: [
    {
      id: crypto.randomUUID(),
      name: 'Default Room',
      client: 'Internal Demo',
      resolution: '1920x1080 @ 60Hz',
      codec: 'H.264 high profile / ProRes playback note',
      notes: 'Baseline profile for comparing the enhanced toolkit shell.',
    },
  ],
  activeProfileId: null,
  incidents: [],
  lineChecks: [],
  checklist: [
    {
      id: 'display',
      label: 'Display path verified',
      note: 'Correct source visible, aspect ratio right, no black playback.',
    },
    { id: 'audio', label: 'Audio line check complete', note: 'L/R/sub/fills confirmed and clean.' },
    { id: 'network', label: 'AV network healthy', note: 'IGMP, uplinks, PoE, and switch role checked.' },
    { id: 'lighting', label: 'Lighting camera-safe', note: 'Flicker and wash validated with actual camera exposure.' },
    { id: 'record', label: 'Incident / notes exported', note: 'Room report ready for PM or client handoff.' },
  ].map((item) => ({ ...item, checked: false })),
  showMode: false,
  animationFrame: null,
  rgbInterval: null,
  rgbCycleIndex: 0,
  audioCtx: null,
  activeOscillator: null,
  activeNoiseSource: null,
  activeGainNode: null,
  activePanner: null,
  sweepInterval: null,
  activeSoundId: null,
  volume: 0.5,
};

state.activeProfileId = state.profiles[0].id;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function initIcons() {
  if (window.lucide) lucide.createIcons();
}

function setTheme(next) {
  document.documentElement.setAttribute('data-theme', next);
  $('#themeToggle').innerHTML =
    next === 'dark' ? '<i data-lucide="sun-medium"></i>' : '<i data-lucide="moon-star"></i>';
  initIcons();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function scrollToSection(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function exportBlob(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getActiveProfile() {
  return state.profiles.find((p) => p.id === state.activeProfileId) || state.profiles[0];
}

function loadProfileToForm(profile) {
  if (!profile) return;
  $('#profileName').value = profile.name || '';
  $('#profileClient').value = profile.client || '';
  $('#profileResolution').value = profile.resolution || '';
  $('#profileCodec').value = profile.codec || '';
  $('#profileNotes').value = profile.notes || '';
}

function collectProfileFromForm() {
  return {
    id: state.activeProfileId || crypto.randomUUID(),
    name: $('#profileName').value.trim() || 'Untitled Profile',
    client: $('#profileClient').value.trim(),
    resolution: $('#profileResolution').value.trim(),
    codec: $('#profileCodec').value.trim(),
    notes: $('#profileNotes').value.trim(),
  };
}

function saveCurrentProfile() {
  const profile = collectProfileFromForm();
  const idx = state.profiles.findIndex((p) => p.id === profile.id);
  if (idx >= 0) state.profiles[idx] = profile;
  else state.profiles.push(profile);
  state.activeProfileId = profile.id;
  renderProfiles();
  updateStats();
  saveStateToLocalStorage();
}

function newBlankProfile() {
  const blank = {
    id: crypto.randomUUID(),
    name: 'New Room',
    client: '',
    resolution: '1920x1080 @ 60Hz',
    codec: '',
    notes: '',
  };
  state.profiles.push(blank);
  state.activeProfileId = blank.id;
  loadProfileToForm(blank);
  renderProfiles();
  updateStats();
  saveStateToLocalStorage();
}

function renderProfiles() {
  const list = $('#profileList');
  list.innerHTML = '';
  state.profiles.forEach((profile) => {
    const li = document.createElement('li');
    li.className = 'profile-item';
    li.innerHTML = `
      <strong>${profile.name}</strong>
      <div>${profile.client || 'No client specified'}</div>
      <div class="meta-row">
        <span>${profile.resolution || 'No output set'}</span>
        <span>${profile.codec || 'No codec note'}</span>
      </div>
      <div class="toolbar">
        <button class="btn" data-profile-load="${profile.id}">Load</button>
        <button class="btn" data-profile-delete="${profile.id}">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderChecklist() {
  const grid = $('#checklistGrid');
  grid.innerHTML = '';
  state.checklist.forEach((item) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'check-item';
    wrapper.innerHTML = `
      <input type="checkbox" ${item.checked ? 'checked' : ''} data-check-id="${item.id}" />
      <span>
        <strong>${item.label}</strong>
        <span>${item.note}</span>
      </span>
    `;
    grid.appendChild(wrapper);
  });
}

function addIncident() {
  const notes = $('#incidentNotes').value.trim();
  if (!notes) return;
  state.incidents.unshift({
    id: crypto.randomUUID(),
    category: $('#incidentCategory').value,
    owner: $('#incidentOwner').value.trim() || 'Unassigned',
    notes,
    timestamp: new Date().toLocaleString(),
  });
  $('#incidentNotes').value = '';
  renderIncidents();
  updateStats();
  saveStateToLocalStorage();
}

function renderIncidents() {
  const list = $('#incidentList');
  list.innerHTML = '';
  if (!state.incidents.length) {
    const li = document.createElement('li');
    li.className = 'incident-item';
    li.innerHTML =
      '<strong>No incidents yet</strong><div>Use this log for show notes, client handoff, and recurring room quirks.</div>';
    list.appendChild(li);
    return;
  }
  state.incidents.forEach((inc) => {
    const li = document.createElement('li');
    li.className = 'incident-item';
    li.innerHTML = `
      <strong>${inc.category} · ${inc.owner}</strong>
      <div>${inc.notes}</div>
      <div class="meta-row"><span>${inc.timestamp}</span></div>
    `;
    list.appendChild(li);
  });
}

function updateStats() {
  $('#statProfiles').textContent = String(state.profiles.length);
  const complete = state.checklist.filter((item) => item.checked).length;
  const percent = Math.round((complete / state.checklist.length) * 100);
  $('#statChecks').textContent = `${percent}%`;
  $('#statIncidents').textContent = String(state.incidents.length);
}

function calculateDelay() {
  const distance = parseFloat($('#distanceFeet').value || '0');
  const speed = parseFloat($('#speedOfSound').value || '1130');
  if (distance <= 0 || speed <= 0) {
    $('#delayResult').textContent = 'Enter valid positive values for distance and speed of sound.';
    return;
  }
  const seconds = distance / speed;
  const ms = seconds * 1000;
  $('#delayResult').textContent =
    `Suggested delay: ${ms.toFixed(1)} ms (${seconds.toFixed(3)} s) for ${distance.toFixed(1)} ft from the reference source.`;
}

function renderMacro(note) {
  $('#macroResult').textContent = note;
}

function logLineCheck(line) {
  const entry = `${new Date().toLocaleTimeString()} — ${line} checked`;
  state.lineChecks.unshift(entry);
  $('#lineCheckLog').textContent = state.lineChecks.join('\n');
}

function generateDMXRows() {
  const universe = parseInt($('#dmxUniverse').value || '1', 10);
  const start = parseInt($('#dmxStart').value || '1', 10);
  const footprint = parseInt($('#dmxFootprint').value || '1', 10);
  const count = parseInt($('#dmxCount').value || '1', 10);
  const rows = [];
  let current = start;

  for (let i = 1; i <= count; i++) {
    const end = current + footprint - 1;
    if (end > 512) {
      rows.push({ fixture: `Fixture ${i}`, universe, start: current, end: 'Overflow' });
      break;
    }
    rows.push({ fixture: `Fixture ${i}`, universe, start: current, end });
    current = end + 1;
  }
  return rows;
}

function renderDMX() {
  const rows = generateDMXRows();
  const lines = ['Fixture\tUniverse\tStart\tEnd'];
  rows.forEach((row) => lines.push(`${row.fixture}\t${row.universe}\t${row.start}\t${row.end}`));
  $('#dmxResults').textContent = lines.join('\n');
}

function exportDMX() {
  const rows = generateDMXRows();
  const csv = ['Fixture,Universe,Start,End', ...rows.map((r) => `${r.fixture},${r.universe},${r.start},${r.end}`)].join(
    '\n',
  );
  exportBlob('dmx-patch.csv', csv, 'text/csv');
}

function calculatePoE() {
  const capacity = parseFloat($('#poeCapacity').value || '0');
  const rows = $('#poeDevices')
    .value.split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let total = 0;
  const parsed = rows.map((line) => {
    const [name, watts] = line.split(',').map((part) => part.trim());
    const value = parseFloat(watts || '0');
    total += value;
    return { name, value };
  });

  const percent = capacity ? (total / capacity) * 100 : 0;
  const headroom = capacity - total;
  const detail = parsed.map((device) => `${device.name}: ${device.value.toFixed(1)}W`).join(' · ');

  $('#poeSummary').textContent =
    `Total draw ${total.toFixed(1)}W / ${capacity.toFixed(1)}W (${percent.toFixed(0)}% used). Headroom: ${headroom.toFixed(1)}W. ${detail}`;
}

function generateWizard() {
  const symptom = $('#networkSymptom').value;
  const steps = {
    drop: [
      'Confirm IGMP snooping is paired with an active IGMP querier.',
      'Disable Energy Efficient Ethernet on AV ports.',
      'Verify the affected streams are intentionally in the correct VLAN.',
    ],
    freeze: [
      'Check uplink bandwidth and link speed between switch tiers.',
      'Verify jumbo frame settings are aligned end to end where required.',
      'Inspect port errors, multicast flood behavior, and QoS policy.',
    ],
    black: [
      'Test a non-protected source first to isolate HDCP from signal loss.',
      'Reduce inline devices and capture links in the display path.',
      'Re-seat or bypass the suspected switcher or extender leg.',
    ],
    signal: [
      'Force the source to a known-good resolution and refresh rate.',
      'Set switcher EDID to a stable static profile.',
      'Power-cycle the destination path for a clean handshake.',
    ],
  };

  $('#wizardList').innerHTML = steps[symptom]
    .map((step, idx) => `<li class="wizard-step"><strong>Step ${idx + 1}</strong><div>${step}</div></li>`)
    .join('');
}

function generateCribSheet() {
  const vlan = $('#vlanId').value.trim();
  const subnet = $('#subnetRange').value.trim();
  $('#cribSheet').textContent = [
    `AV VLAN: ${vlan}`,
    `Subnet: ${subnet}`,
    'Checklist:',
    '- IGMP snooping enabled only with querier present',
    '- EEE disabled on AV ports',
    '- Jumbo frames aligned where AVoIP vendor requires them',
    '- 10Gb uplinks or better for high-density video paths',
    '- PoE headroom documented before adding endpoints',
  ].join('\n');
}

function exportRoomReport() {
  const profile = collectProfileFromForm();
  const report = {
    exportedAt: new Date().toISOString(),
    profile,
    checklist: state.checklist,
    incidents: state.incidents,
    lineChecks: state.lineChecks,
    poeSummary: $('#poeSummary').textContent,
    dmxPatch: $('#dmxResults').textContent,
    networkCribSheet: $('#cribSheet').textContent,
  };

  const safeName = (profile.name || 'room').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  exportBlob(`${safeName}-report.json`, JSON.stringify(report, null, 2));
}

function exportActiveProfile() {
  saveCurrentProfile();
  const profile = getActiveProfile();
  const safeName = (profile.name || 'profile').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  exportBlob(`${safeName}.json`, JSON.stringify(profile, null, 2));
}

function importProfile(file) {
  if (!file) return;

  file
    .text()
    .then((text) => {
      const parsed = JSON.parse(text);
      const profile = {
        id: parsed.id || crypto.randomUUID(),
        name: parsed.name || 'Imported Profile',
        client: parsed.client || '',
        resolution: parsed.resolution || '',
        codec: parsed.codec || '',
        notes: parsed.notes || '',
      };
      state.profiles.push(profile);
      state.activeProfileId = profile.id;
      loadProfileToForm(profile);
      renderProfiles();
      updateStats();
    })
    .catch(() => alert('Could not import profile JSON.'));
}

function toggleShowMode() {
  state.showMode = !state.showMode;
  document.body.classList.toggle('show-mode', state.showMode);
}

function highlightActiveNav() {
  const sections = ['#dashboard', '#profiles', '#audio', '#video', '#lighting', '#network', '#ops', '#troubleshooting'];
  const scrollY = window.scrollY + 120;
  let current = '#dashboard';

  sections.forEach((id) => {
    const el = document.querySelector(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });

  $$('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

const inlineCanvas = $('#patternCanvas');
const inlineCtx = inlineCanvas.getContext('2d');
const fullscreenCanvas = $('#fullscreenCanvas');
const fullscreenCtx = fullscreenCanvas.getContext('2d');
const fullscreenContainer = $('#fullscreen-canvas-container');

let activeCanvas = inlineCanvas;
let activeCtx = inlineCtx;
let motionX = 0;

function clearCanvas() {
  activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  activeCtx.fillStyle = '#000';
  activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
}

function drawSafeArea() {
  activeCtx.strokeStyle = 'rgba(255,255,255,0.85)';
  activeCtx.lineWidth = 2;
  activeCtx.strokeRect(80, 45, activeCanvas.width - 160, activeCanvas.height - 90);

  activeCtx.strokeStyle = 'rgba(255,255,255,0.35)';
  activeCtx.strokeRect(160, 90, activeCanvas.width - 320, activeCanvas.height - 180);

  activeCtx.beginPath();
  activeCtx.moveTo(activeCanvas.width / 2, 0);
  activeCtx.lineTo(activeCanvas.width / 2, activeCanvas.height);
  activeCtx.moveTo(0, activeCanvas.height / 2);
  activeCtx.lineTo(activeCanvas.width, activeCanvas.height / 2);
  activeCtx.stroke();
}

function drawPattern(pattern = $('#patternSelect').value) {
  cancelAnimationFrame(state.animationFrame);
  if (state.rgbInterval) {
    clearTimeout(state.rgbInterval);
    state.rgbInterval = null;
  }
  clearCanvas();

  if (pattern === 'bars') {
    const colors = ['#fff', '#ffd500', '#00d1ff', '#00ff72', '#ff41a1', '#ff3b30', '#003cff', '#111'];
    const w = activeCanvas.width / colors.length;
    colors.forEach((color, index) => {
      activeCtx.fillStyle = color;
      activeCtx.fillRect(index * w, 0, w, activeCanvas.height);
    });
    drawSafeArea();
  } else if (pattern === 'grid') {
    activeCtx.fillStyle = '#111';
    activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

    for (let x = 0; x <= activeCanvas.width; x += 64) {
      activeCtx.strokeStyle = x % 128 === 0 ? 'rgba(79,152,163,0.8)' : 'rgba(255,255,255,0.18)';
      activeCtx.beginPath();
      activeCtx.moveTo(x, 0);
      activeCtx.lineTo(x, activeCanvas.height);
      activeCtx.stroke();
    }

    for (let y = 0; y <= activeCanvas.height; y += 64) {
      activeCtx.strokeStyle = y % 128 === 0 ? 'rgba(79,152,163,0.8)' : 'rgba(255,255,255,0.18)';
      activeCtx.beginPath();
      activeCtx.moveTo(0, y);
      activeCtx.lineTo(activeCanvas.width, y);
      activeCtx.stroke();
    }

    drawSafeArea();
  } else if (pattern === 'framing') {
    activeCtx.fillStyle = '#101010';
    activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

    activeCtx.strokeStyle = 'rgba(255,255,255,0.7)';
    activeCtx.lineWidth = 3;
    activeCtx.strokeRect(40, 40, activeCanvas.width - 80, activeCanvas.height - 80);

    const thirdsX = activeCanvas.width / 3;
    const thirdsY = activeCanvas.height / 3;

    for (let i = 1; i < 3; i++) {
      activeCtx.beginPath();
      activeCtx.moveTo(thirdsX * i, 40);
      activeCtx.lineTo(thirdsX * i, activeCanvas.height - 40);
      activeCtx.stroke();

      activeCtx.beginPath();
      activeCtx.moveTo(40, thirdsY * i);
      activeCtx.lineTo(activeCanvas.width - 40, thirdsY * i);
      activeCtx.stroke();
    }

    activeCtx.beginPath();
    activeCtx.arc(activeCanvas.width / 2, activeCanvas.height / 2, 42, 0, Math.PI * 2);
    activeCtx.strokeStyle = 'rgba(79,152,163,1)';
    activeCtx.stroke();
  } else if (pattern === 'motion') {
    animateMotion();
  } else if (pattern === 'white') {
    activeCtx.fillStyle = '#ffffff';
    activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
  } else if (pattern === 'black') {
    activeCtx.fillStyle = '#000000';
    activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
  } else if (pattern === 'rgb') {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    activeCtx.fillStyle = colors[state.rgbCycleIndex || 0];
    activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

    state.rgbInterval = setTimeout(() => {
      if ($('#patternSelect').value === 'rgb') {
        state.rgbCycleIndex = ((state.rgbCycleIndex || 0) + 1) % 3;
        drawPattern('rgb');
      }
    }, 2000);
  }
}

function animateMotion() {
  cancelAnimationFrame(state.animationFrame);

  function frame() {
    clearCanvas();
    activeCtx.fillStyle = '#0f1111';
    activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

    const colWidth = 110;
    const numCols = Math.ceil(activeCanvas.width / colWidth) + 2;
    for (let i = 0; i < numCols; i++) {
      activeCtx.fillStyle = i % 2 === 0 ? '#4f98a3' : '#f0f0f0';
      activeCtx.fillRect(i * colWidth - motionX, 0, 60, activeCanvas.height);
    }

    drawSafeArea();
    activeCtx.fillStyle = 'rgba(255,255,255,0.92)';
    activeCtx.font = '700 28px Satoshi';
    activeCtx.fillText(`Motion test · ${$('#frameRateSelect').value}`, 48, 54);

    motionX = (motionX + 6) % 110;
    state.animationFrame = requestAnimationFrame(frame);
  }

  frame();
}

function launchFullscreenPattern() {
  activeCanvas = fullscreenCanvas;
  activeCtx = fullscreenCtx;

  fullscreenCanvas.width = window.innerWidth;
  fullscreenCanvas.height = window.innerHeight;

  fullscreenContainer.style.display = 'block';

  if (fullscreenContainer.requestFullscreen) {
    fullscreenContainer.requestFullscreen();
  } else if (fullscreenContainer.webkitRequestFullscreen) {
    fullscreenContainer.webkitRequestFullscreen();
  }

  drawPattern();
  requestWakeLock();
  document.addEventListener('keydown', handleFullscreenEscKey);
}

function exitFullscreenPattern() {
  if (document.fullscreenElement === fullscreenContainer || document.webkitFullscreenElement === fullscreenContainer) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  fullscreenContainer.style.display = 'none';

  cancelAnimationFrame(state.animationFrame);
  if (state.rgbInterval) {
    clearTimeout(state.rgbInterval);
    state.rgbInterval = null;
  }

  activeCanvas = inlineCanvas;
  activeCtx = inlineCtx;

  drawPattern();
  releaseWakeLock();
  document.removeEventListener('keydown', handleFullscreenEscKey);
}

function handleFullscreenEscKey(e) {
  if (e.key === 'Escape') {
    exitFullscreenPattern();
  }
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && activeCanvas === fullscreenCanvas) {
    exitFullscreenPattern();
  }
});

document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement && activeCanvas === fullscreenCanvas) {
    exitFullscreenPattern();
  }
});

window.addEventListener('resize', () => {
  if (activeCanvas === fullscreenCanvas) {
    fullscreenCanvas.width = window.innerWidth;
    fullscreenCanvas.height = window.innerHeight;
    drawPattern();
  }
});

function initAudio() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
  return state.audioCtx;
}

function stopAllAudio() {
  if (state.activeOscillator) {
    try {
      state.activeOscillator.stop();
    } catch (_e) {}
    try {
      state.activeOscillator.disconnect();
    } catch (_e) {}
    state.activeOscillator = null;
  }
  if (state.activeNoiseSource) {
    try {
      state.activeNoiseSource.stop();
    } catch (_e) {}
    try {
      state.activeNoiseSource.disconnect();
    } catch (_e) {}
    state.activeNoiseSource = null;
  }
  if (state.activeGainNode) {
    try {
      state.activeGainNode.disconnect();
    } catch (_e) {}
    state.activeGainNode = null;
  }
  if (state.activePanner) {
    try {
      state.activePanner.disconnect();
    } catch (_e) {}
    state.activePanner = null;
  }
  if (state.sweepInterval) {
    clearInterval(state.sweepInterval);
    state.sweepInterval = null;
  }
  state.activeSoundId = null;

  $$('.macro-btn, .line-btn').forEach((btn) => {
    btn.classList.remove('btn-danger');
  });

  const playBtn = $('#playManualBtn');
  if (playBtn) {
    playBtn.textContent = '▶ Start Generator';
    playBtn.classList.remove('btn-danger');
  }
}

function updateVolume() {
  const val = parseInt($('#audioVolume').value, 10);
  $('#volumeVal').textContent = `${val}%`;
  state.volume = val / 100;
  if (state.activeGainNode) {
    state.activeGainNode.gain.setValueAtTime(state.volume, state.audioCtx.currentTime);
  }
}

function getPinkNoiseBuffer(ctx, durationSeconds = 2) {
  const bufferSize = ctx.sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    data[i] = pink * 0.11;
  }
  return buffer;
}

function playMacro(macroType, btn) {
  const ctx = initAudio();

  if (state.activeSoundId === `macro-${macroType}`) {
    stopAllAudio();
    return;
  }

  stopAllAudio();
  btn.classList.add('btn-danger');
  state.activeSoundId = `macro-${macroType}`;

  if (macroType === 'speech') {
    const buffer = getPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 125;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 8000;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(state.volume, ctx.currentTime);

    source.connect(hp);
    hp.connect(lp);
    lp.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);

    state.activeNoiseSource = source;
    state.activeGainNode = gainNode;
    renderMacro('Playing band-limited pink noise from 125 Hz to 8 kHz for speech EQ...');
  } else if (macroType === 'lowend') {
    const buffer = getPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 40;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 100;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(state.volume, ctx.currentTime);

    source.connect(hp);
    hp.connect(lp);
    lp.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);

    state.activeNoiseSource = source;
    state.activeGainNode = gainNode;
    renderMacro('Playing low-end rumble check noise from 40 Hz to 100 Hz...');
  } else if (macroType === 'feedback') {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(state.volume, ctx.currentTime);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(0);

    state.activeOscillator = osc;
    state.activeGainNode = gainNode;

    const sweepDuration = 10;

    function runSweep() {
      if (!state.activeOscillator || state.activeSoundId !== 'macro-feedback') return;
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(6000, now + sweepDuration);
    }

    runSweep();

    state.sweepInterval = setInterval(() => {
      runSweep();
    }, sweepDuration * 1000);

    renderMacro('Playing continuous frequency sweep from 500 Hz to 6 kHz (repeating every 10s)...');
  }
}

function playLineCheck(line, btn) {
  const ctx = initAudio();

  if (state.activeSoundId === `line-${line}`) {
    stopAllAudio();
    return;
  }

  stopAllAudio();
  btn.classList.add('btn-danger');
  state.activeSoundId = `line-${line}`;

  let panValue = 0;
  let frequency = 1000;

  if (line === 'Left') {
    panValue = -1;
  } else if (line === 'Right') {
    panValue = 1;
  } else if (line === 'Sub') {
    panValue = 0;
    frequency = 60;
  } else if (line === 'Fill 1') {
    panValue = -0.6;
  } else if (line === 'Fill 2') {
    panValue = 0.6;
  } else if (line === 'Lobby') {
    panValue = 0;
  }

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(state.volume, ctx.currentTime);

  let panner;
  if (ctx.createStereoPanner) {
    panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(panValue, ctx.currentTime);
  } else {
    panner = ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.setPosition(panValue, 0, 1 - Math.abs(panValue));
  }

  osc.connect(gainNode);
  gainNode.connect(panner);
  panner.connect(ctx.destination);

  osc.start(0);

  state.activeOscillator = osc;
  state.activeGainNode = gainNode;
  state.activePanner = panner;

  logLineCheck(line);
  saveStateToLocalStorage();
}

function saveStateToLocalStorage() {
  try {
    const payload = {
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      incidents: state.incidents,
      lineChecks: state.lineChecks,
      checklistChecked: state.checklist.map((item) => ({ id: item.id, checked: item.checked })),
    };
    localStorage.setItem('av_toolkit_state', JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

function loadStateFromLocalStorage() {
  try {
    const raw = localStorage.getItem('av_toolkit_state');
    if (!raw) return;
    const payload = JSON.parse(raw);
    if (payload.profiles) state.profiles = payload.profiles;
    if (payload.activeProfileId) state.activeProfileId = payload.activeProfileId;
    if (payload.incidents) state.incidents = payload.incidents;
    if (payload.lineChecks) state.lineChecks = payload.lineChecks;
    if (payload.checklistChecked) {
      payload.checklistChecked.forEach((c) => {
        const match = state.checklist.find((item) => item.id === c.id);
        if (match) match.checked = c.checked;
      });
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
}

let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (err) {
    console.warn('Wake Lock request failed:', err);
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock
      .release()
      .then(() => {
        wakeLock = null;
      })
      .catch(() => {});
  }
}

function playManualGenerator() {
  const ctx = initAudio();

  if (state.activeSoundId === 'manual-gen') {
    stopAllAudio();
    return;
  }

  stopAllAudio();

  const btn = $('#playManualBtn');
  btn.textContent = '■ Stop Generator';
  btn.classList.add('btn-danger');
  state.activeSoundId = 'manual-gen';

  const type = $('#manualWaveform').value;
  const freq = parseFloat($('#manualFreq').value);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(state.volume, ctx.currentTime);

  if (type === 'pink') {
    const buffer = getPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);

    state.activeNoiseSource = source;
  } else {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(0);

    state.activeOscillator = osc;
  }

  state.activeGainNode = gainNode;
}

function updateManualFrequency() {
  const freq = parseFloat($('#manualFreq').value);
  $('#manualFreqVal').textContent = `${freq} Hz`;

  if (state.activeOscillator && state.activeSoundId === 'manual-gen') {
    state.activeOscillator.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
  }
}

function updateManualWaveform() {
  const isPlaying = state.activeSoundId === 'manual-gen';
  if (isPlaying) {
    playManualGenerator();
    playManualGenerator();
  }
}

function attachEvents() {
  $('#themeToggle').addEventListener('click', toggleTheme);
  $('#calcDelayBtn').addEventListener('click', calculateDelay);
  $('#dmxCalcBtn').addEventListener('click', renderDMX);
  $('#dmxExportBtn').addEventListener('click', exportDMX);
  $('#poeCalcBtn').addEventListener('click', calculatePoE);
  $('#wizardBtn').addEventListener('click', generateWizard);
  $('#cribBtn').addEventListener('click', generateCribSheet);
  $('#addIncidentBtn').addEventListener('click', addIncident);
  $('#clearIncidentBtn').addEventListener('click', () => {
    state.incidents = [];
    renderIncidents();
    updateStats();
  });
  $('#saveProfileBtn').addEventListener('click', saveCurrentProfile);
  $('#newProfileBtn').addEventListener('click', newBlankProfile);
  $('#exportChecklistBtn').addEventListener('click', exportRoomReport);
  $('#exportProfileBtn').addEventListener('click', exportActiveProfile);
  $('#showModeBtn').addEventListener('click', toggleShowMode);
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', (event) => importProfile(event.target.files[0]));
  $('#drawPatternBtn').addEventListener('click', () => drawPattern($('#patternSelect').value));
  $('#animatePatternBtn').addEventListener('click', () => {
    $('#patternSelect').value = 'motion';
    launchFullscreenPattern();
  });
  $('#fullscreenPatternBtn').addEventListener('click', launchFullscreenPattern);
  $('#patternCanvas').addEventListener('dblclick', launchFullscreenPattern);
  $('#fullscreenCanvas').addEventListener('click', exitFullscreenPattern);
  $('#clearLineLogBtn').addEventListener('click', () => {
    state.lineChecks = [];
    $('#lineCheckLog').textContent = 'No line checks yet.';
  });

  $('#audioVolume').addEventListener('input', updateVolume);
  $('#stopAudioBtn').addEventListener('click', stopAllAudio);

  $('#playManualBtn').addEventListener('click', playManualGenerator);
  $('#manualFreq').addEventListener('input', updateManualFrequency);
  $('#manualWaveform').addEventListener('change', updateManualWaveform);

  $$('[data-freq-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      $('#manualFreq').value = btn.dataset.freqPreset;
      updateManualFrequency();
    });
  });

  document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  });

  $$('.macro-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      playMacro(btn.dataset.sound, btn);
      saveStateToLocalStorage();
    }),
  );

  $$('.line-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      playLineCheck(btn.dataset.line, btn);
    }),
  );

  document.body.addEventListener('click', initAudio, { once: false });

  $$('[data-scroll]').forEach((btn) => btn.addEventListener('click', () => scrollToSection(btn.dataset.scroll)));

  document.addEventListener('change', (event) => {
    if (event.target.matches('[data-check-id]')) {
      const id = event.target.getAttribute('data-check-id');
      const item = state.checklist.find((entry) => entry.id === id);
      if (item) item.checked = event.target.checked;
      updateStats();
      saveStateToLocalStorage();
    }
  });

  document.addEventListener('click', (event) => {
    const loadId = event.target.getAttribute('data-profile-load');
    const deleteId = event.target.getAttribute('data-profile-delete');

    if (loadId) {
      const profile = state.profiles.find((p) => p.id === loadId);
      state.activeProfileId = loadId;
      loadProfileToForm(profile);
      saveStateToLocalStorage();
    }

    if (deleteId && state.profiles.length > 1) {
      state.profiles = state.profiles.filter((p) => p.id !== deleteId);
      if (state.activeProfileId === deleteId) state.activeProfileId = state.profiles[0].id;
      loadProfileToForm(getActiveProfile());
      renderProfiles();
      updateStats();
      saveStateToLocalStorage();
    }
  });

  document.addEventListener('keydown', (event) => {
    const activeTag = document.activeElement && document.activeElement.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

    // Fullscreen pattern cycling shortcuts
    if (activeCanvas === fullscreenCanvas) {
      const select = $('#patternSelect');
      const options = Array.from(select.options).map((opt) => opt.value);
      const currentIndex = options.indexOf(select.value);

      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        const nextIdx = (currentIndex + 1) % options.length;
        select.value = options[nextIdx];
        drawPattern();
        return;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIdx = (currentIndex - 1 + options.length) % options.length;
        select.value = options[prevIdx];
        drawPattern();
        return;
      } else if (['1', '2', '3', '4', '5', '6', '7'].includes(event.key)) {
        const idx = parseInt(event.key, 10) - 1;
        if (idx < options.length) {
          select.value = options[idx];
          drawPattern();
          return;
        }
      }
    }

    const shortcuts = {
      1: '#audio',
      2: '#video',
      3: '#lighting',
      4: '#network',
      5: '#ops',
      6: '#troubleshooting',
      g: '#dashboard',
      G: '#dashboard',
    };

    if (event.key === 's' || event.key === 'S') toggleShowMode();
    if (shortcuts[event.key]) scrollToSection(shortcuts[event.key]);
  });

  document.addEventListener('scroll', highlightActiveNav, { passive: true });
}

function init() {
  loadStateFromLocalStorage();
  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(preferredDark ? 'dark' : 'light');
  loadProfileToForm(getActiveProfile());
  renderProfiles();
  renderChecklist();
  renderIncidents();
  renderDMX();
  calculateDelay();
  calculatePoE();
  generateWizard();
  generateCribSheet();
  updateStats();
  drawPattern('bars');
  updateVolume();
  attachEvents();
  highlightActiveNav();
  initIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
