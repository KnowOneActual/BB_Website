async function init() {
  // Browser Info
  const uaEl = document.getElementById('ua');
  const resEl = document.getElementById('res');
  const platformEl = document.getElementById('platform');
  const coresEl = document.getElementById('cores');
  const localTimeEl = document.getElementById('localtime');

  if (uaEl) uaEl.textContent = navigator.userAgent;
  if (resEl) resEl.textContent = `${window.screen.width} x ${window.screen.height}`;
  if (platformEl) platformEl.textContent = navigator.platform;
  if (coresEl) coresEl.textContent = navigator.hardwareConcurrency || 'N/A';

  const updateTime = () => {
    if (localTimeEl) localTimeEl.textContent = new Date().toLocaleTimeString();
  };
  updateTime();
  setInterval(updateTime, 1000);

  // IP Info
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    if (data.ip) {
      const ipEl = document.getElementById('ip');
      const ispEl = document.getElementById('isp');
      const asnEl = document.getElementById('asn');
      const networkEl = document.getElementById('network');
      const versionEl = document.getElementById('version');
      const locationEl = document.getElementById('location');
      const timezoneEl = document.getElementById('timezone');
      const currencyEl = document.getElementById('currency');
      const callingEl = document.getElementById('calling');

      if (ipEl) ipEl.textContent = data.ip;
      if (ispEl) ispEl.textContent = data.org || '-';
      if (asnEl) asnEl.textContent = data.asn || '-';
      if (networkEl) networkEl.textContent = data.network || '-';
      if (versionEl) versionEl.textContent = data.version || '-';

      if (locationEl) locationEl.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
      if (timezoneEl) timezoneEl.textContent = `${data.timezone} (UTC ${data.utc_offset})`;
      if (currencyEl) currencyEl.textContent = `${data.currency_name} (${data.currency})`;
      if (callingEl) callingEl.textContent = `+${data.country_calling_code}`;

      // Map Initialization
      if (data.latitude && data.longitude) {
        const mapContainer = document.getElementById('location-map');
        if (mapContainer) {
          const map = L.map('location-map').setView([data.latitude, data.longitude], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);
          L.marker([data.latitude, data.longitude]).addTo(map);
        }
      }
    } else {
      throw new Error('IP information not available');
    }
  } catch (e) {
    console.error('Error fetching IP info:', e);
    const ipEl = document.getElementById('ip');
    const mapEl = document.getElementById('location-map');
    if (ipEl) ipEl.textContent = 'Error loading data';
    if (mapEl)
      mapEl.innerHTML = '<div class="h-full flex items-center justify-center text-gray-500">Map unavailable.</div>';
  }
}
window.addEventListener('load', init);
