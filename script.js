// Easter Egg functions
const egg = () => {
  console.log("%c窓 Well hey there, curious mind! You found the hidden message! 脂", "color: fuchsia; font-size: 1.5rem;");
  // Using a custom modal-like message instead of alert() for better user experience.
  showMessage("笨ｨ You found the Easter Egg! Stay curious. Stay creative. 笨ｨ");
};

const catEgg = () => {
  const img = document.createElement("img");
  img.src = "https://cataas.com/cat/gif";
  img.alt = "Surprise Cat!";
  // Apply the new CSS class instead of inline styles
  img.classList.add('cat-image'); 
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 8000);
};

const jamEgg = () => {
  const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
  audio.volume = 0.3;
  audio.play();
  // Using a custom modal-like message instead of alert().
  showMessage("叱 Enjoy this chill track while you explore! 叱");
};

// Helper function for custom messages
// This is a simple implementation. You might have a more complex modal system in your CSS/HTML.
function showMessage(msg) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = msg;
  // Basic inline styling for demonstration. Consider moving this to CSS.
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


// Keyboard event listener for Easter Egg activation.
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


// --- FORM VALIDATION AND SUBMISSION LOGIC ---

// Client-side validation for the contact form
function validateForm() {
  // Select form fields using the form's name attribute
  const nameInput = document.querySelector('form[name="contact"] input[name="name"]');
  const emailInput = document.querySelector('form[name="contact"] input[name="email"]');
  const messageTextarea = document.querySelector('form[name="contact"] textarea[name="message"]');

  // Check if fields exist and then get their values
  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const message = messageTextarea ? messageTextarea.value.trim() : '';

  if (!name || !email || !message) {
    showMessage("Please fill in all required fields.");
    return false;
  }

  // Basic email format validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address.");
    return false;
  }

  // If all validations pass, return true
  return true; 
}

// Attach event listeners once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Select the form using its 'name' attribute, as it doesn't have an ID in index.html
  const talkBackForm = document.querySelector('form[name="contact"]'); 

  if (talkBackForm) {
    // Add a submit event listener to the form
    talkBackForm.addEventListener('submit', function(event) {
      // Prevent the default form submission if validation fails
      if (!validateForm()) { 
        event.preventDefault(); 
      }
      // If validateForm() returns true, the form will submit naturally.
      // Netlify's built-in form handling will then process the submission
      // and redirect to /success (or a page defined by your _redirects if present).
    });
  }

  // --- INTERSECTION OBSERVER FOR FADE-IN ANIMATION ---
  const faders = document.querySelectorAll(".fade-in"); // Select all elements with the 'fade-in' class.
  const appearOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible.
    // You can adjust this threshold as needed for different scroll behaviors.
  };

  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // If the element is not currently visible, do nothing.
        return;
      } else {
        // If the element becomes visible, add the 'appear' class to trigger its CSS animation.
        entry.target.classList.add("appear");
        // Stop observing the element once it has appeared to prevent the animation from re-triggering.
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  // Apply the Intersection Observer to each element with the 'fade-in' class.
  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});