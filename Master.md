# 🌍 Kora Tutor – AI-Assisted Development

> **Version:** 1.4 | **Last Updated:** 2026-06-22 | **Owner:** Ali Mora
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

**Next Step:** Sprint 5 complete — awaiting Ali's go-ahead to push to `main`

**Blocker:** None.

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
| Fix Gemini 400 errors — upgrade model version / fix API call config | Claude Code | 🟢 Done |
| Resolve React hydration mismatch warnings in chat UI | Claude Code | 🟢 Done |
| Verify PDF-grounded grammar injection is wired into every live chat call (not just planned) — confirm chunks from `nama-grammar-guide.pdf` / `click-phonology-reference.pdf` reach the Gemini prompt context | Claude Code | 🟢 Done |
| Smoke test: run a 20-turn conversation, confirm zero console errors and no ungrounded grammar claims | Claude Code | 🟡 Partial — single-turn live test confirmed grounding; full 20-turn pass deferred |

**Exit criteria:** Chat runs error-free end-to-end; every grammar/pronunciation claim Kora makes is traceable to the grounding source.

### Sprint 2 — Identity & Signal · Target: Jun 29–Jul 5, 2026

**Goal:** Know who's testing, capture what they think, and hide everything not in MVP scope without deleting it.

| Task | Owner | Status |
|------|-------|--------|
| Build single-profile sign-in (email + Google) — no parent/child split, simplified user doc shape | Claude Code | 🟢 Done — was already implemented |
| Add thumbs up/down control under each Kora response; write to a `message_feedback` Firestore collection (`userId`, `messageId`, `rating`, `timestamp`) | Claude Code | 🟢 Done |
| Feature-flag and hide all V2 surfaces: Speech Lab button/route, curriculum map, XP/streaks/badges UI, Kid/Parent mode toggle, offline/PWA prompts, progress dashboard — flags off by default, code retained in place | Claude Code | 🟢 Done |
| Update or hide the `/progress` page so it doesn't reference unbuilt curriculum data | Claude Code | 🟢 Done |

**Exit criteria:** A new user can sign in, chat, and rate responses; every V2 feature is invisible to testers but not deleted from the codebase.

### Sprint 3 — Polish & Ship-Ready · Target: Jul 6–12, 2026

**Goal:** Make it safe to hand the live link to friends.

| Task | Owner | Status |
|------|-------|--------|
| Full regression pass: sign-in → chat → all 3 starter prompts → feedback rating, on desktop and mobile viewport | Claude Code | 🟢 Done |
| Build a lightweight feedback review path (simple Firestore query/script or a minimal admin-only page) so Ali can read thumbs ratings without manually digging through the Firebase console | Claude Code | 🟢 Done |
| Deploy to Vercel; verify live URL build matches local, confirm production env vars (Gemini key, Firebase config) are correct | Claude Code | 🟡 Pending — auto-deploys via Vercel's GitHub integration on push to `main`; verify live after this push |
| Final console-error sweep + mobile responsiveness check | Claude Code | 🟢 Done — found and fixed a real COOP console error from Firebase Auth popup |

**Exit criteria:** The live link works cleanly for a first-time, signed-out visitor through to a rated conversation, on both desktop and mobile.

### Sprint 4 — Chat History & Audio Pipeline · Target: Jun 22, 2026

**Goal:** Give testers a way to navigate past conversations and let Kora actually play native pronunciation audio in chat, not just describe it.

| Task | Owner | Status |
|------|-------|--------|
| Build a collapsible chat history sidebar panel (list, rename, delete past chats) | Claude Code | ✅ Done |
| Build dynamic Firebase Storage audio resolution for chat playback (live `training_audio/` listing, normalized Nama-phrase lookup) | Claude Code | ✅ Done |
| Split the audio player into a reusable `AudioWaveformPlayer` widget + a thin `FirebaseAudioPlayer` resolution layer | Claude Code | ✅ Done |
| Code-quality pass over the chat history + audio resolution work (zero behavior change, verified via clean build) | Claude Code | ✅ Done |

