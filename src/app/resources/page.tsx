import Link from "next/link";
import resourcesData from "@/data/resources.json";

interface Resource {
    id: string;
    category: string;
    type: string;
    title: string;
    url: string;
    notes: string;
    status: string;
}

export default function ResourcesPage() {
    const { resources } = resourcesData as { resources: Resource[] };

    return (
        <div className="min-h-screen bg-[url('/bg-pattern.svg')] bg-cover relative">
            <div className="absolute inset-0 bg-background/90 z-0"></div>

            <main className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex flex-col">
                {/* Navigation Breadcrumb */}
                <Link href="/" className="mb-8 text-gray-400 hover:text-white transition-colors w-fit flex items-center gap-2">
                    ← Back to Home
                </Link>

                <div className="mb-12">
                    <h1 className="text-5xl font-black text-white mb-4">Resource <span className="text-gradient">Library</span></h1>
                    <p className="text-xl text-gray-400 font-light">
                        Curated materials for learning and preserving the Khoekhoegowab language.
                    </p>
                </div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((res) => (
                        <a
                            key={res.id}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-card p-6 block hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] group transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                                    {res.category}
                                </span>
                                <span className="text-xs text-gray-500">{res.type}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {res.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-4">
                                {res.notes}
                            </p>

                            <div className="text-accent text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                View Source ↗
                            </div>
                        </a>
                    ))}
                </div>

                {/* Empty State / Footer */}
                {resources.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No resources found. Run the scraper to populate the database.
                    </div>
                )}

            </main>
        </div>
    );
}
