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
- **Dynamic Localization:** The app features a "Set Region" engine that uses AI to restructure the entire 8-stage timeline based on a specific country or state's actual laws and procedures.
- **Google-Powered Fact Verification:** Every AI response includes a **"🔍 Verify on Google"** button that opens a pre-filled Google Search with the user's exact question — promoting responsible AI usage and digital literacy globally.

## 3. How the Solution Works
### Architecture
The app consists of four main modules:
- `stages.js`: The data model. Contains the default 8 electoral stages and manages the mutable state for AI-generated regional timelines.
- `timeline.js`: The state machine. Handles UI navigation, progress bar updates, and rendering the dynamic stage detail cards.
- `chat.js`: The messaging UI. Handles rendering user/AI message bubbles and contextual suggestion chips.
- `api.js`: The network layer. Manages the connection to the Groq API. Includes specialized logic for **AI-driven JSON schema generation** and **geographic validation**.

### Key Features
1. **Global Adaptability:** Users can enter any region (e.g., "India", "California", "UK"). The app validates the region via AI and generates a custom, factually accurate 8-stage guide for that specific location.
2. **AI Validation:** The system rejects fictional or invalid locations (e.g., "Narnia") to prevent hallucinations and maintain educational integrity.
3. **Resilient API Handling:** Implements exponential backoff and client-side cooldowns to respect Groq's free-tier rate limits.

### User Flow
1. **Onboarding:** The user starts with a "Generic" global election guide.
2. **Personalization:** The user clicks the 🌍 Region button and enters their location.
3. **AI Generation:** The app generates a custom timeline, updating descriptions, emojis, key facts, and suggested questions.
4. **Interaction:** The user chats with the AI, which now has hyper-local context for that specific region's laws.

## 4. Assumptions Made
1. **Data Accuracy:** While the AI is instructed to be strictly factual and highly accurate, users are advised that the tool is for educational purposes and should be cross-referenced with official local election commission data.
2. **API Key Management:** It is assumed that the end-user can acquire a free Groq API key for full functionality.
3. **Modern Browser Availability:** Supports ES6+ features, CSS Variables, and `localStorage`.
4. **8-Stage Schema:** The application assumes that any democratic process can be meaningfully summarized into 8 distinct logical phases for educational clarity.

---
*Built with Vanilla HTML, CSS, and JavaScript. No external dependencies.*
