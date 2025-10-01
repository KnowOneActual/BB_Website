// /script.js

// Wrap the entire script in a try...catch block to handle any top-level errors.
try {

  // --- Theme Management ---
  function setTheme() {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      let theme = 'light'; // Default theme
      if (savedTheme) {
        theme = savedTheme;
      } else if (prefersDark) {
        theme = 'dark';
      }
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.error("Error in setTheme:", e);
    }
  }

  function toggleTheme() {
    try {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error("Error in toggleTheme:", e);
    }
  }

  // --- Dynamic Content Fetching ---
  async function fetchAndDisplayWeather() {
    const weatherContainer = document.getElementById('weather-widget');
    if (!weatherContainer) return; // Exit if the element doesn't exist

    try {
      const response = await fetch('/.netlify/functions/weather');
      if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);
      const data = await response.json();
      const iconUrl = `https://openweathermap.org/img/wn/${data.icon}.png`;
      weatherContainer.innerHTML = `
        Currently in Chicago: ${data.temp}°F and ${data.description}
        <img src="${iconUrl}" alt="${data.description}" style="display:inline-block; vertical-align:middle; width:30px; height:30px;">`;
    } catch (error) {
      console.error('Error fetching weather:', error);
      weatherContainer.textContent = 'Could not load weather.';
    }
  }

  async function fetchAndDisplayBlogPosts() {
    const postsContainer = document.getElementById('recent-blog-posts');
    const errorContainer = document.getElementById('blog-posts-error');
    if (!postsContainer || !errorContainer) return; // Exit if elements don't exist

    try {
      const response = await fetch('/.netlify/functions/fetch-posts');
      if (!response.ok) throw new Error(`Blog fetch failed: ${response.status}`);
      const posts = await response.json();
      
      if (!posts || posts.length === 0) {
        postsContainer.innerHTML = "<p>No recent posts available.</p>";
        return;
      }

      let html = '<ul>';
      posts.forEach(post => {
        html += `
          <li>
            <a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title || 'Untitled'}</a>
            <p>${post.snippet || ''}</p>
          </li>`;
      });
      html += '</ul>';
      postsContainer.innerHTML = html;
      errorContainer.style.display = 'none';
    } catch (error) {
      console.error('Error fetching or displaying blog posts:', error);
      errorContainer.textContent = 'Error loading posts. See console for details.';
      errorContainer.style.display = 'block';
      postsContainer.style.display = 'none';
    }
  }

  // --- Main Execution ---
  // This function sets up all the event listeners and dynamic content.
  function initializePage() {
    console.log("Initializing page..."); // Sanity check to confirm script is running

    setTheme();

    const themeToggler = document.getElementById('theme-toggler');
    if (themeToggler) {
      themeToggler.addEventListener('click', toggleTheme);
    }

    // Call functions to load content
    fetchAndDisplayWeather();
    fetchAndDisplayBlogPosts();
    
    console.log("Page initialization complete.");
  }

  // Use the DOMContentLoaded event to ensure the HTML is fully loaded before running the script.
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializePage);
  } else {
      // The DOM is already loaded, run immediately.
      initializePage();
  }

} catch (e) {
  // This is a global catch block. If an error happens outside of other try/catch blocks,
  // it will be caught here, preventing the entire page from crashing.
  console.error("A critical top-level error occurred in script.js:", e);
  // As a fallback, try to make the body visible so static content can be seen.
  document.body.style.visibility = 'visible';
}