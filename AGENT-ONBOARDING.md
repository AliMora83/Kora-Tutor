# AGENT-ONBOARDING — Kora-Tutor

## Welcome, AGENT
This document defines the constraints and patterns for the Kora project.

## Architecture & Conventions
- **Framework:** Next.js 14/15 (App Router)
- **Styling:** Vanilla CSS + Framer Motion for high-end animations
- **Firebase:** Firestore (data), Storage (audio/PDFs), Auth (family accounts)
- **AI:** Google Gemini 1.5 Flash for multimodal tutoring and evaluation
- **Phonology:** 4 clicks (| || ! ǂ) are the priority — anatomical SVG animations required

## Critical Workflows
- **Authenticity First:** Native audio recordings are sacred. Never use TTS for Khoekhoegowab.
- **Visual Design:** Follow the warm African aesthetic with deep amber/gold and dark backgrounds.
- **Sync:** The project status is automatically synced to the Namka Mission Control dashboard via `PROJECT-SYNC.json` generated on every push to `main`.

## Verification Loop
1. Run `npm run lint` before committing.
2. Verify audio/SVG synchronization in the browser.
3. Validate and update `Master.md` and `AI_CHANGELOG.md` for each significant change.
4. Ensure no hydration mismatches in the console.
