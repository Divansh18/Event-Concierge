# ✦ Concierge — AI Corporate Event Planner

A full-stack AI-powered platform that takes a natural language description of a corporate event and returns a structured, AI-generated venue proposal. Built with **NestJS**, **Next.js**, and **MySQL**.

---

## 🏗️ Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend    | NestJS 10, TypeScript, TypeORM   |
| Database   | MySQL 8.x                        |
| AI         | OpenAI GPT-4o mini               |

---

## 📁 Project Structure

```
ai-event-concierge/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── event/
│   │   │   ├── dto/
│   │   │   │   └── create-event.dto.ts    # Input validation
│   │   │   ├── ai.service.ts              # OpenAI integration
│   │   │   ├── event.controller.ts        # REST endpoints
│   │   │   ├── event.module.ts
│   │   │   ├── event-search.entity.ts     # TypeORM entity
│   │   │   └── event.service.ts           # Business logic
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── schema.sql                         # MySQL DDL
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # Next.js App
    ├── src/
    │   ├── app/
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx                   # Main page
    │   ├── components/
    │   │   ├── EmptyState.tsx
    │   │   ├── ErrorToast.tsx
    │   │   ├── HistoryPanel.tsx
    │   │   ├── LoadingState.tsx
    │   │   ├── SearchForm.tsx
    │   │   └── VenueCard.tsx
    │   ├── lib/
    │   │   └── api.ts                     # Axios API client
    │   └── types/
    │       └── index.ts
    ├── .env.local.example
    └── package.json
```

---

## ⚡ Local Setup

### Prerequisites
- Node.js 18+
- MySQL 8.x running locally
- OpenAI API key

---

### 1. Database

```bash
# Log into MySQL and run the schema
mysql -u root -p < backend/schema.sql
```

---

### 2. Backend (NestJS)

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
```

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_concierge

OPENAI_API_KEY=sk-your-openai-api-key

PORT=3001
FRONTEND_URL=http://localhost:3000
```

```bash
# Start the API in dev mode
npm run start:dev
```

API will be available at: `http://localhost:3001/api`

---

### 3. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

```bash
# Start the frontend dev server
npm run dev
```

App will be available at: `http://localhost:3000`

---

## 🌐 API Reference

### `POST /api/events`
Submit a new event query and receive an AI-generated venue proposal.

**Request Body:**
```json
{
  "query": "A 10-person leadership retreat in the mountains for 3 days with a $4k budget"
}
```

**Response:**
```json
{
  "id": 1,
  "userQuery": "A 10-person leadership retreat...",
  "venueName": "The Broadmoor",
  "location": "Colorado Springs, Colorado, USA",
  "estimatedCost": "$3,500 – $4,200",
  "whyItFits": "The Broadmoor offers exclusive mountain retreat packages...",
  "amenities": ["Private meeting rooms", "Mountain hiking trails", "In-house catering", "AV equipment", "Spa facilities"],
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### `GET /api/events`
Retrieve all past searches, newest first.

### `DELETE /api/events/:id`
Delete a specific search record.

---

## 🚀 Deployment

### Backend → Railway

1. Push `backend/` to a GitHub repo
2. Create a new Railway project → **Deploy from GitHub**
3. Add a **MySQL** plugin in Railway (or use PlanetScale)
4. Set environment variables in Railway dashboard
5. Railway auto-detects NestJS and runs `npm run start:prod`

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import into **Vercel** → framework preset: Next.js
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
4. Deploy

---

## 🎯 Key Design Decisions

- **`response_format: { type: 'json_object' }`** — Forces OpenAI to return valid JSON every time, eliminating parse failures
- **TypeORM `synchronize: true`** — Auto-creates the MySQL table on first boot (disable in production, use migrations instead)
- **Textarea auto-resize** — UX polish for long event descriptions
- **Typewriter placeholder effect** — Guides users with real-world examples without cluttering the UI
- **Stagger animations** — Page content reveals progressively for a premium feel
- **CORS scoped to frontend URL** — Security best practice; configurable via env var

---

## 📝 License

MIT
