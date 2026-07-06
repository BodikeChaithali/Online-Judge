# 🚀 Online Judge

An end-to-end coding platform that enables users to solve programming problems, execute code securely in isolated Docker containers, submit solutions, receive AI-powered code analysis, and track their progress through leaderboards and personal statistics.

## ✨ Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Profile management

### 💻 Coding Environment

* Browse coding problems
* Filter problems by difficulty
* Rich code editor
* Support for custom input
* Automatic draft saving
* Multi-language support

### ⚡ Code Execution

* Secure Docker-based sandbox
* Instant code execution
* Runtime output display
* Compilation and runtime error handling

### 📤 Submissions

* Submit solutions
* View submission history
* Track verdicts
* Monitor execution status

### 🤖 AI Code Review

* Time complexity estimation
* Space complexity estimation
* Code quality suggestions
* Edge-case detection

### 🏆 Leaderboard & Profile

* Global leaderboard
* Difficulty-based scoring
* User statistics
* Solved problems overview

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* React Router
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google Gemini API

## Code Execution

* Docker
* Ubuntu 22.04
* GCC
* G++
* OpenJDK 17
* Python 3

## Deployment

* AWS EC2
* Docker
* Docker Compose

---

# 🏗️ Project Structure

```text
Online-Judge/
│
├── frontend/
├── backend/
├── sandbox/
├── docker-compose.yml
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

* Node.js (v22 or later)
* npm
* Docker
* Docker Compose

Docker must be installed and running before using the code execution feature.

---

# Local Development

## Clone the Repository

```bash
git clone https://github.com/BodikeChaithali/Online-Judge.git

cd Online-Judge
```

## Backend

```bash
cd backend

npm install

cp .env.example .env

npm start
```

Runs on:

```text
http://localhost:3000
```

---

## Frontend

Open a new terminal.

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

## Build Sandbox Image

```bash
docker build -t onlinejudge-sandbox ./sandbox
```

---

# Docker Compose

Copy environment files.

```bash
cp backend/.env.example backend/.env

cp frontend/.env.example frontend/.env
```

Build the sandbox.

```bash
docker build -t onlinejudge-sandbox ./sandbox
```

Start the application.

```bash
docker compose up --build
```

Stop all services.

```bash
docker compose down
```

---

# 🌐 Default URLs

| Service  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:5173     |
| Backend  | http://localhost:3000     |
| MongoDB  | mongodb://localhost:27017 |

---

# ⚙️ Environment Variables

## Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
HOST_PROJECT_PATH=
GEMINI_API_KEY=
```

## Frontend

```env
VITE_API_URL=
```

---

# 🌍 Supported Languages

* C
* C++
* Java
* Python

---

# 🔒 Secure Code Execution

Every code submission runs inside an isolated Docker container with multiple security restrictions.

* Network disabled
* CPU limits
* Memory limits
* Process limits
* Non-root execution
* Dropped Linux capabilities
* Temporary filesystem
* Automatic container cleanup

This ensures user programs execute safely without affecting the host system.

---

# 🤖 AI Code Analysis

The integrated AI review system analyzes submitted code and provides:

* Time complexity estimation
* Space complexity estimation
* Code review and improvement suggestions
* Detection of possible edge cases

---

# 🐳 Docker Images

* `bodikechaithali/onlinejudge-frontend`
* `bodikechaithali/onlinejudge-backend`
* `bodikechaithali/onlinejudge-sandbox`

---

# 🎥 Demo

**Live Demo**

https://ojchaithali.me

**Video Walkthrough**

https://www.loom.com/share/81556f3cfcb34c2a997fcdf9fb60c53e

---

# 👩‍💻 Author

**Bodike Chaithali**

GitHub: https://github.com/BodikeChaithali

---

If you found this project useful, consider giving it a ⭐ on GitHub.
