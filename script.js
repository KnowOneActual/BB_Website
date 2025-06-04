// Easter Egg functions
const egg = () => {
  console.log("%c👋 Well hey there, curious mind! You found the hidden message! 🎉", "color: fuchsia; font-size: 1.5rem;");
  // Using a custom modal-like message instead of alert() for better user experience.
  showMessage("✨ You found the Easter Egg! Stay curious. Stay creative. ✨");
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
  showMessage("🎶 Enjoy this chill track while you explore! 🎶");
};

// Keyboard event listener for Easter Egg activation.
window.addEventListener("keydown", (e) => {
  window._eggCode = (window._eggCode || "") + e.key.toLowerCase();
  if (window._eggCode.includes("beau")) {
    egg();
    window._eggCode = "";
  }
  if (window._eggCode.includes("cat")) {
    catEgg();
    window._eggCode = "";
  }
  if (window._eggCode.includes("jam")) {
    jamEgg();
    window._eggCode = "";
  }
  // Keep the code string from getting too long.
  if (window._eggCode.length > 10) {
    window._eggCode = window._eggCode.slice(-10);
  }
});

// Custom message display function (replaces alert()).
function showMessage(message) {
  const messageBox = document.createElement('div');
  messageBox.className = 'fixed inset-0 flex items-center justify-center z-50';
  messageBox.innerHTML = `
    <div class="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm mx-4 border border-fuchsia-600">
      <p class="text-lg text-white mb-6">${message}</p>
      <button id="messageBoxCloseButton" class="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded transition">Got It!</button>
    </div>
  `;
  document.body.appendChild(messageBox);

  // Attach event listener to the close button after it's added to the DOM
  document.getElementById('messageBoxCloseButton').addEventListener('click', () => {
    messageBox.remove();
  });
}

// Form validation function.
function validateForm() {
  var recaptchaResponse = document.querySelector(".g-recaptcha-response").value;
  if (recaptchaResponse === "") {
    // Using custom message display instead of alert().
    showMessage("Please complete the reCAPTCHA to submit the form.");
    return false;
  }
  // Using custom message display instead of alert().
  showMessage("Thanks for reaching out! Your message has been received.");
  return true;
}

// Attach form submission listener after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const talkBackForm = document.getElementById('talkBackForm');
  if (talkBackForm) {
    talkBackForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
      if (validateForm()) {
        // If validation passes, manually submit the form
        talkBackForm.submit();
      }
    });
  }

  // Intersection Observer for fade-in animation on scroll.
  const faders = document.querySelectorAll(".fade-in"); // Select all elements with the 'fade-in' class.
  const appearOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible.
  };

  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // If the element is not intersecting, do nothing.
        return;
      } else {
        // If the element is intersecting, add the 'appear' class to trigger the animation.
        entry.target.classList.add("appear");
        // Stop observing the element once it has appeared to prevent re-triggering.
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  // Observe each 'fade-in' element.
  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});
