
---

# AlgoMentor - Elevate Your DSA Skills with AI

**Learn, Debug, and Succeed** with AI-powered assistance.

AlgoMentor is an AI-powered learning web application designed to help users master Data Structures and Algorithms (DSA) through real-time debugging support, personalized learning paths, and AI-generated challenges.

## Features

- **AI-Based DSA Challenges**: Problems generated based on user-selected difficulty levels with intentional bugs for learning.
- **AI Chatbot**: Get answers to DSA-related questions using a locally running Qwen AI model.
- **Generative Learning**: Automatically generated content on DSA topics like arrays, linked lists, and more.

## Challenges

We faced inconsistencies while integrating AI models and running them locally. To overcome this:
- **Optimized prompts** for better response quality from Qwen.
- Switched to local **LLM (Qwen via Ollama)** to avoid API limits and latency.
- Managed **resource constraints** (RAM/CPU) by selecting lightweight models.
- Added a **user feedback system** for continuous improvement.

## Tech Stack

- **Frontend**: Nextjs
- **Backend**: Node.js, Express.js
- **Database**: Prism ORM
- **AI**: Ollama (for running Qwen locally)

## Getting Started

### Prerequisites

- Prisma
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/psykickguy/AlgoMentor
   ```
2. Navigate to the project directory:
   ```bash
   cd AlgoMentor
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Install and run Ollama:
```bash
ollama pull qwen2.5-coder:1.5b
ollama run qwen2.5-coder:1.5b
```
### Environment Variables

Create a `.env` file and add:

```env
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen2.5-coder:1.5b
```

### Run the Project

Start the development server:
```bash
npm run dev
```

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Push and create a pull request.

## License

Licensed under the MIT License. See [LICENSE](LICENSE).

---
