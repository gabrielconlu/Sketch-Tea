import Link from 'next/link';

export default function StoryGalleryPage() {
    return (
        <div className="max-w-[1200px] mx-auto px-4 pt-[112px] pb-14 sm:px-[30px] sm:pt-[140px] sm:pb-20 flex-1">
            <div className="text-center mb-[60px]">
                <h1 className="text-5xl lg:text-6xl font-bold mb-3">Story Gallery</h1>
                <p className="max-w-[600px] mx-auto opacity-85 text-[1.1rem]">
                    Every blend holds a tale. Immerse yourself in the visual journals and watercolor chapters behind our signature teas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-[30px]">
                {/* Spirit Garden Card */}
                <article className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[20px] overflow-hidden backdrop-blur-[10px] transition-transform duration-350 hover:-translate-y-1.5 hover:shadow-[var(--shadow)]">
                    <div className="w-full h-[240px] bg-[var(--paper2)] flex items-center justify-center border-b border-[var(--glass-border)] text-[3rem]">
                        🌿✨
                    </div>
                    <div className="p-6">
                        <span className="block font-bold text-[0.75rem] uppercase text-[var(--accent3)] mb-2 tracking-[0.05em]">Series • Botanical Realm</span>
                        <h3 className="text-[1.8rem] font-bold mb-[10px]">Spirit Garden</h3>
                        <p className="text-[0.95rem] opacity-85 mb-4">Step through the hidden gates where botanical spirits bloom, whispering ancient secrets of earth, leaf, and brewing harmony.</p>
                        <Link href="/story-gallery/stories/spirit-garden" className="no-underline text-[var(--accent3)] font-bold text-[0.9rem]">Read Chapters →</Link>
                    </div>
                </article>
            </div>
        </div>
    );
}