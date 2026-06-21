# 🌍 Kora Tutor – AI-Assisted Development

> **Version:** 1.2 | **Last Updated:** 2026-06-21 | **Owner:** Ali Mora
> **Mission Control:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)

---

## 📖 How to Use This File

**For Ali:** This is the single source of truth for Kora Tutor. Update project status, sprint tasks, and AI review entries here.

**For AI Agents:** Before starting work on this project:
1. Read this `Master.md` file first
2. Check the **AI Reviews & Artifacts** section for existing architectural decisions
3. Follow the **Multi-Agent Context Protocol (MACP)** below
4. Commit your review to this file when done

---

## 🚀 Project Overview

**Description:** Kora is a culturally immersive language-learning platform for Khoekhoē children (ages 5–14), teaching Khoekhoegowab (Nama) through AI-powered speech coaching, animated phonetic illustrations, and a structured curriculum sourced from Pedro Dausab's *Leer jouself Nama*.

**Status:** In Progress — scoped down to MVP for first round of friend testing

**Priority:** Priority 2 – Active Development

**Stack:** TypeScript / Next.js 14+ / Firebase / Google Gemini 1.5 Flash / Google Cloud TTS / WaveSurfer.js / Framer Motion / GSAP

**Repo:** [https://github.com/AliMora83/Kora-Tutor](https://github.com/AliMora83/Kora-Tutor)

**Live URL:** [https://kora-tutor.vercel.app/](https://kora-tutor.vercel.app/) — currently deployed, being hardened for friend testing

**AI Model Assigned:** Claude Code (build/execution) / Claude, Comet (Perplexity) (review)

**Development Environment:** Antigravity IDE, with Claude Code integrated directly in-editor — open this repo there (not VS Code) to execute sprint tasks.

---

## 🎯 Current Goal

**Next Milestone:** Ship a stable MVP — single-profile sign-in, the core chat-tutor loop, and a thumbs up/down feedback control — to a small group of friends to test whether the core tutoring experience feels good and engaging.

**Next Step:** Begin Sprint 1 — fix Gemini 400 errors, clear hydration warnings, confirm PDF-grounded grammar injection is actually wired into live chat calls.

**Blocker:** None currently — PDF-grounding status needs verification (see Sprint 1).

**Effort Estimate:** M (re-scoped down from L after MVP cut)

**Progress:** 20% of full vision; MVP scope itself starting fresh at Sprint 1 of 3

---

## 🧪 MVP Definition — Testing Round 1

**Test goal:** Does the core chat-tutor experience feel good and engaging? (Not testing pronunciation accuracy, curriculum depth, or gamification yet — those are separate, later tests.)

**In scope for MVP:**
- Chat interface with the three starter prompts (Translate Phrase, Explain Grammar, Practice Script)
- Kora's tutor personality/responses, grounded in source material via PDF knowledge injection
- Single-profile sign-in (email or Google) — one profile per person, no parent/child split
- Thumbs up / thumbs down feedback control on each of Kora's responses, logged for review
- Stability fixes: no Gemini 400 errors, no hydration warnings, no console errors

**Explicitly deferred to V2 (hidden via feature flags, not deleted):**
- Speech Lab / pronunciation recording and scoring
- 8-level / 30-lesson structured curriculum map
- XP, streaks, badges, family leaderboard
- Kid Mode / Parent Mode split and the family-account (parent + child profile) model
- Offline / PWA mode
- Parent progress dashboard and weekly digest

**Rationale:** Testers in this round are friends evaluating the product, not families with children. Building the family/parent-child auth model, the audio pipeline, or gamification now would mean testing multiple unvalidated things at once and risks a tester concluding "this is broken" over an unrelated half-built feature, muddying the one signal this round is designed to capture.

---

## 🏗 Tech Stack & Dependencies

- **Frontend:** Next.js 14+, TypeScript, Vanilla CSS, Framer Motion
- **Backend:** Firebase Firestore, Firebase Cloud Storage
- **Database:** Firebase Firestore (user profiles, progress, XP, lesson state, audio tags, message feedback)
- **Auth:** Firebase Authentication — single-profile per user for MVP; family accounts (parent + child) deferred to V2
- **AI / LLM:** Google Gemini 1.5 Flash (multimodal: text, audio, PDF knowledge injection)
- **Voice (TTS):** Google Cloud TTS (en-AU-Neural2)
- **Audio Viz:** WaveSurfer.js (waveform rendering) — V2, gated behind Speech Lab flag
- **SVG Animations:** GSAP / CSS keyframes (mouth/tongue articulation) — V2
- **Deployment:** Vercel + Firebase

---

## 🧭 Vision Statement

Kora exists so that Khoekhoē children grow up knowing their language — not as a school subject, but as a living part of who they are. It is a cultural inheritance platform disguised as a game, built for families who want the next generation to speak, hear, and feel Khoekhoegowab.

**Mission:** To make Khoekhoegowab (Nama) the most accessible, joyful, and linguistically accurate indigenous language to learn digitally — built for Khoekhoē kids, used by their families, trusted by their communities.

*(Note: MVP testing round validates the core tutoring experience with general users first, as a stepping stone toward this full vision — not a change in destination, just a sequencing decision.)*

---

## 👥 Primary Users & Personas

### 1. 🧪 Friend Tester — *Current MVP User*
- General adult user, not necessarily Khoekhoē heritage or a parent
- Engages directly with the chat tutor, no curriculum structure yet
- Goal of this round: does the conversation feel engaging and trustworthy

### 2. 🧒 The Child (Ages 5–14) — *Core Long-Term User*
- Khoekhoē heritage, likely born in Namibia, South Africa, or diaspora
- Engages through Kid Mode: short lessons, animations, games, rewards
- Motivation: fun, achievement, belonging — **V2**

### 3. 👩‍👧 The Parent — *Co-User & Driver (V2)*
- Wants their child to maintain cultural identity
- Engages through Parent Mode: progress dashboards, guided conversation prompts
- Motivation: heritage, pride, practicality

### 4. 🏫 The Educator *(Phase 4 — Future)*
- Teacher in a Namibian or South African school
- Needs classroom-compatible tool, assignment capability, student progress views

---

## 💡 Product Principles

1. **Culture First, Language Second** — Every lesson carries a piece of Khoekhoē life
2. **Joy is Non-Negotiable** — Every interaction earns a reaction: animations, sounds, celebrations
3. **Authenticity Over Approximation** — Native audio is sacred; Kora never invents pronunciation
4. **Family as the Unit** — Designed to spill out of the screen into dinner table conversations (V2 expression of this principle)
5. **Offline Ready** — Core lessons must work without internet (critical for Namibian reach) — V2

---

## ✨ Core Feature Set

### MVP (Testing Round 1)

| Feature | Status |
|---|---|
| Chat interface + 3 starter prompts (Translate Phrase, Explain Grammar, Practice Script) | 🟢 MVP |
| Kora tutor responses grounded via PDF knowledge injection | 🟢 MVP — verify wiring in Sprint 1 |
| Single-profile sign-in (email/Google) | 🟢 MVP — build in Sprint 2 |
| Thumbs up/down feedback on responses | 🟢 MVP — build in Sprint 2 |

### V2 (Deferred, hidden behind feature flags)

| Feature | Notes |
|---|---|
| 🎭 Kid Mode vs. Parent Mode | Requires family-account model |
| 🖼️ Animated Mouth & Tongue Illustrations (SVG) | 4 clicks visualised, GSAP/CSS, synced to audio |
| 🌊 Speech Wave Visualizer | WaveSurfer.js, native vs. learner waveform |
| 🎙️ The Speech Lab | Record → Gemini evaluates → accuracy score |
| 📚 Structured Curriculum — 8 Levels, 30 Lessons | Sourced from *Leer jouself Nama*, 264 total XP |
| 🔊 Audio Pipeline | 104+ `.m4a` files, 3 voices, Firestore tagging schema |
| 🧠 Learner Memory & Weak-Spot Tracking | Per-learner click accuracy, adaptive drills |
| 🏆 Rewards & Engagement | XP, streaks, badges, family leaderboard |
| 📱 Offline Mode (PWA) | Service worker caching, sync on reconnect |

*(Full feature descriptions retained below for V2 planning reference.)*

#### V2 Feature Detail

**Kid Mode vs. Parent Mode:** Kid Mode — full-screen immersive, 3–5 min lessons, reward-dense (XP, badges, streaks). Parent Mode — dashboard with progress, weak-spot alerts, "Practice Together" button, weekly digest.

**Animated Mouth & Tongue Illustrations (SVG):**

| Click | Symbol | Articulation |
|-------|--------|--------------|
| Dental | \| | Tongue tip behind upper teeth |
| Lateral | \|\| | Side of tongue against molars |
| Alveolar | ! | Tongue tip to alveolar ridge |
| Palatal | ǂ | Tongue body to hard palate |

**Speech Lab:** Record → Gemini evaluates → accuracy score (1–100) with per-click breakdown, phonetic highlighting, minimum 3 attempts before passing.

**Curriculum (8 Levels, 30 Lessons, 264 Total XP):**

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

Level 1 is the mandatory gateway; 80% required to unlock each next lesson.

**Audio Pipeline:** 104+ `.m4a` files in Firebase `training_audio/`; 3 voices planned (adult male/Ali, adult female Khoekhoē speaker, child 6–10); Firestore tag schema: `file`, `concept`, `lesson`, `speaker`, `gender`, `age_group`, `verified`.

---

## 🎨 Design System

**Feel:** Warm, African, joyful, premium — not Western edtech beige
- **Primary:** Deep amber/gold (sun motif)
- **Secondary:** Warm terracotta
- **Accent:** Sand, ochre
- **Backgrounds:** Dark mode (existing)
- **Display font:** Serif with character for Nama words
- **Animations:** Framer Motion (transitions) + GSAP (SVG mouth) — GSAP work gated to V2 Speech Lab
- **Kora Character:** Khoekhoē-inspired face/avatar that reacts to performance

---

## 🚀 Delivery Schedule — MVP Sprints (Claude Code Execution)

> Replaces the prior 6-sprint full-vision schedule for now. These 3 sprints are scoped for execution by Claude Code, each with concrete, file-level tasks and a clear exit criteria. The original 6-sprint plan is preserved further down under **V2 Roadmap (Reference)** for when this round is done.
>
> **Commit/push workflow:** Claude Code batches all tasks within a sprint into a single commit at the end of that sprint (not one commit per task), and pushes directly to `main` itself — it has push access. Antigravity's native in-editor agent is reserved for other work to conserve tokens, not used for committing/pushing these sprints.

### Sprint 1 — Unblock & Ground · Target: Jun 22–28, 2026

**Goal:** Eliminate every blocker that would contaminate the "does the chat feel good" signal — stability and grounding, no new features yet.

| Task | Owner | Status |
|------|-------|--------|
| Fix Gemini 400 errors — upgrade model version / fix API call config | Claude Code | 🔴 To Do |
| Resolve React hydration mismatch warnings in chat UI | Claude Code | 🔴 To Do |
| Verify PDF-grounded grammar injection is wired into every live chat call (not just planned) — confirm chunks from `nama-grammar-guide.pdf` / `click-phonology-reference.pdf` reach the Gemini prompt context | Claude Code | 🔴 To Do |
| Smoke test: run a 20-turn conversation, confirm zero console errors and no ungrounded grammar claims | Claude Code | 🔴 To Do |

**Exit criteria:** Chat runs error-free end-to-end; every grammar/pronunciation claim Kora makes is traceable to the grounding source.

### Sprint 2 — Identity & Signal · Target: Jun 29–Jul 5, 2026

**Goal:** Know who's testing, capture what they think, and hide everything not in MVP scope without deleting it.

| Task | Owner | Status |
|------|-------|--------|
| Build single-profile sign-in (email + Google) — no parent/child split, simplified user doc shape | Claude Code | 🔴 To Do |
| Add thumbs up/down control under each Kora response; write to a `message_feedback` Firestore collection (`userId`, `messageId`, `rating`, `timestamp`) | Claude Code | 🔴 To Do |
| Feature-flag and hide all V2 surfaces: Speech Lab button/route, curriculum map, XP/streaks/badges UI, Kid/Parent mode toggle, offline/PWA prompts, progress dashboard — flags off by default, code retained in place | Claude Code | 🔴 To Do |
| Update or hide the `/progress` page so it doesn't reference unbuilt curriculum data | Claude Code | 🔴 To Do |

**Exit criteria:** A new user can sign in, chat, and rate responses; every V2 feature is invisible to testers but not deleted from the codebase.

### Sprint 3 — Polish & Ship-Ready · Target: Jul 6–12, 2026

**Goal:** Make it safe to hand the live link to friends.

| Task | Owner | Status |
|------|-------|--------|
| Full regression pass: sign-in → chat → all 3 starter prompts → feedback rating, on desktop and mobile viewport | Claude Code | 🔴 To Do |
| Build a lightweight feedback review path (simple Firestore query/script or a minimal admin-only page) so Ali can read thumbs ratings without manually digging through the Firebase console | Claude Code | 🔴 To Do |
| Deploy to Vercel; verify live URL build matches local, confirm production env vars (Gemini key, Firebase config) are correct | Claude Code | 🔴 To Do |
| Final console-error sweep + mobile responsiveness check | Claude Code | 🔴 To Do |

**Exit criteria:** The live link works cleanly for a first-time, signed-out visitor through to a rated conversation, on both desktop and mobile.

### 🏁 MVP Test-Ready Target: Jul 12, 2026

---

## 📦 V2 Roadmap (Reference — Original Full-Vision Schedule)

> Preserved for continuity. Pick back up here once MVP testing round 1 is complete and feedback has been reviewed.

### Sprint 2 — Sound & Vision
SVG mouth animations (all 4 clicks) + WaveSurfer.js waveform rendering in Speech Lab.

### Sprint 3 — Audio Recording Week
Record Level 1–2 audio × 3 voices. Upload + tag all files.

### Sprint 4 — Child-First Experience
Kid Mode / Parent Mode split, curriculum map, Lessons 1.1–3.1, streak + XP system.

### Sprint 5 — Depth & Intelligence
Per-click accuracy, PDF injection depth, weak-spot detection, Lessons 3.2–5.3, Counting Rhyme milestone.

### Sprint 6 — Polish, Offline & Launch Prep
Lessons 6–8, badges, family leaderboard, PWA, mobile optimisation, full regression test.

### 🏁 Original Launch Target: May 31, 2026 *(superseded — MVP testing round inserted ahead of this)*

---

## 📊 Success Metrics

### Testing Round 1 (MVP)

| Metric | What it tells us |
|--------|--------------------|
| % of testers who complete a multi-turn conversation | Basic engagement / not bouncing immediately |
| Thumbs up : thumbs down ratio | Whether Kora's responses land well |
| Qualitative feedback from friends | Why they liked/disliked it — the real signal |
| Console/runtime errors during test window | Stability under real (non-dev) usage |

### Long-Term (12 months, full vision)

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
1. **Read Master.md first** — Check the **AI Reviews & Artifacts** section for existing decisions.
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

### 2026-06-21 — MVP Scoping for Friend Testing Round 1 (Claude / Anthropic)
**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Claude (Anthropic, Sonnet 4.6)
**Scope:** Defined MVP scope for the first round of friend testing, ahead of any further build work, and re-sequenced the delivery schedule into 3 MVP sprints for Claude Code execution.

#### Key Decisions
1. **Test goal locked:** this round validates whether the core chat-tutor experience feels good and engaging — not pronunciation accuracy, not curriculum depth, not gamification.
2. **Family/parent-child account model deferred to V2 in full.** MVP uses simple single-profile sign-in (email/Google); family accounts are a real long-term requirement but add auth surface area the current testers (friends, not parents) don't need.
3. **MVP feature set:** chat + 3 starter prompts, PDF-grounded Kora responses, single-profile sign-in, thumbs up/down feedback on responses.
4. **V2 features hidden via feature flags, not deleted:** Speech Lab, curriculum map, XP/streaks/badges, Kid/Parent mode, offline/PWA, progress dashboard. Flagging preserves the work already done while keeping the MVP surface clean.
5. **PDF-grounded grammar injection flagged as a hidden blocker, not a nice-to-have** — if Kora gives ungrounded pronunciation/grammar answers during testing, that's a credibility failure, not a missing feature. Verifying this is live is now Sprint 1 work, not assumed-done.
6. **New schedule:** original 6-sprint full-vision plan preserved under "V2 Roadmap (Reference)"; replaced at the top with 3 MVP-focused sprints (Unblock & Ground → Identity & Signal → Polish & Ship-Ready), targeted for Jun 22 – Jul 12, 2026.

#### Implementation Notes
See **MVP Definition — Testing Round 1** and **Delivery Schedule — MVP Sprints** sections above for full detail. `message_feedback` is a new Firestore collection introduced in Sprint 2 (not previously documented) — shape: `{ userId, messageId, rating, timestamp }`.

#### Next Step
Begin Sprint 1: fix Gemini 400 errors, clear hydration warnings, confirm PDF grounding is actually wired into live chat calls (currently unverified — could be a silent gap).

> 🔁 **Next:** Claude Code to execute Sprint 1, then report back here before starting Sprint 2.

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
- **Raw (programmatic):** `https://raw.githubusercontent.com/AliMora83/Kora-Tutor/main/Master.md`

### Project Metadata (read by Mission Control Dashboard)

- **Status:** Active — MVP scoping complete, Sprint 1 next
- **Next Step:** Fix Gemini 400 errors + hydration warnings; verify PDF grounding is live
- **Blocker:** None (PDF-grounding status to be confirmed in Sprint 1)
- **AI Model:** Claude Code (execution) / Claude, Comet (Perplexity) (review)
- **Effort:** M
- **Progress:** Sprint 1 of 3 (MVP track)

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
| 2026-06-21 | Defer family/parent-child account model to V2; MVP uses single-profile sign-in | Friend testers in round 1 aren't parents; simplifies auth surface for the engagement test | Ali + Claude |
| 2026-06-21 | Hide Speech Lab, curriculum, gamification, Kid/Parent mode, offline mode via feature flags rather than removing code | Keeps work already done reusable for V2, isolates the MVP signal to chat engagement only | Ali + Claude |
| 2026-06-21 | Add thumbs up/down feedback on chat responses | Lightweight way to capture *why* testers react, not just whether they bounce | Ali + Claude |
| 2026-06-21 | Treat PDF-grounded grammar injection as a Sprint 1 blocker, not an assumed-complete feature | Ungrounded pronunciation/grammar claims would corrupt the "does chat feel good" signal | Ali + Claude |
| 2026-06-21 | Claude Code batches each sprint into a single commit at sprint-end and pushes directly to `main` itself | Avoids noisy per-task commits; frees Antigravity's native agent for other work, saving tokens | Ali + Claude |

### Known Issues
- React hydration mismatch warnings in current build — **Sprint 1**
- Gemini 400 errors — model version needs upgrade — **Sprint 1**
- PDF-grounded grammar injection wiring unverified in live chat calls — **Sprint 1**
- Firebase Storage CORS / 403 issues on some audio files — affects V2 (Speech Lab/audio pipeline), not MVP chat; revisit when Speech Lab work resumes

### Future Enhancements
- Community voice recording portal (families contribute audio)
- Multi-voice toggle per word
- Educator dashboard + school pilot programme (Namibia)
- University and NGO partnerships for language preservation

---

## 🔗 Quick Links
- **Repo:** [https://github.com/AliMora83/Kora-Tutor](https://github.com/AliMora83/Kora-Tutor)
- **Live URL:** [https://kora-tutor.vercel.app/](https://kora-tutor.vercel.app/)
- **Mission Control:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)
- **Lesson Plans:** `Kora-LessonPlans.md` (V2 reference)
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
  # Not consumed by MVP chat — relevant again when Speech Lab (V2) resumes

user_recordings/
  {userId}/
    {lessonId}/
      {timestamp}.webm
  # V2 — Speech Lab feature

message_feedback/
  {feedbackId}/
    userId
    messageId
    rating       # "up" | "down"
    timestamp
  # New in MVP Sprint 2 — chat response feedback

pdfs/
  nama-grammar-guide.pdf
  click-phonology-reference.pdf
  vocabulary-glossary.pdf
  # Grounding source for MVP chat — verify wiring in Sprint 1
```

---

## 🔮 Long-Term Vision

Kora becomes the definitive digital platform for Khoekhoegowab — for children, universities, language preservation NGOs, and Khoekhoē communities worldwide. A living repository where community members contribute audio, elders record stories, and families pass the language to grandchildren they may never meet in person.

The language doesn't disappear. Kora won't let it.

---

_Last updated by: Claude (Anthropic) on 2026-06-21_
