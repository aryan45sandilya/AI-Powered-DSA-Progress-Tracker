# 🧠 AI-Powered DSA Progress Tracker

<div align="center">

![DSA Tracker](https://img.shields.io/badge/DSA-Tracker-22c55e?style=for-the-badge&logo=leetcode&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

### 🚀 [Live Demo → ai-powered-dsa-progress-tracker.vercel.app](https://ai-powered-dsa-progress-tracker.vercel.app/)

**The smartest way for students to track LeetCode progress, identify weak topics with AI, and land their dream job.**

[🌐 Live Demo](https://ai-powered-dsa-progress-tracker.vercel.app/) · [🐛 Report Bug](https://github.com/aryan45sandilya/AI-Powered-DSA-Progress-Tracker/issues) · [✨ Request Feature](https://github.com/aryan45sandilya/AI-Powered-DSA-Progress-Tracker/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ✅ **Problem Tracker** | Log solved problems with difficulty, topic, notes & time taken |
| 📋 **DSA Sheets** | Follow Striver A2Z & Top 150 sheets with progress tracking |
| 🏆 **Contest Tracker** | Record contest rankings & visualize rating progression |
| 🤖 **AI Weak Topic Analyzer** | Gemini AI analyzes your patterns & pinpoints weak areas |
| 💡 **Smart Recommendations** | Personalized problem suggestions based on weak topics |
| 🔥 **Streak System** | Daily solving habit tracking with visual rewards |
| 🐙 **GitHub Analyzer** | Analyze GitHub profile to surface DSA repos & language stats |
| 📄 **Resume Generator** | AI generates polished DSA bullet points for your resume |
| 📊 **Activity Heatmap** | GitHub-style heatmap showing year-round solving consistency |

---

## 🌐 Live Demo

> **[https://ai-powered-dsa-progress-tracker.vercel.app/](https://ai-powered-dsa-progress-tracker.vercel.app/)**

- Frontend hosted on **Vercel**
- Backend hosted on **Render**
- Database on **Neon** (PostgreSQL)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — Dark mode UI
- **React Router v6** — Client-side routing
- **TanStack Query** — Server state management
- **Recharts** — Charts & visualizations
- **Lucide React** — Icons

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **PostgreSQL** (Neon)
- **JWT** — Authentication
- **bcryptjs** — Password hashing

### AI & APIs
- **Google Gemini 1.5 Flash** — Weak topic analysis, recommendations, resume generation
- **LeetCode Unofficial API** — User stats & submissions
- **GitHub REST API** — Profile & repo analysis

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or free [Neon](https://neon.tech) cloud DB)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 1. Clone the repo
```bash
git clone https://github.com/aryan45sandilya/AI-Powered-DSA-Progress-Tracker.git
cd AI-Powered-DSA-Progress-Tracker
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_random_secret_key
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
PORT=5000
```

Run database migration:
```bash
npx prisma db push
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 📁 Project Structure

```
AI-Powered-DSA-Progress-Tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database models
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.ts            # Register, login, profile
│   │   │   ├── tracker.ts         # CRUD for solved questions
│   │   │   ├── contests.ts        # Contest tracking
│   │   │   ├── leetcode.ts        # LeetCode API proxy
│   │   │   ├── ai.ts              # Gemini AI endpoints
│   │   │   └── github.ts          # GitHub analyzer
│   │   ├── services/
│   │   │   └── gemini.ts          # Gemini AI service
│   │   └── index.ts               # Express app entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts           # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── Sidebar.tsx        # Responsive sidebar with mobile drawer
│   │   │   ├── StatsCard.tsx      # Reusable stats card
│   │   │   ├── HeatmapChart.tsx   # Activity heatmap
│   │   │   ├── DifficultyBadge.tsx
│   │   │   ├── StreakBadge.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Auth state management
│   │   ├── data/
│   │   │   └── dsaSheets.ts       # DSA sheet data
│   │   ├── pages/
│   │   │   ├── Landing.tsx        # Landing page
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx      # Stats overview
│   │   │   ├── Tracker.tsx        # Problem tracker
│   │   │   ├── DSASheets.tsx      # DSA sheets
│   │   │   ├── Contests.tsx       # Contest tracker
│   │   │   ├── AIAnalyzer.tsx     # AI weak topic analyzer
│   │   │   ├── GitHub.tsx         # GitHub analyzer
│   │   │   ├── Resume.tsx         # Resume generator
│   │   │   └── Heatmap.tsx        # Activity heatmap
│   │   └── App.tsx                # Router setup
│   └── package.json
│
└── README.md
```

---

## 🔑 Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `GITHUB_TOKEN` | GitHub personal access token | ⚡ Recommended |
| `PORT` | Server port (default: 5000) | ❌ |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ✅ |

---

## 📱 Responsive Design

- **Mobile** — Hamburger menu, slide-out drawer, optimized layouts
- **Tablet** — 2-column grids, adjusted spacing
- **Desktop** — Full sidebar, multi-column dashboards

---

## 🤖 AI Features (Gemini 1.5 Flash)

1. **Weak Topic Analyzer** — Analyzes solved problem history, identifies weak topics, gives actionable suggestions
2. **Smart Recommendations** — Suggests 6 problems tailored to weak topics and skill level
3. **Resume Generator** — Creates professional DSA bullet points based on actual stats

---

## 🗄️ Database Schema

- `User` — Auth & profile
- `SolvedQuestion` — Tracked problems
- `Streak` — Daily solving streaks
- `ContestEntry` — Contest history
- `DSASheet` + `SheetQuestion` + `SheetProgress` — Sheet tracking

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License — free to use for learning and portfolio purposes.

---

<div align="center">
  Built with ❤️ for students cracking tech interviews
  <br/><br/>
  <a href="https://ai-powered-dsa-progress-tracker.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-22c55e?style=for-the-badge" alt="Live Demo" />
  </a>
  <br/><br/>
  <strong>⭐ Star this repo if it helped you!</strong>
</div>
