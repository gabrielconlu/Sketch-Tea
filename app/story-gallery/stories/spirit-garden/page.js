import Link from 'next/link';

export default function SpiritGardenOverview() {
    return (
        <main className="max-w-[900px] mx-auto p-[140px_30px_80px_30px] flex-1">
            <div className="mb-6">
                <Link href="/story-gallery" className="no-underline text-[var(--accent3)] font-semibold text-[0.9rem] flex items-center gap-2 mb-4">
                    ← Back to Story Gallery
                </Link>
                <span className="block font-bold text-[0.75rem] uppercase text-[var(--accent3)] mb-2 tracking-[0.05em]">Series Overview</span>
                <h1 className="text-[clamp(2.8rem,4.5vw,4rem)] font-bold mb-4 leading-tight">The Spirit Garden</h1>
                <p className="text-[1.2rem] opacity-80 leading-relaxed font-serif">
                    High above the valley floor in mist-veiled glasshouses, botanical realms pulse with ancient energies, crystal flora, and whispered secrets waiting to be drawn.
                </p>
            </div>

            <hr className="border-0 h-[1px] bg-[var(--glass-border)] mb-10" />

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] flex flex-col justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-2">Setting</span>
                        <h3 className="text-xl font-bold mb-2">High-Altitude Glasshouses</h3>
                        <p className="text-sm opacity-80">A sanctuary wrapped in pine scents, damp slate, and frost-bitten morning air.</p>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] flex flex-col justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-2">Core Theme</span>
                        <h3 className="text-xl font-bold mb-2">Awakening &amp; Creation</h3>
                        <p className="text-sm opacity-80">Exploring the fragile boundary between botanical science and living magic.</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Available Chapters</h2>
            <div className="flex flex-col gap-4">
                <Link
                    href="/story-gallery/stories/spirit-garden/chapter-1"
                    className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] hover:border-[var(--accent3)] transition flex items-center justify-between no-underline text-[var(--text)] group"
                >
                    <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-1">Chapter I</span>
                        <h3 className="text-2xl font-bold group-hover:text-[var(--accent3)] transition">The Awakening Seedling</h3>
                        <p className="text-sm opacity-70 mt-1">Master Julian sits at his cedar workbench as a mysterious amber shoot breaks through the forest loam.</p>
                    </div>
                    <span className="text-xl font-bold text-[var(--accent3)]">Read →</span>
                </Link>

                <Link
                    href="/story-gallery/stories/spirit-garden/chapter-2"
                    className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] hover:border-[var(--accent3)] transition flex items-center justify-between no-underline text-[var(--text)] group"
                >
                    <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-1">Chapter II</span>
                        <h3 className="text-2xl font-bold group-hover:text-[var(--accent3)] transition">The Resonance of Leaves</h3>
                        <p className="text-sm opacity-70 mt-1">Master Julian and Elena harvest the first amber leaf as it hums with bioluminescent energy.</p>
                    </div>
                    <span className="text-xl font-bold text-[var(--accent3)]">Read →</span>
                </Link>
            </div>
        </main>
    );
}
