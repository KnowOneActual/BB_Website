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
  console.log(
    ' !!Well hey there, curious mind! You found the hidden message!',
    'color: fuchsia; font-size: 1.5rem;',
  );
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
  const audio = new Audio(
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  );
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
  const nameInput = document.querySelector(
    'form[name="contact"] input[name="name"]',
  );
  const emailInput = document.querySelector(
    'form[name="contact"] input[name="email"]',
  );
  const messageTextarea = document.querySelector(
    'form[name="contact"] textarea[name="message"]',
  );
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

// --- 3D Background Animation ---
function initializeThreeJsAnimation() {
  const canvas = document.getElementById('hero-background');
  if (!canvas) {
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xc026d3,
    wireframe: true,
  });
  const cubes = [];
  for (let i = 0; i < 50; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    );
    cube.scale.setScalar(Math.random() * 0.5 + 0.1);
    scene.add(cube);
    cubes.push(cube);
  }
  camera.position.z = 5;
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  function animate() {
    requestAnimationFrame(animate);
    cubes.forEach((cube) => {
      cube.rotation.x += 0.001;
      cube.rotation.y += 0.001;
    });
    camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.1 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
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
        '<p class="text-gray-400 text-center col-span-1 md:col-span-2 lg:col-span-3">No recent blog posts found. Please visit the <a href="https://blog.beaubremer.com/" class="text-fuchsia-400 underline">blog</a> directly.</p>';
      return;
    }

    container.innerHTML = '';

    posts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.className =
        'bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-fuchsia-600/50 transition fade-in transform hover:-translate-y-1';

      const postDate = new Date(post.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const title = document.createElement('h3');
      title.className = 'text-2xl font-semibold text-fuchsia-400 mb-3';
      title.textContent = post.title;

      const date = document.createElement('p');
      date.className = 'text-gray-400 text-sm mb-2';
      date.textContent = postDate;

      const snippet = document.createElement('p');
      snippet.className = 'text-gray-300 text-sm mb-4';
      snippet.textContent = post.snippet;

      const linkContainer = document.createElement('div');
      linkContainer.className = 'mt-4 flex flex-wrap gap-4';

      const link = document.createElement('a');
      link.href = post.link;
      link.target = '_blank';
      link.className =
        'text-white bg-fuchsia-600 hover:bg-fuchsia-700 font-bold rounded-full px-4 py-2 text-sm';
      link.textContent = 'Read More →';

      linkContainer.appendChild(link);
      postElement.appendChild(title);
      postElement.appendChild(date);
      postElement.appendChild(snippet);
      postElement.appendChild(linkContainer);
      container.appendChild(postElement);
    });

    initializeFadeInAnimation();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    container.innerHTML =
      '<p class="text-gray-400 text-center col-span-1 md:col-span-2 lg:col-span-3">Could not load recent blog posts. Please visit the <a href="https://blog.beaubremer.com/" class="text-fuchsia-400 underline">blog</a> directly.</p>';
  }
}

// --- DOMContent Listener ---
document.addEventListener('DOMContentLoaded', () => {
  initializeEasterEggs();
  initializeFormHandling();
  initializeThreeJsAnimation();
  initializeFadeInAnimation();
  fetchAndDisplayBlogPosts(); // Fetch blog posts after the page has loaded
});
