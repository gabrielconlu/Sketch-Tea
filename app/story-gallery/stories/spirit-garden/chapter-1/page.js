import Link from 'next/link';

export default function SpiritGardenChapter1() {
    return (
        <main className="max-w-[800px] mx-auto p-[140px_30px_80px_30px] flex-1">
            <div className="mb-8">
                <Link href="/story-gallery/stories/spirit-garden" className="no-underline text-[var(--accent3)] font-semibold text-[0.9rem] flex items-center gap-2 mb-4">
                    ← Back to Spirit Garden Overview
                </Link>
                <span className="block font-bold text-[0.75rem] uppercase text-[var(--accent3)] mb-2 tracking-[0.05em]">Chapter I • Botanical Realm</span>
                <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold mb-4 leading-tight">The Awakening Seedling</h1>
                <p className="text-sm opacity-70 italic">Setting: The Mist-Veiled Greenhouse at Dawn</p>
            </div>

            <hr className="border-0 h-[1px] bg-[var(--glass-border)] mb-8" />

            <div className="flex flex-col gap-6 text-[1.15rem] leading-relaxed opacity-95 font-serif">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[var(--accent3)]">
                    Dawn does not merely arrive in the high-altitude glasshouses; it unfurls like a wet watercolor wash across gray linen. At four hundred meters above the valley floor, the world was still choked in a quiet, mother-of-pearl fog that tasted faintly of crushed pine needles and damp slate.
                </p>

                <p>
                    Master Julian sat motionless at his scarred cedar workbench, his fingers curled around a porcelain cup of yesterday&apos;s cooling white tea. Before him sat a single, unassuming terracotta pot filled with rich forest loam. For three weeks, it had held nothing save for the phantom scent of morning dew and his own quiet doubts.
                </p>

                <p>Then, the soil sighed.</p>

                <p>
                    It wasn&apos;t a sound heard with the ears, but a low, rhythmic thrum felt deep within the marrow of the wrists—a vibration akin to a cello string plucked in an empty cathedral.
                </p>

                <blockquote className="border-l-2 border-[var(--accent3)] pl-4 my-4 italic text-base opacity-85">
                    &ldquo;Slowly now,&rdquo; Julian whispered into the steam of his cup, his charcoal pencil hovering above the cream-colored pages of his journal like a dragonfly over a pond.
                </blockquote>

                <p>
                    A single shoot fractured the crust of the earth. But it did not burst forth in ordinary shades of chlorophyll green. Instead, it rose clad in a shimmering, translucent amber—a filament of liquid light that seemed to drink the shadows straight out of the corners of the room. As the first sharp needle of golden sunlight pierced the frosted glass above, hitting the tip of the tiny stem, the leaves blossomed outward in a silent cascade of crystal petals.
                </p>

                <p>
                    A scent bloomed instantly on the air: sweet white peach, frost-bitten mint, and something ancient—the rich, untamed breath of a forest that had never known an axe. The seedling wasn&apos;t just growing; it was singing its first note.
                </p>

                <p>
                    Julian dipped his brush into the inkwell, his heart keeping time with the plant&apos;s quiet pulse. The garden was waking up, and the harvest of dreams had officially begun.
                </p>
            </div>

            <div className="mt-16 pt-8 border-t border-[var(--glass-border)] flex justify-between items-center gap-4">
                <Link href="/story-gallery/stories/spirit-garden" className="no-underline text-[var(--text)] opacity-80 hover:opacity-100 font-semibold text-[0.9rem]">
                    ← Series Overview
                </Link>
                <Link href="/story-gallery/stories/spirit-garden/chapter-2" className="no-underline text-[var(--accent3)] font-semibold text-[0.95rem] flex items-center gap-2 hover:opacity-85 transition text-right">
                    Chapter II: The Resonance of Leaves →
                </Link>
            </div>
        </main>
    );
}