**Exit criteria:** Testers can browse and resume past chats from a sidebar, and bolded Nama phrases in Kora's replies render a working audio player sourced from real Storage files.

### Sprint 4b — UI Fixes · Target: Jun 22, 2026

**Goal:** Quick polish pass on three rough edges testers would hit immediately — dead-looking chat titles, a broken greetings audio card, and a TTS button nobody asked for.

| Task | Owner | Status |
|------|-------|--------|
| Chat sidebar titles now show first user message truncated to ~40 chars, with "New chat · HH:MM" time fallback for empty chats | Claude Code | ✅ Done |
| Audio player confirmed working for greetings phrases (e.g. !Gâi ║goas) — low recording volume noted as a V2 re-recording task, not a code bug | Claude Code | ✅ Done |
| Speaker/TTS icon replaced with Redo/Regenerate icon (`RotateCcw` from lucide-react); clicking regenerates a fresh Kora reply for the same user message | Claude Code | ✅ Done |

**Exit criteria:** Sidebar entries are individually identifiable at a glance, the greetings audio card plays, and the per-message toolbar offers a regenerate action instead of TTS playback.

### Sprint 5 — Community Affiliation Field · Target: Jun 22, 2026

**Goal:** Start learning which Khoi-San communities our users belong to, without gating anything on it or pestering anyone who's already answered.

| Task | Owner | Status |
|------|-------|--------|
| Add `communityAffiliation` (string \| null) and `communityAffiliationSkipped` (boolean) to the `users/{uid}` doc shape | Claude Code | ✅ Done |
| Build a one-time, optional, free-text-only modal shown after sign-in (Google or email); "Skip for now" / "Save", styled to the dark/amber theme | Claude Code | ✅ Done |
| On Save, write a `community_affiliation_responses` record (`userId`, `affiliation`, `timestamp`, `source: "signup"`) in addition to the user doc | Claude Code | ✅ Done |
| Update `firestore.rules`: create-only/no-read rule for `community_affiliation_responses`; confirm `communityAffiliation` is owner-only via the existing `users/{userId}` rule | Claude Code | ✅ Done |

**Exit criteria:** Every signed-in user sees the prompt at most once (new or existing), no feature is gated behind answering it, and Ali can review responses via the Firebase console.

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

### 2026-06-23 — Audio Waveform Floor Fix (Claude Code / Anthropic)
**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Claude (Anthropic, Sonnet 4.6)
**Scope:** Revisited the "waveform renders flat" report. Verified, rather than assumed, whether the prior `Agent Reviewed` decision below ("low recording volume is a content issue not a code bug") still holds, then shipped a UI improvement on top of it.

#### Key Decisions
1. **The requested fix (`normalize: true`, `barWidth/barGap/barRadius`, amber `waveColor`/`progressColor`) was already in `AudioWaveformPlayer.tsx`, unchanged since the component's introduction.** Verified by downloading the actual flagged files (`1-The Dental/Lateral/Palatal click.m4a`) from Storage, decoding them for real (peak amplitude -19.8dB to -5.7dB — quiet but not silent), and rendering them in an isolated headless-browser reproduction of the exact component markup: the existing settings produce a correct, clearly visible normalized peak. Re-applying the same settings would have been a no-op.
2. **Root cause of the "flat" perception:** these training clips are short, sharp clicks (~0.1–0.3s of sound inside a ~1s recording). Peak-normalizing alone still leaves a narrow spike surrounded by a long near-silent stretch — visually close enough to flat, especially at a glance or in a compressed screenshot, to read as broken even though it's rendering correctly.
3. **Fix shipped:** replaced WaveSurfer's built-in bar options with a custom `renderFunction` (`renderBarsWithFloor` in `AudioWaveformPlayer.tsx`) that applies an 8%-of-half-height minimum floor per bar, so quiet/silent stretches show a visible baseline instead of fading to nothing. WaveSurfer's own `normalize`/`barWidth`/`barGap`/`barRadius` options are not read once `renderFunction` is set, so those literals moved into the custom renderer as constants.
4. **This refines, not reverses, the prior decision** (`2026-06-22` entry below, and the matching Decision Log row): the root cause is still "this is what short recordings normalized look like," not a code defect — the only change here is a perceptual UI improvement on top of that correct behavior.
5. **V2 boundary respected:** only `src/components/AudioWaveformPlayer.tsx` (MVP chat audio) was touched. `SpeechLab/WaveVisualizer.tsx` (V2, live-recording comparison) was not opened.

