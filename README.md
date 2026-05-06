# LeetCode Assistant

An AI-powered chatbot that helps you understand LeetCode problems without giving away the solution. Enter a problem name or link, then use the suggestion chips or ask your own questions to get hints, explanations, and pattern breakdowns.

## Features

- **Explain this problem** — breaks down what the problem is asking in plain English
- **Give me a hint** — nudges you in the right direction without spoiling the answer
- **Walk me through the approach** — step by step logic, no code
- **Show the pattern** — identifies the algorithm pattern and suggests similar problems
- Custom questions via chat input

## Tech Stack

- **Frontend:** React, TypeScript, Next.js, Tailwind CSS
- **AI:** OpenAI API (GPT-4o-mini)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key

### Environment Variables

Create a `.env.local` file in the root:

```bash
OPENAI_API_KEY=sk-...
```

### Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Author

Gab — [gabtlv](https://github.com/gabtlv)
