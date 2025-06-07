// --- Helper Functions ---

/**
 * Displays a temporary message box on the screen.
 * @param {string} msg - The message to display.
 */
function showMessage(msg) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = msg;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    z-index: 1000;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 80%;
  `;
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 5000); // Remove message after 5 seconds
}

// --- Easter Egg Functions ---

const egg = () => {
  console.log("%c🥚 Well hey there, curious mind! You found the hidden message! 🔮", "color: fuchsia; font-size: 1.5rem;");
  showMessage("💡 You found the Easter Egg! Stay curious. Stay creative. 💡");
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
  showMessage("🎶 Enjoy this chill track while you explore! 🎶");
};

/**
 * Initializes keyboard event listener for Easter Egg activation.
 */
function initializeEasterEggs() {
  window.addEventListener("keydown", (e) => {
    window._eggCode = (window._eggCode || "") + e.key.toLowerCase();
    if (window._eggCode.includes("beau")) {
      egg();
      window._eggCode = ""; // Reset code after activation
    }
    if (window._eggCode.includes("cat")) {
      catEgg();
      window._eggCode = ""; // Reset code after activation
    }
    if (window._eggCode.includes("jam")) {
      jamEgg();
      window._eggCode = ""; // Reset code after activation
    }
  });
}

// --- Form Validation Logic ---

/**
 * Validates the contact form fields.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
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

/**
 * Initializes the contact form submission logic.
 */
function initializeContactForm() {
  const talkBackForm = document.querySelector('form[name="contact"]');

  if (talkBackForm) {
    talkBackForm.addEventListener('submit', function(event) {
      if (!validateForm()) {
        event.preventDefault();
      }
    });
  }
}

// --- Three.js Background Animation ---

/**
 * Initializes and animates the Three.js background.
 */
function initializeThreeJSBackground() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: document.getElementById('hero-background') });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0); // Transparent background

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xC026D3, wireframe: true }); // Fuchsia wireframe

  const cubes = [];
  const numCubes = 50;
  for (let i = 0; i < numCubes; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
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

    cubes.forEach(cube => {
      cube.rotation.x += 0.001;
      cube.rotation.y += 0.001;
      cube.position.x += (Math.random() - 0.5) * 0.005;
      cube.position.y += (Math.random() - 0.5) * 0.005;
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

/**
 * Initializes the Intersection Observer for fade-in animations.
 */
function initializeFadeInAnimation() {
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = {
    threshold: 0.1,
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
}

// --- DOM Content Loaded Entry Point ---

document.addEventListener('DOMContentLoaded', function() {
  initializeEasterEggs();
  initializeContactForm();
  initializeThreeJSBackground();
  initializeFadeInAnimation();
});
