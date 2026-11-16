# 🗄 Kora Tutor — AI Reviews Archive

> Historical **AI Reviews & Artifacts** entries, moved out of `Master.md` on 2026-11-16 to keep that file readable and small enough to sync.
> Nothing here was edited — entries are verbatim, newest first. The three most recent entries stay in [`Master.md`](../Master.md#-ai-reviews--artifacts).
> Decisions recorded here still stand: read this before re-architecting anything they cover.

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

_Archived from `Master.md` v1.6 on 2026-11-16._
