<div align="center">

# ✦ Medix AI — Medical Mentor Lite

### Your AI-Powered Companion for Mastering Medicine

<br/>

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

<br/>

*An intelligent medical education platform that combines **AI-driven terminology exploration**, **interactive 3D anatomy visualization**, **adaptive quizzes**, and **dynamic knowledge graphs** — all in a stunning, modern interface.*

<br/>

---

</div>

<br/>

## 🧬 Overview

**Medix AI** is a full-stack medical learning application designed for medical students, residents, and healthcare professionals. It leverages **Google's Gemini 2.5 Flash** model to deliver real-time, context-aware medical insights — from deep terminology breakdowns to dynamically generated clinical assessments.

The platform features a clean **Nexora-inspired SaaS design system** with smooth Framer Motion animations, responsive layouts, and a premium light-mode aesthetic that keeps the focus on learning.

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔬 Terminology Explorer
- AI-powered medical term definitions
- Pathophysiology & clinical relevance breakdowns
- Intelligent **auto-correct** for misspelled medical terms
- **Related terms** engine for connected learning
- Curated **YouTube video** integration for visual learning

</td>
<td width="50%">

### 🧠 Adaptive Quiz Engine
- **Dynamic question generation** via Gemini AI
- Configurable difficulty: Easy → Hard
- Adjustable question count (5–20)
- Real-time scoring with detailed **explanations**
- Progress tracking with animated **progress bars**

</td>
</tr>
<tr>
<td width="50%">

### 🫀 3D Anatomy Visualizer
- Interactive **Three.js** powered 3D rendering
- Explore anatomical structures in real-time
- Orbital camera controls (rotate, zoom, pan)
- Built with **React Three Fiber** & **Drei**

</td>
<td width="50%">

### 🕸️ Knowledge Graph
- AI-generated **medical knowledge graphs**
- Visualize relationships between diseases, symptoms & drugs
- Interactive **3D force-directed graph** layout
- Click-to-explore node navigation

</td>
</tr>
<tr>
<td width="50%">

### 📜 Study History & Timeline
- Persistent cloud-based activity log synced to Supabase
- Precise **Date & Time timestamps** for each search and quiz attempt
- Real-time page updates bypassing React Query cache
- Interactive cards for rapid review of focus areas

</td>
<td width="50%">

</td>
</tr>
</table>

<br/>

## 🏗️ Architecture

```
medix-ai/
├── server.js                  # Express 5 API server (Gemini AI proxy)
├── index.html                 # Entry point
├── src/
│   ├── App.jsx                # Route definitions & providers
│   ├── main.jsx               # React DOM entry
│   ├── index.css              # Global design tokens & styles
│   ├── App.css                # Application-level styles
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx    # Hero landing with dashboard preview
│   │   ├── Dashboard.jsx      # Study hub with bento-grid layout
│   │   ├── TerminologyExplorer.jsx  # AI term lookup interface
│   │   ├── QuizConfigurator.jsx     # Quiz setup (topic, difficulty)
│   │   ├── QuizEngine.jsx     # Live quiz with scoring engine
│   │   ├── AnatomyVisualizer.jsx    # 3D anatomy viewer
│   │   └── KnowledgeGraphPage.jsx   # Interactive knowledge graph
│   │
│   ├── components/
│   │   ├── TopNavBar.jsx      # Top navigation bar
│   │   ├── SideNavBar.jsx     # Sidebar navigation
│   │   ├── KnowledgeGraph3D.jsx  # 3D graph visualization
│   │   └── ui/               # Reusable UI primitives
│   │       ├── button.jsx
│   │       ├── Badge.jsx
│   │       ├── GlassCard.jsx
│   │       ├── GlassPanel.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── NeonButton.jsx
│   │       ├── ProgressBar.jsx
│   │       ├── Tooltip.jsx
│   │       └── ErrorBoundary.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx     # Shared layout (nav + content)
│   │
│   ├── services/
│   │   ├── apiService.js      # Axios HTTP client
│   │   └── graphService.js    # Knowledge graph API
│   │
│   ├── store/
│   │   └── useAppStore.js     # Zustand global state
│   │
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Utility functions
│
├── tailwind.config.js         # Tailwind theme & plugins
├── vite.config.js             # Vite build configuration
└── package.json
```

<br/>

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 19 + Vite 8 | Component architecture & HMR dev server |
| **Styling** | Tailwind CSS 3.4 | Utility-first styling with custom design tokens |
| **Animations** | Framer Motion 12 | Page transitions, micro-interactions, staggered reveals |
| **3D Rendering** | Three.js + React Three Fiber | Anatomy visualization & knowledge graphs |
| **State** | Zustand 5 | Lightweight global state management |
| **Data Fetching** | TanStack React Query 5 | Server state caching & synchronization |
| **Backend** | Express 5 (Node.js) | REST API proxy for Gemini AI |
| **AI Model** | Google Gemini 2.5 Flash | Medical content generation & quiz creation |
| **Search** | Fuse.js 7 | Client-side fuzzy search |
| **Icons** | Lucide React + Material Symbols | Consistent iconography |
| **Database** | Supabase (PostgreSQL) | Cloud database for user profile, quiz attempts, and activity logs |
| **ORM** | Prisma | Typesafe database schema mapping & query building |

<br/>

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Gemini API Key** — [Get one free here](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/medical-mentor-lite.git
cd medical-mentor-lite

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

Open `.env` and add your API key:

```env
# Gemini API Key (Required for AI generation)
GEMINI_API_KEY=your_api_key_here

# Backend Server Port
PORT=3001
```

### Run the Application

```bash
# Start both frontend (Vite) and backend (Express) concurrently
npm run dev
```

| Service | URL |
|:--------|:----|
| Frontend | `http://localhost:5173` |
| API Server | `http://localhost:3001` |

> **💡 Note:** The app works **without** a Gemini API key — all API endpoints gracefully fall back to realistic mock data, so you can explore the full UI immediately.

<br/>

## 📡 API Endpoints

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/define` | Get AI-generated definition, pathophysiology & clinical relevance |
| `POST` | `/api/related` | Fetch 6 related medical terms |
| `POST` | `/api/quiz` | Generate adaptive quiz questions |
| `POST` | `/api/graph` | Build a medical knowledge graph (nodes + edges) |
| `POST` | `/api/explain` | Get a concise 2-sentence explanation |
| `GET` | `/api/youtube?term=` | Fetch relevant educational YouTube videos |

<br/>

## 🎨 Design System

The UI follows the **Nexora** design language — a clean, light-mode SaaS aesthetic:

- **Typography** — Inter (UI), Space Grotesk (headings), Instrument Serif (display), Manrope (accents)
- **Colors** — Indigo/Violet primary palette with neutral grays
- **Components** — Glass panels, elevated cards, gradient accents
- **Motion** — Staggered entrances, hover lifts, page transitions via Framer Motion
- **Layout** — Responsive bento-grid dashboard with sidebar navigation

<br/>

## 📂 Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run build` | Production build via Vite |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm start` | Start backend server only |

<br/>

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

1. **Fork** the repository
2. Create your feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m "feat: add amazing feature"`
4. Push to the branch — `git push origin feature/amazing-feature`
5. Open a **Pull Request**

<br/>

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<br/>

---

<div align="center">

**Built with 🩺 by medical students, for medical students**

*Powered by Google Gemini AI · React · Three.js*

<br/>

[⬆ Back to Top](#-medix-ai--medical-mentor-lite)

</div>

