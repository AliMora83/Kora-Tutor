# 🌍 Kora — Product Vision Document
### *Preserving the Nama Language, One Child at a Time*

---

## 🧭 Vision Statement

Kora exists so that Khoekhoē children grow up knowing their language — not as a school subject, but as a living part of who they are. It is a cultural inheritance platform disguised as a game, built for families who want the next generation to speak, hear, and feel Khoekhoegowab.

---

## 🎯 Mission

To make Khoekhoegowab (Nama) the most accessible, joyful, and linguistically accurate indigenous language to learn digitally — built for Khoekhoē kids, used by their families, trusted by their communities.

---

## 👥 Primary Users & Personas

### 1. 🧒 The Child (Ages 5–14) — *Core User*
- Khoekhoē heritage, likely born in Namibia, South Africa, or diaspora
- Primarily engages through Kid Mode: short lessons, animations, games, rewards
- Motivation: fun, achievement, belonging — NOT academic obligation
- Device: phone or tablet, often shared with a parent

### 2. 👩‍👧 The Parent — *Co-User & Driver*
- Wants their child to maintain cultural identity and speak their language
- May themselves be a partial or fluent Nama speaker
- Engages through Parent Mode: progress dashboards, alongside-child practice, guided conversation prompts for home use
- Motivation: heritage, pride, practicality — giving their child something lasting

### 3. 🏫 The Educator *(Future)*
- Teacher in a Namibian or South African school with Khoekhoē students
- Needs a classroom-compatible tool, assignment capability, student progress views
- Arrives in Phase 4

---

## 💡 Product Principles

1. **Culture First, Language Second** — Every lesson carries a piece of Khoekhoē life: the market, the greeting between elders, the counting of livestock. Language is the vessel; culture is the water.
2. **Joy is Non-Negotiable** — For children, boredom is a show-stopper. Every interaction earns a reaction: animations, sounds, celebrations.
3. **Authenticity Over Approximation** — Native audio is sacred. Kora never invents pronunciation. If we don't have an authentic recording, we don't teach it yet.
4. **Family as the Unit** — The best language learning happens at home. Kora is designed to spill out of the screen into dinner table conversations.
5. **Offline Ready** — Connectivity in Namibia is variable. Core lessons must work without internet.

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ | React framework, SSR, PWA support |
| **Logic** | TypeScript | Type-safe state management |
| **AI / LLM** | Google Gemini 1.5 Flash | Multimodal: text, audio, PDF knowledge injection |
| **Voice (TTS)** | Google Cloud TTS | Premium English explanations (en-AU-Neural2) |
| **Storage** | Firebase Cloud Storage | Native audio files, user recordings, PDF resources |
| **Database** | Firebase Firestore | User profiles, progress, XP, lesson state |
| **Auth** | Firebase Authentication | Family accounts (parent + child profiles) |
| **Styling** | Vanilla CSS + Framer Motion | Custom design system, animations |
| **Audio Viz** | WaveSurfer.js | Waveform rendering for native + user audio |
| **SVG Animations** | React + CSS / GSAP | Mouth/tongue articulation illustrations |
| **Deployment** | Vercel + Firebase | Edge functions, scalable hosting |

---

## ✨ Core Feature Set

### 1. 🎭 Kid Mode vs. Parent Mode

**Kid Mode**
- Full-screen, immersive, game-like interface
- Kora speaks directly to the child in simple, friendly language
- Short sessions (3–5 minutes per lesson)
- Reward-dense: XP, badges, unlockable characters, streak flames
- Progress saved to child's profile under the family account

**Parent Mode**
- Clean dashboard showing child's progress, streaks, weak areas
- "Practice Together" button that launches a shared session
- Weekly digest: what your child learned, what to practice at home
- Parent can also take lessons themselves — many parents want to re-learn alongside their kids

---

### 2. 🖼️ Animated Mouth & Tongue Illustrations (SVG)

The 4 clicks are the phonological heart of Nama. No other feature matters more for pronunciation accuracy.

**The 4 Clicks — Visual Treatment:**

| Click | Symbol | Articulation | Animation |
| :--- | :--- | :--- | :--- |
| Dental | \| | Tongue tip behind upper teeth | Tongue curls forward to teeth, releases |
| Lateral | \|\| | Side of tongue against molars | Tongue seals lateral edges, releases sideways |
| Alveolar (Post-alveolar) | ! | Tongue tip to alveolar ridge | Sharp snap backward from ridge |
| Palatal | ǂ | Tongue body to hard palate | Full tongue body rises and releases |

