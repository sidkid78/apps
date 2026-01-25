v# My Apps Portfolio

A showcase of AI-powered financial applications built with modern web technologies.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

## 🚀 Live Apps

### Holistic Finance AI
>
> Your AI-Powered Wealth Architect

A comprehensive AI-powered financial advisor featuring predictive wealth forecasting, proactive tax optimization, and a generative AI financial coach.

🔗 **Live:** [holistic-finance-ai-1.vercel.app](https://holistic-finance-ai-1.vercel.app/)

**Features:**

- 🧠 AI Financial Coach powered by Gemini 2.0
- 📈 Predictive wealth forecasting
- 🎯 Tax optimization strategies
- 💳 Account aggregation via Plaid API
- 📊 Real-time portfolio analysis

---

### Subscription Guardian
>
> Never Overpay for Subscriptions Again

A proactive personal finance tool using AI to detect, manage, and optimize recurring expenses.

🔗 **Live:** [subscription-guardian.vercel.app](https://subscription-guardian.vercel.app/)

**Features:**

- 🔍 AI-powered subscription detection
- 🔔 Smart price & trial alerts
- 💰 Savings finder for unused subscriptions
- 📉 Spending trend analysis
- ⚠️ Duplicate subscription detection

---

### Listen & Fix DIY
>
> Shazam for Engines & Appliances

An AI-powered DIY repair assistant that analyzes audio/video/images of broken equipment, diagnoses issues using multimodal AI, and generates custom step-by-step repair guides with local parts availability.

🔗 **Live:** [fix-it-tau.vercel.app](https://fix-it-tau.vercel.app/)

**Features:**

- 🎤 Audio/video/image analysis for diagnosis
- 🔧 Custom step-by-step repair guides
- 📍 Local parts availability search
- 📚 RAG-enhanced technical documentation
- ⚠️ Equipment-specific safety warnings

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Next.js 16, TypeScript |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **AI** | Google Gemini 2.0 |
| **Banking** | Plaid API |
| **Deployment** | Vercel |

## 📁 Project Structure

```text
apps/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Portfolio home page
│   ├── holistic-finance/  # Holistic Finance landing & demo
│   ├── subscription-guardian/  # Subscription Guardian landing & demo
│   └── listen-fix/        # Listen & Fix DIY landing page
├── components/            # Reusable UI components
├── holistic-finance-ai/   # Holistic Finance Vite app (deployed separately)
├── subscription-guardian/ # Subscription Guardian Vite app (deployed separately)
└── diy/                   # Listen & Fix DIY Next.js app (deployed separately)
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📦 Deployment

The portfolio and each app are deployed separately on Vercel:

- **Portfolio:** Auto-deploys from `main` branch
- **Holistic Finance AI:** Deployed from `/holistic-finance-ai` folder
- **Subscription Guardian:** Deployed from `/subscription-guardian` folder
- **Listen & Fix DIY:** Deployed from `/diy` folder (or via [fix-it repo](https://github.com/sidkid78/fix-it))

## 📄 License

MIT © 2024
