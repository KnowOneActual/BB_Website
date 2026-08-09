// Davis Audio - Field AV Notes Application Logic

const STORAGE_KEY = 'davis_av_field_notes_data';

// Default initial state
const defaultState = {
  clientName: '',
  jobDate: new Date().toISOString().split('T')[0],
  questions: ['Verify client Wi-Fi password preference', 'Confirm TV mounting height with client'],
  generalNotes: '',
  issues: ['Need extra HDMI 2.1 cable for 8K source'],
  nextVisit: ['Bring wall anchors'],
  vanRun: ['Extra Cat6 patch cords'],
  hdRun: ['Zip ties and wall plates'],
  
  wallTall: '',
  wallWide: '',
  tvTall: '',
  tvWide: '',
  tvBracket: '',
  soundbarModel: '',
  soundbarBracket: '',
  tvSbCombined: '',
  
  routerSt: '',
  routerMac: '',
  lan: ['Wattbox PDU'],
  wan: ['Modem'],
  
  switchSt: '',
  switchMac: '',
  switchPorts: Array(16).fill('').map((_, i) => i === 0 ? 'Input' : '-'),
  
  wattboxSt: '',
  wattboxMac: '',
  wattboxOutlets: Array(12).fill('-'),
  
  avrHdmiInputs: [
    { label: 'CBL/Sat', value: '' },
    { label: 'DVD', value: '' },
    { label: 'Blu-ray', value: '' },
    { label: 'Media Player', value: '' },
    { label: 'Game', value: '' },
    { label: '8K Input', value: '' }
  ],
  avrHdmiArc: '',
  avrHdmiMon: '',
  avrRcaInputs: [
    { label: 'CBL/Sat', value: '' },
    { label: 'DVD', value: '' },
    { label: 'Game', value: '' },
    { label: 'CD', value: '' }
  ],
  
  c4HdmiOut: 'Family room AVR',
  c4EthOut: 'Tv net (Family Room)',
  c4Ir1: '', c4Ir2: '', c4Ir3: '', c4Ir4: '',
  
  sonosZones: ['Living Room', 'Patio Speakers'],
  sonosDevices: [
    { model: 'Sonos Port', sn: '', pin: '' },
    { model: 'Sonos Amp', sn: '', pin: '' }
  ],
  
  creds: [
    { key: 'Modem Login', user: '', pass: '' },
    { key: 'Router Login', user: '', pass: '' },
    { key: 'Core Switch Login', user: '', pass: '' },
    { key: 'Wattbox Login', user: '', pass: '' },
    { key: 'Sonos Account', user: '', pass: '' },
    { key: 'eero Account', user: '', pass: '' },
    { key: 'Wi-Fi Network', user: '', pass: '' },
    { key: 'Control4 Account', user: '', pass: '' },
    { key: 'Apple ID', user: '', pass: '' }
  ],
  
  techArrival: '08:30',
  techDeparture: '16:30',
  inventoryUsed: ['1x SANUS VLT7-B2 TV Mount', '2x 6ft Ultra High Speed HDMI 2.1 Cables', '50ft Cat6 Plenum Cable (Blue)'],
  photos: [],
  emailCorrespondence: '',
  dailyLogSummary: ''
};

let appState = JSON.parse(JSON.stringify(defaultState));

// Available Sonos Product Models
const sonosModelOptions = [
  'Sonos Port',
  'Sonos Amp',
  'Sonos Arc',
  'Sonos Era 100',
  'Sonos Era 300',
  'Sonos Beam',
  'Sonos Sub',
  'Sonos Move',
  'Sonos Five',
  'Sonos Ray',
  'Other Sonos Product'
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  renderApp();
  setupEventListeners();
  setupModalBackdropHandlers();
});

function loadFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appState = Object.assign({}, defaultState, JSON.parse(saved));
      // Ensure Apple ID is present in creds list if loading older state
      if (appState.creds) {
        const hasAppleId = appState.creds.some(c => c.key === 'Apple ID');
        if (!hasAppleId) {
          appState.creds.push({ key: 'Apple ID', user: '', pass: '' });
        }
      }
      // Backward compatibility for old single Port/Amp schema
      if (!appState.sonosDevices) {
        appState.sonosDevices = [];
        if (appState.sonosPortSn || appState.sonosPortPin) {
          appState.sonosDevices.push({ model: 'Sonos Port', sn: appState.sonosPortSn || '', pin: appState.sonosPortPin || '' });
        }
        if (appState.sonosAmpSn || appState.sonosAmpPin) {
          appState.sonosDevices.push({ model: 'Sonos Amp', sn: appState.sonosAmpSn || '', pin: appState.sonosAmpPin || '' });
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    showSaveIndicator();
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      showToast('Storage quota reached! Clearing photo cache to save notes.');
      if (appState.photos.length > 0) {
        appState.photos = appState.photos.slice(-2);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        } catch (retryErr) {
          appState.photos = [];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        }
      }
    } else {
      console.error('Failed to save to localStorage', e);
    }
  }
}

