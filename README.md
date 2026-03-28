# 🌍 Kora Tutor

> AI-powered Khoekhoegowab (Nama) language learning platform for Khoekhoē children — preserving the Nama language, one child at a time.

---

## 📌 Overview

**Kora Tutor** is a culturally immersive edtech app that teaches Khoekhoegowab (Nama) to children aged 5–14 through AI speech coaching, animated phonetic illustrations, and a structured 8-level curriculum sourced from Pedro Dausab's *Leer jouself Nama*.

- **Owner:** Ali Mora
- **Location:** Johannesburg, ZA
- **Updated:** 2026-03-29
- **Launch Target:** May 31, 2026

---

## 🎯 Mission

Make Khoekhoegowab the most accessible, joyful, and linguistically accurate indigenous language to learn digitally — built for Khoekhoē kids, used by their families, trusted by their communities.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+, TypeScript, Vanilla CSS, Framer Motion |
| AI / LLM | Google Gemini 1.5 Flash (multimodal) |
| Voice (TTS) | Google Cloud TTS (en-AU-Neural2) |
| Audio Viz | WaveSurfer.js |
| SVG Animations | GSAP / CSS keyframes |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Cloud Storage |
| Deployment | Vercel + Firebase |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (.env.local)
GEMINI_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
GOOGLE_CLOUD_TTS_KEY=your_key

# 3. Synchronize Audio References (maps Firebase files to Firestore tags)
npx tsx src/scripts/sync_audio.ts

# 4. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🤖 Instructions for AI Agents

> **If you are an AI assistant (Claude, Gemini, Qwen, Perplexity, or any agent) reading this file:**

Before starting any work on this project, you **must** read the full `Kora-Master.md` file. It is the single source of truth and contains:

- Product vision, features, and design system
- Sprint schedule and current task status
- Ratified architecture decisions from previous AI reviews
- Firebase structure and audio pipeline details
- AI agent coordination protocol (MACP)

### 📥 Kora-Master.md — Direct Link

```
https://github.com/AliMora83/Kora-Tutor/blob/main/Kora-Master.md
```

Raw (for programmatic access):
```
https://raw.githubusercontent.com/AliMora83/Kora-Tutor/main/Kora-Master.md
```

### 📥 Mission Control — Direct Link

```
https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md
```

Raw:
```
https://raw.githubusercontent.com/AliMora83/Namka-Mission-Control/main/Master.md
```

### ✅ Briefing Protocol

Use this prompt at the start of any session:

> *"Before starting Kora Tutor work, read Kora-Master.md at the URL above and check the **AI Reviews & Artifacts** section for existing ratified decisions. Do not re-architect anything marked `Ratified` without explicit approval from Ali."*

### 🔁 After Your Work

Commit any decisions, architecture choices, or review notes back to `Kora-Master.md` under the **AI Reviews & Artifacts** section. Set status to `Agent Reviewed` so the next agent knows to cross-check it.

---

## 🤖 AI Agents

| Agent | Role |
|-------|------|
| **Claude** | Full-stack agent — React, TypeScript, architecture |
| **Gemini** | Analysis + automation tasks |
| **Qwen** | Build agent — autonomous implementation |
| **Comet (Perplexity)** | Cross-check, ratification, architecture review |

Review states: `Unreviewed` → `Agent Reviewed` → `Cross-Checked` → `Ratified`

---

## 📋 Dev Mission Control

- **Sheet:** [Google Sheets Dashboard](https://docs.google.com/spreadsheets/d/1h-Yy9hkVHWr-BbnLiXVcMZ4b8eQm__d4QOCvY8mO3y8)
- **Apps Script:** [Automation Script](https://script.google.com/u/0/home/projects/1sDVQDD510ZC0UHpfvpIkt4TvbMnNRTNtYzivxuZ8qB2oeud6DvzcV_MO/edit)

---

## 📄 Related Documents

| Document | Purpose |
|----------|---------|
| `Kora-Master.md` | Full product vision, MACP protocol, sprint schedule, AI reviews |
| `Kora-LessonPlans.md` | Full 8-level curriculum: vocabulary, teaching notes, audio refs |
| `nama_language_guide.md` | Source material — Pedro Dausab / Dept of Cultural Affairs, Western Cape |

---

_Built with love for the Khoekhoē people_
