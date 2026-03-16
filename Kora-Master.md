# 🎙️ Kora: The Nama Language Tutor

Kora is an advanced, AI-powered language learning platform dedicated to preserving and teaching the **Khoekhoegowab (Nama)** language. By combining the multimodal power of Google Gemini with a human-centric teaching persona, Kora provides an immersive environment for mastering the complex clicks and tones of one of Africa's most unique languages.

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14+** | React framework for a fast, SEO-friendly UI. |
| **Logic** | **TypeScript** | Type-safe development for complex state management. |
| **IA/LLM** | **Google Gemini 1.5 Flash** | Multimodal analysis of text, audio, and documents. |
| **Voice (TTS)** | **Google Cloud TTS** | Premium, human-like English explanations (en-AU-Neural2). |
| **Storage** | **Firebase (Cloud Storage)** | Hosting authentic Nama audio recordings and voice clips. |
| **Styling** | **Vanilla CSS + Lucide Icons** | Custom, premium design system with dynamic animations. |
| **Deployment** | **Vercel / Firebase** | Scalable hosting and edge function execution. |

---

## ✨ Core Features

### 1. The Speech Lab (Active Practice)
A high-commitment interface where users can record their own pronunciation.
- **Multimodal Feedback**: Gemini analyzes the user's audio against expected text.
- **Scoring System**: Provides a 1-100 accuracy score.
- **Anatomical Tips**: Explains tongue and mouth placement for difficult clicks (!, |, ||, ǂ).

### 2. Audio Orchestration
Context-aware audio playback that blends:
- **Authentic Nama Clips**: Sourced from native speakers in Firebase.
- **High-Fidelity TTS**: Kora's "Voice" which explains grammar and context in English.
- **Visual Highlighting**: Real-time text-to-audio synchronization for better reading comprehension.

### 3. Smart Knowledge Injection
Kora isn't just a chatbot; he is a specialist.
- **Language Guide**: Injects deep linguistic rules from standard Nama documentation.
- **Semantic Audio Map**: Kora knows which audio file corresponds to which concept, allowing him to "play" examples during conversation.

---

## 📈 Recent Progress (Sprint Summary)

- [x] **Voice Overhaul**: Replaced browser-default voices with Google Cloud TTS (Australian Zubenelgenubi).
- [x] **Speech Lab v1**: Implemented microphone capture and Gemini-powered pronunciation evaluation.
- [x] **Audio Sync Engine**: Added support for `.m4a` and improved MIME-type handling for Gemini File API.
- [x] **Infrastructure Stability**: Resolved 403 Forbidden errors and 400 Bad Request issues with model versioning.
- [x] **Mobile Optimization**: Added touch events for recording on iOS/Android devices.

---

## 🎯 Upcoming Roadblocks & Tasks

### 🛠️ Phase 1: Refining the Lab
- [ ] **Visual Aids**: Generate/Integrate images of mouth positions for each click type.
- [ ] **Phonetic Highlighting**: Highlight specific letters in a word that the user mispronounced.
- [ ] **Success States**: Add "Wow" animations and premium toast notifications for high scores.

### 🎙️ Phase 2: Authentic Content
- [ ] **Contextual Tagging**: Complete the analysis of all 104+ audio files to map them to specific lessons.
- [ ] **Session Memory**: Allow Kora to remember which sounds a user specifically struggles with.

### 🎨 Phase 3: Premium UI/UX
- [ ] **Kinetic Typography**: Implement more reactive font scaling during audio playback.
- [ ] **Sidebar Organization**: Group tools (Speech Lab, Lessons, Glossary) by user intent.
- [ ] **Hydration Fix**: Resolve the React hydration mismatch warnings in the console.

---

## 🚀 How to Run
```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (.env.local)
# GEMINI_API_KEY=your_key
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket

# 3. Synchronize Audio References
npx tsx src/scripts/sync_audio.ts

# 4. Start Development Server
npm run dev
```

---
*Created by Antigravity AI for Nama Language Project, 2026.*
