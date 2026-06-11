# OnlineJudge

A full-stack online coding judge platform for competitive programming. Practice coding problems, improve problem-solving skills, participate in contests, and track your progress.

## 📋 Prerequisites

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **CSS** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (local or cloud instance)

## How to Run

### Step 1: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other configurations
npm start
```

Backend runs on `http://localhost:5000`

### Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend API URL if different
npm run dev
```

Frontend runs on `http://localhost:5173`

### Step 3: Access Application

Open your browser and go to `http://localhost:5173`

---

**Both backend and frontend servers must be running simultaneously.**