function showSaveIndicator() {
  const badge = document.getElementById('save-status-text');
  if (badge) {
    badge.textContent = 'SAVED';
    setTimeout(() => { badge.textContent = 'AUTO-SAVED'; }, 1500);
  }
}

function renderApp() {
  // Bind top header fields
  setValue('client-name', appState.clientName);
  setValue('job-date', appState.jobDate);
  setValue('general-notes', appState.generalNotes);
  
  // Section 1: Lists
  renderDynamicList('list-questions', appState.questions);
  renderDynamicList('list-issues', appState.issues);
  renderDynamicList('list-next-visit', appState.nextVisit);
  renderDynamicList('list-van-run', appState.vanRun);
  renderDynamicList('list-hd-run', appState.hdRun);
  
  // Section 2: Mounting
  setValue('wall-tall', appState.wallTall);
  setValue('wall-wide', appState.wallWide);
  setValue('tv-tall', appState.tvTall);
  setValue('tv-wide', appState.tvWide);
  setValue('tv-bracket', appState.tvBracket);
  setValue('soundbar-model', appState.soundbarModel);
  setValue('soundbar-bracket', appState.soundbarBracket);
  setValue('tv-sb-combined', appState.tvSbCombined);
  
  setValue('router-st', appState.routerSt);
  setValue('router-mac', appState.routerMac);
  renderDynamicList('list-lan', appState.lan);
  renderDynamicList('list-wan', appState.wan);
  
  // Section 3: Rack
  setValue('switch-st', appState.switchSt);
  setValue('switch-mac', appState.switchMac);
  renderSwitchPorts();
  
  setValue('wattbox-st', appState.wattboxSt);
  setValue('wattbox-mac', appState.wattboxMac);
  renderWattboxOutlets();
  
  renderAvrLists();
  setValue('avr-hdmi-arc', appState.avrHdmiArc);
  setValue('avr-hdmi-mon', appState.avrHdmiMon);
  
  setValue('c4-hdmi-out', appState.c4HdmiOut);
  setValue('c4-eth-out', appState.c4EthOut);
  setValue('c4-ir-1', appState.c4Ir1);
  setValue('c4-ir-2', appState.c4Ir2);
  setValue('c4-ir-3', appState.c4Ir3);
  setValue('c4-ir-4', appState.c4Ir4);
  
  // Section 4: Sonos & Credentials
  renderDynamicList('list-sonos-zones', appState.sonosZones);
  renderSonosDevices();
  renderCredentialsVault();
  
  // Section 5: Daily Log & Photos
  setValue('tech-arrival', appState.techArrival);
  setValue('tech-departure', appState.techDeparture);
  renderDynamicList('list-inventory-used', appState.inventoryUsed);
  renderPhotoGallery();
  setValue('email-correspondence', appState.emailCorrespondence);
  setValue('daily-log-summary', appState.dailyLogSummary);
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function setupEventListeners() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', (e) => {
      syncInputToState(e.target.id, e.target.value);
    });
  });
}

function setupModalBackdropHandlers() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

function syncInputToState(id, val) {
  switch (id) {
    case 'client-name': appState.clientName = val; break;
    case 'job-date': appState.jobDate = val; break;
    case 'general-notes': appState.generalNotes = val; break;
    case 'wall-tall': appState.wallTall = val; break;
    case 'wall-wide': appState.wallWide = val; break;
    case 'tv-tall': appState.tvTall = val; break;
    case 'tv-wide': appState.tvWide = val; break;
    case 'tv-bracket': appState.tvBracket = val; break;
    case 'soundbar-model': appState.soundbarModel = val; break;
    case 'soundbar-bracket': appState.soundbarBracket = val; break;
    case 'tv-sb-combined': appState.tvSbCombined = val; break;
    case 'router-st': appState.routerSt = val; break;
    case 'router-mac': appState.routerMac = val; break;
    case 'switch-st': appState.switchSt = val; break;
    case 'switch-mac': appState.switchMac = val; break;
    case 'wattbox-st': appState.wattboxSt = val; break;
    case 'wattbox-mac': appState.wattboxMac = val; break;
    case 'avr-hdmi-arc': appState.avrHdmiArc = val; break;
    case 'avr-hdmi-mon': appState.avrHdmiMon = val; break;
    case 'c4-hdmi-out': appState.c4HdmiOut = val; break;
    case 'c4-eth-out': appState.c4EthOut = val; break;
    case 'c4-ir-1': appState.c4Ir1 = val; break;
    case 'c4-ir-2': appState.c4Ir2 = val; break;
    case 'c4-ir-3': appState.c4Ir3 = val; break;
    case 'c4-ir-4': appState.c4Ir4 = val; break;
    case 'tech-arrival': appState.techArrival = val; break;
    case 'tech-departure': appState.techDeparture = val; break;
    case 'email-correspondence': appState.emailCorrespondence = val; break;
    case 'daily-log-summary': appState.dailyLogSummary = val; break;
  }
  saveToLocalStorage();
}

