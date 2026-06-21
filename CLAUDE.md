# CLAUDE.md — Standing Instructions for Claude Code

> This file is read automatically by Claude Code at the start of every session in this repo.
> Keep it short — it's a pointer to the living docs below, not a duplicate of them.

## Before any work, every session

1. Read `Master.md` in full. It is the single source of truth for current sprint status, MVP vs. V2 feature scope, and the Multi-Agent Context Protocol (MACP) used to log decisions.
2. Read `AGENT-ONBOARDING.md` for repo-specific conventions, agent roles, and raw-URL references (including the Mission Control `Master.md`).
3. Check the **AI Reviews & Artifacts** section of `Master.md` for decisions other agents (or past sessions) have already made — don't re-decide something already settled there.

## Standing rules for this repo

- **MVP scope only, for now.** Anything tagged `V2` in Master.md's Core Feature Set table is off-limits — do not build, modify, or "improve" it unless explicitly asked. If fixing something in MVP scope requires touching V2 code, stop and ask first rather than assuming.
- **Feature flags, not deletions.** When hiding a V2 feature from the UI, gate it behind a flag defaulted to off. Never delete the underlying code.
- **Commits:** batch all tasks for a sprint into a single commit at the end of that sprint — not one commit per task.
- **Before pushing:** show the diff and wait for explicit approval before pushing to `main`. This applies to every sprint unless told otherwise for that session.
- **After finishing a sprint:** add an entry to `Master.md`'s **AI Reviews & Artifacts** section, following the existing format, and mark it `Agent Reviewed`.

## Stack quick reference

Next.js 14+ (App Router) · TypeScript · Firebase (Auth, Firestore, Storage) · Google Gemini 1.5 Flash · Google Cloud TTS · WaveSurfer.js (V2) · GSAP / Framer Motion.
Full detail lives in `Master.md` → Tech Stack & Dependencies.
