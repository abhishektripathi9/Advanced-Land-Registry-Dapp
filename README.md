# TalkRiva AI — Interactive English Speaking Partner & PW Talk Riva Clone 🎙️✨

An AI-powered spoken English partner and communication improvement web app inspired by **PW Talk Riva** and conversational speech AI. Designed to help learners build spoken fluency from **Tooti-Footi (Broken English)** to **Advanced Campus Placements & Job Interviews**, with full human emotional expression.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## 🌟 Key Features

### 1. 🎙️ PW Talk Riva Real-Life Conversation Partner
- **Strictly Sweet, Natural Female Voice (Aria/Riva)** with tuned pitch (1.10) and pacing (0.98x) matching PW Talk.
- **Full Emotional Expression**: Real-life human conversational reactions (`🤩 Impressed & Proud`, `🌸 Warm & Welcoming`, `💡 Placement Coach`, `🤗 Supportive & Caring`, `✨ Energized & Cheerful`).
- **Dynamic Expression Badges**: Real-time visual mood badge displayed on Riva's room status and message bubbles.
- **Ping-Pong Conversational Dynamic**: Emotional reaction ➔ relatable context ➔ gentle spoken polish ➔ engaging follow-up question.

### 2. 🧠 Persistent One-Time Memory Mind
- **Ek Hi Baar Me Data Save**: Remembers learner name, hometown/city (*Chitkoot, Delhi, Lucknow, etc.*), native level (*Tooti-Footi, Hesitant, Intermediate, Advanced*), main goal (*Campus Placements/Job Interviews, Daily Chat*), and profession.
- Profile stays permanently remembered across sessions via `localStorage` and `UserMemoryMind`.
- Starters, interview practice, and tips adapt dynamically to the saved profile.

### 3. 🔆 Show Hint + Help Me Speak Stack (PW Talk Exact Replica)
- **🔆 Show Hint Drawer**: Dynamic guidance card showing:
  - *What Riva is asking in Hindi* (आरिया क्या पूछ रही है)
  - *Target English response*
  - *Word-by-word Phonetic Guide*
  - *Hindi meaning*
  - *🔊 Listen & 🚀 Speak Now buttons*
- **🎤 Tap to Speak**: Golden microphone for instant voice input.
- **🗣️ Help Me Speak ("Koi baat nahi, Hindi me bolo")**: Speak in Hindi/Hinglish and Riva translates to polished, natural English.

### 4. 📚 7-Day Real-Life Communication Curriculum
1. **Day 1**: The 7-Second Rule: First Impressions & Magnetic Greetings
2. **Day 2**: Tooti-Footi to Fluent: The SVO Anchor Technique
3. **Day 3**: Overcoming Hesitation & Fear: The Power of Silent Pauses
4. **Day 4**: Real-Life Conversation Flow: The FORD Networking Matrix
5. **Day 5**: Professional Persuasion: Diplomatic & Polite English
6. **Day 6**: The 45-Second Elevator Pitch & Professional Intro
7. **Day 7**: Campus Placement & Job Interview Mastery (STAR Method)

### 5. 📸 Visual Vocabularies & MCQ Practice Hub
- **70+ Curated Vocabularies** with real-life photos, pronunciation, Hindi meanings, and interview tips.
- **Interactive MCQ Quiz** with instant score, streak, and audio explanations.

---

## 🚀 How to Run Locally

### Using Python:
```bash
python server.py
```
Opens automatically on `http://localhost:3000`.

### Using Node / npx:
```bash
npm start
```

---

## 🌐 How to Deploy on Render (Free & Fast)

### Option A: 1-Click Blueprint (Recommended)
1. Push this repository to your GitHub account.
2. In [Render Dashboard](https://dashboard.render.com), click **New +** ➔ **Blueprint**.
3. Connect your repository. Render will automatically read `render.yaml` and deploy your app as a **Static Site** for free!

### Option B: Manual Static Site Deploy
1. On [Render Dashboard](https://dashboard.render.com), click **New +** ➔ **Static Site**.
2. Connect your GitHub repository.
3. Configure:
   - **Name**: `talkriva-ai`
   - **Branch**: `main`
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `.`
4. Click **Create Static Site**.
5. Your app is live with free HTTPS and global CDN in ~30 seconds!

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, Google Fonts: Plus Jakarta Sans, Inter, Outfit).
- **Speech**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
- **Audio Engine**: Web Audio API Chime Synthesizer & Canvas Visualizer.
- **Backend / Deployment**: Python `server.py` + Render Static Site (`render.yaml`).
- **License**: MIT
