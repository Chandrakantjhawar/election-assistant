/**
 * api.js — Groq API integration (serves Llama 3.3 70B FREE)
 *
 * WHY GROQ instead of OpenRouter?
 *   OpenRouter's free endpoints are often congested (returning 429 Provider Errors).
 *   Groq provides native, incredibly fast access to Llama 3.3 70B.
 *   Groq offers a massive free tier: 30 requests/minute & 14,400 requests/day.
 *
 * FREE model used: llama-3.3-70b-versatile
 *   ✅ Meta Llama 3.3 70B            ✅ No credit card needed
 *   ✅ Ultra-fast inference           ✅ OpenAI-compatible format
 *
 * Get a free key at: https://console.groq.com/keys
 */

const OR_MODEL    = 'llama-3.3-70b-versatile';
const OR_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// ── Rate-limit guard ──────────────────────────────────────────
// Free model: ~20 RPM → 1 request per 3 seconds to be safe
const MIN_REQUEST_INTERVAL_MS = 3100;
let lastRequestTime = 0;

function waitForRateLimit() {
  const elapsed = Date.now() - lastRequestTime;
  const waitMs  = Math.max(0, MIN_REQUEST_INTERVAL_MS - elapsed);
  return new Promise(resolve => setTimeout(resolve, waitMs));
}

function setTypingLabel(text) {
  const el = document.getElementById('typing-label');
  if (el) el.textContent = text;
}

// ── Key Management ────────────────────────────────────────────

const STORAGE_KEY = 'electionguide_groq_key';

function getApiKey()       { return localStorage.getItem(STORAGE_KEY) || ''; }
function saveApiKey(key)   {
  key = (key || '').trim();
  if (key) localStorage.setItem(STORAGE_KEY, key);
  else     localStorage.removeItem(STORAGE_KEY);
  updateApiKeyStatus();
}
function clearApiKey()     { localStorage.removeItem(STORAGE_KEY); updateApiKeyStatus(); }
function maskKey(key)      {
  if (!key || key.length <= 12) return '••••••••';
  return key.slice(0, 8) + '••••••••' + key.slice(-4);
}

function updateApiKeyStatus() {
  const key    = getApiKey();
  const hasKey = !!key;

  const badge = document.getElementById('api-status-badge');
  if (badge) {
    badge.textContent    = hasKey ? '✓ AI Connected' : '⚡ Demo Mode';
    badge.style.background   = hasKey ? '#e6f4ea' : 'var(--color-background-info)';
    badge.style.color        = hasKey ? '#1e7e34' : 'var(--color-primary)';
    badge.style.borderColor  = hasKey ? '#a8d5b5' : '#c5d9f9';
  }

  const input = document.getElementById('settings-key-input');
  if (input) {
    input.value       = '';
    input.placeholder = key ? 'Key saved — paste a new key to replace' : 'Paste your Groq API key (gsk_…)';
  }

  const chip = document.getElementById('settings-status-chip');
  if (chip) {
    chip.textContent  = hasKey ? '✓ API key saved — using Llama 3.3 70B (free)' : '○ No key — running in demo mode';
    chip.className    = 'settings-status-chip ' + (hasKey ? 'connected' : 'demo');
  }
}

// ── System Prompt ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are ElectionGuide, a knowledgeable, friendly, and strictly non-partisan election process educator. Your role is to help users understand how democratic elections work — including voter registration, candidate nominations, campaign rules, polling day procedures, vote counting, result certification, dispute resolution, and the transfer of power.

TONE: Encouraging, civic-minded, factual, plain-language. Avoid jargon. When you must use a technical term, define it immediately.

PARTISANSHIP: You are completely neutral. Never favor any political party, candidate, ideology, or outcome. If asked for your political opinion, redirect to facts.

SCOPE: Focus exclusively on electoral processes, civic participation, and democratic institutions. Politely decline questions unrelated to elections.

FORMATTING: Plain text only — no markdown headers, no bullet symbols, no asterisks. Use short paragraphs with line breaks. Keep answers to 2–4 paragraphs unless a complex question warrants more. Always end with an invitation to ask a follow-up.

GEOGRAPHIC AWARENESS: Acknowledge that electoral rules vary significantly by country and jurisdiction. Where possible, note the most common practices and flag where major variations exist.

