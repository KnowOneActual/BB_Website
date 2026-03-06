console.log('Weather Bot script starting from js/weather-bot.js...');

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import {
  getFirestore,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

console.log('Firebase modules imported successfully.');

// --- CONFIGURATION ---
// Fetch configuration from Netlify function to keep secrets out of the source code.
const firebaseConfig = await fetch('/.netlify/functions/firebase-config')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch Firebase configuration.');
    return res.json();
  })
  .catch(err => {
    console.error('Firebase Config Error:', err);
    return null;
  });

const appId = 'weather-bot-beaubremer-com';

// --- FIREBASE INITIALIZATION ---
let db, auth;
let userId = null;
let unsubscribe;

// --- DOM ELEMENTS ---
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const statusEl = document.getElementById('status');
const statusDot = document.getElementById('status-dot');
const typingIndicator = document.getElementById('typing-indicator');
const userInfoEl = document.getElementById('user-info');

function setStatus(text, type = 'connecting') {
  if (statusEl) statusEl.textContent = text;
  if (statusDot) {
    statusDot.classList.remove('bg-yellow-500', 'bg-green-500', 'bg-red-500', 'animate-pulse');
    if (type === 'online') {
      statusDot.classList.add('bg-green-500');
    } else if (type === 'error') {
      statusDot.classList.add('bg-red-500');
    } else {
      statusDot.classList.add('bg-yellow-500', 'animate-pulse');
    }
  }
}

console.log('Initializing weather bot with status element:', statusEl ? 'Found' : 'Missing');

if (statusEl) setStatus('Initializing...');

// Add a connection timeout
const connectionTimeout = setTimeout(() => {
  if (statusEl && statusEl.textContent === 'Initializing...') {
    setStatus('Connection Slow...', 'connecting');
    console.warn('Initialization is taking longer than expected.');
  }
}, 10000);

try {
  console.log('Initializing Firebase App...');
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  setStatus('Authenticating...', 'connecting');
  console.log('Firebase services initialized. Waiting for auth state change...');

  onAuthStateChanged(auth, async (user) => {
    clearTimeout(connectionTimeout);
    console.log('Auth state changed:', user ? 'User signed in' : 'No user');
    if (user) {
      userId = user.uid;
      setStatus('Online', 'online');
      if (userInfoEl) userInfoEl.textContent = `Session ID: ${userId.substring(0, 8)}`;
      console.log('User ID:', userId);
      loadChatHistory();
    } else {
      console.log('Attempting anonymous sign-in...');
      try {
        await signInAnonymously(auth);
        console.log('Anonymous sign-in successful');
      } catch (error) {
        console.error('Anonymous sign-in failed:', error);
        setStatus('Authentication Failed', 'error');
        addMessage('bot', `I'm having trouble connecting. Please refresh. Error: ${error.message}`);
      }
    }
  });
} catch (e) {
  console.error('Initialization failed:', e);
  setStatus('Error: Check Config', 'error');
  addMessage('bot', `Failed to initialize the app. Check console for errors. Error: ${e.message}`);
}

// --- MODAL LOGIC ---
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

function toggleModal(show) {
  if (show) {
    modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  } else {
    modalOverlay.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    document.body.style.overflow = '';
  }
}

if (openModalBtn) openModalBtn.addEventListener('click', () => toggleModal(true));
if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => toggleModal(false));
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) toggleModal(false);
  });
}

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.classList.contains('opacity-0')) {
    toggleModal(false);
  }
});

// --- CHAT FUNCTIONS ---
function addMessage(sender, text, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('flex', 'items-start', 'space-x-3', 'max-w-[85%]');

  const time = timestamp
    ? new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const iconDiv = document.createElement('div');
  iconDiv.classList.add(
    'w-10',
    'h-10',
    'rounded-full',
    'flex-shrink-0',
    'flex',
    'items-center',
    'justify-center',
    'border',
  );

  const contentWrapperDiv = document.createElement('div');
  contentWrapperDiv.classList.add('flex', 'flex-col');

  const bubbleDiv = document.createElement('div');
  bubbleDiv.classList.add('p-4', 'rounded-2xl', 'text-sm', 'leading-relaxed', 'shadow-sm');

  const textP = document.createElement('p');
  textP.textContent = text;

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('text-[10px]', 'text-gray-500', 'mt-1', 'font-medium', 'uppercase');
  timeSpan.textContent = time;

  if (sender === 'user') {
    messageDiv.classList.add('ml-auto', 'flex-row-reverse', 'space-x-reverse');
    iconDiv.classList.add('bg-indigo-600', 'border-indigo-500', 'text-white', 'font-bold');
    iconDiv.textContent = 'U';
    bubbleDiv.classList.add('bg-indigo-600', 'text-white', 'rounded-tr-none');
    timeSpan.classList.add('text-right');
  } else {
    iconDiv.classList.add('bg-gray-800', 'border-gray-700');
    iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>`;
    bubbleDiv.classList.add('bg-gray-800', 'text-gray-100', 'rounded-tl-none', 'border', 'border-gray-700');
  }

  bubbleDiv.appendChild(textP);
  contentWrapperDiv.appendChild(bubbleDiv);
  contentWrapperDiv.appendChild(timeSpan);
  messageDiv.appendChild(iconDiv);
  messageDiv.appendChild(contentWrapperDiv);

  if (chatWindow) {
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

function setTyping(isTyping) {
  if (typingIndicator) typingIndicator.style.display = isTyping ? 'block' : 'none';
  if (isTyping && chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- FIRESTORE FUNCTIONS ---
async function saveMessage(sender, text) {
  if (!userId) return;
  try {
    const messagesRef = collection(db, `artifacts/${appId}/users/${userId}/messages`);
    await addDoc(messagesRef, { sender, text, createdAt: serverTimestamp() });
  } catch (error) {
    console.error('Error saving message: ', error);
  }
}

function loadChatHistory() {
  if (!userId) return;
  if (unsubscribe) unsubscribe();
  const messagesRef = collection(db, `artifacts/${appId}/users/${userId}/messages`);
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (chatWindow) chatWindow.innerHTML = '';
      if (snapshot.empty) {
        addMessage('bot', "Hello! I'm your Weather Assistant. Ask me about the weather anywhere in the world!");
      }
      snapshot.forEach((doc) => {
        const data = doc.data();
        addMessage(data.sender, data.text, data.createdAt);
      });
    },
    (error) => {
      console.error('Error loading chat history:', error);
      addMessage('bot', "Sorry, I couldn't load your chat history.");
    },
  );
}

// --- EVENT HANDLERS ---
if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!chatInput) return;
    const userQuery = chatInput.value.trim();
    if (!userQuery || !userId) return;

    addMessage('user', userQuery);
    await saveMessage('user', userQuery);
    chatInput.value = '';
    setTyping(true);

    try {
      const response = await fetch('/.netlify/functions/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: userQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The server returned an error.');
      }

      const data = await response.json();
      const botResponse = data.reply;

      addMessage('bot', botResponse);
      await saveMessage('bot', botResponse);
    } catch (error) {
      console.error('Processing Error:', error);
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      addMessage('bot', errorMessage);
      await saveMessage('bot', errorMessage);
    } finally {
      setTyping(false);
    }
  });
}
