# ElectionGuide — Interactive Election Process Assistant

An AI-powered, non-partisan civic education tool that walks users through all 8 phases of the democratic election process, with an interactive Claude-powered chat assistant.

---

## 🚀 Quick Start

1. **Open `index.html`** in any modern web browser — no build step or server required.

2. **Add your API key** (optional, for live AI responses):
   - Open `scripts/api.js`
   - Replace `'YOUR_ANTHROPIC_API_KEY_HERE'` with your [Anthropic API key](https://console.anthropic.com)
   - Without a key, the app runs in **demo mode** with pre-written educational responses

> ⚠️ **Security Note:** Never expose API keys in production frontend code. Use a backend proxy endpoint for real deployments.

---

## 📁 File Structure

```
election-assistant/
├── index.html          ← Main entry point (semantic HTML + accessibility)
├── README.md           ← This file
├── styles/
│   └── main.css        ← Design system tokens, component styles
└── scripts/
    ├── stages.js       ← All 8 election stage data objects
    ├── timeline.js     ← Timeline rendering & navigation logic
    ├── chat.js         ← Chat UI, message rendering, suggestion chips
    └── api.js          ← Anthropic Claude API integration
```

---

## 🗳️ Features

| Feature | Details |
|---------|---------|
| **8-Stage Timeline** | Interactive horizontal timeline — click any stage to jump directly |
| **Stage Detail Cards** | Rich cards with description, 4 key points, and a callout fact |
| **Progress Tracking** | Visual progress bar with stage counter |
| **AI Chat Panel** | Full conversation history (last 10 exchanges), typing indicator |
| **Suggestion Chips** | Context-aware suggested questions per stage |
| **Demo Mode** | Works without API key — educational fallback responses |
| **Accessibility** | ARIA labels, keyboard navigation, screen reader support |
| **Responsive** | Mobile-friendly layout |

---

## 🎨 Design System

| Token | Value | Used for |
|-------|-------|---------|
| `--color-primary` | `#1A73E8` | Buttons, active states, progress |
| `--color-background-info` | `#E8F0FE` | User bubbles, stage icon bg |
| `--color-background-secondary` | `#F8F9FA` | AI bubbles, key point chips |
| `--color-border-tertiary` | `#F1F3F4` | Component borders |
| `--font-family` | Inter | All text |

---

## 🔧 Customization

### Change Stage Data
Edit `scripts/stages.js` — each stage is a plain JS object with `description`, `keyPoints`, `callout`, and `suggestedQuestions`.

### Add a Country Selector
Add a `country` property to each stage and filter/modify content based on selection (Extension Idea #1 from the spec).

### Use a Backend Proxy
Replace the `fetch` call in `api.js` with a call to your own backend endpoint to protect your API key.

---

## 📖 Tech Spec

Based on `election_assistant_techspec.md` — Document version 1.0.

- **AI Model:** `claude-sonnet-4-20250514`
- **Max tokens:** 1,000 per response
- **History limit:** Last 20 messages (10 exchanges)
- **Architecture:** Vanilla HTML/CSS/JS — zero dependencies
