# Nama Language Research & Translation Project

- [x] **Research Phase**
    - [x] Explore local workspace for existing resources <!-- id: 0 -->
    - [x] Perform deep web research on Nama language (phonology, grammar, vocabulary, dialects) <!-- id: 1 -->
    - [x] Identify existing datasets or translation tools <!-- id: 2 -->
    - [x] Compile research into a comprehensive "Nama Language Report" <!-- id: 3 -->

- [ ] **Resource Discovery Phase (Green Box)**
    - [ ] Search for "Adults TV Shows" (news, dramas in Khoekhoegowab) <!-- id: 14 -->
    - [ ] Search for "Kids TV Shows" (cartoons, educational content) <!-- id: 15 -->
    - [x] Search for Music & Cultural Audio resources (Bradlox/Damara Punch) <!-- id: 16 -->
    - [x] Search for Historical/Cultural text resources (IOL/SA History) <!-- id: 17 -->

- [ ] **Data Collection & Storage (Firebase)**
    - [x] Create `nama_resource_database.json` (add Bradlox) <!-- id: 18 -->
    - [x] `scraper.py` (Keep for "Music/History" research) <!-- id: 19 -->
    - [x] Run scraper to populate local folders (Text downloaded) <!-- id: 19d -->
    - [x] Fix Firebase CLI (Node v25 compatibility) <!-- id: 22a -->
    - [x] Initialize Firebase Project (Firestore + Storage) <!-- id: 22 -->
    - [x] Upload scraped "Culture/History/Music" data to Firebase <!-- id: 23 -->
    - [x] Upload "Nama Language Guide" to Firebase <!-- id: 23a -->
    - [x] Refactor `src/lib/knowledge.ts` to fetch from Firestore <!-- id: 23b -->

- [ ] **AI Script Generation (The "Simpsons/Dora" Engine)**
    - [x] Create `prepare_context.py` to merge articles into one text file <!-- id: 24a -->
    - [x] Design Prompt Engineering pipeline (Artifact) <!-- id: 24 -->
    - [x] Create `src/app/api/generate-script/route.ts` (API Endpoint) <!-- id: 24b -->
    - [ ] **Nama AI Agent & Web Interface**
    - [x] Scaffold Next.js App (`nama-app`) <!-- id: 20 -->
    - [x] Create Home Page with Mission Statement <!-- id: 20a -->
    - [x] Build Resources Grid Page <!-- id: 20b -->
    - [x] Implement "Track Progress" dashboard <!-- id: 21 -->
    - [x] Integrate "AI Tutor" chat interface <!-- id: 27 -->
    - [x] **DEBUG:** User needs to add API Key to `.env.local` <!-- id: 27a -->
    - [x] Create `src/app/generators/adults/page.tsx` (Simpsons Interface) <!-- id: 24c -->
    - [x] Add "Simpsons Mode" link to Sidebar <!-- id: 24d -->
    - [x] Create `src/app/generators/kids/page.tsx` (Dora Interface) <!-- id: 24e -->

- [x] **User Persistence & History**
    - [x] Implement Google Sign-in (`AuthButton`) <!-- id: 30 -->
    - [x] Enable Chat History Persistence (Firestore) <!-- id: 31 -->
    - [x] Add "Save & Chat" to Generators <!-- id: 32 -->

- [x] **Data Processing Phase**
    - [x] Structure collected data for translation purposes <!-- id: 4 -->
    - [x] Finalize "Nama Language Translation" dataset artifact <!-- id: 5 -->

- [ ] **Phase 2 Pipeline (New Features)**
    - [ ] **Repurpose Generators**: Adapt Script Generator API for daily vocabulary quizzes or flashcards <!-- id: 25 -->
    - [ ] **Audio / Pronunciation Support**
        - [ ] Research Text-to-Speech (TTS) API for click consonants <!-- id: 26a -->
        - [ ] Add "Play Audio" button to chat tables/vocabulary <!-- id: 26b -->
        - [ ] Implement Speech-to-Text testing for user pronunciation (Whisper model) <!-- id: 26c -->
    - [ ] **Progress Dashboard Expansion**
        - [ ] Track consecutive daily chat streaks <!-- id: 28a -->
        - [ ] Track number of messages sent in Nama <!-- id: 28b -->
        - [ ] Build visual charts for vocabulary/grammar mastery based on chat history <!-- id: 28c -->

- [x] **Verification & Delivery**
    - [x] Review report with user <!-- id: 6 -->
    - [x] specific questions to user regarding "Google Translate" integration goals <!-- id: 7 -->
    - [x] **Walkthrough**: Verified all features locally and in production.
    - [x] **Deploy**: Push to GitHub and deploy to Vercel.
    - [x] **Redesign**: Implemented Claude/Gemini Hybrid Home Page with Sidebar.
    - [x] **Knowledge**: Ingested `nama_language_guide.md` (including 1-10 counting) into AI System Prompt.
    - [x] **Branding**: Implemented Custom Logo & Favicon with Final Polish ("!Gâi tsēs").
    - [x] **Polish**: Refined Chat UI, Responsive Bottom Nav (Mobile), Active Tab Indicator (Top), Hidden Dev Tools.
    - [x] **Refactor**: Split `page.tsx` into `WelcomeScreen` and `ChatInterface` components.
    - [x] **Migration**: Moved project to `/Users/alikora/dev/AntiG/Nama Language` and committed to git.
    - [x] **Persistence**: Google Sign-In, Chat History, Save & Chat.
    - [x] **Refactor**: Linting cleanup, type safety, optimization.
    - [x] **Security**: Secured Firebase config in `.env.local` and added `firestore.rules`.
