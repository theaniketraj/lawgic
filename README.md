# RIZZ.ie — AI Avatar Chatbot (React)

A lightweight React-based AI avatar chatbot UI with a 3D avatar (Three.js), local chat session management, toast notifications, voice input support (Web Speech API), file attachments, and a responsive sidebar for session controls.

This README was generated from the repository source and documents how the app is organized, how to run it locally, the main components and context API, extension points (AI backend, TTS/STT), and troubleshooting tips.

## Table of contents

- About
- Features
- Tech stack
- Project structure (key files)
- Quick start
  - Prerequisites
  - Install
  - Run (development)
  - Build (production)
  - Tests
- Usage / UI guide
  - Keyboard shortcuts
  - Global window helpers
- Context & state (shapes)
- Persistence / localStorage keys
- Extending & integration points
  - Connecting to an AI backend
  - Adding TTS / STT providers
- Avatar (Three.js) notes
- Troubleshooting
- Contributing
- License

## About

RIZZ.ie is a front-end prototype for an AI chatbot that presents a friendly 3D avatar alongside a chat UI. It demonstrates client-side conversation management, session history, voice input (using the browser Web Speech API), basic emotion analysis, and a simple avatar rendered with Three.js.

This project is built with Create React App and is intended as a UI reference and local demo — it does not include any remote AI model or API integration out of the box.

## Features

- 3D avatar rendered with Three.js (simple head, eyes, mouth).
- Chat UI with user and bot messages, typing indicator, and message timestamps.
- Session management: create, switch, and persist multiple chat sessions in localStorage.
- Conversation memory (client-side) with a simple sidebar UI to view and clear memory.
- Voice input using the Web Speech API (if supported by the browser).
- File upload (images and documents) with placeholder handling.
- Toast notifications with a global `window.showToast` helper for quick messages.
- Welcome screen and keyboard shortcuts (Escape to close sidebar, Ctrl+M to toggle sidebar).

## Tech stack

- React 19 (Create React App)
- Three.js (simple avatar)
- Font Awesome (icons)
- CSS modules / plain CSS
- LocalStorage for persistence

Dependencies are defined in `package.json` (notable ones: `react`, `react-dom`, `react-scripts`, `three`, `react-icons`, `@fortawesome/fontawesome-free`).

## Project structure (key files)

- `package.json` — npm scripts and dependencies.
- `public/index.html` — CRA HTML template; includes Font Awesome + Three.js script usage in `sample.html`.
- `sample.html` — standalone demo-like page showcasing avatar layout and styles (useful reference).
- `src/index.js` — app entrypoint.
- `src/App.js` — top-level layout and sidebar toggle logic.
- `src/context/ChatContext.js` — core app state (chat sessions, messages, memory, TTS/voice flags).
- `src/components/Sidebar.js` — session controls, chat history, memory, and settings UI.
- `src/components/ChatSection.js` — message list, input, voice modal, attachments.
- `src/components/AvatarSection.js` — Three.js avatar setup and simple emotion-driven appearance.
- `src/components/ToastContainer.js` and `src/components/Toast.js` — toast notification system.
- `src/*.css` and `src/components/*.css` — styles for layout and components.

## Quick start

Prerequisites

- Node.js (14+ recommended) and npm
- A modern browser (Chrome, Edge, or Firefox) for development. For voice input and some Web Speech features use Chromium-based browsers for best support.

Install

```bash
# from the project root (where package.json lives)
npm install
```

Run (development)

```bash
npm start
```

This starts the CRA development server and opens the app at <http://localhost:3000> by default.

Build (production)

```bash
npm run build
```

The production build will be written to the `build/` folder (already present in the repository). You can then serve this with any static file server.

Tests

```bash
npm test
```

The project uses the default Create React App testing setup. There are no unit tests included in the repository by default apart from the CRA scaffold.

## Usage / UI guide

- On first load a welcome screen is shown for ~4 seconds. The app initializes a new chat and shows a welcome bot message.
- Sidebar: click the menu button (top-left) to open/close the sidebar. It contains:
  - New Chat (create new session)
  - Recent Chats (switch sessions)
  - Clear All History
  - Audio/TTS toggle
  - Clear Memory
  - Profile Settings placeholder
- Chat area:
  - Type into the input and press Enter or click the paper-plane button to send.
  - Attach files/images via the paperclip button (image and document support is stubbed: it shows a toast and adds a placeholder bot reply).
  - Voice: open the voice modal with the microphone button; uses `window.SpeechRecognition` / `webkitSpeechRecognition` if available.

Keyboard shortcuts

- Escape: closes the sidebar when open.
- Ctrl + M: toggles the sidebar.

Global helpers

- The toast system exposes `window.showToast(message, type, duration)` for use in the console or other scripts. Example:

```js
window.showToast('Hello world', 'success', 3000);
```

Type can be `info` (default), `success`, `warning`, or `error`.