**Implementation:**
- SVG cross-section of the mouth (profile view) — commision or generate accurate anatomical base
- Tongue animates between rest position and articulation position using GSAP or CSS keyframes
- 3-frame animation: rest → contact → release
- Plays automatically when audio plays, so sound and visual are synchronised
- Replay button always visible
- On mobile: full-screen tap-to-replay

**Design Note:** Illustrations should feel warm and approachable (slightly stylised, not clinical), while remaining anatomically accurate enough to teach correct placement.

---

### 3. 🌊 Speech Wave Visualizer

One of the most powerful features for pronunciation learning — seeing the difference between native and learner audio.

**Layout:**
```
[ Native Speaker Waveform ]   ← plays automatically with Kora's example
[ Your Recording Waveform  ]  ← appears after user records
```

**Click Spike Callout:**
- The click produces a sharp transient spike that is visually unmistakeable on a waveform
- A vertical annotation marker highlights *where* the click should occur in the native audio
- If the user's waveform shows no spike (or a flat section) at that moment, Kora says: *"See how your wave is smooth here? The click should make a sharp spike — like a pop!"*

**Tech Implementation:**
- WaveSurfer.js for rendering (React-compatible, handles `.m4a`)
- Web Audio API for real-time recording capture
- Time-alignment: normalize both waveforms to the same duration for overlay comparison
- Color coding: native = amber/gold (brand), user = blue or white

**Progressive Enhancement:**
- Phase 1: Side-by-side static waveforms post-recording
- Phase 2: Overlay mode with opacity toggle
- Phase 3: Auto-detected click region highlighting using amplitude threshold detection

---

### 4. 🎙️ The Speech Lab

A dedicated high-focus practice interface.

- Record → Gemini evaluates audio against expected text
- **Accuracy score (1–100)** with breakdown:
  - Click accuracy (per-click, not just overall)
  - Vowel length
  - Tone contour
- **Kora's Tip**: Anatomical, practical guidance based on what went wrong
- **Visual**: Mouth animation plays the correct version after scoring
- **Waveform**: Both waveforms displayed post-recording
- Minimum 3 attempts before moving on — mastery, not speed

---

### 5. 📚 Structured Curriculum

A progressive, unlockable learning path sourced entirely from Pedro Dausab's *Leer jouself Nama* guide. Full lesson detail in **Kora-LessonPlans.md**.

#### Curriculum Map — 8 Levels, 30 Lessons

| Level | Theme | Lessons | Total XP |
| :--- | :--- | :--- | :--- |
| **1** | Sound System | The 4 Clicks · Vowels & Diphthongs · The Alphabet | 23 |
| **2** | Essentials & First Words | Yes/No/Please · Basic Greetings · How Are You? · Goodbyes | 26 |
| **3** | People & Names | Self Introduction · Noun Gender & Number · Pronouns | 26 |
| **4** | Numbers & Time | Numbers 1–10 · Numbers 11–1000 · Ordinals · Time · Days & Seasons | 39 |
| **5** | The World Around Us | Weather · Sky & Planets · Body Parts · Animals | 32 |
| **6** | Everyday Life | Feelings & States · Polite Phrases · Questions · Survival Phrases | 29 |
| **7** | Conversation | Classroom · Hospitality · At the Market · Feelings | 41 |
| **8** | Grammar Deep Dive | Noun Classes · Singular/Dual/Plural · Inclusive vs Exclusive "We" · Counting Rhyme Capstone | 48 |

**Total XP available: 264**

**Progression Rules:**
- Level 1 is the mandatory gateway — no vocabulary before clicks are mastered
- Each lesson requires 80% score to unlock the next
- Completed lessons can always be replayed for XP top-up
- The Counting Rhyme (Lesson 8.4) is the capstone milestone — children who complete it have absorbed numbers, pronouns, gender, and inclusive/exclusive "we" in one joyful moment

**📄 Reference:** See `Kora-LessonPlans.md` for full vocabulary tables, teaching notes, activity designs, and audio file references per lesson.

---

### 6. 🔊 Audio Pipeline & Multi-Voice System

**Current State:**
- 104+ `.m4a` files in Firebase `training_audio/`
- All files need contextual tagging (lesson, concept, word)
- Re-recording needed for quality and completeness

