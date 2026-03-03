async function fetchWeatherGreeting() {
  const greetingEl = document.getElementById('weather-greeting');
  if (!greetingEl) return;

  try {
    const response = await fetch('/.netlify/functions/weather');
    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();
    if (data.greeting) {
      // Extract the temperature to provide Fahrenheit for US users if desired
      // Our function returns "Greeting • Temp°C"
      const [greeting, tempCStr] = data.greeting.split(' • ');
      const tempC = parseInt(tempCStr);
      const tempF = Math.round((tempC * 9) / 5 + 32);

      greetingEl.textContent = `${greeting} • ${tempC}°C (${tempF}°F)`;
      greetingEl.classList.add('fade-in', 'appear');
    }
  } catch (error) {
    console.error('Weather greeting error:', error);
    // Silent fail - don't show an error message on the hero
  }
}

document.addEventListener('DOMContentLoaded', fetchWeatherGreeting);