// Dynamic Lists Renderer
function renderDynamicList(containerId, itemsArray) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  itemsArray.forEach((itemText, idx) => {
    const row = document.createElement('div');
    row.className = 'list-item-row';
    
    const isChecked = itemText.startsWith('[x] ');
    const cleanText = isChecked ? itemText.replace('[x] ', '') : itemText;
    
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.className = 'checkbox-custom';
    chk.checked = isChecked;
    chk.onchange = (e) => toggleDynamicCheck(containerId, idx, e.target.checked);
    
    const txt = document.createElement('input');
    txt.type = 'text';
    txt.value = cleanText;
    txt.oninput = (e) => updateDynamicItem(containerId, idx, e.target.value);
    
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon';
    delBtn.textContent = '✕';
    delBtn.onclick = () => removeDynamicItem(containerId, idx);
    
    row.appendChild(chk);
    row.appendChild(txt);
    row.appendChild(delBtn);
    container.appendChild(row);
  });
}

function addDynamicItem(containerId) {
  const arr = getArrayByContainerId(containerId);
  if (arr) {
    arr.push('');
    renderDynamicList(containerId, arr);
    saveToLocalStorage();
  }
}

function updateDynamicItem(containerId, idx, val) {
  const arr = getArrayByContainerId(containerId);
  if (arr && arr[idx] !== undefined) {
    const isChecked = arr[idx].startsWith('[x] ');
    arr[idx] = isChecked ? `[x] ${val}` : val;
    saveToLocalStorage();
  }
}

function toggleDynamicCheck(containerId, idx, checked) {
  const arr = getArrayByContainerId(containerId);
  if (arr && arr[idx] !== undefined) {
    const clean = arr[idx].replace('[x] ', '');
    arr[idx] = checked ? `[x] ${clean}` : clean;
    saveToLocalStorage();
  }
}

function removeDynamicItem(containerId, idx) {
  const arr = getArrayByContainerId(containerId);
  if (arr) {
    arr.splice(idx, 1);
    renderDynamicList(containerId, arr);
    saveToLocalStorage();
  }
}

function getArrayByContainerId(id) {
  switch (id) {
    case 'list-questions': return appState.questions;
    case 'list-issues': return appState.issues;
    case 'list-next-visit': return appState.nextVisit;
    case 'list-van-run': return appState.vanRun;
    case 'list-hd-run': return appState.hdRun;
    case 'list-lan': return appState.lan;
    case 'list-wan': return appState.wan;
    case 'list-sonos-zones': return appState.sonosZones;
    case 'list-inventory-used': return appState.inventoryUsed;
  }
  return null;
}

// Sonos Hardware Devices Manager
function renderSonosDevices() {
  const container = document.getElementById('sonos-devices-list');
  if (!container) return;
  container.innerHTML = '';
  
  if (!appState.sonosDevices || appState.sonosDevices.length === 0) {
    container.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">No Sonos products added yet. Tap "+ Add Sonos Product" below.</div>`;
    return;
  }

  appState.sonosDevices.forEach((dev, idx) => {
    const card = document.createElement('div');
    card.className = 'list-item-row';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '8px';
    card.style.padding = '12px';
    card.style.background = 'var(--surface-input)';
    card.style.borderRadius = 'var(--radius-md)';
    card.style.border = '1px solid var(--border-color)';
    
    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.justifyContent = 'space-between';
    topRow.style.alignItems = 'center';
    
    const select = document.createElement('select');
    select.style.fontSize = '0.85rem';
    select.style.fontWeight = '700';
    select.style.color = 'var(--accent-green)';
    select.style.width = 'calc(100% - 44px)';
    
    sonosModelOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (dev.model === opt) option.selected = true;
      select.appendChild(option);
    });
    
    select.onchange = (e) => {
      appState.sonosDevices[idx].model = e.target.value;
      saveToLocalStorage();
    };
    
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon';
    delBtn.textContent = '✕';
    delBtn.onclick = () => removeSonosDevice(idx);
    
    topRow.appendChild(select);
    topRow.appendChild(delBtn);
    
    const inputsRow = document.createElement('div');
    inputsRow.className = 'grid-2';
    
    const snInput = document.createElement('input');
    snInput.type = 'text';
    snInput.className = 'mono-input';
    snInput.value = dev.sn || '';
    snInput.placeholder = 'Serial Number (S/N)';
    snInput.oninput = (e) => {
      appState.sonosDevices[idx].sn = e.target.value;
      saveToLocalStorage();
    };
    
    const pinInput = document.createElement('input');
    pinInput.type = 'text';
    pinInput.className = 'mono-input';
    pinInput.value = dev.pin || '';
    pinInput.placeholder = 'PIN Code';
    pinInput.oninput = (e) => {
      appState.sonosDevices[idx].pin = e.target.value;
      saveToLocalStorage();
    };
    
    inputsRow.appendChild(snInput);
    inputsRow.appendChild(pinInput);
    
    card.appendChild(topRow);
    card.appendChild(inputsRow);
    container.appendChild(card);
  });
}

