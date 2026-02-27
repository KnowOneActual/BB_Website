// --- Helper Functions ---
function showMessage(msg) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = msg;
  // Apply the new CSS class for cleaner code
  messageDiv.classList.add('toast-message');

  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 5000);
}

// --- Easter Egg Functions ---
const egg = () => {
  console.log(' !!Well hey there, curious mind! You found the hidden message!', 'color: fuchsia; font-size: 1.5rem;');
  showMessage('!! You found the Easter Egg! Stay curious. Stay creative. !!');
};
const catEgg = () => {
  const img = document.createElement('img');
  img.src = 'https://cataas.com/cat/gif';
  img.alt = 'Surprise Cat!';
  img.classList.add('cat-image');
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 8000);
};
const jamEgg = () => {
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  audio.volume = 0.3;
  audio.play();
  showMessage('Enjoy this chill track while you explore!');
};
function initializeEasterEggs() {
  window.addEventListener('keydown', (e) => {
    if (e && e.key) {
      window._eggCode = (window._eggCode || '') + e.key.toLowerCase();
      if (window._eggCode.includes('beau')) {
        egg();
        window._eggCode = '';
      }
      if (window._eggCode.includes('cat')) {
        catEgg();
        window._eggCode = '';
      }
      if (window._eggCode.includes('jam')) {
        jamEgg();
        window._eggCode = '';
      }
    }
  });
}

// --- FORM VALIDATION AND SUBMISSION LOGIC ---
function validateForm() {
  const nameInput = document.querySelector('form[name="contact"] input[name="name"]');
  const emailInput = document.querySelector('form[name="contact"] input[name="email"]');
  const messageTextarea = document.querySelector('form[name="contact"] textarea[name="message"]');
  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const message = messageTextarea ? messageTextarea.value.trim() : '';
  if (!name || !email || !message) {
    showMessage('Please fill in all required fields.');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address.');
    return false;
  }
  return true;
}

function initializeFormHandling() {
  const talkBackForm = document.querySelector('form[name="contact"]');
  if (talkBackForm) {
    talkBackForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!validateForm()) {
        return;
      }
      const formData = new FormData(talkBackForm);
      const formBody = new URLSearchParams(formData).toString();
      try {
        const response = await fetch('/.netlify/functions/hello', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody,
        });
        if (response.ok) {
          window.location.href = '/thank-you.html';
        } else {
          showMessage('Submission failed. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('An error occurred. Please try again later.');
      }
    });
  }
}

// --- Fade-In Animation ---
function initializeFadeInAnimation() {
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.1 };
  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
}

// --- Fetch and Display Blog Posts ---
async function fetchAndDisplayBlogPosts() {
  const container = document.getElementById('blog-posts-container');
  if (!container) return;

  try {
    const response = await fetch('/.netlify/functions/fetch-posts');
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const posts = await response.json();

    if (posts.length === 0) {
      container.innerHTML =
        '<p class="text-gray-400 text-center col-span-1 md:col-span-2 lg:col-span-3">No recent blog posts found. Please visit the <a href="https://blog.beaubremer.com/" class="text-indigo-400 underline">blog</a> directly.</p>';
      return;
    }

    container.innerHTML = '';

    posts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.className =
        'group p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/30 transition duration-300 fade-in';

      const postDate = new Date(post.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const title = document.createElement('h3');
      title.className = 'text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition';
      title.textContent = post.title;

      const date = document.createElement('p');
      date.className = 'text-gray-400 text-sm mb-3';
      date.textContent = postDate;

      const snippet = document.createElement('p');
      snippet.className = 'text-gray-400 text-sm mb-6';
      snippet.textContent = post.snippet;

      const link = document.createElement('a');
      link.href = post.link;
      link.target = '_blank';
      link.className = 'text-indigo-400 text-sm font-semibold hover:underline';
      link.textContent = 'Read More →';

      postElement.appendChild(title);
      postElement.appendChild(date);
      postElement.appendChild(snippet);
      postElement.appendChild(link);
      container.appendChild(postElement);
    });

    initializeFadeInAnimation();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    container.innerHTML =
      '<p class="text-gray-400 text-center col-span-1 md:col-span-2 lg:col-span-3">Could not load recent blog posts. Please visit the <a href="https://blog.beaubremer.com/" class="text-indigo-400 underline">blog</a> directly.</p>';
  }
}

// --- Sticky Navigation ---
function initializeStickyNav() {
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
}

// --- DOMContent Listener ---
document.addEventListener('DOMContentLoaded', () => {
  initializeEasterEggs();
  initializeFormHandling();
  initializeFadeInAnimation();
  fetchAndDisplayBlogPosts();
  initializeStickyNav();

  // Handle Resume Request Button
  const resumeBtn = document.getElementById('request-resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const messageArea = document.querySelector('textarea[name="message"]');
      if (messageArea) {
        messageArea.value = "Hi Beau, I'd like to request a copy of your latest resume. Thanks!";
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Focus the name field so they can start typing immediately
        const nameInput = document.querySelector('input[name="name"]');
        if (nameInput) nameInput.focus();
      }
    });
  }
});
