# ⚖️ LAWgic - AI-Powered Legal Advisory for the Indian Judiciary

<div align="center">
  <p><strong>Bridging the gap between cutting-edge AI and the Indian Legal System.</strong></p>
</div>

## Overview

LAWgic is an ambitious, AI-powered judiciary consultancy chatbot designed to empower legal professionals and citizens across India. With the recent and massive digital transformation of the Indian legal landscape, LAWgic provides instant case law research, procedural transitions (e.g., IPC to BNS), and accurate legal document drafting.

Whether you need to understand the new **Bharatiya Nyaya Sanhita (BNS)**, draft an affidavit, or research Supreme Court precedents, LAWgic acts as your intelligent legal daemon.

---

## Key Features

- **Intelligent Legal Research:** Trained on statutory laws, the Constitution of India, and the "Big Three" transitions (IPC $\rightarrow$ BNS, CrPC $\rightarrow$ BNSS, Evidence Act $\rightarrow$ BSA).
- **Smart Drafting:** Generate instant, highly accurate drafting templates for legal notices, affidavits, rent agreements, and more.
- **Modern Chat Interface:** A sleek, fully responsive, glassmorphism-inspired UI tailored for long-form reading and code/text block formatting.
- **Dark/Light Mode:** Seamlessly toggle between dark and light themes with intelligent contrast adjustments and smooth CSS transitions.
- **Accessible & Cross-Platform:** 100% responsive design working flawlessly from desktop browsers down to mobile devices, styled with accessibility in mind.
- **Strict Privacy & PII Handling:** Evaluates prompts while maintaining context and strictly adhering to data privacy standards.

---

## Tech Stack

- **Frontend:** React.js, Context API, CSS3 (Variables & Glassmorphism)
- **Routing & State:** React Router, Custom Chat Hooks
- **Backend & AI:** Node.js, Express, Custom NLP Models (Trained on India Code, Supreme Court Judgments, and Procedural Data)
- **Deployment:** Netlify / Vercel ready

---

## Getting Started

Follow these instructions to get a local copy of LAWgic up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/theaniketraj/lawgic.git
   cd lawgic
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

The application will be available at `http://localhost:3000`.

---

## Disclaimer

**LAWgic is an AI tool and does not constitute professional legal advice.** The information provided by the chatbot is for educational and research purposes only. Always consult a qualified legal practitioner or advocate before making any legal decisions or taking action based on the AI's output.