function addSonosDevice() {
  if (!appState.sonosDevices) appState.sonosDevices = [];
  appState.sonosDevices.push({ model: 'Sonos Port', sn: '', pin: '' });
  renderSonosDevices();
  saveToLocalStorage();
}

function removeSonosDevice(idx) {
  if (appState.sonosDevices && appState.sonosDevices[idx] !== undefined) {
    appState.sonosDevices.splice(idx, 1);
    renderSonosDevices();
    saveToLocalStorage();
  }
}

// Credentials Vault (Dynamic with Apple ID & Custom Credentials Support)
function renderCredentialsVault() {
  const container = document.getElementById('creds-list');
  if (!container) return;
  container.innerHTML = '';
  
  if (!appState.creds) appState.creds = [];
  
  appState.creds.forEach((cred, idx) => {
    const card = document.createElement('div');
    card.className = 'section-card';
    card.style.margin = '0 0 10px 0';
    card.style.padding = '12px';
    
    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.justifyContent = 'space-between';
    topRow.style.alignItems = 'center';
    topRow.style.marginBottom = '8px';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = cred.key || 'Custom Login';
    titleInput.style.fontSize = '0.85rem';
    titleInput.style.fontWeight = '700';
    titleInput.style.color = 'var(--primary)';
    titleInput.style.background = 'transparent';
    titleInput.style.border = 'none';
    titleInput.style.padding = '0';
    titleInput.oninput = (e) => {
      appState.creds[idx].key = e.target.value;
      saveToLocalStorage();
    };
    
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon';
    delBtn.style.width = '30px';
    delBtn.style.height = '30px';
    delBtn.style.minHeight = '30px';
    delBtn.textContent = '✕';
    delBtn.onclick = () => removeCredential(idx);
    
    topRow.appendChild(titleInput);
    topRow.appendChild(delBtn);
    
    const grid = document.createElement('div');
    grid.className = 'grid-2';
    
    const userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.value = cred.user || '';
    userInput.placeholder = 'Username / Email';
    userInput.oninput = (e) => {
      appState.creds[idx].user = e.target.value;
      saveToLocalStorage();
    };
    
    const passWrap = document.createElement('div');
    passWrap.className = 'password-wrap';
    
    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.id = `cred-pwd-${idx}`;
    passInput.value = cred.pass || '';
    passInput.placeholder = 'Password';
    passInput.oninput = (e) => {
      appState.creds[idx].pass = e.target.value;
      saveToLocalStorage();
    };
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-pwd-btn';
    toggleBtn.textContent = '👁';
    toggleBtn.onclick = () => togglePasswordVisibility(`cred-pwd-${idx}`);
    
    passWrap.appendChild(passInput);
    passWrap.appendChild(toggleBtn);
    
    grid.appendChild(userInput);
    grid.appendChild(passWrap);
    
    card.appendChild(topRow);
    card.appendChild(grid);
    container.appendChild(card);
  });
}

function addCustomCredential() {
  if (!appState.creds) appState.creds = [];
  appState.creds.push({ key: 'Custom Account / Login', user: '', pass: '' });
  renderCredentialsVault();
  saveToLocalStorage();
  showToast('Added new custom credential card!');
}

function removeCredential(idx) {
  if (appState.creds && appState.creds[idx] !== undefined) {
    appState.creds.splice(idx, 1);
    renderCredentialsVault();
    saveToLocalStorage();
  }
}

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

// Core Switch Ports
function renderSwitchPorts() {
  const grid = document.getElementById('switch-ports-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  appState.switchPorts.forEach((val, idx) => {
    const card = document.createElement('div');
    card.className = 'port-card';
    
    const header = document.createElement('div');
    header.className = 'port-card-header';
    header.innerHTML = `<span class="port-num">PORT ${idx + 1}</span>`;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = val || '';
    input.placeholder = '-';
    input.oninput = (e) => updateSwitchPort(idx, e.target.value);
    
    card.appendChild(header);
    card.appendChild(input);
    grid.appendChild(card);
  });
}

function updateSwitchPort(idx, val) {
  appState.switchPorts[idx] = val;
  saveToLocalStorage();
}

// Wattbox Outlets
function renderWattboxOutlets() {
  const grid = document.getElementById('wattbox-outlets-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  appState.wattboxOutlets.forEach((val, idx) => {
    const card = document.createElement('div');
    card.className = 'port-card';
    
    const header = document.createElement('div');
    header.className = 'port-card-header';
    header.innerHTML = `<span class="port-num" style="color:var(--secondary); background:rgba(255,176,0,0.1);">OUTLET ${idx + 1}</span>`;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = val || '';
    input.placeholder = '-';
    input.oninput = (e) => updateWattboxOutlet(idx, e.target.value);
    
    card.appendChild(header);
    card.appendChild(input);
    grid.appendChild(card);
  });
}

function updateWattboxOutlet(idx, val) {
  appState.wattboxOutlets[idx] = val;
  saveToLocalStorage();
}

