# 🌍 Kora Tutor – AI-Assisted Development

> **Version:** 1.9 | **Last Updated:** 2026-11-16 | **Owner:** Ali Mora
> **Mission Control:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)

---

## 📖 How to Use This File

**For Ali:** This is the single source of truth for Kora Tutor. Update project status, sprint tasks, and AI review entries here.

**For AI Agents:** Before starting work on this project:
1. Read this `Master.md` file first
2. Check the **AI Reviews & Artifacts** section for existing architectural decisions — and `docs/AI-REVIEWS-ARCHIVE.md` for anything before 2026-11-15
3. Follow the **Multi-Agent Context Protocol (MACP)** below
4. Commit your review to this file when done

---

## 🚀 Project Overview

**Description:** Kora is a culturally immersive language-learning platform for Khoekhoē children (ages 5–14), teaching Khoekhoegowab (Nama) through AI-powered speech coaching, animated phonetic illustrations, and a structured curriculum sourced from Pedro Dausab's *Leer jouself Nama*.

**Status:** MVP built (Sprints 1–5) — Gemini key rotated and working; model updated to 3.8 Flash 2026-11-16, awaiting a live reply to confirm. No external users yet

**Priority:** Priority 2 – Active Development

**Stack:** TypeScript / Next.js 14+ / Firebase / Google Gemini 3.8 Flash (`@google/genai`) / WaveSurfer.js / Framer Motion / GSAP

