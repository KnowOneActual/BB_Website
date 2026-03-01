async function fetchIP() {
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');
  if (!loading || !content) return;

  loading.classList.remove('hidden');
  content.classList.add('hidden');

  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    if (data.ip) {
      const ipEl = document.getElementById('ip');
      const locationEl = document.getElementById('location');
      const ispEl = document.getElementById('isp');
      const timezoneEl = document.getElementById('timezone');
      const networkEl = document.getElementById('network');

      if (ipEl) ipEl.textContent = data.ip;
      if (locationEl) locationEl.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
      if (ispEl) ispEl.textContent = `${data.org} (${data.asn || 'N/A'})`;
      if (timezoneEl) timezoneEl.textContent = `${data.timezone}`;
      if (networkEl) networkEl.textContent = data.network || 'N/A';

      loading.classList.add('hidden');
      content.classList.remove('hidden');
    } else {
      throw new Error('IP lookup failed');
    }
  } catch (error) {
    console.error('Error:', error);
    loading.innerHTML =
      '<p class="text-red-400">Failed to load IP information. Please check your connection or try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refresh');
  if (refreshBtn) refreshBtn.addEventListener('click', fetchIP);
  fetchIP();
});
