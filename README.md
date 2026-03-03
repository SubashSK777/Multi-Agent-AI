# Nexus: Multi-Agent AI Engine

## Project Summary
Nexus is an advanced AI application that leverages a Multi-Agent System (MAS) framework built directly into the browser. Originally implemented with CrewAI over Python, it has now been fully refactored and modernized using **Puter.js** to provide seamless, intuitive, and serverless AI orchestration. 

This application takes an ethical dilemma or complex scenario and runs it sequentially through a team of specialized AI agents—ranging from *Moral Analyzers* to *Legal Evaluators*—before generating a cohesive final synthesis.

### Key Features
- **Serverless AI Execution:** Powered entirely by `puter.js`, requiring no backend setup or API keys to start.
- **Beautiful Dark UI:** A highly intuitive, visually pleasing dark theme utilizing the *Outfit* font, glassmorphism, and smooth micro-animations.
- **Multi-Agent Collaboration:** A coordinated pipeline of agents (Scenario Creator, Moral Analyzer, Emotional Evaluator, Consequence Evaluator, and Final Decider) evaluate prompts sequentially.
- **Dynamic Context Passing:** Each agent builds upon the insights of the previous step.
- **PDF Export:** Effortlessly download the final synthesis as a nicely formatted PDF.

---

## Architecture Flow
### 1. The Scenario is Defined
The user inputs a complex dilemma (like choosing between saving a baby or a world leader).

### 2. Multi-Agent Pipeline
The application triggers a sequential run of specialized agents:
- **📝 Scenario Creator:** Outlines the core conflict.
- **⚖️ Moral Analyzer:** Assesses ethical considerations.
- **❤️ Emotional Evaluator:** Evaluates the empathetic and emotional impact.
- **🌍 Consequence Evaluator:** Projects the broader societal implications.
- **🏛️ Final Decider:** Integrates all insights to provide a definitive choice.

### 3. Final Synthesis & Export
The UI beautifully animates each agent's active status. Upon completion, a formatted markdown synthesis is presented to the user, with the option to download it seamlessly.

---

## Tech Stack
- **Frontend Core:** HTML5, CSS3, ES6 JavaScript
- **AI Backend:** [Puter.js](https://puter.com/) (`puter.ai.chat()`)
- **Document Export:** `html2pdf.js`
- **Aesthetic Tone:** Custom-built modern CSS featuring deep space dark colors (`#0d1117`), cyan/purple gradients, and glass blur effects.

---

## Getting Started

1. **Clone the Repository**
```sh
git clone https://github.com/SubashSK777/Multi-Agent-AI.git
cd Multi-Agent-AI
```

2. **Run the Application**
Since this project is completely serverless and runs on browser APIs, you simply need to serve the directory!
Using python:
```sh
python -m http.server 8000
```
Or using Node `serve`:
```sh
npx serve
```

3. **Open your Browser**
Navigate to `http://localhost:8000` to start interacting with Nexus.

---

## Contact
For any inquiries, feel free to reach out:
**Email:** subashsk11831@gmail.com
