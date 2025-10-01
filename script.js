// TOP /script.js
// Theme toggle functionality
function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

// Function to toggle between light and dark themes
function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

// Event listener for the theme toggler button
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  const themeToggler = document.getElementById('theme-toggler');
  if (themeToggler) {
    themeToggler.addEventListener('click', toggleTheme);
  }
});

// Weather widget functionality
async function fetchAndDisplayWeather() {
  const weatherWidget = document.getElementById('weather-widget');
  if (!weatherWidget) return;

  try {
    const response = await fetch('/.netlify/functions/weather');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}.png`;
    weatherWidget.innerHTML = `
      Currently in Chicago: ${data.temp}°F and ${data.description}
      <img src="${iconUrl}" alt="${data.description}" style="display:inline-block; vertical-align:middle; width:30px; height:30px;">
    `;
  } catch (error) {
    console.error('Error fetching weather:', error);
    weatherWidget.textContent = 'Could not load current weather.';
  }
}

// Contact form submission
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const status = document.getElementById('form-status');

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          status.textContent = 'Thanks for your submission!';
          contactForm.reset();
        } else {
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              status.textContent = data.errors.map(error => error.message).join(', ');
            } else {
              status.textContent = 'Oops! There was a problem submitting your form';
            }
          });
        }
      } catch (error) {
        status.textContent = 'Oops! There was a problem submitting your form';
      }
    });
  }
});

// Recent blog posts functionality
async function fetchAndDisplayBlogPosts() {
  const postsContainer = document.getElementById('recent-blog-posts');
  const errorContainer = document.getElementById('blog-posts-error');

  try {
    const response = await fetch('/.netlify/functions/fetch-posts');
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const posts = await response.json();
    let html = '<ul>';
    posts.forEach(post => {
      html += `
        <li>
          <a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a>
          <p>${post.snippet}</p>
        </li>
      `;
    });
    html += '</ul>';
    postsContainer.innerHTML = html;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    if (errorContainer) {
      errorContainer.style.display = 'block';
    }
    if (postsContainer) {
      postsContainer.style.display = 'none';
    }
  }
}

// Call functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayWeather();
  fetchAndDisplayBlogPosts();
});