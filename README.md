# 🎙️ VAANI AI – Offline Secure Speech Intelligence Platform

VAANI AI is an offline speech intelligence platform that converts coded missile information into natural English using a local LLM (Ollama) and generates speech using OmniVoice Studio.

---

# Architecture

```
                User
                  │
                  ▼
        React + Vite Frontend
                  │
          HTTP (Port 5000)
                  │
          Flask Backend API
                  │
      ┌───────────┴────────────┐
      ▼                        ▼
 Ollama LLM             OmniVoice Studio
 (Port 11434)           (Port 3900)
      │                        │
      └──────────► Audio ◄─────┘
```

---

# Project Structure

```
VAANI-AI/
│
├── frontend/
│   ├── node_modules/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── ...
│
├── OmniVoice-Studio/
│
└── README.md
```

---

# Requirements

## Operating System

- Windows 11
- Windows 10

---

## Software

Install:

- Python 3.11.x
- Node.js 22+
- Bun
- Git
- Ollama
- FFmpeg
- Visual Studio C++ Redistributable

---

# Install Python Packages

Inside backend

```
cd backend
```

Create virtual environment

```
python -m venv venv
```

Activate

Windows

```
venv\Scripts\activate
```

Install

```
pip install -r requirements.txt
```

If requirements.txt is unavailable

```
pip install flask
pip install flask-cors
pip install requests
pip install python-dotenv
```

---

# Install Frontend

Go to frontend

```
cd frontend
```

Install packages

```
npm install
```

or

```
bun install
```

Run

```
npm run dev
```

or

```
bun run dev
```

---

# Required Node Modules

```
npm install react
npm install react-dom
npm install react-router-dom

npm install axios

npm install antd

npm install lucide-react

npm install react-hot-toast

npm install framer-motion

npm install clsx

npm install tailwindcss

npm install @headlessui/react

npm install @heroicons/react

npm install react-icons
```

If using Vite

```
npm install vite
npm install @vitejs/plugin-react
```

---

# Install Ollama

Download

https://ollama.com/download

Verify

```
ollama --version
```

Pull model

```
ollama pull llama3.2:3b
```

Check

```
ollama list
```

Run manually

```
ollama run llama3.2:3b
```

API

```
http://localhost:11434
```

---

# OmniVoice Studio Setup

Clone

```
git clone https://github.com/debpalash/OmniVoice-Studio.git
```

Go inside

```
cd OmniVoice-Studio
```

Sync

```
uv sync
```

Run

```
uv run uvicorn main:app --app-dir backend --host 127.0.0.1 --port 3900
```

Swagger

```
http://127.0.0.1:3900/docs
```

Health

```
http://127.0.0.1:3900/health
```

---

# Install FFmpeg

Download

https://ffmpeg.org/download.html

Extract

Add

```
C:\ffmpeg\bin
```

to

Environment Variables → PATH

Verify

```
ffmpeg -version
```

---

# Flask Backend

Go

```
cd backend
```

Run

```
python app.py
```

Runs at

```
http://127.0.0.1:5000
```

Health

```
http://127.0.0.1:5000/health
```

---

# Ports

| Service | Port |
|----------|------|
| Frontend | 5173 |
| Flask | 5000 |
| OmniVoice | 3900 |
| Ollama | 11434 |

---

# Startup Order

Always start in this order

### Terminal 1

```
ollama serve
```

---

### Terminal 2

```
cd OmniVoice-Studio

uv run uvicorn main:app --app-dir backend --host 127.0.0.1 --port 3900
```

---

### Terminal 3

```
cd backend

python app.py
```

---

### Terminal 4

```
cd frontend

npm install

npm run dev
```

Open

```
http://localhost:5173
```

---

# Verify Services

## Ollama

```
curl http://localhost:11434/api/tags
```

---

## OmniVoice

```
http://127.0.0.1:3900/health
```

Should return

```json
{
  "status":"ok"
}
```

---

## Flask

```
http://127.0.0.1:5000/health
```

---

# API Flow

```
Frontend

↓

Flask

↓

Ollama

↓

Generated English

↓

OmniVoice

↓

MP3 Audio

↓

Frontend Player
```

---

# Common Errors

## 500 Internal Server Error

Check

- Flask running
- OmniVoice running
- Ollama running

---

## Backend Offline

Start Flask

```
python app.py
```

---

## Voice Not Found

Visit

```
http://127.0.0.1:3900/docs
```

Use

```
GET /v1/audio/voices
```

Choose an available voice.

---

## No Voices Available

Restart OmniVoice

```
uv sync

uv run uvicorn main:app --app-dir backend --host 127.0.0.1 --port 3900
```

---

## Ollama Error

Check

```
ollama list
```

Should contain

```
llama3.2:3b
```

If missing

```
ollama pull llama3.2:3b
```

---

## Port Already In Use

Find

```
netstat -ano | findstr :5000
```

Kill

```
taskkill /PID <PID> /F
```

---

# Production Checklist

- Python 3.11
- Node.js 22+
- Bun installed
- Ollama installed
- llama3.2:3b downloaded
- OmniVoice running
- Flask running
- Frontend running
- FFmpeg installed
- VC++ Redistributable installed

---

# Developed By

**VAANI AI – Offline Secure Speech Intelligence Platform**

Powered by

- React
- Flask
- Ollama
- OmniVoice Studio
- Llama 3.2 3B