// AVR HDMI & RCA Inputs
function renderAvrLists() {
  const hdmiList = document.getElementById('avr-hdmi-list');
  if (hdmiList) {
    hdmiList.innerHTML = '';
    appState.avrHdmiInputs.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'grid-2';
      div.style.alignItems = 'center';
      
      const label = document.createElement('span');
      label.style.fontSize = '0.8rem';
      label.style.fontWeight = '600';
      label.style.color = 'var(--text-muted)';
      label.textContent = `${idx + 1}. ${item.label}`;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = item.value || '';
      input.placeholder = 'Device Source';
      input.oninput = (e) => {
        appState.avrHdmiInputs[idx].value = e.target.value;
        saveToLocalStorage();
      };
      
      div.appendChild(label);
      div.appendChild(input);
      hdmiList.appendChild(div);
    });
  }

  const rcaList = document.getElementById('avr-rca-list');
  if (rcaList) {
    rcaList.innerHTML = '';
    appState.avrRcaInputs.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'grid-2';
      div.style.alignItems = 'center';
      
      const label = document.createElement('span');
      label.style.fontSize = '0.8rem';
      label.style.fontWeight = '600';
      label.style.color = 'var(--text-muted)';
      label.textContent = `${idx + 1}. ${item.label}`;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = item.value || '';
      input.placeholder = 'Device Source';
      input.oninput = (e) => {
        appState.avrRcaInputs[idx].value = e.target.value;
        saveToLocalStorage();
      };
      
      div.appendChild(label);
      div.appendChild(input);
      rcaList.appendChild(div);
    });
  }
}

// Photo Attachment Handler
function handlePhotoUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      compressImage(evt.target.result, 600, 0.7, (compressedDataUrl) => {
        appState.photos.push(compressedDataUrl);
        renderPhotoGallery();
        saveToLocalStorage();
      });
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
}

function compressImage(src, maxWidth, quality, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    callback(dataUrl);
  };
  img.src = src;
}