**Recording Plan — Minimum Viable Audio Set:**
1. **Primary Voice** (Ali / adult male) — narration, lesson explanations
2. **Female Voice** — at least one adult Khoekhoē speaker
3. **Child Voice** — at least one child speaker aged 6–10

This gives learners 3 audio perspectives per word from day one — the foundation for the community voice model.

**Audio Tagging Schema (Firestore):**
```json
{
  "file": "1-The Dental click.m4a",
  "concept": "dental_click",
  "lesson": "level1_4clicks",
  "speaker": "ali",
  "gender": "male",
  "age_group": "adult",
  "verified": true
}
```

**Gemini Audio Map:**
Kora maintains a semantic map of audio files — so during a conversation, when a click is mentioned, Kora can say *"Let me play you an example"* and fetch the correct file dynamically. This is powered by the Firestore tag schema above.

---

### 7. 📖 Knowledge Backbone — PDF Injection

Kora's linguistic accuracy comes from the PDF resources stored in Firebase.

**How It Works:**
- PDF pages are extracted and chunked at startup (or cached)
- Relevant chunks are injected into each Gemini prompt as context
- Kora never improvises grammar rules — every rule is grounded in the source documents
- Example: when asked about noun classes, Kora pulls the exact rule from the linguistic guide

**Content to Inject:**
- Standard Nama grammar guide (PDF)
- Click phonology reference
- Vocabulary glossary
- Dialogue scripts (for lesson generation)

---

### 8. 🧠 Learner Memory & Weak-Spot Tracking

Kora remembers — and adapts.

**Stored Per Learner:**
- Click accuracy history per click type (!, |, ||, ǂ)
- Vocabulary recall rate per word
- Lessons completed / scores / attempts
- Streak data

**Kora's Adaptive Behaviour:**
- If a child consistently struggles with the lateral click (||), Kora proactively introduces extra || drills in warm-up
- Parent Mode shows: *"Amara struggles most with the || click — try asking her to show you tonight"*
- Over time, generates personalised review sessions weighted toward weak areas

---

### 9. 🏆 Rewards & Engagement System

Designed for children — every session should feel like winning.

**XP & Levels:** Points per lesson, cumulative level-up milestones
**Streaks:** Daily practice streak with fire animation (Duolingo-style but branded)
**Badges:** Cultural, not generic — e.g. *"You can greet an elder correctly"*, *"Master of the ! click"*
**Unlockables:** New Kora outfits/expressions, wallpapers, audio from community speakers
**Family Leaderboard:** Parent vs. child XP race — turns practice into a household game

---

## 📱 Offline Mode (PWA)

**Priority:** High — critical for Namibian reach

**Implementation (Next.js PWA):**
- Service worker caches core lesson assets on first load
- Lesson audio files pre-cached per level as user progresses
- Progress syncs to Firestore when connection is restored
- Recording stored locally, submitted on reconnect

**Offline-Available:**
- All Level 1–2 lessons
- Previously visited lessons (auto-cached)
- Speech Lab (local scoring only — Gemini requires connection; show a simple waveform comparison instead when offline)

---

## 🎨 Design System

**Target Feel:** Warm, African, joyful, premium — not Western edtech beige

**Color Palette:**
- Primary: Deep amber/gold (the sun motif from the current logo)
- Secondary: Warm terracotta
- Accent: Sand, ochre
- Dark backgrounds for immersion (existing dark mode is correct)

**Typography:**
- Display: Serif with character for Nama words (existing approach is good)
- Body: Clean sans-serif for readability at small sizes

**Animations:**
- Framer Motion for lesson transitions
- GSAP for SVG mouth animations
- Micro-animations on every correct answer (particle bursts, character reactions)

**Kora Character:**
- Give Kora a visible face/avatar that reacts — celebrates high scores, looks thoughtful when giving tips
- Character should feel Khoekhoē in visual design — not a generic robot

---

## 🚀 Delivery Schedule — March 16 to May 31, 2026

**Total runway: 11 weeks**
Target: Full Phases 1–3 shipped. Phase 4 scoped and ready to build post-launch.

---

### 📅 SPRINT 1 — Week 1–2 · Mar 16–29
**Theme: Fix the Foundation**

The goal of this sprint is to clean up existing code and lock in the infrastructure everything else depends on. No new features ship until the foundation is solid.

