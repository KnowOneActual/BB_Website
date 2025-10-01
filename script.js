// /script.js

// Function to set the theme based on user preference or system settings
function setTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// Function to toggle the theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Function to handle the contact form submission
async function handleContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const status = document.getElementById('form-status');

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      status.textContent = 'Thanks for your submission!';
      form.reset();
    } else {
      const responseData = await response.json();
      if (Object.prototype.hasOwnProperty.call(responseData, 'errors')) {
        status.textContent = responseData.errors.map(error => error.message).join(', ');
      } else {
        status.textContent = 'Oops! There was a problem submitting your form';
      }
    }
  } catch (error) {
    console.error('Form submission error:', error);
    status.textContent = 'Oops! There was a problem submitting your form';
  }
}

// Function to display the current weather
async function fetchAndDisplayWeather() {
    const weatherContainer = document.getElementById('weather-widget');
    if (!weatherContainer) return;

    try {
        const response = await fetch('/.netlify/functions/weather');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const iconUrl = `https://openweathermap.org/img/wn/${data.icon}.png`;
        weatherContainer.innerHTML = `
            Currently in Chicago: ${data.temp}°F and ${data.description}
            <img src="${iconUrl}" alt="${data.description}" style="display:inline-block; vertical-align:middle; width:30px; height:30px;">
        `;
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherContainer.textContent = 'Could not load current weather.';
    }
}

// Function to fetch and display recent blog posts
async function fetchAndDisplayBlogPosts() {
  const postsContainer = document.getElementById('recent-blog-posts');
  const errorContainer = document.getElementById('blog-posts-error');

  // Ensure containers exist before proceeding
  if (!postsContainer || !errorContainer) {
    console.warn('Blog post containers not found on this page.');
    return;
  }

  try {
    const response = await fetch('/.netlify/functions/fetch-posts');

    if (!response.ok) {
      // Get the raw text from the server response for better error details
      const errorText = await response.text();
      console.error('Server returned a non-OK status:', response.status, errorText);
      throw new Error(`Server error: ${response.statusText}`);
    }

    const posts = await response.json();

    // Check if the response is a valid array with posts
    if (!Array.isArray(posts)) {
      console.error('Received invalid data from server:', posts);
      throw new Error('Invalid data format received from the server.');
    }
    
    if (posts.length === 0) {
      // Handle the case where there are no posts to show
      postsContainer.innerHTML = '<p>No recent posts to display.</p>';
      return;
    }

    let html = '<ul>';
    posts.forEach(post => {
      // Use default values to prevent errors from missing data
      const title = post.title || 'Untitled Post';
      const link = post.link || '#';
      const snippet = post.snippet || 'No snippet available.';
      html += `
        <li>
          <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
          <p>${snippet}</p>
        </li>
      `;
    });
    html += '</ul>';
    postsContainer.innerHTML = html;
    errorContainer.style.display = 'none'; // Hide error message on success

  } catch (error) {
    console.error('A critical error occurred while fetching or displaying blog posts:', error);