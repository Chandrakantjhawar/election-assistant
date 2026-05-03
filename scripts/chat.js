/**
 * chat.js — Chat UI rendering, message management, and suggestion chips
 * Manages conversationHistory and handles all chat DOM updates
 */

let conversationHistory = [];
let chatInitialized = false;

/** Render the stage detail card */
function renderStageCard() {
  const stage = STAGES[currentStageIndex];
  const card  = document.getElementById('stage-card');
  if (!card) return;

  // Animate out and in
  card.style.opacity = '0';
  card.style.transform = 'translateY(8px)';

  setTimeout(() => {
    card.innerHTML = `
      <div class="stage-card-header">
        <div class="stage-icon" style="background: linear-gradient(135deg, ${stage.color}, ${adjustColor(stage.color, -20)})">
          ${stage.emoji}
        </div>
        <div class="stage-card-titles">
          <h2>${stage.id}. ${stage.label}</h2>
          <p class="stage-timing">${stage.timing}</p>
        </div>
      </div>
      <p class="stage-description">${stage.description}</p>
      <div class="key-points-grid">
        ${stage.keyPoints.map(kp => `
          <div class="key-point-chip">
            <span class="key-point-label">${kp.label}</span>
            <span class="key-point-value">${kp.value}</span>
          </div>
        `).join('')}
      </div>
      <div class="callout-box">
        <span class="callout-icon">ℹ️</span>
        <span>${stage.callout}</span>
      </div>
    `;
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    card.style.transition = 'opacity 300ms ease, transform 300ms ease';
  }, 120);
}

/** Darken a hex color by amount */
function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) + amount);
  const g = Math.max(0, ((num >> 8) & 0xff) + amount);
  const b = Math.max(0, (num & 0xff) + amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/** Update suggestion chips when stage changes */
function updateSuggestions() {
  // Don't disrupt ongoing conversations
  if (conversationHistory.length > 0) return;

  const stage = STAGES[currentStageIndex];
  const area  = document.getElementById('suggestions-area');
  if (!area) return;

  area.innerHTML = `<span class="suggestions-label">Suggested questions</span>`;
  stage.suggestedQuestions.forEach(q => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = q;
    chip.addEventListener('click', () => {
      document.getElementById('chat-input').value = q;
      submitMessage();
    });
    area.appendChild(chip);
  });
}

/** Append a message bubble to the chat */
function appendMessage(role, text) {
  const messages = document.getElementById('chat-messages');
  if (!messages) return;

  const row = document.createElement('div');
  row.className = `message-row ${role === 'user' ? 'msg-user user' : 'msg-ai ai'}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🗳️';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;

  // ── Google Search Verify Button (AI messages only) ──────────
  if (role === 'assistant') {
    // Grab the last user question to use as the search query
    const lastUserMsg = [...conversationHistory]
      .reverse()
      .find(m => m.role === 'user');
    const query = lastUserMsg?.content || text.slice(0, 80);

    const verifyBtn = document.createElement('a');
    verifyBtn.href   = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    verifyBtn.target = '_blank';
    verifyBtn.rel    = 'noopener noreferrer';
    verifyBtn.className   = 'verify-google-btn';
    verifyBtn.textContent = '🔍 Verify on Google';
    verifyBtn.title       = 'Search Google to verify this information';
    verifyBtn.setAttribute('aria-label', `Search Google for: ${query}`);

    bubble.appendChild(verifyBtn);
  }

  row.appendChild(avatar);
  row.appendChild(bubble);
  messages.appendChild(row);
  scrollToBottom();
}


/** Scroll chat to the bottom */
function scrollToBottom() {
  const messages = document.getElementById('chat-messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}

/** Show/hide the typing indicator */
function setTyping(visible) {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.classList.toggle('visible', visible);
    scrollToBottom();
  }
}

/** Submit user message from input field */
async function submitMessage() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const userText = (input.value || '').trim();
  if (!userText) return;

  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;

  appendMessage('user', userText);
  setTyping(true);

  try {
    const aiText = await sendMessageToAI(userText);
    setTyping(false);
    appendMessage('assistant', aiText);
  } catch (err) {
    setTyping(false);
    showErrorToast(err.message || 'Something went wrong. Please try again.');
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

/** Show welcome message */
function showWelcomeMessage() {
  if (chatInitialized) return;
  chatInitialized = true;

  const stage = STAGES[currentStageIndex];
  appendMessage(
    'assistant',
    `Hello! I'm ElectionGuide, your non-partisan election process educator. 🗳️\n\nI'm here to help you understand every stage of the democratic process. You're currently exploring Stage ${stage.id}: "${stage.label}".\n\nFeel free to ask me anything about how elections work — from voter registration to the transfer of power. What would you like to know?`
  );
}

/** Initialize chat */
function initChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitMessage();
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', submitMessage);
  }

  showWelcomeMessage();
  updateSuggestions();
}

/** Show an error toast */
function showErrorToast(message) {
  const toast = document.getElementById('error-toast');
  if (!toast) return;
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 5000);
}
