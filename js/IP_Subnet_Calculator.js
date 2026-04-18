// IP Subnet Logic
function calculateSubnet() {
  const ipEl = document.getElementById('ipAddress');
  const cidrEl = document.getElementById('cidr');
  if (!ipEl || !cidrEl) return;

  const ip = ipEl.value.trim();
  const cidr = parseInt(cidrEl.value);

  if (!validateIP(ip) || isNaN(cidr) || cidr < 0 || cidr > 32) {
    return;
  }

  const ipBinary = ipToBinary(ip);
  const maskBinary = '1'.repeat(cidr) + '0'.repeat(32 - cidr);
  const networkBinary = binaryAnd(ipBinary, maskBinary);
  const broadcastBinary = binaryOr(networkBinary, binaryNot(maskBinary));

  const networkAddress = binaryToIp(networkBinary);
  const broadcastAddress = binaryToIp(broadcastBinary);
  const totalHosts = Math.pow(2, 32 - cidr);

  const networkAddrEl = document.getElementById('networkAddress');
  const broadcastAddrEl = document.getElementById('broadcastAddress');
  const totalHostsEl = document.getElementById('totalHosts');
  const hostRangeEl = document.getElementById('hostRange');

  if (networkAddrEl) networkAddrEl.textContent = networkAddress;
  if (broadcastAddrEl) broadcastAddrEl.textContent = broadcastAddress;
  if (totalHostsEl) totalHostsEl.textContent = totalHosts.toLocaleString();

  if (hostRangeEl) {
    if (cidr < 31) {
      const firstUsable = binaryToIp(incrementBinary(networkBinary));
      const lastUsable = binaryToIp(decrementBinary(broadcastBinary));
      hostRangeEl.textContent = `${firstUsable} - ${lastUsable}`;
    } else {
      hostRangeEl.textContent = 'N/A';
    }
  }
}

// Helper functions
function validateIP(ip) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip,
  );
}
function ipToBinary(ip) {
  return ip
    .split('.')
    .map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
    .join('');
}
function binaryToIp(bin) {
  return bin
    .match(/.{8}/g)
    .map((byte) => parseInt(byte, 2))
    .join('.');
}
function binaryAnd(b1, b2) {
  return b1
    .split('')
    .map((bit, i) =>
      bit === '1' && b2[i] === '1' ? '1' : '0',
    )
    .join('');
}
function binaryOr(b1, b2) {
  return b1
    .split('')
    .map((bit, i) =>
      bit === '1' || b2[i] === '1' ? '1' : '0',
    )
    .join('');
}
function binaryNot(bin) {
  return bin
    .split('')
    .map((bit) => (bit === '1' ? '0' : '1'))
    .join('');
}
function incrementBinary(bin) {
  const num = BigInt('0b' + bin) + 1n;
  return num.toString(2).padStart(32, '0');
}
function decrementBinary(bin) {
  const num = BigInt('0b' + bin) - 1n;
  return num.toString(2).padStart(32, '0');
}

// Device Planner Logic
const devices = [];
const addBtn = document.getElementById('addDevice');
if (addBtn) {
  addBtn.addEventListener('click', () => {
    const nameEl = document.getElementById('deviceName');
    const countEl = document.getElementById('deviceCount');
    if (!nameEl || !countEl) return;

    const name = nameEl.value.trim();
    const count = parseInt(countEl.value);
    if (name && count > 0) {
      devices.push({ name, count });
      updateDeviceList();
      nameEl.value = '';
      countEl.value = '1';
    }
  });
}

function updateDeviceList() {
  const list = document.getElementById('deviceList');
  if (!list) return;
  list.textContent = '';

  devices.forEach((device) => {
    const item = document.createElement('div');
    item.className = 'p-4 bg-gray-800 rounded-xl border border-gray-700 flex justify-between items-center';

    const info = document.createElement('div');
    const nameEl = document.createElement('p');
    nameEl.className = 'font-bold text-white';
    nameEl.textContent = device.name;

    const countEl = document.createElement('p');
    countEl.className = 'text-sm text-gray-400';
    countEl.textContent = `Qty: ${device.count}`;

    info.appendChild(nameEl);
    info.appendChild(countEl);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'text-gray-500 hover:text-red-400 transition';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'w-5 h-5');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('viewBox', '0 0 24 24');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    );

    svg.appendChild(path);
    removeBtn.appendChild(svg);
    removeBtn.onclick = () => removeDevice(device.name);

    item.appendChild(info);
    item.appendChild(removeBtn);
    list.appendChild(item);
  });
}

function removeDevice(name) {
  const index = devices.findIndex((d) => d.name === name);
  if (index > -1) devices.splice(index, 1);
  updateDeviceList();
}

document.addEventListener('DOMContentLoaded', () => {
  const ipAddrInput = document.getElementById('ipAddress');
  const cidrInput = document.getElementById('cidr');

  if (ipAddrInput) ipAddrInput.addEventListener('input', calculateSubnet);
  if (cidrInput) cidrInput.addEventListener('input', calculateSubnet);

  calculateSubnet();
});