| Task | Owner | Status |
| :--- | :--- | :--- |
| Fix React hydration mismatch warnings | Dev | 🔴 To Do |
| Audio tagging schema — design Firestore structure | Dev | 🔴 To Do |
| Run `sync_audio.ts` — map all 104 files to Firestore tags | Dev | 🔴 To Do |
| Upgrade Gemini model version (resolve 400 errors) | Dev | 🔴 To Do |
| Audit Firebase Storage CORS / 403 issues | Dev | 🔴 To Do |
| Book recording session (3 voices: male, female, child) | Ali | 🔴 To Do |

**Sprint exit criteria:** App runs without console errors. All 104 audio files tagged in Firestore. Recording session date confirmed.

---

### 📅 SPRINT 2 — Week 3–4 · Mar 30–Apr 12
**Theme: Sound & Vision**

The two most important new features for learners: seeing how clicks are formed, and seeing what their audio looks like.

| Task | Owner | Notes |
| :--- | :--- | :--- |
| SVG mouth/tongue base illustration — 4 click positions | Design/Dev | Profile cross-section, stylised not clinical |
| Animate Dental click (`\|`) — rest → contact → release | Dev | GSAP / CSS keyframes |
| Animate Palatal click (`!`) — jaw drop visible | Dev | |
| Animate Lateral click (`║`) — side-tongue release | Dev | |
| Animate Alveolar click (`╪`) — tongue-between-teeth pull | Dev | |
| Sync mouth animation to audio playback timing | Dev | |
| Install WaveSurfer.js — render native audio waveform | Dev | amber/gold colour |
| Add user recording waveform (post-record render) | Dev | blue/white colour |
| Side-by-side waveform layout in Speech Lab | Dev | |
| Click spike callout annotation on native waveform | Dev | vertical marker at transient |

**Sprint exit criteria:** All 4 click animations play in sync with audio. Both waveforms render in Speech Lab after a recording.

---

### 📅 SPRINT 3 — Week 5 · Apr 13–19
**Theme: Audio Recording Week** *(Non-code sprint)*

This week is reserved for the recording session. Development continues on lower-priority tasks.

| Task | Notes |
| :--- | :--- |
| Record Level 1 priority audio — all 4 clicks × 3 voices | Studio or quiet space |
| Record Level 2 essentials — Î, Hî-î, Toxoba, Gangans, !Gâi tsēs, !Gâi ║goas, !Gâi !oes | |
| Record Numbers 1–10 × 3 voices | |
| Record Counting Rhyme × 2 voices (adult male + child) | Milestone content |
| Record Body Parts × 1 voice (can expand later) | |
| Upload all files to Firebase `training_audio/` | Follow naming convention |
| Tag all new files in Firestore using audio schema | |

**Sprint exit criteria:** Level 1 and Level 2 audio fully recorded, uploaded, and tagged. Counting Rhyme recorded.

---

### 📅 SPRINT 4 — Week 6–7 · Apr 20–May 3
**Theme: Child-First Experience**

The biggest structural change to the app — splitting into Kid Mode and Parent Mode, and wiring up the full curriculum map.

| Task | Notes |
| :--- | :--- |
| Firebase Auth — family account model (parent + child profiles) | Parent creates account; adds child profiles |
| Kid Mode UI — full-screen, game-like layout | Based on existing dark theme |
| Parent Mode UI — dashboard layout, progress view | Clean, data-focused |
| Curriculum map screen — 8 levels displayed as path | Visual level-unlock progression |
| Level gating — lesson locked until previous ≥ 80% | Firestore progress check |
| Build Lesson 1.1 (4 Clicks) with new SVG + waveform integrated | First fully-designed lesson |
| Build Lesson 1.2 (Vowels) | |
| Build Lesson 2.1 (Essentials: Î, Hî-î, Toxoba) | |
| Build Lesson 2.2 (Basic Greetings) | |
| Build Lesson 2.3 (How Are You?) | |
| Build Lesson 3.1 (Self Introduction) | |
| Streak system — daily streak counter with animation | |
| XP system — persistent, per-child, displayed on dashboard | |

**Sprint exit criteria:** Kid Mode and Parent Mode both functional. Levels 1–3 playable end-to-end with level gating. Streaks and XP tracking live.

---

### 📅 SPRINT 5 — Week 8–9 · May 4–17
**Theme: Depth & Intelligence**

Add the features that make Kora feel like a real tutor rather than a flashcard app.

