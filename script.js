// --- yeah right Helper Functions ---
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
  console.log("%c･�Well hey there, curious mind! You found the hidden message! 醗", "color: fuchsia; font-size: 1.5rem;");
  showMessage("庁 You found the Easter Egg! Stay curious. Stay creative. 庁");
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

// --- DYNAMIC RESOURCE LIBRARY ---
async function initializeResourceLibrary() {
  const resourceList = document.getElementById('resource-library-list');
  if (!resourceList) return;
  try {
    const response = await fetch('/links.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const links = await response.json();
    links.forEach(link => {
      const listItem = document.createElement('li');
      listItem.className = 'bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-fuchsia-600/50 transition fade-in';
      listItem.innerHTML = `<a href="${link.url}" target="_blank" class="text-xl font-semibold text-fuchsia-400 hover:underline">${link.title}</a><p class="text-gray-300 mt-2">${link.description}</p>`;
      resourceList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching or building resource library:', error);
    resourceList.innerHTML = '<p class="text-center text-red-400">Could not load resources at this time.</p>';
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

// --- DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
  initializeEasterEggs();
  initializeFormHandling();
  initializeThreeJsAnimation();
  initializeFadeInAnimation();
  initializeResourceLibrary();
});