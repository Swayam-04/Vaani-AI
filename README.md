# 🎙️ VAANI – Offline Secure Speech Intelligence Platform

VAANI is an air-gapped, offline speech intelligence platform that converts coded missile information into natural English using a local LLM (Ollama) and generates high-fidelity speech using Chatterbox TTS.

### 🌟 Key Features
- **⚡ Real-Time Processing Telemetry**: Displays exact processing times for every stage with emoji badges (Response Time, Gemma 4, Chatterbox, MP3 Encoding, Audio Length).
- **📝 Spoken Text transcription overlay**: Dynamic transcription blocks inside the custom audio player synchronized with the current playback time.
- **📂 Persistent SQLite Audio Logs**: Database persistence logs storing configurations (speed, voice, duration, response time) with automated self-healing duration computation on startup.
- **🎨 Brand Alignment**: Soundwave vector assets replacement and unified interface style.
- **🌐 Offline Dual Speech Output**: Real-time generation of English speech and on-demand translation to natural Hindi speech with single-language Chatterbox models.

---

# Architecture

```
                User
                  │
                  ▼
        React + Vite Frontend
                  │
                  ▼
           HTTP (Port 5000)
                  │
                  ▼
    Flask Backend API (with built-in Chatterbox TTS)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    Ollama LLM       Chatterbox TTS
  (Port 11434)      (Local PyTorch)
   Gemma 4 model    (EN & HI Single Packs)
        │                   │
        └─────────┬─────────┘
                  ▼
              MP3 Audio
```

---

# Project Structure

```
VAANI-AI/
│
├── src/               # React Frontend code
├── package.json       # React dependencies
├── vite.config.js     # Frontend builder
│
├── backend/
│   ├── app.py         # Main Flask Server
│   ├── config.py      # App configurations
│   ├── exceptions.py  # Error classes
│   ├── logger.py      # setup logging
│   ├── pipeline.py    # Pipeline Orchestration
│   ├── requirements.txt # Python dependencies
│   ├── memory/
│   │   └── memory.py  # SQLite DB & history helpers
│   ├── routes/
│   │   ├── api.py     # Main endpoints (speech, history, logs)
│   │   └── documents.py # Document analysis & RAG endpoints
│   ├── services/
│   │   ├── chatterbox_service.py # TTS Engine
│   │   └── ollama_service.py     # LLM Engine & translation
│   └── instance/
│       └── vaani.db   # Local SQLite Database
│
├── VaaniAI.exe        # Automated Master Launcher (Windows only)
├── start_server.bat   # Automated Master Startup Script (Windows only)
└── README.md          # Setup & Installation documentation
```

---

# 🚀 Complete Installation Guide (All Platforms)

This section provides a detailed, step-by-step guide to installing VAANI on Windows, macOS, and Linux.

## Step 1: Install Core Dependencies (Prerequisites)

Before starting, you must install these core tools on your system:

