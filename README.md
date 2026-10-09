# AI Quiz Manager

A full-stack education platform where teachers generate MCQ quizzes using **Gemini AI**, host **live quiz sessions** with real-time leaderboards, and track **student performance** through analytics.

🔗 **Live Demo:** [ai-quiz-manager.vercel.app](https://ai-quiz-manager.vercel.app)

---

## Features

### For Teachers
- **AI Quiz Generation** — Generate MCQs from any topic using Gemini AI (easy / medium / hard, 1–20 questions)
- **Quiz Management** — Full CRUD: create, edit, delete quizzes
- **Live Quiz Hosting** — Open a room, students join via code, start the quiz in real-time
- **Results & Leaderboard** — View all student submissions, scores, and rankings
- **Analytics** — Score distribution charts, question-wise accuracy, student performance breakdown

### For Students
- **Join Quizzes** — Enter a 6-character join code to take any active quiz
- **Timed Attempts** — Client-side countdown timer per quiz duration
- **Instant Results** — Score, correct/wrong breakdown, and per-question answer review
- **Attempt History** — View all past quiz attempts

### Platform
- **Email OTP Verification** — Account activation via 6-digit OTP (Brevo transactional email)
- **Role-Based Access** — Separate dashboards and API guards for teacher and student roles.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | Component-based UI with type safety |
| Vite 8 | Fast dev server and production build |
| Tailwind CSS 4 | Utility-first styling |
| React Router DOM v7 | Client-side routing with protected routes |
| Axios | HTTP client with auto JWT injection interceptor |
| Socket.IO Client | WebSocket connection for live quiz |
| Recharts | Analytics charts (bar charts, score distribution) |

---

## Project Structure

```
ai-quiz-manager/
├── backend/
│   └── src/
│       ├── app.js                  # Express app (middleware, routes)
│       ├── server.js               
│       ├── config/
│       │   └── db.js               # MongoDB connection
│       ├── models/
│       │   ├── User.js            
│       │   ├── Quiz.js             
│       │   └── Attempt.js         
│       ├── controllers/
│       │   ├── authController.js   # register, verifyOtp, login, getMe
│       │   ├── quizController.js   # CRUD + joinQuiz
│       │   ├── attemptController.js# submit, results, leaderboard
│       │   ├── analyticsController.js
│       │   └── aiController.js
│       ├── routes/
│       │   ├── authRoutes.js       # Rate-limited
│       │   ├── quizRoutes.js
│       │   ├── attemptRoutes.js
│       │   ├── aiRoutes.js
│       │   └── healthRoutes.js
│       ├── middleware/
│       │   ├── auth.js           
│       │   └── errorHandler.js     # Global error handler + 404
│       ├── services/
│       │   ├── aiService.js     
│       │   └── emailService.js     
│        |
│       └── utils/
│           └── jwt.js              # generateToken / verifyToken
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.tsx     # Global auth state + useAuth hook
        ├── services/
        │   ├── api.ts              # Axios instance with JWT interceptor
        │   └── socket.ts           # Socket singleton
        ├── routes/
        │   └── AppRoutes.tsx       # Protected + role-based routing
        ├── components/
        │   └── Navbar.tsx
        └── pages/
            ├── Home.tsx
            ├── Login.tsx / Register.tsx / VerifyOtp.tsx
            ├── TeacherDashboard.tsx / StudentDashboard.tsx
            ├── TeacherQuizList.tsx / CreateQuiz.tsx / EditQuiz.tsx
            ├── TeacherLiveQuiz.tsx
            ├── TeacherQuizResults.tsx / TeacherAnalytics.tsx
            ├── JoinQuiz.tsx / QuizAttempt.tsx / QuizResult.tsx
            └── StudentAttempts.tsx
```

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register, sends OTP (rate-limited) |
| POST | `/verify-otp` | Public | Verify OTP, activate account |
| POST | `/login` | Public | Login — verified users only (rate-limited) |
| GET | `/me` | Private | Get current user |
| PUT | `/me` | Private | Update display name |

### Quizzes — `/api/quizzes`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Teacher | Create quiz |
| GET | `/` | Teacher | List own quizzes (no questions) |
| GET | `/:id` | Teacher (owner) | Get quiz with all questions |
| PUT | `/:id` | Teacher (owner) | Update quiz |
| DELETE | `/:id` | Teacher (owner) | Delete quiz |
| POST | `/join` | Student | Join quiz by code (returns questions without answers) |
| GET | `/:id/results` | Teacher (owner) | All student attempts + stats |
| GET | `/:id/leaderboard` | Teacher (owner) | Ranked leaderboard |
| GET | `/:id/analytics` | Teacher (owner) | Score distribution + question accuracy |

### AI — `/api/ai`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/generate-quiz` | Teacher | Generate quiz via Gemini AI |

### Attempts — `/api/attempts`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Student | Submit attempt, get score |
| GET | `/` | Student | List own attempts |
| GET | `/:id` | Student (owner) | Get attempt with answer review |

---

## Socket.IO Events

### Client → Server
| Event | Role | Payload | Description |
|---|---|---|---|
| `teacher:open-room` | Teacher | `{ joinCode }` | Open a live quiz room |
| `teacher:start-quiz` | Teacher | `{ joinCode }` | Broadcast quiz start to all students |
| `student:join-room` | Student | `{ joinCode }` | Join an open room |
| `student:submit-score` | Student | `{ joinCode, score, totalQuestions, percentage }` | Post score to live leaderboard |

### Server → Client
| Event | Description |
|---|---|
| `room:opened` | Confirmation for teacher |
| `room:joined` | Confirmation for student |
| `room:participant-count` | Updated participant list broadcast to all |
| `quiz:started` | Quiz data (no answers) sent to all students |
| `leaderboard:updated` | Sorted leaderboard broadcast to all |
| `error` | Error message to sender |

> All Socket.IO connections are authenticated — JWT is passed via `socket.handshake.auth.token` and verified in the `io.use()` middleware.

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas or local MongoDB
- [Gemini API Key](https://aistudio.google.com/)
- [Brevo](https://www.brevo.com/) account for transactional email


### 2. Frontend

```bash
cd frontend
npm install
```

```bash
npm run dev      # dev server on port 3000
npm run build    # production build → dist/
```

---

## Key Design Decisions

**Embedded questions in Quiz document** — Questions are Mongoose subdocuments inside Quiz. One query fetches a complete quiz with all questions — no JOIN or extra populate needed.

**Server-side scoring** — Correct answers are never sent to the student client (`correctAnswer` and `explanation` are stripped before sending). Grading happens entirely on the backend after submission, making cheating impossible.

**In-memory Socket.IO rooms** — Live quiz room state (`participants`, `leaderboard`) lives in a `Map` on the server. No persistence needed for temporary session data. For multi-server deployments, replace with the Socket.IO Redis adapter.

**Rate limiting on auth endpoints only** — `express-rate-limit` (20 requests / 15 min / IP) is scoped to `/api/auth` — the attack surface for brute-force. All other routes are protected by JWT.

**OTP with `select: false`** — OTP and `otpExpires` fields are stored in the User document with `select: false`, meaning they never appear in normal queries. Cleared immediately after successful verification.

**Duplicate attempt prevention at two layers** — Manual `findOne()` check before creating, plus a compound unique index `{ quiz: 1, student: 1 }` on the Attempt collection. The database is the final guard against race conditions.

---

## Deployment

**Backend** → [Render](https://render.com/) / Railway
- Start command: `npm start`
- Add all environment variables via the hosting dashboard

**Frontend** → [Vercel](https://vercel.com/) / Netlify
- Build command: `npm run build`
- Output directory: `dist`

---

## License

MIT
