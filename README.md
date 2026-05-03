# ElectionGuide — Interactive Election Process Assistant

**Live Demo:** [https://Chandrakantjhawar.github.io/election-assistant/](https://Chandrakantjhawar.github.io/election-assistant/)

## 1. Chosen Vertical
**Civic Education & Democratic Processes.**  
ElectionGuide is a specialized educational tool designed to demystify how democratic elections work. It breaks down the complex, multi-month electoral cycle into an accessible, 8-stage interactive timeline, bridging the knowledge gap for everyday citizens, first-time voters, and students.

## 2. Approach and Logic
The core philosophy behind this project is **structured learning paired with conversational AI**. 
Instead of dropping users into an intimidating blank chat interface, the application guides them through a linear timeline (from "Announcement" to "Inauguration"). 

- **Stateful Context:** As the user navigates through the stages, the underlying UI state updates. 
- **Context-Aware AI:** The AI (powered by Meta Llama 3.3 70B via Groq) is dynamically fed the user's current timeline stage via a system prompt. This ensures the AI's responses are contextually relevant to what the user is currently reading on the screen.
- **Client-Side Architecture:** To ensure high portability and zero hosting costs, the entire application logic, state management, and API orchestration happen client-side using Vanilla JavaScript, HTML, and CSS.

## 3. How the Solution Works
### Architecture
The app consists of four main modules:
- `stages.js`: The data model. Contains the 8 predefined electoral stages, their descriptions, key data points, and context-specific suggested questions.
- `timeline.js`: The state machine. Handles UI navigation, progress bar updates, and rendering the dynamic stage detail cards.
- `chat.js`: The messaging UI. Handles rendering user/AI message bubbles, managing the DOM scroll state, and displaying contextual suggestion chips.
- `api.js`: The network layer. Manages the connection to the Groq API (Llama 3.3 70B). It handles `localStorage` key retrieval, conversation history truncation (to manage token limits), and implements a robust **exponential backoff (5s → 10s → 20s)** to gracefully handle rate limits.

### User Flow
1. **Onboarding:** The user is greeted with a "Demo Mode" fallback that provides pre-written educational responses.
2. **API Configuration:** The user clicks the ⚙️ Settings gear and inputs a free Groq API key (saved securely to browser `localStorage`).
3. **Exploration:** The user navigates the 8 timeline stages.
4. **Interaction:** At any stage, the user can click a "Suggested Question" chip or type their own query. The AI responds contextually based on the active stage.

## 4. Assumptions Made
1. **Generic Democratic Model:** Because electoral systems vary wildly across the globe (Parliamentary vs. Presidential, Proportional Representation vs. First-Past-The-Post), the 8 stages outlined in the app assume a generalized, international standard for democratic elections. The AI is instructed to note geographic variations when answering specific questions.
2. **API Key Management:** It is assumed that the end-user can acquire a free Groq API key. To mitigate the UX friction of this assumption, detailed instructions are provided in the UI, and a pre-written "Demo Mode" ensures the app is not broken if a key is not provided.
3. **Modern Browser Availability:** The application assumes the user is on a modern browser that supports ES6 features (Promises, async/await), CSS Variables, Flexbox, and standard `localStorage`.
4. **Rate Limiting:** It is assumed the Groq free tier limit is 30 requests per minute. A client-side cooldown of 2.2 seconds between messages is enforced to prevent the user from accidentally triggering a 429 error under normal use.

---
*Built with Vanilla HTML, CSS, and JavaScript. No external dependencies.*
