// --- top ---
function showMessage(msg) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = msg;
  messageDiv.style.cssText = `
    position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8); color: white; padding: 15px 25px;
    border-radius: 8px; z-index: 1000; font-family: 'Inter', sans-serif;
    font-size: 1rem; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    text-align: center; max-width: 80%;
  `;
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 5000);
}

// --- Easter Egg Functions ---
const egg = () => {
  console.log(" !!Well hey there, curious mind! You found the hidden message!", "color: fuchsia; font-size: 1.5rem;");
  showMessage("!! You found the Easter Egg! Stay curious. Stay creative. !!");
};
const catEgg = () => {
  const img = document.createElement("img");
  img.src = "https://cataas.com/cat/gif";
  img.alt = "Surprise Cat!";
  img.classList.add('cat-image'); 
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 8000);
};
const jamEgg = () => {
  const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
  audio.volume = 0.3;
  audio.play();
  showMessage("叱 Enjoy this chill track while you explore! 叱");
};
function initializeEasterEggs() {
  window.addEventListener("keydown", (e) => {
    if (e && e.key) { 
      window._eggCode = (window._eggCode || "") + e.key.toLowerCase();
      if (window._eggCode.includes("beau")) { egg(); window._eggCode = ""; }
      if (window._eggCode.includes("cat")) { catEgg(); window._eggCode = ""; }
      if (window._eggCode.includes("jam")) { jamEgg(); window._eggCode = ""; }
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
    showMessage("Please fill in all required fields.");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address.");
    return false;
  }
  return true;
}

function initializeFormHandling() {
  const talkBackForm = document.querySelector('form[name="contact"]');
  if (talkBackForm) {
    talkBackForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      if (!validateForm()) { return; }
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

// --- Three.js Background Animation ---
function initializeThreeJsAnimation() {
  const canvas = document.getElementById('hero-background');
  if (!canvas) { return; }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xC026D3, wireframe: true });
  const cubes = [];
  for (let i = 0; i < 50; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
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
    cubes.forEach(cube => {
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

// --- Intersection Observer for Fade-In Animation ---
function initializeFadeInAnimation() {
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = { threshold: 0.1 };
  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) { return; }
      else {
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach(fader => { appearOnScroll.observe(fader); });
}

// --- Fetch and Display Blog Posts ---
async function fetchAndDisplayBlogPosts() {
  const container = document.getElementById('blog-posts-container');
  if (!container) return; // Exit if the container isn't on the page

  try {
    const response = await fetch('/.netlify/functions/fetch-posts');
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const posts = await response.json();

    container.innerHTML = ''; // Clear placeholder content

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-fuchsia-600/50 transition fade-in transform hover:-translate-y-1';
      
      const postDate = new Date(post.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      postElement.innerHTML = `
        <h3 class="text-2xl font-semibold text-fuchsia-400 mb-3">${post.title}</h3>
        <p class="text-gray-400 text-sm mb-2">${postDate}</p>
        <p class="text-gray-300 text-sm mb-4">${post.snippet}</p>
        <div class="mt-4 flex flex-wrap gap-4">
          <a href="${post.link}" target="_blank"
            class="text-white bg-fuchsia-600 hover:bg-fuchsia-700 font-bold rounded-full px-4 py-2 text-sm">Read More
            &rarr;</a>
        </div>
      `;
      container.appendChild(postElement);
    });

    // Re-run the fade-in animation logic for the newly added blog posts
    initializeFadeInAnimation();

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    container.innerHTML = '<p class="text-gray-400 text-center col-span-1 md:col-span-2 lg:col-span-3">Could not load recent blog posts. Please visit the <a href="https://blog.beaubremer.com/" class="text-fuchsia-400 underline">blog</a> directly.</p>';
  }
}


// --- DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
  initializeEasterEggs();
  initializeFormHandling();
  initializeThreeJsAnimation();
  initializeFadeInAnimation();
  fetchAndDisplayBlogPosts(); // Fetch blog posts after the page has loaded
});