1. **Python (3.10 or 3.11 recommended)**
   - Windows/macOS: Download from [python.org/downloads](https://www.python.org/downloads/)
   - Linux (Ubuntu/Debian): `sudo apt install python3 python3-pip python3-venv`
2. **Node.js (Version 20 or higher)**
   - Windows/macOS: Download from [nodejs.org](https://nodejs.org/)
   - Linux: Use NodeSource or nvm to install Node 20+.
3. **Git**
   - Windows/macOS: Download from [git-scm.com](https://git-scm.com/)
   - Linux: `sudo apt install git`
4. **Ollama (Local AI Engine)**
   - Windows/macOS: Download from [ollama.com/download](https://ollama.com/download)
   - Linux: `curl -fsSL https://ollama.com/install.sh | sh`

*(Note: FFmpeg is NO LONGER required! Audio is generated securely as a native MP3 format via lameenc).*

---

## Step 2: Download the Local LLM Model

Once Ollama is installed, open your Terminal or Command Prompt and download the `gemma4` model. This model will run offline on your machine:

```bash
ollama pull gemma4
```
Wait for the download to finish. You can verify it downloaded successfully by running:
```bash
ollama list
```

---

## Step 3: Clone the Repository

Open your Terminal or Command Prompt, navigate to the folder where you want to store the project, and run:

```bash
git clone https://github.com/Swayam-04/Vaani-AI.git
cd Vaani-AI
```

---

## Step 4: Setup by Operating System

Choose the tab for your operating system below to install the frontend and backend dependencies.

### 🪟 Windows Setup

**1. Install Backend Dependencies**
Open Command Prompt and run:
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
*(If `requirements.txt` fails, run: `pip install flask flask-cors requests python-dotenv torch torchaudio chatterbox-tts mutagen lameenc`)*

**2. Install Frontend Dependencies**
Go back to the root directory and install React packages:
```cmd
cd ..
npm install
```

### 🍎 macOS Setup

**1. Install Backend Dependencies**
Open Terminal and run:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**2. Install Frontend Dependencies**
Go back to the root directory and install React packages:
```bash
cd ..
npm install
```

### 🐧 Linux Setup

**1. Install Backend Dependencies**
Open Terminal and run:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**2. Install Frontend Dependencies**
Go back to the root directory and install React packages:
```bash
cd ..
npm install
```

---

# 📦 Required Node Modules (Manual Installation)

If you prefer to install the frontend dependencies individually rather than using `npm install`, you can run these commands one by one:

```bash
npm install react react-dom react-router-dom axios antd lucide-react react-hot-toast framer-motion clsx tailwindcss @headlessui/react @heroicons/react react-icons vite @vitejs/plugin-react
```

---

# 🎮 Running VAANI

## Easy Start (Windows Only)
If you are on Windows, simply double-click the **`VaaniAI.exe`** executable file in the root folder. It will safely open all required services (Ollama, Flask, React) in automated background windows for you!

## Manual Start (macOS / Linux / Advanced Users)
If you are on a Mac or Linux, you will need to open **3 separate terminal windows**. Keep them all open simultaneously!

**Terminal 1: Start Ollama**
```bash
ollama serve
```
*(If it says "port is already in use", Ollama is already running in the background. You can close this terminal).*

**Terminal 2: Start Flask Backend (TTS & API)**
```bash
cd backend
source venv/bin/activate   # On Windows use: venv\Scripts\activate
python app.py
```
*(You should see it running on `http://127.0.0.1:5000`)*

**Terminal 3: Start React Frontend**
```bash
# Make sure you are in the root VAANI-AI folder
npm run dev
```
*(You should see it running on `http://localhost:5173`)*

🎉 **Open your web browser and go to `http://localhost:5173` to use the application!**

---

# 🛠️ Verify Services / Troubleshooting

If something isn't working, use these commands to figure out what broke:

## 1. Verify Ollama is alive
Open a new terminal and run:
```bash
curl http://localhost:11434/api/tags
```
If you get a connection refused error, your Ollama daemon (Terminal 1) crashed or isn't running.

## 2. Verify Flask & Chatterbox are alive
Open a new terminal and run:
```bash
curl http://127.0.0.1:5000/health
```
Should return:
```json
{
  "status": "ok",
  "tts": "chatterbox"
}
```

## Common Errors

- **500 Internal Server Error in React:** Check Terminal 2 (Flask). Did you forget to activate the virtual environment (`venv`) before running `python app.py`? Are the Python packages installed?
- **Port 5000 Already In Use:** 
  - **Windows:** Run `netstat -ano | findstr :5000` and `taskkill /PID <PID> /F`
  - **macOS/Linux:** Run `lsof -i :5000` and `kill -9 <PID>`

---

# Developed By

- Swayam Barik
- Suditi Jena
- Supriya Priyadarsani Pradhan
- Sriya Priyadarshani
- Kashvi Nayak
- Kuldeep Kiran
- Palin Panigrahi
- Barsha Ranee

Powered by:
- React
- Flask
- Ollama (https://github.com/ollama/ollama.git)
- Chatterbox TTS (https://github.com/resemble-ai/chatterbox.git)
- Gemma 4
