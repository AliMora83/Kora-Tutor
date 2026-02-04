import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/bg-pattern.svg')] bg-cover relative">
      <div className="absolute inset-0 bg-background/90 z-0"></div>

      <main className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">

        {/* Hero Section */}
        <div className="animate-float mb-8">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-white">
            NAMA <span className="text-gradient">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            Preserving the <span className="text-primary font-bold">Khoekhoegowab</span> language through next-generation Artificial Intelligence.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mt-12">

          {/* Resources Card */}
          <Link href="/resources" className="glass-card p-6 group cursor-pointer text-left hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] block no-underline">
            <div className="mb-4 text-4xl group-hover:scale-110 transition-transform w-min">📚</div>
            <h2 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Resource Library</h2>
            <p className="text-gray-300 text-sm">
              Access curated video archives, historical texts, and audio from the Damara Punch era.
            </p>
          </Link>

          {/* AI Tutor Card */}
          <Link href="/ai-tutor" className="glass-card p-8 hover:bg-white/5 transition-all group border-l-4 border-l-secondary">
            <div className="flex justify-between items-start mb-4">
              <span className="text-secondary font-mono text-sm tracking-wider">PRACTICE</span>
              <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded">BETA</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">AI Kora Tutor</h3>
            <p className="text-gray-400">Chat with Kora to correct your clicks, learn grammar, and practice conversation.</p>
          </Link>

          {/* Progress Card (Upcoming) */}
          <div className="glass-card p-6 opacity-60 text-left border-dashed border-gray-700">
            <div className="mb-4 text-4xl">📊</div>
            <h2 className="text-xl font-bold mb-2 text-gray-500">Track Progress</h2>
            <p className="text-gray-500 text-sm">
              Coming soon: User dashboard to track your learning journey.
            </p>
          </div>

          {/* Community Card (Upcoming) */}
          <div className="glass-card p-6 opacity-60 text-left border-dashed border-gray-700">
            <div className="mb-4 text-4xl">🌍</div>
            <h2 className="text-xl font-bold mb-2 text-gray-500">Community</h2>
            <p className="text-gray-500 text-sm">
              Coming soon: Connect with other learners and speakers.
            </p>
          </div>

        </div>

        <footer className="mt-24 text-gray-600 text-sm">
          Built with Google Vertex AI • 2026 Nama Preservation Project
        </footer>
      </main>
    </div>
  );
}
