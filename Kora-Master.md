# 🌍 Kora Tutor – AI-Assisted Development

> **Version:** 1.1 | **Last Updated:** 2026-03-29 | **Owner:** Ali Mora
> **Mission Control:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)

---

## 📖 How to Use This File

**For Ali:** This is the single source of truth for Kora Tutor. Update project status, sprint tasks, and AI review entries here.

**For AI Agents:** Before starting work on this project:
1. Read this `Kora-Master.md` file first
2. Check the **AI Reviews & Artifacts** section for existing architectural decisions
3. Follow the **Multi-Agent Context Protocol (MACP)** below
4. Commit your review to this file when done

---

## 🚀 Project Overview

**Description:** Kora is a culturally immersive language-learning platform for Khoekhoē children (ages 5–14), teaching Khoekhoegowab (Nama) through AI-powered speech coaching, animated phonetic illustrations, and a structured curriculum sourced from Pedro Dausab's *Leer jouself Nama*.

**Status:** In Progress

**Priority:** Priority 2 – Active Development

**Stack:** TypeScript / Next.js 14+ / Firebase / Google Gemini 1.5 Flash / Google Cloud TTS / WaveSurfer.js / Framer Motion / GSAP

**Repo:** [https://github.com/AliMora83/Kora-Tutor](https://github.com/AliMora83/Kora-Tutor)

**Live URL:** _(not yet deployed — targeting May 31, 2026)_

**AI Model Assigned:** Claude / Perplexity (Comet)

---

## 🎯 Current Goal

**Next Milestone:** Complete Sprint 1 — fix foundation (no console errors, all 104 audio files tagged in Firestore, recording session booked)

**Next Step:** Fix React hydration mismatch warnings + design Firestore audio tagging schema

**Blocker:** None

**Effort Estimate:** L

**Progress:** 20%

---

## 🏗 Tech Stack & Dependencies

- **Frontend:** Next.js 14+, TypeScript, Vanilla CSS, Framer Motion
- **Backend:** Firebase Firestore, Firebase Cloud Storage
- **Database:** Firebase Firestore (user profiles, progress, XP, lesson state, audio tags)
- **Auth:** Firebase Authentication (family accounts — parent + child profiles)
- **AI / LLM:** Google Gemini 1.5 Flash (multimodal: text, audio, PDF knowledge injection)
- **Voice (TTS):** Google Cloud TTS (en-AU-Neural2)
- **Audio Viz:** WaveSurfer.js (waveform rendering)
- **SVG Animations:** GSAP / CSS keyframes (mouth/tongue articulation)
- **Deployment:** Vercel + Firebase

---

## 🧭 Vision Statement

Kora exists so that Khoekhoē children grow up knowing their language — not as a school subject, but as a living part of who they are. It is a cultural inheritance platform disguised as a game, built for families who want the next generation to speak, hear, and feel Khoekhoegowab.

**Mission:** To make Khoekhoegowab (Nama) the most accessible, joyful, and linguistically accurate indigenous language to learn digitally — built for Khoekhoē kids, used by their families, trusted by their communities.

---

## 👥 Primary Users & Personas

### 1. 🧒 The Child (Ages 5–14) — *Core User*
- Khoekhoē heritage, likely born in Namibia, South Africa, or diaspora
- Engages through Kid Mode: short lessons, animations, games, rewards
- Motivation: fun, achievement, belonging

### 2. 👩‍👧 The Parent — *Co-User & Driver*
- Wants their child to maintain cultural identity
- Engages through Parent Mode: progress dashboards, guided conversation prompts
- Motivation: heritage, pride, practicality

### 3. 🏫 The Educator *(Phase 4 — Future)*
- Teacher in a Namibian or South African school
- Needs classroom-compatible tool, assignment capability, student progress views

---

## 💡 Product Principles

1. **Culture First, Language Second** — Every lesson carries a piece of Khoekhoē life
2. **Joy is Non-Negotiable** — Every interaction earns a reaction: animations, sounds, celebrations
3. **Authenticity Over Approximation** — Native audio is sacred; Kora never invents pronunciation
4. **Family as the Unit** — Designed to spill out of the screen into dinner table conversations
5. **Offline Ready** — Core lessons must work without internet (critical for Namibian reach)

---

## ✨ Core Feature Set

### 1. 🎭 Kid Mode vs. Parent Mode
- **Kid Mode:** Full-screen immersive, 3–5 min lessons, reward-dense (XP, badges, streaks)
- **Parent Mode:** Dashboard with progress, weak-spot alerts, "Practice Together" button, weekly digest

### 2. 🖼️ Animated Mouth & Tongue Illustrations (SVG)
The 4 clicks visualised as SVG cross-section animations (GSAP/CSS), synced to audio playback.

| Click | Symbol | Articulation |
|-------|--------|--------------|
| Dental | \| | Tongue tip behind upper teeth |
| Lateral | \|\| | Side of tongue against molars |
| Alveolar | ! | Tongue tip to alveolar ridge |
| Palatal | ǂ | Tongue body to hard palate |

### 3. 🌊 Speech Wave Visualizer
WaveSurfer.js renders native speaker waveform (amber/gold) and learner recording (blue/white) side-by-side. Click spike callout marks where the transient should appear.

### 4. 🎙️ The Speech Lab
Record → Gemini evaluates → accuracy score (1–100) with per-click breakdown, phonetic highlighting, and minimum 3 attempts before passing.

### 5. 📚 Structured Curriculum — 8 Levels, 30 Lessons
Sourced from Pedro Dausab's *Leer jouself Nama*. Full detail in `Kora-LessonPlans.md`.

| Level | Theme | Total XP |
|-------|-------|----------|
| 1 | Sound System | 23 |
| 2 | Essentials & First Words | 26 |
| 3 | People & Names | 26 |
| 4 | Numbers & Time | 39 |
| 5 | The World Around Us | 32 |
| 6 | Everyday Life | 29 |
| 7 | Conversation | 41 |
| 8 | Grammar Deep Dive | 48 |

**Total XP: 264** — Level 1 is the mandatory gateway; 80% required to unlock each next lesson.

### 6. 🔊 Audio Pipeline
- 104+ `.m4a` files in Firebase `training_audio/`
- 3 voices planned: adult male (Ali), adult female Khoekhoē speaker, child (ages 6–10)
- Firestore audio tag schema: `file`, `concept`, `lesson`, `speaker`, `gender`, `age_group`, `verified`

### 7. 📖 PDF Knowledge Injection
Pedro Dausab guide chunked and injected into Gemini prompts — Kora never improvises grammar rules.

### 8. 🧠 Learner Memory & Weak-Spot Tracking
Per-learner: click accuracy history, vocabulary recall rate, streaks. Adaptive drills target weak click types.

### 9. 🏆 Rewards & Engagement
XP, daily streaks, cultural badges (e.g. *"Master of the ! click"*), unlockable Kora outfits, family leaderboard.

### 10. 📱 Offline Mode (PWA)
Service worker caches Level 1–2 lessons. Progress syncs to Firestore on reconnect. Speech Lab falls back to waveform-only comparison when offline.

---

## 🎨 Design System

**Feel:** Warm, African, joyful, premium — not Western edtech beige

- **Primary:** Deep amber/gold (sun motif)
- **Secondary:** Warm terracotta
- **Accent:** Sand, ochre
- **Backgrounds:** Dark mode (existing)
- **Display font:** Serif with character for Nama words
- **Animations:** Framer Motion (transitions) + GSAP (SVG mouth)
- **Kora Character:** Khoekhoē-inspired face/avatar that reacts to performance

---

## 🚀 Delivery Schedule — Mar 16 to May 31, 2026

### Sprint 1 — Week 1–2 · Mar 16–29 · *Fix the Foundation*

| Task | Owner | Status |
|------|-------|--------|
| Fix React hydration mismatch warnings | Dev | 🔴 To Do |
| Audio tagging schema — design Firestore structure | Dev | 🔴 To Do |
| Run `sync_audio.ts` — map all 104 files | Dev | 🔴 To Do |
| Upgrade Gemini model version (resolve 400 errors) | Dev | 🔴 To Do |
| Audit Firebase Storage CORS / 403 issues | Dev | 🔴 To Do |
| Book recording session (3 voices) | Ali | 🔴 To Do |

**Exit criteria:** App runs without console errors. All 104 audio files tagged. Recording session booked.

### Sprint 2 — Week 3–4 · Mar 30–Apr 12 · *Sound & Vision*
SVG mouth animations (all 4 clicks) + WaveSurfer.js waveform rendering in Speech Lab.

### Sprint 3 — Week 5 · Apr 13–19 · *Audio Recording Week*
Record Level 1–2 audio × 3 voices. Upload + tag all files.

### Sprint 4 — Week 6–7 · Apr 20–May 3 · *Child-First Experience*
Kid Mode / Parent Mode split, curriculum map, Lessons 1.1–3.1, streak + XP system.

### Sprint 5 — Week 8–9 · May 4–17 · *Depth & Intelligence*
Per-click accuracy, PDF injection, weak-spot detection, Lessons 3.2–5.3, Counting Rhyme milestone.

### Sprint 6 — Week 10–11 · May 18–31 · *Polish, Offline & Launch Prep*
Lessons 6–8, badges, family leaderboard, PWA, mobile optimisation, full regression test.

### 🏁 Launch Target: May 31, 2026

---

## 📊 Success Metrics

| Metric | Target (12 months) |
|--------|--------------------|
| Weekly Active Learners | 500+ |
| Average Session Length | 8+ min |
| Day-7 Retention | 40%+ |
| Click Accuracy Improvement | +30% after 10 sessions |
| Lessons Completed (total) | 5,000+ |
| Community Voice Contributors | 50+ families |
| School Partnerships | 3+ |

---

## 🤖 Multi-Agent Context Protocol (MACP)

> **Critical:** All agents must follow this protocol to prevent hallucinations and ensure coordination.

### Workflow for AI Agents

1. **Read Kora-Master.md first** — Check the **AI Reviews & Artifacts** section for existing decisions.
2. **Review consensus states:**
   - `Unreviewed` → No agent has reviewed this yet
   - `Agent Reviewed` → One agent reviewed (needs cross-check)
   - `Cross-Checked` → Two agents agree (pending Ali's ratification)
   - `Ratified` → **Locked truth** — do not re-architect without Ali's explicit approval
3. **Document your work** — Add an entry to **AI Reviews & Artifacts**, commit to this file, mark `Agent Reviewed`
4. **Cross-check** — If you see `Agent Reviewed`, confirm or flag disagreements; update to `Cross-Checked` or `Needs Resolution`

---

## 🤖 AI Reviews & Artifacts

> This section is the shared context layer for all AI agents working on Kora.
> Before starting work, read relevant entries to understand existing architectural decisions.

### Review Entry Format

```markdown
---
### YYYY-MM-DD — [Task/Feature Name] ([Agent Name] / [Provider])

**Status:** `[Unreviewed / Agent Reviewed / Cross-Checked / Ratified]`
**Reviewed by:** [Agent Name] ([Provider])
**Scope:** [Brief description of what was reviewed/built]

#### Key Decisions
- [Decision 1]
- [Decision 2]

#### Implementation Notes
[Code snippets, architecture diagrams, or technical details]

#### Next Step
[What the next agent should do, or what needs Ali's approval]

> 🔁 **Next:** [Agent name] to cross-check and mark as `Ratified`, or Ali to approve.
```

---

### 2026-04-20 — UI & Functionality Review (Antigravity / Gemini)

**Status:** `Agent Reviewed`
**Reviewed by:** Antigravity (Gemini 3.1 Pro)
**Scope:** Localhost setup and UI testing for Kora

#### Key Decisions
1. **Environment Config:** Confirmed `npm run dev` starts correctly in the repository with no build blockers.
2. **Visual Check:** Validated the live rendering of the Chat Interface and Visual Speech Lab component screens.
3. **Progress Tracking:** Screenshots captured and committed to `AI_CHANGELOG.md` to establish visual baseline for upcoming design sprints.

#### Next Step
Ali to proceed with targeted minor updates and review.

> 🔁 **Next:** Ali to ratify or shift to a Builder/Design Lead persona via the relevant workflow.

---

### 2026-03-29 — Project Architecture Review (Comet / Perplexity)

**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Comet (Perplexity)
**Scope:** Full review of Kora-Master.md — restructured to align with MACP template standards

#### Key Decisions

1. **Kora-Master.md** converted from pure product vision doc → MACP-compliant master file with Status, Current Goal, MACP protocol, and AI Reviews section
2. **README.md** replaced default Next.js boilerplate with a proper project-specific README referencing Kora-Master.md and Mission Control
3. Existing product vision, sprint schedule, curriculum map, and tech stack preserved in full — no architectural decisions altered
4. Document now readable by Mission Control dashboard (Status, Next Step, Blocker, AI Model, Effort, Progress fields present)

#### Next Step

Ali or another agent to cross-check restructuring. Begin Sprint 1 tasks: hydration fix + Firestore audio schema.

> 🔁 **Next:** Claude or Ali to cross-check and mark as `Ratified`.

---

## 📡 Integration with Mission Control

- **Mission Control Master.md:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)
- **Raw (programmatic):** `https://raw.githubusercontent.com/AliMora83/Kora-Tutor/main/Kora-Master.md`

### Project Metadata (read by Mission Control Dashboard)

- **Status:** Active
- **Next Step:** Fix React hydration warnings + design Firestore audio tagging schema
- **Blocker:** None
- **AI Model:** Claude / Comet (Perplexity)
- **Effort:** L
- **Progress:** 20%

---

## 📝 Notes & Decisions

### Decision Log

| Date | Decision | Rationale | Decided By |
|------|----------|-----------|------------|
| 2026-03-16 | Next.js 14+ as framework | SSR + PWA support + Vercel deployment | Ali |
| 2026-03-16 | Google Gemini 1.5 Flash for LLM | Multimodal (text + audio), free tier | Ali |
| 2026-03-16 | Firebase for auth + storage + DB | Family account model, real-time sync | Ali |
| 2026-03-16 | WaveSurfer.js for audio viz | React-compatible, handles .m4a | Ali |
| 2026-03-16 | GSAP for SVG mouth animations | Precise keyframe control for articulation | Ali |

### Known Issues

- React hydration mismatch warnings in current build
- Gemini 400 errors — model version needs upgrade
- Firebase Storage CORS / 403 issues on some audio files

### Future Enhancements

- Community voice recording portal (families contribute audio)
- Multi-voice toggle per word
- Educator dashboard + school pilot programme (Namibia)
- University and NGO partnerships for language preservation

---

## 🔗 Quick Links

- **Repo:** [https://github.com/AliMora83/Kora-Tutor](https://github.com/AliMora83/Kora-Tutor)
- **Live URL:** _(deploying May 31, 2026)_
- **Mission Control:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)
- **Lesson Plans:** `Kora-LessonPlans.md`
- **Language Source:** `nama_language_guide.md`

---

## 📁 Firebase Storage Structure

```
training_audio/
  1-The Dental click.m4a
  1-The Alveolar click.m4a
  1-The Lateral click.m4a
  1-The Palatal click.m4a
  2-diphtongs-*.m4a
  ... (104+ files)

user_recordings/
  {userId}/
    {lessonId}/
      {timestamp}.webm

pdfs/
  nama-grammar-guide.pdf
  click-phonology-reference.pdf
  vocabulary-glossary.pdf
```

---

## 🔮 Long-Term Vision

Kora becomes the definitive digital platform for Khoekhoegowab — for children, universities, language preservation NGOs, and Khoekhoē communities worldwide. A living repository where community members contribute audio, elders record stories, and families pass the language to grandchildren they may never meet in person.

The language doesn't disappear. Kora won't let it.

---

_Last updated by: Comet (Perplexity) on 2026-03-29_