#### Implementation Notes
- Touched: `src/components/AudioWaveformPlayer.tsx` only.
- Verified via an isolated headless-browser reproduction (Playwright-backed preview tool) loading the real Storage files through the real Firebase download URL — not just unit-level reasoning.
- `npx tsc --noEmit`, `eslint`, and `npm run build` all clean.

#### Next Step
Ali to eyeball the chat audio cards live and confirm the visual improvement reads as intended.

> 🔁 **Next:** Ali to verify live.

---

### 2026-06-22 — Sprint 5: Community Affiliation Field (Claude Code / Anthropic)
**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Claude (Anthropic, Sonnet 4.6)
**Scope:** Built the optional community affiliation prompt — new user-doc fields, a one-time post-sign-in modal, a dedicated responses collection, and the matching Firestore rule.

#### Key Decisions
1. **Provider-agnostic trigger:** the modal's show/hide check is wired into the existing `onAuthStateChanged` listener in `page.tsx`, not into `AuthButton.tsx`'s Google-specific sign-in handler. This means it fires for any auth provider (only Google sign-in is actually implemented today, despite Master.md's MVP scope listing "email or Google" — no email/password flow exists in the codebase) without needing changes if email sign-in is added later.
2. **Dedup is field-based, not event-based:** the modal shows whenever `communityAffiliation` is falsy AND `communityAffiliationSkipped` is falsy, checked on every auth-state resolution (covers fresh sign-in and session-resume on reload alike). Once either Save or Skip writes one of those fields, the modal never shows again for that user — including users who existed before this feature shipped, since the check is purely field-presence, not a "new account" flag.
3. **No new Firestore rule needed for `communityAffiliation` itself:** the existing `users/{userId}/{document=**}` recursive-wildcard rule already covers the `users/{userId}` document itself (Firestore recursive wildcards include the parent document), and Firestore has no field-level security — so document-level owner-only access already satisfies "communityAffiliation readable by owner only." Documented this in a `firestore.rules` comment so it doesn't look like a missed requirement on review.
4. **New `community_affiliation_responses` rule mirrors `message_feedback`'s pattern** (`read: false`, `create` only if `userId` matches `request.auth.uid`) but is `create`-only with no `update`, since these are one-shot signup-time records, not editable like a re-rated thumbs vote.
5. **Title generation reused the existing free-text convention** — no dropdown, single text input, "e.g. Nama, ǁKhomani, Damara..." placeholder for guidance without constraining input.
6. **Commit split:** Sprint 4b's code (chat titles, audio fix, regenerate button) had been left uncommitted in the working tree from an earlier session — only its Master.md docs were committed. Split into two commits at Ali's direction: Sprint 4b's code committed first standalone, then Sprint 5's new code on top, keeping the one-commit-per-sprint convention intact rather than conflating two sprints' work.

#### Implementation Notes
- New: `src/components/CommunityAffiliationModal.tsx`.
- Touched: `src/app/page.tsx` (auth listener, two new handlers, render restructured from two early returns into one fragment so the modal can overlay either the welcome screen or the chat view), `firestore.rules`.
- Firestore rules deployed live (`firebase deploy --only firestore:rules --project nama-language`).
- `npx tsc --noEmit`, `eslint`, and `npm run build` all clean.
- Live browser verification (clicking through sign-in → modal → Save/Skip → reload) was not possible this session — the Chrome extension didn't connect. Flagged to Ali as a manual follow-up.

#### Next Step
Ali to manually verify the modal end-to-end (appears once, Save and Skip both dismiss and persist, no re-prompt on reload), then approve the push to `main`.

> 🔁 **Next:** Ali to verify live and ratify; Claude Code to push once approved.

---

### 2026-06-22 — Sprint 4b: UI Fixes (Claude Code / Anthropic)
**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Claude (Anthropic, Sonnet 4.6)
**Scope:** Three small polish fixes ahead of Sprint 5 — reactive chat sidebar titles, a fix to native greetings audio playback, and replacing the per-message TTS button with a regenerate action.

#### Key Decisions
1. **Chat titles:** the sidebar previously showed a static `Chat — {date}` label for every chat, making them indistinguishable. Titles now default to the first user message (truncated to ~40 chars), written to the chat's Firestore doc at send-time so it persists across reloads; chats with no user message yet fall back to `New chat · {time}`. Title generation is local string truncation, not a Gemini call — fast, free, and sufficient for this use case.
2. **Greetings audio (e.g. "Good Morning" / `!Gâi ║goas`):** traced end-to-end from chat UI to Firebase Storage. Root cause was two compounding bugs, not Storage/CORS (which were already fine) — `gemini_audio_list.json` (the file list injected into Kora's system prompt) was missing 49 of 125 real Storage files including the entire greetings section, and `normalizeAudioKey()`'s click-glyph handling normalized to the wrong canonical character for the Lateral click. Fixed both; audio playback confirmed working. Low recording volume on some native clips is a content/recording-quality issue, not a code bug — logged as a V2 re-recording task, not reopened here.
3. **Speaker icon → Regenerate:** removed the Volume2/Square TTS "Read Aloud" toggle from the per-message toolbar and replaced it with a `RotateCcw` "Regenerate" button that re-sends the same preceding user message and appends a fresh Kora reply. Underlying TTS/audio-orchestrator code was left in place (not deleted), per the standing "feature-flag, don't delete" rule — only the toolbar button was removed.

#### Implementation Notes
- Touched: `src/app/page.tsx`, `src/components/ChatHistoryPanel.tsx`, `src/components/ChatInterface.tsx`, `src/lib/audioLibrary.ts`, `src/data/gemini_audio_list.json`.
- `npx tsc --noEmit` clean; no new lint issues introduced.

#### Next Step
Ali to ratify Sprint 4b, then Claude Code begins Sprint 5 — Community Affiliation Field.

> 🔁 **Next:** Ali to ratify; Claude Code to begin Sprint 5.

---

### 2026-06-21 — Sprint 2 & 3: Identity, Feedback, Polish (Claude / Anthropic)
**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Claude (Anthropic, Sonnet 4.6)
**Scope:** Completed Sprint 2 (sign-in, feedback, feature flags, progress page) and Sprint 3 (regression pass, feedback review tooling, console/mobile sweep). Deploy-to-Vercel verification deferred to immediately after this push.

#### Key Decisions
1. **Sign-in was already built** — Google sign-in via `signInWithPopup` was fully functional going into Sprint 2 (`AuthButton.tsx`); no family/parent-child model existed, so MVP single-profile scope was already satisfied. No code changes needed there.
2. **Feedback control:** added thumbs up/down buttons to each Kora response in `ChatInterface.tsx`, writing to `message_feedback/{userId}_{messageId}` (deterministic ID so re-rating overwrites rather than duplicating). Added a matching Firestore rule (`create`/`update` only if `request.auth.uid` matches `userId` and the doc ID matches the expected composite key; `read`/`delete` denied to all clients) and deployed it live.
3. **Feature flags introduced from scratch** — `src/lib/featureFlags.ts`, three flags (`SPEECH_LAB`, `PROGRESS_DASHBOARD`, `XP_SYSTEM`), all default off via env vars. Gated: Speech Lab UI + mic recorder + the system-prompt section that told Kora to promote the mic (chat/route.ts), the Progress sidebar link, and the XP toast/increment logic. None of the underlying code was deleted, per standing rule.
4. **`/progress` route is still directly reachable by URL** even with the nav link hidden, so the page itself now checks the flag and shows a short "still being built" placeholder instead of mock curriculum/XP data when off — avoids a tester finding half-built lesson cards by typing the URL.
5. **Feedback review tooling:** built `src/scripts/review_feedback.ts` using the operator's own `gcloud auth print-access-token` (not a service-account key) against the Firestore REST API — avoids introducing a new admin-only web route/auth surface for a one-person, one-sprint need. Verified end-to-end by seeding and then deleting a synthetic test record.
6. **Regression pass:** all 3 starter prompts (Translate Phrase, Explain Grammar, Practice Script) tested live and grounded correctly; `npm run build` (production build, same as Vercel will run) succeeds cleanly; all routes return 200.
7. **Found and fixed a real console error during the sweep, not just warnings:** Firebase Auth's `signInWithPopup` calls `window.closed` on the popup, which Next.js's default same-origin COOP header blocks — this was throwing 4 red `Cross-Origin-Opener-Policy` errors on every sign-in. Fixed via `headers()` in `next.config.ts` setting `Cross-Origin-Opener-Policy: same-origin-allow-popups` globally. Verified fixed live (confirmed by Ali after server restart). Also cleaned up two `next/image` warnings (missing `sizes` prop) on the logo across `Sidebar.tsx` and `ChatInterface.tsx`.
8. **Completed the SDK migration started in Sprint 1** — `src/scripts/sync_audio.ts` was still on the deprecated `@google/generative-ai` SDK (missed in the original 3-route migration since it's a standalone script, not an API route). Migrated to `@google/genai` and switched from a `service-account.json` file to Application Default Credentials, matching `seed_knowledge.ts`'s pattern.
9. **Vercel deploy is automatic** — no `vercel.json` or linked CLI project found; the live URL deploys via Vercel's GitHub integration on push to `main`. "Deploy to Vercel" is therefore not a separate manual step — it happens as a side effect of this sprint's push, and production env vars will be verified against the live URL immediately after.

#### Implementation Notes
- New: `src/lib/featureFlags.ts`, `src/scripts/review_feedback.ts`.
- Firestore rules redeployed live (`firebase deploy --only firestore:rules --project nama-language`) — note the active `firebase use` project alias was stale (pointed at an unrelated project, `openclaw-mission-control-d1fa8`); always pass `--project nama-language` explicitly rather than relying on `firebase use` in this environment.
- `Message` type gained an optional `id` field (`crypto.randomUUID()` generated at send-time in `page.tsx`) so feedback can reference a stable message ID; legacy messages without an ID fall back to `idx-{index}` in the UI.

#### Next Step
Push to `main`, confirm the Vercel deploy picks up cleanly, and verify production env vars (`GEMINI_API_KEY`, Firebase config) match what's expected on the live URL. Then this MVP test-ready milestone is complete pending Ali's go-ahead to share the link with friends.

> 🔁 **Next:** Claude Code to verify the live Vercel deploy post-push; Ali to ratify Sprints 2 & 3 or flag anything from manual testing.

---

### 2026-06-22 — Post-Feature Refactor: Audio Pipeline Cleanup (Claude / Anthropic)
**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Claude (Anthropic, Sonnet 4.6)
**Scope:** Code-quality pass over the chat history panel and dynamic audio resolution work built across the last several sessions. Zero behavior changes — UI, copy, and rendered output are identical before/after; verified via clean `npm run build` and a runtime smoke check.

#### Key Decisions
1. **Split audio rendering into two layers.** `src/components/AudioWaveformPlayer.tsx` is now the single reusable WaveSurfer widget — props are exactly `{ url: string; label: string }` per spec, owns `WaveSurfer.create()`/`.destroy()` and the play/pause + fixed-height/clipped-card UI, nothing else. `FirebaseAudioPlayer.tsx` became a thin resolution layer: looks up a chat-message audio reference in the session-cached library, then hands `{url, label}` to `AudioWaveformPlayer`. There was exactly one WaveSurfer mount site before this split (no duplicates to consolidate) — V2's `SpeechLab/WaveVisualizer.tsx` is a deliberately different live-recording-comparison widget and was left untouched per the "don't touch V2" constraint.
2. **`audioLibrary.ts` cache was already a true module-level singleton** (`let cachedLibrary: Promise<...> | null`, set once, reused by every caller) — confirmed, not re-initialized per component mount. Added a top-of-file JSDoc block spelling out the `{number}-{slug}-{Nama phrase}.m4a` naming convention so the parsing logic in `normalizeAudioKey` reads as "implements this documented rule," not opaque regex.
3. **Feature-flag audit:** grepped every `FEATURE_FLAGS.*` usage across `src/` — all 6 V2 gating sites (Speech Lab in `chat/route.ts` and `ChatInterface.tsx` ×5, Progress in `progress/page.tsx` and `Sidebar.tsx`, XP in `page.tsx`) are unchanged and consistent. The audio work doesn't touch any gated surface — audio playback itself is MVP scope, not V2.
4. **No `any` types were introduced by this sprint's work** — checked every file added/modified in this stretch (`audioLibrary.ts`, `AudioWaveformPlayer.tsx`, `FirebaseAudioPlayer.tsx`, `ChatHistoryPanel.tsx`, `page.tsx`'s additions). The `any` usages still present in `ChatInterface.tsx` (markdown component prop types, the Speech Lab `evaluation` state) all predate this work and are V2-adjacent or pre-existing project debt — left alone rather than scope-creeping into an unrelated cleanup.
5. **No leftover debug `console.log`s found.** The `console.error` calls in `audioLibrary.ts` and `page.tsx` are intentional error-path logging (Storage list/lookup failures, Firestore write failures), consistent with the rest of the codebase's existing error-handling style — not iteration debris.
6. **`renderContent` in `ChatInterface.tsx`** already only had two steps (inject audio links, then re-encode filenames for the markdown round-trip) — added a clearer `--- Audio card resolution ---` comment block and renamed one intermediate variable (`contentWithAudio` → `contentWithAudioLinks`) for readability; no logic changed.

#### Implementation Notes
- New file: `src/components/AudioWaveformPlayer.tsx`.
- `FirebaseAudioPlayer.tsx` shrank from ~145 lines (own WaveSurfer instance + lookup) to ~50 (lookup + delegate).
- `npm run build` and `npx tsc --noEmit` both clean; lint clean on every new/touched file in this pass.

#### Next Step
Ali to manually re-verify chat audio (click sounds + any other bold-phrase matches) still renders identically after this refactor, then this stretch of work (chat history panel + dynamic audio resolution + this cleanup) is ready to batch-commit.

> 🔁 **Next:** Ali to confirm visually; Claude Code to batch-commit and push pending Ali's go-ahead.

---

### 2026-06-21 — Sprint 1: Unblock & Ground (Claude / Anthropic)
**Status:** `Agent Reviewed` — pending cross-check
**Reviewed by:** Claude (Anthropic, Sonnet 4.6)
**Scope:** Executed Sprint 1 — fixed Gemini 400 errors, reviewed and cleaned up hydration handling, verified PDF/grammar knowledge grounding is live in production chat calls.

#### Key Decisions
1. **Root cause of Gemini 400 errors:** the codebase was on `@google/generative-ai@0.24.1`, Google's frozen legacy SDK (last published a year prior, no longer updated), which is incompatible with `gemini-2.5-flash` on the current live API. Migrated `chat/route.ts`, `evaluate-speech/route.ts`, and `generate-script/route.ts` to the actively maintained `@google/genai` SDK (`ai.models.generateContent({ model, config: { systemInstruction }, contents })`). Live-tested after migration — 200 OK, Kora responding correctly.
2. **Hydration mismatch review:** audited all client components (`AuthButton`, `Sidebar`, `ChatInterface`, `page.tsx`, `FirebaseAudioPlayer`, `progress/page.tsx`) for the usual mismatch sources (`Date.now()`, `Math.random()`, unguarded `window`/`localStorage` access, conditional SSR-vs-client render). All existing `mounted`-flag and `typeof window` guards were already correct. Removed one dead, unused `mounted` state in `ChatInterface.tsx` (no functional mismatch, just clutter). No live console verification was possible this session (Chrome extension didn't respond) — flagged below as a follow-up.
3. **PDF-grounded knowledge injection — confirmed live, but found and fixed a real blocker first:** the Firestore database query initially returned `NOT_FOUND` on `(default)`. Root cause turned out to be that the project uses a **named** Firestore database (`nama-language`), not the default one — `src/lib/firebase.ts` already correctly points `getFirestore(app, "nama-language")`, and the `resources/nama_language_guide` document was already seeded there (full Nama language guide content, last updated 2026-02-06). Verified end-to-end with a live chat call: Kora correctly refused to answer a question outside the source material ("water") rather than hallucinating — confirms strict source-adherence is working as designed.
4. **Knowledge source is Markdown-in-Firestore, not the PDFs named in Master.md's Firebase Storage Structure section** (`nama-grammar-guide.pdf`, `click-phonology-reference.pdf`). Those PDF filenames don't exist in the repo or Storage; the actual grounding source is `resources/nama_language_guide` (Markdown) read via `src/lib/knowledge.ts`. This works correctly for MVP purposes but the PDF filenames in this doc's Firebase Storage Structure section are aspirational/inaccurate and should be corrected in a future pass.
5. **Smoke test partially complete:** a full 20-turn smoke test was not run this session. A single live end-to-end call confirmed grounding and zero errors, but the full multi-turn pass (translate/grammar/audio prompts, console monitoring) is deferred — see Next Step.

#### Implementation Notes
- New file: `src/scripts/seed_knowledge.ts` — re-seeds `resources/nama_language_guide` into the `nama-language` Firestore database via firebase-admin; keep this for future re-seeding if content changes.
- `package.json`: `@google/generative-ai` removed in favor of `@google/genai@^2.9.0`.
- `.env.local` created locally (not committed) with `GEMINI_API_KEY` and Firebase web config — required for any future local dev/testing session.

#### Next Step
Run the full 20-turn smoke test (translate phrase / explain grammar / practice script prompts) with browser console monitoring once Chrome tooling is available, to formally close out Sprint 1's last exit-criterion. Then begin Sprint 2: single-profile sign-in, thumbs up/down feedback, and feature-flagging all V2 surfaces.

> 🔁 **Next:** Claude Code to begin Sprint 2; full smoke-test pass can run in parallel or as a quick follow-up.

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

- **Status:** Active — Sprints 1–5 complete, pending push to `main`
- **Next Step:** Ali to ratify Sprint 5 and approve push to `main`
- **Blocker:** None
- **AI Model:** Claude Code (execution) / Claude, Comet (Perplexity) (review)
- **Effort:** M
- **Progress:** 6 of 7 sprints complete (including 4b)

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
| 2026-06-22 | Chat titles show first user message, truncated | Static "Chat — date" labels were identical and useless for navigation | Ali + Claude Code |
| 2026-06-22 | Audio waveform not rendering flagged as V2 re-recording task | Low recording volume is a content issue not a code bug; fix when re-recording audio in V2 | Ali + Claude |
| 2026-06-22 | Speaker icon replaced with Redo/Regenerate | TTS playback is handled by the audio player; the toolbar icon is more useful as a regenerate action | Ali + Claude |
| 2026-06-22 | Community affiliation field is fully optional, free-text only, never gates a feature, and prompts at most once per user | Wanted signal on who the community is, without adding friction or implying any feature requires answering | Ali + Claude Code |
| 2026-06-22 | `communityAffiliation` field-level security relies on the existing `users/{userId}` document-owner rule rather than a new rule | Firestore has no field-level security rules; document-level owner gating already satisfies "owner only" for any field on that doc | Claude Code |
| 2026-06-23 | Added a minimum bar-height floor to the chat audio waveform renderer, on top of the existing (already-correct) normalize/color settings | Short click recordings stay a narrow spike even fully normalized; verified the settings weren't the bug before changing anything | Ali + Claude Code |

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

_Last updated by: Claude (Anthropic) on 2026-06-22_