SAFETY: If a user expresses frustration with election results or democratic institutions, respond with empathy and factual information about legal dispute mechanisms. Never validate claims of fraud without evidence, and never dismiss legitimate systemic concerns without acknowledging them thoughtfully.`;

function buildSystemPrompt() {
  const stage = STAGES[currentStageIndex];
  const region = document.getElementById('current-region-display')?.textContent || 'Generic';
  
  let context = `The user is currently viewing Stage ${stage.id}: ${stage.label} (${stage.timing}) in the interactive election guide.`;
  if (region !== 'Generic') {
    context += ` IMPORTANT: You must tailor your entire response to the specific election laws, timelines, and political processes of ${region}.`;
  }
  
  return `${context} Tailor your response to this context when helpful, but prioritize answering their literal question.\n\n` + SYSTEM_PROMPT;
}

// ── OpenRouter API Call ───────────────────────────────────────

/** Convert history to OpenAI-compatible messages array */
function toOpenAIMessages(history, systemPrompt) {
  return [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role:    msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
  ];
}

/** One fetch attempt — throws typed error with .status on failure */
async function callAPIOnce(trimmedHistory, apiKey) {
  const response = await fetch(OR_ENDPOINT, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer':  'https://electionguide.app',
      'X-Title':       'ElectionGuide'
    },
    body: JSON.stringify({
      model:      OR_MODEL,
      max_tokens: 1000,
      temperature: 0.7,
      messages:   toOpenAIMessages(trimmedHistory, buildSystemPrompt())
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData?.error?.message || response.statusText;
    console.error(`[Groq] HTTP ${response.status}: ${msg}`);
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw Object.assign(new Error('empty'), { status: 0 });
  return text;
}

// ── Region Generation API Call ─────────────────────────────────

/** Calls the API to generate a custom 8-stage timeline for a specific region */
async function generateRegionStages(regionName) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No API key saved.');

  const prompt = `You are a strict, highly accurate civic education expert. The user has requested a custom 8-stage timeline of the election process specifically for: "${regionName}".

FIRST, validate if "${regionName}" is a real-world country, state, or recognized geopolitical region that holds democratic elections. If it is fictional (e.g., "Narnia", "Gotham") or gibberish (e.g., "asdf"), you must reject it.

You must return your answer ONLY as a raw JSON object. Do not include markdown blocks.