**Repo:** [https://github.com/AliMora83/Kora-Tutor](https://github.com/AliMora83/Kora-Tutor)

**Live URL:** [https://kora.namka.cloud/](https://kora.namka.cloud/) — served by Vercel (DNS: `kora` CNAME → `vercel-dns-017.com`)

**AI Model Assigned:** Claude Code (build/execution) / Claude, Comet (Perplexity) (review)

**Development Environment:** Antigravity IDE, with Claude Code integrated directly in-editor — open this repo there (not VS Code) to execute sprint tasks.

---

## 🎯 Current Goal

**Next Milestone:** Get the first real users. The MVP is built but as of 2026-11-15 nobody other than Ali has signed in, so there is no engagement or thumbs data yet. Sprint 6 removes what stands between a visitor and a first good answer.

**Next Step:** Confirm the chat replies on kora.namka.cloud, then start Sprint 6 — see Delivery Schedule.

**Blocker:** 🟡 Clearing. The leaked-key 403 is resolved — the rotated key authenticates. It exposed a second fault behind it: `gemini-2.5-flash` is retired for new users and returned `404 NOT_FOUND`. The model ID moved to `gemini-3.8-flash` on 2026-11-16; awaiting a live reply to confirm.

**Effort Estimate:** M (re-scoped down from L after MVP cut)

**Progress:** 20% of full vision; MVP Sprints 1–5 complete, Sprint 6 planned

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
- **AI / LLM:** Google Gemini 3.8 Flash via the `@google/genai` SDK. The model ID lives in one place, `src/lib/model.ts` — import `GEMINI_MODEL`, never hardcode it. Gemini 3.x rejects `temperature`, `topP`, `topK` and `candidateCount`, so keep them out of the request config. (History: 1.5 Flash on the legacy SDK → 2.5 Flash in Sprint 1 → 3.8 Flash on 2026-11-16, after Google retired 2.5 for new users.) Grounding is the Markdown guide in Firestore (`resources/nama_language_guide`), not PDFs
- **Voice:** Native recordings only. TTS was dropped — the toolbar TTS button became Regenerate in Sprint 4b; `api/tts` code is retained but unused. Kora never synthesises Nama pronunciation
- **Audio Viz:** WaveSurfer.js — used in MVP chat for native-clip playback (Sprint 4); the Speech Lab comparison view stays V2
- **SVG Animations:** GSAP / CSS keyframes (mouth/tongue articulation) — V2
- **Deployment:** **Today:** Vercel (Next.js app and `/api/*` routes, auto-deploy on push to `main`) + Firebase (Auth, Firestore, Storage). kora.namka.cloud is a Cloudflare DNS-only CNAME to Vercel (`vercel-dns-017.com`), confirmed 2026-11-16; production env vars live in the Vercel project settings. **Target:** self-hosted on the Hostinger VPS (Docker behind the existing nginx front door) — Sprint 7

---

## 🧭 Vision Statement

Kora exists so that Khoekhoē children grow up knowing their language — not as a school subject, but as a living part of who they are. It is a cultural inheritance platform disguised as a game, built for families who want the next generation to speak, hear, and feel Khoekhoegowab.

**Mission:** To make Khoekhoegowab (Nama) the most accessible, joyful, and linguistically accurate indigenous language to learn digitally — built for Khoekhoē kids, used by their families, trusted by their communities.

*(Note: MVP testing round validates the core tutoring experience with general users first, as a stepping stone toward this full vision — not a change in destination, just a sequencing decision.)*

---

## 👥 Primary Users & Personas

### 1. 🧪 First Visitor — *Current MVP User*
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
| Dental | ǀ | Tongue tip behind upper teeth |
| Lateral | ǁ | Side of tongue against molars |
| Alveolar | ǂ | Tongue tip to alveolar ridge |
| Palatal | ǃ | Tongue body to hard palate |

*Naming follows the source book (*Leer jouself Nama*): ǃ = palatal, ǂ = alveolar. Always use the real click letters ǀ ǁ ǂ ǃ, never ASCII stand-ins.*

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

**Speech Wave Visualizer:** WaveSurfer.js renders the native speaker's waveform (amber/gold) and the learner's recording (blue/white) side by side, with a click-spike callout marking where the transient should appear.

**Learner Memory & Weak-Spot Tracking:** per learner — click accuracy history, vocabulary recall rate, streaks. Adaptive drills target the weak click types.

**Rewards & Engagement:** XP, daily streaks, cultural badges (e.g. *"Master of the ǃ click"*), unlockable Kora outfits, family leaderboard.

**Offline Mode (PWA):** a service worker caches Levels 1–2. Progress syncs to Firestore on reconnect, and the Speech Lab falls back to waveform-only comparison while offline.

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

### Sprint 6 — Unblock & Open · Target: TBC (starts once the key is rotated)

**Goal:** Restore the chat, then make Kora worth visiting without an account. Agreed in the 2026-11-15 product review.

| # | Task | Owner | Status |
|---|------|-------|--------|
| -1 | **Model ID retired.** `gemini-2.5-flash` returns `404 NOT_FOUND` for new users; moved to `gemini-3.8-flash` via the new `src/lib/model.ts` constant | Claude | ✅ Done 2026-11-16 — awaiting live confirmation |
| 0 | **Rotate the Gemini API key.** New key from Google AI Studio on project `nama-language`; set `GEMINI_API_KEY` in Vercel → Settings → Environment Variables (Production), redeploy, delete the old key | Ali (manual) | 🟡 Key set 2026-11-16 — outstanding: redeploy if not already done, confirm a live chat reply, delete the old key |
| 1 | Replace the raw API error JSON in the chat bubble with a friendly message; log the detail server-side only | Claude Code | ⚪ Planned |
| 2 | **Golden-set eval.** 40–50 question/expected-answer pairs drawn from `nama_language_guide.md` (all three starter-prompt types, plus out-of-source questions that must be refused). Script in `src/scripts/`, run before every prompt or model change | Claude Code | ⚪ Planned |
| 3 | **"Hear the four clicks" public page.** No sign-in, no LLM: the four clicks plus ~20 words with native audio. Server-rendered so it is shareable and indexable | Claude Code | ⚪ Planned — gated on the listening check below |
| 4 | **Guest chat.** ~5 messages before the sign-in prompt, on top of the limiter from task 6 | Claude Code | ⚪ Planned — blocked on task 6 |
| 5 | **Refusal log.** When Kora declines a question as outside the source, write the question to a `knowledge_gaps` collection (create-only, no client read). The list drives what content to source next | Claude Code | ⚪ Planned |
| 6 | **Protect the API routes — raised in priority 2026-11-16.** `/api/chat`, `/api/evaluate-speech` and `/api/generate-script` have no auth check, no middleware and no rate limit today, so anyone who finds them can spend the new key's quota. Add a per-IP/per-session limit and an origin check before task 4 opens guest chat; task 4 then rides on the same limiter | Claude Code | 🟠 Do before task 4 |

**Gate for task 3:** clips are confirmed by ear before they are published. The existing `training_audio/1-The … click.m4a` file names predate the book-naming decision (ǃ = palatal, ǂ = alveolar), so each file must be checked against the label it is shown with.

**Exit criteria:** A signed-out visitor can hear the four clicks and send a first chat message without an account; the eval passes on the deployed model; refused questions are being logged.

### Sprint 7 — Move Hosting to the Hostinger VPS · Target: TBC (after Sprint 6)

**Goal:** Kora runs on Ali's own VPS alongside his other dockerized apps, not on Vercel. Decided 2026-11-16.

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Add `output: 'standalone'` to `next.config.ts` and a multi-stage `Dockerfile`. **The seven `NEXT_PUBLIC_FIREBASE_*` values are inlined at build time, so they must be Docker build args, not only runtime env** — a container built without them ships a broken Firebase config | Claude Code | ⚪ Planned |
| 2 | Add Kora to the VPS `docker-compose.yml`; `GEMINI_API_KEY` goes in that stack's `.env` (runtime, server-side only) | Ali | ⚪ Planned |
| 3 | nginx front-door server block for kora.namka.cloud → the container; TLS via certbot (Cloudflare is DNS-only, so the cert is issued on the VPS) | Ali | ⚪ Planned |
| 4 | Cut over DNS: replace the `kora` CNAME with an A record to the VPS IP. Keep the Vercel deploy live until the VPS serves a working chat | Ali | ⚪ Planned |
| 5 | Decide the deploy trigger — a push to `main` will no longer deploy anything by itself. Either a manual `git pull && docker compose up -d --build` or a webhook/CI step | Ali + Claude | ⚪ Planned |
| 6 | Confirm kora.namka.cloud is still in Firebase Auth's authorised domains (the domain does not change, so it should be), then delete the Vercel project and its stored env vars | Ali | ⚪ Planned |

**Watch for:** the COOP header in `next.config.ts` (`same-origin-allow-popups`) is what makes Google sign-in work — if nginx or the container drops it, sign-in breaks with console errors. Verify it on the live response after cutover.

**Exit criteria:** kora.namka.cloud is served by the VPS over HTTPS, sign-in and chat both work, and Vercel is gone.

### 🏁 MVP Test-Ready Target: Jul 12, 2026 *(build met; no external users as of 2026-11-15)*

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
1. **Read Master.md first** — Check the **AI Reviews & Artifacts** section for existing decisions, and `docs/AI-REVIEWS-ARCHIVE.md` for entries before 2026-11-15.
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

### 2026-11-16 — Model Moved to Gemini 3.8 Flash (Claude / Anthropic)
**Status:** `Agent Reviewed`
**Reviewed by:** Claude (Anthropic)
**Scope:** Fixed the live chat after the key rotation surfaced a second fault. First code change in this run of work.

#### Key Decisions
1. **The key rotation worked.** With a valid key the 403 disappeared and revealed what sat behind it: `404 NOT_FOUND — "models/gemini-2.5-flash is no longer available to new users"`. Two separate faults, found one at a time. The project's own Google account is "new" to that model, so the retirement applies.
2. **Moved to `gemini-3.8-flash`**, the successor Google's error names. Confirmed against Google's docs: it is GA, and the `ai.models.generateContent({ model, config, contents })` shape this codebase already uses is exactly what the 3.8 docs show, so it is a drop-in string change.
3. **The model ID now lives in `src/lib/model.ts`** as `GEMINI_MODEL`. It had been hardcoded at six sites; one stale copy is enough to take the chat down again. The file also carries the Gemini 3.x warning about sampling parameters.
4. **Updated:** `chat/route.ts` (both call sites and the log line), `generate-script/route.ts` (the `/generators/*` pages), and the "Kora 2.5 Flash" label in `ChatInterface.tsx`.
5. **`evaluate-speech/route.ts` (Speech Lab, V2-flagged) updated on Ali's explicit go-ahead**, as the one exception to the no-touch-V2 rule: leaving a dead model ID in flagged-off code just books a failure for whoever resumes V2. Behaviour is unchanged while the flag is off.
6. **`smart_audio_ingestion.ts` left alone** — it is a standalone script still on the removed `@google/generative-ai` SDK, so it needs a migration rather than a rename. Logged in Known Issues.
7. **The `package-lock.json` churn from this session's `npm install` was reverted** — only `"peer": true` metadata, no version changes, and not a deliberate part of this work.

#### Implementation Notes
- Checked for `temperature`, `topP`, `topK` and `candidateCount` before switching, since Gemini 3.x rejects them: none present.
- `npx tsc --noEmit` passes. `npm run build` could not complete in the sandbox — `next/font` cannot reach Google Fonts through the proxy, which is a network restriction here, not a fault in this change. Vercel's builders can reach it.
- `@google/genai` left at `^2.9.0`. If 3.8 needs a newer SDK, the error will say so; bumping it blind risks a build break for no observed reason.

#### Next Step
Ali confirms a reply on the live site, then deletes the old key.

> 🔁 **Next:** Ali to verify live; then Sprint 6.

---

### 2026-11-16 — Duplicate Master Files Removed (Claude / Anthropic)
**Status:** `Agent Reviewed`
**Reviewed by:** Claude (Anthropic)
**Scope:** Consolidated and deleted the two leftover master files, and dropped one obsolete review entry. Documentation only — no app code changed.

#### Key Decisions
1. **`Kora-Master.md` deleted** (last touched 2026-04-20) and **`Template-Master.md` deleted** (2026-03-28). Both predate this file and were a standing trap: an agent told to "read Master.md" could open the wrong one and act on April's plan.
2. **Four details carried across from `Kora-Master.md` into V2 Feature Detail** before deleting it — the only content it held that this file lacked: the Speech Wave Visualizer's colour scheme and click-spike callout, vocabulary recall rate in weak-spot tracking, cultural badges and unlockable Kora outfits, and the offline scope (Levels 1–2 cached, Speech Lab degrades to waveform-only).
3. **Deliberately not carried across:** its click table used the pre-ratification naming (ǂ alveolar swapped with ǃ palatal) and ASCII stand-ins; its "PDF Knowledge Injection" section describes a grounding method replaced by Markdown-in-Firestore; its sprint schedule, metadata, Known Issues and Quick Links were all superseded. Everything else in it already appears here.
4. **The 2026-03-29 Comet review entry deleted from the archive** — its whole subject was restructuring `Kora-Master.md`, which no longer exists. The archive now holds eight entries.

#### Implementation Notes
- Checked before deleting: nothing outside the deleted files and that Comet entry referenced either filename, so no dangling links remain.

#### Next Step
None — this closes the docs cleanup. Sprint 6 is next.

> 🔁 **Next:** Claude Code to start Sprint 6 once the live chat reply is confirmed.

---

### 2026-11-16 — Gemini Key Rotated; API Routes Found Unauthenticated (Claude / Anthropic)
**Status:** `Agent Reviewed`
**Reviewed by:** Claude (Anthropic)
**Scope:** Recorded the key rotation and audited what the new key is exposed to. Documentation only — no app code changed.

#### Key Decisions
1. **New Gemini key is set in Vercel** (Ali, 2026-11-16). Two things remain open and are tracked on Sprint 6 task 0: a Vercel environment-variable change only applies to a *new* deployment, so a redeploy is needed if one has not run since; and nobody has yet confirmed a live chat reply. The blocker stays amber until a real reply comes back.
2. **The chat endpoint is already public.** `/api/chat` takes an unauthenticated POST — there is no `middleware.ts`, no token check and no rate limit anywhere under `src/app/api/`. `/api/evaluate-speech` and `/api/generate-script` are the same. The sign-in wall is UI-only; it never protected the key. Anyone who finds the URL can spend the new key's quota, which makes rate limiting a prerequisite rather than a guest-chat detail — now Sprint 6 task 6, ahead of task 4.
3. **This does not change the leak diagnosis.** Google flags a key as leaked when it finds it published, which points at the git history (see the 2026-11-15 entry), not at endpoint traffic. The open endpoint is a separate, live exposure worth closing regardless.
4. **The nine review entries before 2026-11-15 moved to `docs/AI-REVIEWS-ARCHIVE.md`**, verbatim and newest-first, with a pointer left in their place. Master.md had grown past the point where tooling could read or rewrite it in one pass, which was already blocking syncs. Nothing was edited or dropped — 3 entries stay here, 9 are in the archive.

#### Implementation Notes
- Verified by reading `src/app/api/chat/route.ts` and grepping `src/app/api/` for auth, token and rate-limit references: the only match is the word "auth" inside a prompt string.
- A live `POST` to `https://kora.namka.cloud/api/chat` could not be made from this session — outbound requests to that host are refused by the sandbox proxy. The verification has to be done from Ali's browser.
- `src/app/api/chat/route.ts` instructs Kora to write clicks as `!`, `|`, `||` with only `ǂ` as a real letter. The *naming* matches the book (ǃ palatal, ǂ alveolar), but three of the four symbols are ASCII stand-ins, which contradicts the real-click-letter decision. Logged in Known Issues, not fixed here.

#### Next Step
Ali confirms a live chat reply, then deletes the old key. Claude Code starts Sprint 6, taking task 6 before task 4.

> 🔁 **Next:** Ali to verify the live reply; Claude Code to start Sprint 6.

---

### 2026-11-16 — Hosting Confirmed, PROJECT-SYNC Removed, VPS Migration Agreed (Claude / Anthropic)
**Status:** `Agent Reviewed`
**Reviewed by:** Claude (Anthropic)
**Scope:** Settled where Kora is hosted, deleted a broken generated file, and recorded the decision to self-host. Documentation and repo housekeeping only — no app code changed.

#### Key Decisions
1. **Kora is on Vercel today.** Cloudflare DNS shows `kora.namka.cloud` as a DNS-only CNAME to `4091c3f52d0a90ae.vercel-dns-017.com`. None of the VPS A records (147.93.18.188) cover it. An earlier belief that Vercel was unused traced back to this file, so the docs were the source of the confusion.
2. **Kora should move to the Hostinger VPS** — Ali's decision. Planned as Sprint 7, after the chat is unblocked.
3. **`PROJECT-SYNC.json` and `.github/workflows/generate-project-sync.yml` deleted.** The workflow wrote the raw multi-line commit message into a JSON string without escaping, so the committed file has never been valid JSON — anything parsing it fails. It also hardcoded `live_url` and `deploy_target`, rewriting them on every push. Master.md is already the single source of truth and is readable raw.

#### Implementation Notes
- If Mission Control reads `PROJECT-SYNC.json`, it needs repointing at `Master.md`'s raw URL. Not verified here — that is a different repo.
- `package.json` pins `next@16.1.6`, not the 14+ this file has claimed since March.

#### Next Step
Ali rotates the Gemini key in Vercel (Sprint 6 task 0) to restore the chat, then Sprint 7 moves hosting.

> 🔁 **Next:** Ali to rotate the key; Sprint 7 to be scheduled.

---

### 2026-11-15 — Product Review & Sprint 6 Planning (Claude / Anthropic)
**Status:** `Agent Reviewed` — directions approved by Ali in session
**Reviewed by:** Claude (Anthropic)
**Scope:** Reviewed progress against this file, the repo and the live site; brainstormed product direction; brought this file back in line with the code. Documentation only — no code changed.

#### Key Decisions
1. **Usage signal is zero.** Ali confirmed no one else has signed in; the only data in Firestore is his own. The next milestone is first real users, not more V2 scope.
2. **Four directions approved (Sprint 6):** public "Hear the four clicks" page, guest chat before sign-in, a refusal log (`knowledge_gaps`), and a golden-set eval.
3. **Production chat is down.** Google has revoked the Gemini key as leaked (403 `PERMISSION_DENIED`). Rotation is task 0 and blocks everything else.
4. **Docs corrected to match the code:** model is Gemini 2.5 Flash on `@google/genai`; TTS is dropped in favour of native recordings; grounding is Markdown in Firestore, not PDFs; click table uses the book's naming and real click letters; Known Issues refreshed.

#### Implementation Notes
- A Google API key (the Firebase web config key) is hardcoded in public git history in `src/lib/firebase.ts` at commits `62e792a` and `3c4089d` (2026-03-05), before config was externalised in `22cff43`. Not confirmed whether production `GEMINI_API_KEY` was that same key; if it was, that is the leak. Either way the new Gemini key should be a separate, API-restricted key, and the Firebase web key should be restricted to the Firebase APIs it needs.
- `HEAD` contains no hardcoded keys.
- Last code commit on `main` is 2026-06-25. The Word Cutter upgrade (prompt dated 2026-10-20) and audio-intake schema v2 are not on `main`.
- `src/scripts/smart_audio_ingestion.ts` still imports the removed `@google/generative-ai` SDK.

#### Next Step
Ali rotates the key and confirms a live chat reply. Then Claude Code runs Sprint 6 tasks 1–5 as one commit, diff reviewed before push.

> 🔁 **Next:** Ali to rotate the Gemini key; Claude Code to start Sprint 6.

---

### 📚 Older entries

The entries before 2026-11-15 (Sprints 1–5, the audio pipeline work, and the 2026-04-20 Antigravity review) live in [`docs/AI-REVIEWS-ARCHIVE.md`](docs/AI-REVIEWS-ARCHIVE.md), moved there on 2026-11-16 to keep this file readable. Their decisions still stand — read the archive before re-architecting anything they cover.

---

## 📡 Integration with Mission Control

- **Mission Control Master.md:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)
- **Raw (programmatic):** `https://raw.githubusercontent.com/AliMora83/Kora-Tutor/main/Master.md`

### Project Metadata (read by Mission Control Dashboard)

- **Status:** Active — MVP built (Sprints 1–5); key rotated and model moved to Gemini 3.8 Flash, awaiting live verification
- **Next Step:** Confirm a live chat reply, then Sprint 6 (Unblock & Open), then Sprint 7 (VPS migration)
- **Blocker:** None confirmed — key and model fixes pending live verification
- **AI Model:** Claude Code (execution) / Claude, Comet (Perplexity) (review)
- **Effort:** M
- **Progress:** Sprints 1–5 complete (including 4b); Sprints 6–7 planned

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
| 2026-11-15 | Next milestone is first real users; Sprint 6 = key rotation, friendly errors, golden-set eval, public "Hear the four clicks" page, guest chat, refusal log | No one but Ali has signed in, so there is no signal to act on; the sign-in wall and an empty signed-out page give a visitor nothing to try | Ali + Claude |
| 2026-11-15 | Click naming follows the source book: ǃ = palatal, ǂ = alveolar, written with real click letters | Consistency with *Leer jouself Nama*, the grounding source | Ali |
| 2026-11-16 | Hosting confirmed as Vercel today; kora.namka.cloud is the public URL | Cloudflare DNS shows `kora` as a CNAME to `vercel-dns-017.com` | Ali + Claude |
| 2026-11-16 | Move Kora off Vercel onto the Hostinger VPS (Docker behind nginx) — Sprint 7, after the chat is unblocked | Ali self-hosts his other apps there and wants Kora with them | Ali |
| 2026-11-16 | Move to `gemini-3.8-flash` and keep the model ID in one constant (`src/lib/model.ts`) | Google retired `gemini-2.5-flash` for new users, 404ing the live chat; it had been hardcoded at six sites, any one of which could break it again | Ali + Claude |
| 2026-11-16 | Update the V2-flagged `evaluate-speech/route.ts` to the new model despite the no-touch-V2 rule | A dead model ID in flagged-off code is a failure booked for whoever resumes V2; the change is inert while the flag is off | Ali |
| 2026-11-16 | Delete `Kora-Master.md` and `Template-Master.md` after carrying four unique V2 feature details into Master.md; delete the 2026-03-29 Comet review entry | Two stale master files invited agents to act on April's plan; the Comet entry only described restructuring the file that is now gone | Ali |
| 2026-11-16 | Move AI Review entries older than 2026-11-15 into `docs/AI-REVIEWS-ARCHIVE.md`; keep the three most recent in Master.md | Master.md had grown too large for tooling to read or rewrite in one pass, blocking syncs; the history is still worth keeping | Ali + Claude |
| 2026-11-16 | New Gemini key issued from AI Studio on `nama-language` and set in Vercel; old key to be deleted once a live reply is confirmed | The old key was revoked by Google as leaked, taking the chat down | Ali |
| 2026-11-16 | Rate-limit and origin-check the API routes before opening guest chat (Sprint 6 task 6, ahead of task 4) | The routes are already unauthenticated, so the new key's quota is spendable by anyone who finds the URL | Ali + Claude |
| 2026-11-16 | Delete `PROJECT-SYNC.json` and its workflow | The generated file has never been valid JSON (unescaped commit message) and hardcoded stale hosting values; Master.md is already the source of truth | Ali + Claude |
| 2026-11-15 | Audio is published to learners only after a listening check | "Native audio is sacred" — a mislabelled click on a public page is worse than no page | Ali + Claude |

### Known Issues
- 🟠 **`/api/chat`, `/api/evaluate-speech` and `/api/generate-script` accept unauthenticated POSTs** — no middleware, no token check, no rate limit; the sign-in wall is UI-only and never protected the key. Fix: Sprint 6 task 6
- 🟡 **Gemini key rotation not yet verified end-to-end** — the rotated key authenticates (the leaked-key 403 is gone); still to do: confirm a live reply on the 3.8 model, then delete the old key. Fix: Sprint 6 task 0
- 🟠 **`src/scripts/smart_audio_ingestion.ts` still names the retired `gemini-2.5-flash`** and is also still on the removed `@google/generative-ai` SDK, so it needs an SDK migration, not just the `GEMINI_MODEL` import. (`evaluate-speech/route.ts` was updated on 2026-11-16 with Ali's go-ahead, despite being V2-flagged.)
- **A model-not-found 404 is misdiagnosed as expired audio** — the `catch` in `src/app/api/chat/route.ts` treats any 404 as stale Gemini File API URIs and silently retries text-only, so a bad model ID costs two failed calls and a misleading log line. Narrow that check to the file-URI case
- **Kora's system prompt uses ASCII click stand-ins** (`!`, `|`, `||`, with only `ǂ` as a real letter) in `src/app/api/chat/route.ts`, so Kora teaches them to learners — contradicts the real-click-letter decision (ǀ ǁ ǂ ǃ). Naming itself is correct per the book
- **Raw API error JSON is shown to the user** in the chat bubble — Sprint 6 task 1
- **A Google API key is in public git history** (`src/lib/firebase.ts`, commits `62e792a` / `3c4089d`). Restrict or rotate it in Google Cloud Console; rewriting history does not un-leak it
- **Sprint 1's 20-turn smoke test was never run** — superseded by the golden-set eval (Sprint 6 task 2)
- **Low recording volume on some native clips** — content issue, logged for re-recording / loudness normalisation
- **Firebase Storage CORS / 403 on some audio files** — affects Speech Lab / audio pipeline; audit before any audio intake
- `src/scripts/smart_audio_ingestion.ts` still imports the removed `@google/generative-ai` SDK
- *Resolved in Sprint 1:* hydration warnings, Gemini 400 errors, grounding wiring

### Future Enhancements
- Community voice recording portal (families contribute audio)
- Multi-voice toggle per word
- Educator dashboard + school pilot programme (Namibia)
- University and NGO partnerships for language preservation

---

## 🔗 Quick Links
- **Repo:** [https://github.com/AliMora83/Kora-Tutor](https://github.com/AliMora83/Kora-Tutor)
- **Live URL:** [https://kora.namka.cloud/](https://kora.namka.cloud/)
- **Mission Control:** [https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md](https://github.com/AliMora83/Namka-Mission-Control/blob/main/Master.md)
- **AI Reviews Archive:** `docs/AI-REVIEWS-ARCHIVE.md` (entries before 2026-11-15)
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
  ... (125 files at last listing, Sprint 4b)
  # Played in MVP chat as native clips (Sprint 4); also the source for the Sprint 6 clicks page

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

```

**Grounding source (Firestore, not Storage):** `resources/nama_language_guide` in the named database `nama-language` — the Markdown guide, read by `src/lib/knowledge.ts` and re-seeded with `src/scripts/seed_knowledge.ts`. The `pdfs/` folder previously listed here never existed.

---

## 🔮 Long-Term Vision

Kora becomes the definitive digital platform for Khoekhoegowab — for children, universities, language preservation NGOs, and Khoekhoē communities worldwide. A living repository where community members contribute audio, elders record stories, and families pass the language to grandchildren they may never meet in person.

The language doesn't disappear. Kora won't let it.

---

_Last updated by: Claude (Anthropic) on 2026-11-16_
