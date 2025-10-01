// /script.js - Update the fetchAndDisplayBlogPosts function

async function fetchAndDisplayBlogPosts() {
  const postsContainer = document.getElementById('recent-blog-posts');
  const errorContainer = document.getElementById('blog-posts-error');

  try {
    const response = await fetch('/.netlify/functions/fetch-posts');

    if (!response.ok) {
      // Try to get detailed error from the response body
      const errorData = await response.json();
      console.error('Server returned an error:', errorData);
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