JSON SCHEMA:
{
  "isValidRegion": true or false,
  "normalizedName": "The proper name of the region if valid (e.g. 'United States' instead of 'usa')",
  "errorMessage": "If isValidRegion is false, provide a short friendly error explaining why. Otherwise empty.",
  "stages": [ // If valid, provide exactly 8 stage objects. If invalid, this can be empty.
    {
      "id": 1, 
      "slug": "unique-string",
      "label": "Name of the stage",
      "emoji": "🇺🇸", 
      "timing": "When it happens (e.g. 'November', '4 weeks before')",
      "color": "#1A73E8", 
      "description": "A 3-4 sentence highly accurate, factual explanation of this specific stage tailored perfectly to the laws of ${regionName}. Do NOT hallucinate.",
      "keyPoints": [
        { "label": "Key Fact 1", "value": "Specific detail" },
        { "label": "Key Fact 2", "value": "Specific detail" },
        { "label": "Key Fact 3", "value": "Specific detail" },
        { "label": "Key Fact 4", "value": "Specific detail" }
      ],
      "callout": "💡 A fascinating, hyper-local, and factually verified fact about this stage in ${regionName}.",
      "suggestedQuestions": [
        "A relevant question 1?",
        "A relevant question 2?",
        "A relevant question 3?"
      ]
    }
  ]
}`;

  const response = await fetch(OR_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OR_MODEL,
      response_format: { type: "json_object" },
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || response.statusText);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  
  if (!text) throw new Error('Empty response from AI');
  
  try {
    const parsed = JSON.parse(text);
    
    // Validate region via AI
    if (parsed.isValidRegion === false) {
      throw new Error(parsed.errorMessage || 'Please enter a valid real-world country or region.');
    }
    
    if (!parsed.stages || !Array.isArray(parsed.stages) || parsed.stages.length === 0) {
      throw new Error('AI returned invalid JSON format.');
    }
    
    // Globally update the stages array
    STAGES = parsed.stages;
    currentStageIndex = 0;
    
    return parsed.normalizedName || regionName;

  } catch (err) {
    console.error('JSON Parse Error:', text);
    throw new Error(err.message || 'Failed to parse the custom timeline JSON.');
  }
}

/**
 * Send a message with:
 *   - Client-side cooldown (3.1s between requests)
 *   - Auto-retry with exponential backoff on 429 (3 retries: 5s, 10s, 20s)
 */
async function sendMessageToAI(userText) {
  conversationHistory.push({ role: 'user', content: userText });
  const trimmedHistory = conversationHistory.slice(-20);
  const apiKey = getApiKey();

  // Demo mode
  if (!apiKey) {
    const demo = getDemoResponse(userText);
    conversationHistory.push({ role: 'assistant', content: demo });
    return demo;
  }

  setTypingLabel('Thinking…');
  await waitForRateLimit();
  lastRequestTime = Date.now();

  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const text = await callAPIOnce(trimmedHistory, apiKey);
      conversationHistory.push({ role: 'assistant', content: text });
      setTypingLabel('Thinking…');
      return text;

    } catch (err) {
      const is429    = err.status === 429;
      const is401    = err.status === 401;
      const is403    = err.status === 403;
      const isServer = err.status >= 500;
      const isRetryable = (is429 || isServer) && !is401 && !is403;

      if (!isRetryable || attempt === MAX_RETRIES) {
        conversationHistory.pop();
        setTypingLabel('Thinking…');

        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          throw new Error('Connection error. Please check your internet connection.');
        }
        if (is401 || is403) {
          throw new Error('Invalid API key. Please open ⚙️ Settings and paste your Groq key (starts with gsk_).');
        }
        if (is429) {
          throw new Error('You\'ve hit the free tier rate limit. Please wait a minute and try again, or send messages more slowly.');
        }
        if (isServer) {
          throw new Error('The AI service is temporarily unavailable. Please try again in a moment.');
        }
        if (err.status === 0) {
          throw new Error("I couldn't generate a response. Could you rephrase your question?");
        }
        throw new Error(`Error ${err.status}: ${err.message}`);
      }

      // Exponential backoff
      const waitSec = 5 * Math.pow(2, attempt);
      attempt++;
      setTypingLabel(`Rate limit — retrying in ${waitSec}s… (${attempt}/${MAX_RETRIES})`);
      lastRequestTime = Date.now();
      await new Promise(r => setTimeout(r, waitSec * 1000));
      setTypingLabel('Retrying…');
    }
  }
} // end sendMessageToAI

// ── Demo Responses ────────────────────────────────────────────

function getDemoResponse(question) {
  const stage = STAGES[currentStageIndex];
  const q = question.toLowerCase();

  if (q.includes('register') || q.includes('registration')) {
    return `Voter registration is the process of adding your name to the official list of eligible voters — the foundation of participating in any democratic election.\n\nMost countries require citizens to register before they can vote. The process typically involves providing proof of identity, citizenship, and your current address. Deadlines usually fall 15 to 30 days before election day, though this varies significantly by jurisdiction.\n\nSome countries, like Canada and Australia, use automatic registration — every eligible citizen is automatically enrolled when they interact with government services. Others require voters to actively register, which is why organizations conduct registration drives.\n\nWould you like to know more about automatic registration, registration deadlines, or what documents you might need?`;
  }
  if (q.includes('snap election') || q.includes('call an election')) {
    return `A snap election — also called an early election — is one called before the scheduled date. In parliamentary systems, the ruling government or head of state can dissolve parliament and call an election at any time, often when they believe current public sentiment gives them an advantage.\n\nIn presidential systems like the United States, election dates are constitutionally fixed, so snap elections are not possible at the federal level. However, many parliamentary democracies like the United Kingdom, Canada, and Australia have historically allowed snap elections.\n\nThe strategic element is significant: a prime minister trailing in polls has little incentive to call early, while one with strong approval ratings might call a snap election to "lock in" their majority before sentiment shifts.\n\nWould you like to know more about how different electoral systems handle election timing?`;
  }
  if (q.includes('count') || q.includes('tally') || q.includes('ballot')) {
    return `Counting votes is one of the most carefully monitored steps in the entire electoral process. After polls close, election officials collect all ballots and begin counting under strict observation from representatives of all major parties, independent monitors, and often international observers.\n\nMost modern elections use electronic counting machines called tabulators for speed and consistency. However, close races often trigger hand counts — a manual recount of every ballot. In both cases, the total number of ballots counted must exactly match the number of voters checked in at each polling location.\n\nBallots that can't be read clearly — due to damage, stray marks, or ambiguous choices — are set aside and reviewed by a bipartisan canvassing board that applies specific legal standards to determine voter intent.\n\nWould you like to know what triggers an automatic recount, or how election audits work?`;
  }
  if (q.includes('inaugur') || q.includes('sworn in') || q.includes('oath')) {
    return `The inauguration — also called the swearing-in ceremony — is the formal event that transfers power from the outgoing officeholder to the newly elected winner.\n\nThe centerpiece of every inauguration is the oath of office: a solemn, constitutionally required promise to uphold the law and faithfully execute the duties of the position. Once the oath is taken, the transfer of power is complete and legally binding.\n\nThis peaceful, ceremonial transfer of power is widely considered one of democracy's most important features — it demonstrates that authority flows from the people through elections, not from personal loyalty or force.\n\nWould you like to know more about what happens during the transition period before inauguration?`;
  }

  return `That's a thoughtful question! You're exploring the "${stage.label}" stage — ${stage.timing}.\n\n${stage.description.split('.').slice(0, 2).join('.')}.\n\nI'm currently in demo mode. To unlock full AI-powered answers using Llama 3.3 (free!), click ⚙️ Settings and paste a free Groq key from console.groq.com — no credit card needed.\n\nWhat else would you like to know about the electoral process?`;
}