| Task | Notes |
| :--- | :--- |
| Per-click accuracy breakdown in Speech Lab | Gemini prompt engineering — score per click type |
| Phonetic highlighting — mispronounced letters highlighted in word | Post-score UI overlay |
| Speech Lab — minimum 3 attempts before "pass" | Mastery not speed |
| Build Lessons 3.2–3.3 (Noun Classes, Pronouns) | Grammar lessons with visual aids |
| Build Lessons 4.1–4.2 (Numbers 1–10, Counting Rhyme) | Counting Rhyme = milestone animation |
| Build Lessons 5.1–5.3 (Weather, Sky, Body Parts) | |
| PDF knowledge injection pipeline | Chunk Pedro Dausab guide → inject to Gemini context |
| Kora adaptive behaviour — weak-spot detection | Flag if child fails same click type 3× |
| Parent Mode — weak-spot alert card | "Amara struggles with the ║ click" |
| Cultural context notes — add to relevant lessons | Brief notes on Khoekhoē culture in lesson flow |

**Sprint exit criteria:** PDF injection live. Speech Lab gives per-click scores. Counting Rhyme lesson ships as a milestone with full celebration animation. Levels 1–5 fully playable.

---

### 📅 SPRINT 6 — Week 10–11 · May 18–31
**Theme: Polish, Offline & Launch Prep**

The final sprint focuses on robustness, reach (offline), and the remaining lesson content.

| Task | Notes |
| :--- | :--- |
| Build Lessons 6.1–6.4 (Everyday Life) | |
| Build Lessons 7.1–7.4 (Conversation — including At the Market milestone) | |
| Build Lessons 8.1–8.4 (Grammar Deep Dive) | |
| Badges — design and implement 10 cultural achievement badges | |
| Family Leaderboard — parent vs child XP race | |
| PWA setup — Next.js service worker, offline caching | Level 1–2 cached on first load |
| Offline Speech Lab fallback — waveform comparison only (no Gemini) | |
| Mobile optimisation pass — all touch interactions reviewed | iOS + Android |
| Performance audit — lesson load times, audio latency | |
| Bug bash — full regression test across devices | |
| Onboarding flow — new user walkthrough (Kid Mode + Parent Mode) | |
| Launch checklist — Vercel deployment, Firebase rules review, env vars | |

**Sprint exit criteria:** All 30 lessons playable. PWA offline mode functional for Levels 1–2. App passes full regression test on mobile. Ready for first real users.

---

### 🏁 Launch Target: **May 31, 2026**

What ships on launch day:
- ✅ 8 levels, 30 lessons, fully sourced from Pedro Dausab's guide
- ✅ Kid Mode + Parent Mode
- ✅ Animated SVG mouth/tongue illustrations for all 4 clicks
- ✅ Speech Wave Visualizer (side-by-side waveforms)
- ✅ Speech Lab with per-click accuracy scores
- ✅ 3-voice audio (male, female, child) for Levels 1–2
- ✅ Family accounts (parent + child profiles)
- ✅ XP, streaks, badges, family leaderboard
- ✅ Counting Rhyme milestone lesson
- ✅ PDF knowledge injection (Kora grounded in source material)
- ✅ PWA offline mode (Levels 1–2)
- ✅ Cultural context notes throughout

**Post-launch (Phase 4 — June onwards):**
- Community voice recordings
- Multi-voice toggle
- Educator dashboard
- School pilot programme in Namibia

---

## 📊 Success Metrics

| Metric | Target (12 months) |
| :--- | :--- |
| Weekly Active Learners | 500+ |
| Average Session Length | 8+ minutes |
| Day-7 Retention | 40%+ |
| Click Accuracy Improvement (avg) | +30% after 10 sessions |
| Lessons Completed (total) | 5,000+ |
| Community Voice Contributors | 50+ families |
| School Partnerships | 3+ |

---

## 🛠️ How to Run

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

Kora becomes the definitive digital platform for Khoekhoegowab — not just for children but for universities, language preservation NGOs, and Khoekhoē communities worldwide. A living repository where community members contribute audio, elders record stories, and families pass the language to grandchildren they may never meet in person.

The language doesn't disappear. Kora won't let it.

---

---

## 📄 Related Documents

| Document | Purpose |
| :--- | :--- |
| `Kora-Master.md` | This file — product vision, features, schedule |
| `Kora-LessonPlans.md` | Full 8-level curriculum: vocabulary, teaching notes, activities, audio refs |
| `nama_language_guide.md` | Source material — Pedro Dausab / Dept of Cultural Affairs, Western Cape |

---

*Last updated: March 16, 2026*
*Built with love for the Khoekhoē people*