function renderPhotoGallery() {
  const gal = document.getElementById('photo-gallery');
  if (!gal) return;
  gal.innerHTML = '';
  
  appState.photos.forEach((src, idx) => {
    const div = document.createElement('div');
    div.className = 'photo-thumb';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Site Photo ${idx + 1}`;
    
    const delBtn = document.createElement('button');
    delBtn.className = 'del-photo';
    delBtn.textContent = '✕';
    delBtn.onclick = () => deletePhoto(idx);
    
    div.appendChild(img);
    div.appendChild(delBtn);
    gal.appendChild(div);
  });
}

function deletePhoto(idx) {
  appState.photos.splice(idx, 1);
  renderPhotoGallery();
  saveToLocalStorage();
}

// Dedicated Daily Log Generator
function generateDailyLogMarkdown() {
  const dateStr = appState.jobDate || new Date().toISOString().split('T')[0];
  const clientStr = appState.clientName || '[Client Name]';
  const arrival = appState.techArrival || 'N/A';
  const departure = appState.techDeparture || 'N/A';
  
  let md = `# Daily Log - ${clientStr}\n\n`;
  md += `**Date:** ${dateStr}  \n`;
  md += `**Company:** Davis Audio  \n`;
  md += `**Technician:** Beau Bremer  \n`;
  md += `**On-Site Hours:** ${arrival} - ${departure}  \n\n`;
  md += `---\n\n`;
  
  md += `## 1. Summary of Work Completed Today\n`;
  if (appState.dailyLogSummary) {
    md += `${appState.dailyLogSummary}\n\n`;
  } else {
    md += `* Site installation work conducted per layout specs.\n\n`;
  }
  
  md += `## 2. Inventory Used for Van Today\n`;
  if (appState.inventoryUsed.length === 0) {
    md += `* None recorded\n`;
  } else {
    appState.inventoryUsed.forEach(item => {
      const isChecked = item.startsWith('[x] ');
      const clean = item.replace('[x] ', '');
      md += `* ${clean}\n`;
    });
  }
  
  md += `\n## 3. Outstanding Action Items & Next Visit Prep\n`;
  md += `* **Bring On Next Visit:**\n`;
  if (appState.nextVisit.length === 0) md += `  * None\n`;
  else appState.nextVisit.forEach(item => { md += `  * ${item.replace('[x] ', '')}\n`; });
  
  md += `* **Van Run:**\n`;
  if (appState.vanRun.length === 0) md += `  * None\n`;
  else appState.vanRun.forEach(item => { md += `  * ${item.replace('[x] ', '')}\n`; });
  
  md += `* **Home Depot Run:**\n`;
  if (appState.hdRun.length === 0) md += `  * None\n`;
  else appState.hdRun.forEach(item => { md += `  * ${item.replace('[x] ', '')}\n`; });
  
  md += `\n## 4. Active Site Issues\n`;
  if (appState.issues.length === 0) md += `* None\n`;
  else appState.issues.forEach(iss => { md += `* ${iss.replace('[x] ', '')}\n`; });
  
  md += `\n---\n*Logged via Davis Audio Field Assistant*\n`;
  return md;
}

// Markdown Export Generator
function generateObsidianMarkdown() {
  const dateStr = appState.jobDate || '2024-00-00';
  const clientStr = appState.clientName || '[Client Name]';
  
  let md = `# Davis Audio - General AV Site Notes & Installation Checklist\n\n`;
  md += `**Date:** ${dateStr}  \n`;
  md += `**Company:** Davis Audio  \n`;
  md += `**Client Name:** ${clientStr}  \n\n`;
  md += `---\n\n`;
  
  // Section 1
  md += `## 1. General Site Notes\n\n`;
  md += `### Client Questions\n`;
  if (appState.questions.length === 0) md += `* [ ] \n`;
  else appState.questions.forEach(q => {
    const isChecked = q.startsWith('[x] ');
    const text = q.replace('[x] ', '');
    md += `* [${isChecked ? 'x' : ' '}] ${text}\n`;
  });
  
  md += `\n### Job Notes\n`;
  if (appState.generalNotes) {
    appState.generalNotes.split('\n').forEach((line, i) => {
      md += `${i + 1}. ${line}\n`;
    });
  } else {
    md += `1. \n2. \n`;
  }
  
  md += `\n### Active Issues\n`;
  if (appState.issues.length === 0) md += `* [ ] \n`;
  else appState.issues.forEach(iss => {
    const isChecked = iss.startsWith('[x] ');
    const text = iss.replace('[x] ', '');
    md += `* [${isChecked ? 'x' : ' '}] ${text}\n`;
  });
  
  md += `\n### Action Items & Logistics\n`;
  md += `* **Bring On Next Visit:**\n`;
  appState.nextVisit.forEach(item => {
    const isChecked = item.startsWith('[x] ');
    md += `  * [${isChecked ? 'x' : ' '}] ${item.replace('[x] ', '')}\n`;
  });
  md += `* **Van Run:**\n`;
  appState.vanRun.forEach(item => {
    const isChecked = item.startsWith('[x] ');
    md += `  * [${isChecked ? 'x' : ' '}] ${item.replace('[x] ', '')}\n`;
  });
  md += `* **Home Depot Run:**\n`;
  appState.hdRun.forEach(item => {
    const isChecked = item.startsWith('[x] ');
    md += `  * [${isChecked ? 'x' : ' '}] ${item.replace('[x] ', '')}\n`;
  });
  
  md += `\n---\n\n`;
  
  // Section 2
  md += `## 2. Mounting Specs & Housing Dimensions\n\n`;
  md += `### TV & Soundbar Mounting Measurements\n\n`;
  md += `| Parameter | Wall | TV / Device |\n`;
  md += `| :--- | :--- | :--- |\n`;
  md += `| **Height (Center)** | ${appState.wallTall || 'center='} | ${appState.tvTall || 'center='} |\n`;
  md += `| **Width (Center)** | ${appState.wallWide || 'center='} | ${appState.tvWide || 'center='} |\n`;
  md += `| **TV Mount / Bracket** | N/A | ${appState.tvBracket || ''} |\n`;
  md += `| **Soundbar Model** | N/A | ${appState.soundbarModel || ''} |\n`;
  md += `| **Soundbar Bracket** | N/A | ${appState.soundbarBracket || ''} |\n`;
  md += `| **Combined TV + Soundbar Height** | N/A | ${appState.tvSbCombined || ''} |\n\n`;
  
  md += `### Network & Gateway Setup\n`;
  md += `* **Router Service Tag (ST):** ${appState.routerSt || ''}\n`;
  md += `* **Router MAC Address:** ${appState.routerMac || ''}\n\n`;
  
  md += `#### LAN Connections\n`;
  appState.lan.forEach((item, i) => { md += `${i + 1}. ${item}\n`; });
  md += `\n#### WAN Connections\n`;
  appState.wan.forEach((item, i) => { md += `${i + 1}. ${item}\n`; });
  
  md += `\n---\n\n`;
  
  // Section 3
  md += `## 3. Core Rack & Equipment Wiring\n\n`;
  md += `### Core Switch\n`;
  md += `* **Service Tag (ST):** ${appState.switchSt || ''}\n`;
  md += `* **MAC Address:** ${appState.switchMac || ''}\n\n`;
  md += `| Port # | Connected Device / Function |\n`;
  md += `| :---: | :--- |\n`;
  appState.switchPorts.forEach((p, i) => {
    md += `| ${i + 1} | ${p || '-'} |\n`;
  });
  md += `\n*(Mark unassigned ports as \`-\`)*\n\n`;
  
  md += `### Wattbox Power Distribution Unit (PDU)\n`;
  md += `* **Service Tag (ST):** ${appState.wattboxSt || ''}\n`;
  md += `* **MAC Address:** ${appState.wattboxMac || ''}\n\n`;
  md += `| Outlet # | Powered Device |\n`;
  md += `| :---: | :--- |\n`;
  appState.wattboxOutlets.forEach((o, i) => {
    md += `| ${i + 1} | ${o || '-'} |\n`;
  });
  md += `\n*(Mark unassigned outlets as \`-\`)*\n\n`;
  
  md += `### AVR Wiring Matrix\n\n`;
  md += `#### HDMI Inputs\n`;
  md += `| Input # | Label | Connected Source |\n`;
  md += `| :---: | :--- | :--- |\n`;
  appState.avrHdmiInputs.forEach((item, i) => {
    md += `| ${i + 1} | ${item.label} | ${item.value || ''} |\n`;
  });
  
  md += `\n#### HDMI Outputs\n`;
  md += `1. **ARC / eARC Output:** ${appState.avrHdmiArc || ''}\n`;
  md += `2. **Monitor Output:** ${appState.avrHdmiMon || ''}\n\n`;
  
  md += `#### RCA Audio Inputs\n`;
  md += `| Input # | Label | Connected Source |\n`;
  md += `| :---: | :--- | :--- |\n`;
  appState.avrRcaInputs.forEach((item, i) => {
    md += `| ${i + 1} | ${item.label} | ${item.value || ''} |\n`;
  });
  
  md += `\n### Control4 Controller (C4-CORE1)\n`;
  md += `* **HDMI Output:** ${appState.c4HdmiOut || ''}\n`;
  md += `* **Ethernet Output:** ${appState.c4EthOut || ''}\n\n`;
  md += `#### IR Outputs\n`;
  md += `1. ${appState.c4Ir1 || ''}\n`;
  md += `2. ${appState.c4Ir2 || ''}\n`;
  md += `3. ${appState.c4Ir3 || ''}\n`;
  md += `4. ${appState.c4Ir4 || ''}\n`;
  
  md += `\n---\n\n`;
  
  // Section 4
  md += `## 4. Audio Zones & Credentials\n\n`;
  md += `### Sonos System\n`;
  md += `* [x] **Sonos Zones Configured:** ${appState.sonosZones.join(', ') || 'None'}\n\n`;
  md += `#### Hardware & Devices List (${appState.sonosDevices ? appState.sonosDevices.length : 0} Devices)\n`;
  
  if (appState.sonosDevices && appState.sonosDevices.length > 0) {
    appState.sonosDevices.forEach((dev, idx) => {
      md += `* **Device ${idx + 1}: ${dev.model}**\n`;
      md += `  * **Serial Number (S/N):** ${dev.sn || ''}\n`;
      md += `  * **PIN:** ${dev.pin || ''}\n`;
    });
  } else {
    md += `* None recorded\n`;
  }
  
  md += `\n### Device & Service Credentials Vault\n\n`;
  md += `| System / Device | Username / Email | Password |\n`;
  md += `| :--- | :--- | :--- |\n`;
  if (appState.creds && appState.creds.length > 0) {
    appState.creds.forEach(c => {
      md += `| **${c.key}** | ${c.user || ''} | ${c.pass || ''} |\n`;
    });
  } else {
    md += `| None | | |\n`;
  }
  
  md += `\n---\n\n`;
  
  // Section 5
  md += `## 5. Site Documentation & Daily Log\n\n`;
  md += `### Tech Hours & Van Inventory\n`;
  md += `* **On-Site Time:** ${appState.techArrival || 'N/A'} - ${appState.techDeparture || 'N/A'}\n`;
  md += `* **Inventory Used for Van:** ${appState.inventoryUsed.join(', ') || 'None'}\n\n`;
  md += `### Documentation & Files\n`;
  md += `* **Site Photos Attached:** ${appState.photos.length} Photo(s)\n`;
  md += `* **Email Correspondence Summary:**\n${appState.emailCorrespondence || 'None'}\n\n`;
  
  md += `### Daily Log Entry\n`;
  md += `* **Date:** ${dateStr}\n`;
  md += `* **Summary of Work Completed:**\n${appState.dailyLogSummary || 'Installation completed per specs.'}\n`;
  
  return md;
}

// Modal Handlers
function openMarkdownModal() {
  const modal = document.getElementById('md-modal');
  const txt = document.getElementById('markdown-output');
  if (modal && txt) {
    txt.value = generateObsidianMarkdown();
    modal.classList.add('active');
  }
}

function closeMarkdownModal() {
  const modal = document.getElementById('md-modal');
  if (modal) modal.classList.remove('active');
}

function openDailyLogModal() {
  const modal = document.getElementById('daily-log-modal');
  const txt = document.getElementById('daily-log-output');
  if (modal && txt) {
    txt.value = generateDailyLogMarkdown();
    modal.classList.add('active');
  }
}

function closeDailyLogModal() {
  const modal = document.getElementById('daily-log-modal');
  if (modal) modal.classList.remove('active');
}

function copyMarkdownToClipboard() {
  const txt = document.getElementById('markdown-output');
  if (txt) {
    navigator.clipboard.writeText(txt.value).then(() => {
      showToast('Full Spec Markdown copied!');
    }).catch(err => {
      txt.select();
      document.execCommand('copy');
      showToast('Full Spec Markdown copied!');
    });
  }
}

function copyDailyLogToClipboard() {
  const txt = document.getElementById('daily-log-output');
  if (txt) {
    navigator.clipboard.writeText(txt.value).then(() => {
      showToast('Daily Log copied to clipboard!');
    }).catch(err => {
      txt.select();
      document.execCommand('copy');
      showToast('Daily Log copied to clipboard!');
    });
  }
}

function downloadMarkdownFile() {
  const md = generateObsidianMarkdown();
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Davis_AV_Notes_${appState.clientName.replace(/[^a-zA-Z0-9]/g, '_') || 'Site'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded Full Spec Markdown file!');
}

function downloadDailyLogFile() {
  const md = generateDailyLogMarkdown();
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateTag = appState.jobDate || new Date().toISOString().split('T')[0];
  a.download = `Daily_Log_${dateTag}_${appState.clientName.replace(/[^a-zA-Z0-9]/g, '_') || 'Site'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded Daily Log file!');
}

function scrollToSection(id, btnEl) {
  const sec = document.getElementById(id);
  if (sec) {
    sec.scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="var(--primary)" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

function loadSampleData() {
  appState = JSON.parse(JSON.stringify(defaultState));
  appState.clientName = 'Smith Residence';
  appState.wallTall = '64.5 in';
  appState.wallWide = '84.0 in';
  appState.tvTall = '38.2 in';
  appState.tvWide = '67.1 in';
  appState.tvBracket = 'SANUS VLT7-B2';
  appState.soundbarModel = 'Sonos Arc';
  appState.soundbarBracket = 'SANUS Soundbar Mount';
  appState.tvSbCombined = '44.8 in';
  appState.routerSt = 'RT-9984X';
  appState.routerMac = 'D4:20:B0:11:22:33';
  appState.switchSt = 'SW-16P-01';
  appState.switchMac = 'EC:F4:51:77:88:99';
  appState.switchPorts[0] = 'Input (Router)';
  appState.switchPorts[1] = 'Wattbox PDU';
  appState.switchPorts[2] = 'Control4 CORE1';
  appState.switchPorts[3] = 'Sonos Port';
  appState.switchPorts[4] = 'Sonos Amp';
  appState.wattboxSt = 'WB-700-12';
  appState.wattboxMac = 'AC:12:34:56:78:90';
  appState.wattboxOutlets[0] = 'Modem';
  appState.wattboxOutlets[1] = 'Router';
  appState.wattboxOutlets[2] = 'Core Switch';
  appState.wattboxOutlets[3] = 'AVR Receiver';
  appState.wattboxOutlets[4] = 'Sonos Amp';
  appState.techArrival = '08:00';
  appState.techDeparture = '16:30';
  appState.inventoryUsed = ['1x SANUS VLT7-B2 TV Mount', '2x 6ft Ultra High Speed HDMI 2.1 Cables', '50ft Cat6 Plenum Cable'];
  appState.dailyLogSummary = 'Completed main TV mounting and soundbar bracket installation. Wired Core Switch and Wattbox PDU. Tested Sonos zones.';
  appState.sonosDevices = [
    { model: 'Sonos Arc', sn: 'AR-2024-991', pin: '8841' },
    { model: 'Sonos Port', sn: 'PT-1002-441', pin: '1092' },
    { model: 'Sonos Amp', sn: 'AM-9081-332', pin: '5521' },
    { model: 'Sonos Era 300', sn: 'ER-3001-112', pin: '7730' },
    { model: 'Sonos Sub', sn: 'SB-8002-554', pin: '4410' }
  ];
  appState.creds = [
    { key: 'Modem Login', user: 'admin', pass: 'admin123' },
    { key: 'Router Login', user: 'admin', pass: 'DavisAudio2024!' },
    { key: 'Core Switch Login', user: 'admin', pass: 'SwitchPass99' },
    { key: 'Wattbox Login', user: 'tech@davisaudio.com', pass: 'WattboxSecure' },
    { key: 'Sonos Account', user: 'client@smithresidence.com', pass: 'SonosPass123' },
    { key: 'eero Account', user: 'client@smithresidence.com', pass: 'EeroWifi2024' },
    { key: 'Wi-Fi Network', user: 'SmithHouse_5G', pass: 'SmithFamilyWifi!' },
    { key: 'Control4 Account', user: 'client@smithresidence.com', pass: 'C4Passphrase' },
    { key: 'Apple ID', user: 'smithfamily@icloud.com', pass: 'AppleTVPass!' },
    { key: 'Lutron System', user: 'tech@davisaudio.com', pass: 'LutronHome1' }
  ];
  renderApp();
  saveToLocalStorage();
  showToast('Loaded sample job data!');
}

function clearFormConfirm() {
  if (confirm('Clear all form fields and start a new site note?')) {
    appState = JSON.parse(JSON.stringify(defaultState));
    appState.clientName = '';
    appState.questions = [];
    appState.generalNotes = '';
    appState.issues = [];
    appState.nextVisit = [];
    appState.vanRun = [];
    appState.hdRun = [];
    appState.inventoryUsed = [];
    appState.sonosDevices = [];
    appState.creds = [];
    appState.switchPorts = Array(16).fill('-');
    appState.wattboxOutlets = Array(12).fill('-');
    renderApp();
    saveToLocalStorage();
    showToast('Form cleared for new job.');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
