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
    - [ ] Fix Firebase CLI (Node v25 compatibility) <!-- id: 22a -->
    - [ ] Initialize Firebase Project (Firestore + Storage) <!-- id: 22 -->
    - [ ] Upload scraped "Culture/History/Music" data to Firebase <!-- id: 23 -->

- [ ] **AI Script Generation (The "Simpsons/Dora" Engine)**
    - [x] Create `prepare_context.py` to merge articles into one text file <!-- id: 24a -->
    - [x] Design Prompt Engineering pipeline (Artifact) <!-- id: 24 -->
    - [ ] Create "Adults Script Generator" (Simpsons style) - Ready for User <!-- id: 25 -->
    - [ ] Create "Kids Script Generator" (Dora style) - Ready for User <!-- id: 26 -->

- [ ] **Nama AI Agent & Web Interface**
    - [x] Scaffold Next.js App (`nama-app`) <!-- id: 20 -->
    - [x] Create Home Page with Mission Statement <!-- id: 20a -->
    - [x] Build Resources Grid Page <!-- id: 20b -->
    - [ ] Implement "Track Progress" dashboard <!-- id: 21 -->
- [ ] **Nama AI Agent & Web Interface**
    - [x] Scaffold Next.js App (`nama-app`) <!-- id: 20 -->
    - [x] Create Home Page with Mission Statement <!-- id: 20a -->
    - [x] Build Resources Grid Page <!-- id: 20b -->
    - [ ] Implement "Track Progress" dashboard <!-- id: 21 -->
    - [x] Integrate "AI Tutor" chat interface <!-- id: 27 -->
    - [x] **DEBUG:** User needs to add API Key to `.env.local` <!-- id: 27a -->

- [ ] **Data Processing Phase**
    - [x] Structure collected data for translation purposes <!-- id: 4 -->
    - [x] Finalize "Nama Language Translation" dataset artifact <!-- id: 5 -->

- [x] **Verification & Delivery**
    - [x] Review report with user <!-- id: 6 -->
    - [x] specific questions to user regarding "Google Translate" integration goals <!-- id: 7 -->
    - [x] **Walkthrough**: Verified all features locally and in production.
    - [x] **Deploy**: Push to GitHub and deploy to Vercel.
    - [x] **Redesign**: Implemented Claude/Gemini Hybrid Home Page with Sidebar.
    - [x] **Knowledge**: Ingested `nama_language_guide.md` into AI System Prompt.
    - [x] **Branding**: Implemented Custom Logo & Favicon with Final Polish ("!Gâi tsēs").
    - [x] **Polish**: Refined Chat UI, Responsive Bottom Nav (Mobile), Active Tab Indicator (Top), Hidden Dev Tools.
    - [x] **Refactor**: Split `page.tsx` into `WelcomeScreen` and `ChatInterface` components.
    - [x] **Migration**: Moved project to `/Users/alikora/dev/AntiG/Nama Language` and committed to git.