## Context & state (shapes)

The app uses a React Context in `src/context/ChatContext.js`. Below are the important pieces of state and the shapes you can expect:

- messages: Array of message objects
  - { id: number|string, text: string, sender: 'user'|'bot', timestamp: ISOString }

- conversationMemory: Array of { role, content } objects used for contextual memory display

- chatSessions: Map (object) of chatId -> session object
  - session = { id, title, messages: [...], memory: [...], createdAt, lastActive }

- chatHistory: Array of session summaries used by the sidebar
  - { id, title, preview, lastActive }

- currentChatId: string | null

- showWelcomeScreen: boolean (true initially, auto-dismissed after ~4s)

API provided by context (functions available via useChatContext):

- addMessage(text, sender) — append a message to the current session.
- processMessage(message) — in the UI code this causes client-side bot replies (see below) — extend to call a remote AI.
- createNewChat() — creates and switches to a new chat session.
- switchToChat(chatId) — switch to an existing session.
- clearChatHistory() — removes all sessions and resets the app to a new welcome session.
- clearMemory() — clears conversation memory.
- toggleTTS() — toggles the `ttsEnabled` flag.

Note: `processMessage` in the current client is a lightweight handler that simulates the bot response (look inside `ChatContext.js` in the `generateResponse` implementation). To connect a real AI backend, replace or extend `processMessage` to call your API, then call `addMessage(responseText, 'bot')`.

## Persistence / localStorage keys

The app persists sessions and data to localStorage under the following keys:

- `chatSessions` — JSON object of all sessions
- `chatHistoryList` — array of session summaries (sidebar list)
- `currentChatId` — active session id
- `conversationMemory` — saved memory entries
- `chatHistory` — legacy key for recent messages (still cleaned up by the app)

When clearing history the app removes these keys and re-initializes a new session.

## Extending & integration points

Connecting to an AI backend

- Add a network call in `src/context/ChatContext.js` inside `processMessage` or `generateResponse`. Typical flow:
  1. When the user sends a message, call `addMessage(userText, 'user')`.
  2. set `isTyping(true)` and `status('Thinking...')`.
  3. POST to your AI endpoint (e.g., an OpenAI proxy, custom model API) with the conversation context and any stored memory.
  4. On response, call `addMessage(botText, 'bot')`, update `conversationMemory` if needed, and set `isTyping(false)`.

Security note: do not embed secret API keys in client-side code. Host any key-protected AI calls on a server-side component or use a secure API gateway.

Adding TTS / STT providers

- TTS (Text-to-speech): The UI contains a `ttsEnabled` flag. You can integrate browser TTS (`speechSynthesis`) or a dedicated provider (AWS Polly, Azure TTS, Google Cloud TTS) by adding a function which plays audio when a bot message is added.
- STT (Speech-to-text): The voice input currently uses the Web Speech API (`SpeechRecognition`). You can adapt it to use a remote STT service by recording audio in the browser and sending the audio blob to your STT API, then emitting the recognized transcript into the UI.

## Avatar (Three.js) notes

- The avatar is implemented in `src/components/AvatarSection.js` and uses `window.THREE` (Three.js). The project includes Three in `public/index.html` with a CDN link and also depends on `three` in package.json.
- The avatar is a simple constructed mesh (head, eyes, mouth). Emotion changes update the mouth color/scale. Replace the simple geometry with a model loader (GLTF) to use a richer avatar.
- The repository also contains `sample.html` which demonstrates a layout and standalone usage of the avatar styles and structure.

## Troubleshooting

- Speech recognition not working:
  - The Web Speech API is not implemented in all browsers. Use Chrome or Edge (Chromium) for the best support. The UI will show a toast if the browser doesn't support speech recognition.

- Three.js / WebGL errors:
  - If the canvas is blank, ensure your browser and GPU support WebGL. Check the browser console for errors.

- LocalStorage / session persistence issues:
  - If you see JSON parse errors in the console, try clearing localStorage for this site and reloading.

- Build issues (react-scripts):
  - Ensure Node.js and npm versions are compatible with the project's dependencies. Update or reinstall node_modules if needed.

## Contributing

- This project is scaffolded with Create React App. Small UI fixes, accessibility improvements, or adding a backend integration are welcome.

Suggested workflow:

```bash
# create a branch
git checkout -b feat/add-ai-backend
# implement changes
npm install
npm start
# run tests
npm test
```

If you add any server-side code for AI calls, keep secrets off the client.

## License

This repository does not include an explicit license file. Add a LICENSE file to indicate how the project may be used.

---

If you'd like, I can also:

- Add a short `CONTRIBUTING.md` and `LICENSE` (MIT) file.
- Wire up a minimal serverless function example that proxies requests to an AI provider (no secrets in repo) and adjust `ChatContext` to use it.

Tell me which of those you'd like next and I will implement it.
