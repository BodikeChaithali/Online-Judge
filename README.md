# OnlineJudge

A full-stack online coding judge platform for competitive programming. Practice coding problems, improve problem-solving skills, participate in contests, and track your progress.

---

# 📋 Tech Stack

## Frontend

* **React** - UI library
* **Vite** - Build tool and development server
* **React Router** - Routing
* **CSS** - Styling

## Backend

* **Node.js** - JavaScript runtime
* **Express.js** - Web framework
* **MongoDB** - Database
* **Mongoose** - MongoDB ODM
* **CORS** - Cross-origin resource sharing
* **dotenv** - Environment variable management

## Code Execution

* **Docker** - Secure sandboxed code execution
* **Ubuntu 22.04** - Sandbox environment
* **GCC**
* **G++**
* **OpenJDK 17**
* **Python 3**

---

# 📋 Prerequisites

* Node.js (v22 or later)
* npm
* Docker
* Docker Compose
* MongoDB (only if running without Docker)

> **Important**
>
> Docker **must** be installed and the Docker daemon must be running before using the compiler.
>
> The backend launches sandbox containers using the Docker CLI.

---

# 🚀 Running the Project

There are two supported ways to run the project.

---

## Option 1 — Local Development

### Clone the Repository

```bash
git clone https://github.com/BodikeChaithali/Online-Judge.git
cd Online-Judge
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Runs at:

```text
http://localhost:3000
```

### Frontend

Open another terminal.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at:

```text
http://localhost:5173
```

### Build the Sandbox Image

```bash
docker build -t onlinejudge-sandbox ./sandbox
```

This only needs to be rebuilt if the `sandbox/Dockerfile` changes.

### Start Docker

Ensure Docker Desktop (Windows/macOS) or the Docker daemon (Linux) is running before using the **Run Code** feature.

---

## Option 2 — Docker Compose

### Clone Repository

```bash
git clone https://github.com/BodikeChaithali/Online-Judge.git
cd Online-Judge
```

### Configure Environment Variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Build the Sandbox

```bash
docker build -t onlinejudge-sandbox ./sandbox
```

### Start Application

```bash
docker compose up --build
```

This starts:

* MongoDB
* Backend
* Frontend

Backend:

```text
http://localhost:3000
```

Frontend:

```text
http://localhost:5173
```

### Stop

```bash
docker compose down
```

---

# 🐳 Docker Images

Docker Hub images:

* `bodikechaithali/onlinejudge-backend`
* `bodikechaithali/onlinejudge-frontend`
* `bodikechaithali/onlinejudge-sandbox`

---

# 🔒 Sandbox Security

Each submission executes inside an isolated Docker container with:

* No network access
* Memory limit
* CPU limit
* Process limit
* Dropped Linux capabilities
* No new privileges
* Temporary filesystem
* Non-root execution

---

# 🌍 Default URLs

Frontend

```text
http://localhost:5173
```

Backend

```text
http://localhost:3000
```

MongoDB

```text
mongodb://localhost:27017
```

---

# ⚙️ Environment Variables

## Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
HOST_PROJECT_PATH=
```

**HOST_PROJECT_PATH Example**

Linux

```text
/home/username/Online-Judge/backend
```

macOS

```text
/Users/username/Online-Judge/backend
```

Windows (Docker Desktop)

```text
C:\Users\username\Online-Judge\backend
```

## Frontend

```env
VITE_API_URL=
```

---

# 📝 Notes

* The compiler requires the `onlinejudge-sandbox` Docker image.
* Docker must be running before executing code.
* If `sandbox/Dockerfile` changes, rebuild the sandbox image.
* If backend or frontend Dockerfiles change, rebuild using:

```bash
docker compose up --build
```
