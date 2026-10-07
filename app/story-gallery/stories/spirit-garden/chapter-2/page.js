import Link from 'next/link';

export default function SpiritGardenChapter2() {
    return (
        <main className="max-w-[800px] mx-auto p-[140px_30px_80px_30px] flex-1">
            <div className="mb-8">
                <Link href="/story-gallery/stories/spirit-garden" className="no-underline text-[var(--accent3)] font-semibold text-[0.9rem] flex items-center gap-2 mb-4">
                    ← Back to Spirit Garden Overview
                </Link>
                <span className="block font-bold text-[0.75rem] uppercase text-[var(--accent3)] mb-2 tracking-[0.05em]">Chapter II • Botanical Realm</span>
                <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold mb-4 leading-tight">The Resonance of Leaves</h1>
                <p className="text-sm opacity-70 italic">Setting: The Inner Atrium &amp; Steep Room</p>
            </div>

            <hr className="border-0 h-[1px] bg-[var(--glass-border)] mb-8" />

            <div className="flex flex-col gap-6 text-[1.15rem] leading-relaxed opacity-95 font-serif">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[var(--accent3)]">
                    By noon, the amber seedling had expanded, its crystal veins pulsing with a soft, bioluminescent cadence that mirrored the heartbeat of the greenhouse itself. Master Julian could no longer rely on charcoal and dry parchment alone; the air in the room had grown heavy with a rich, aromatic vapor that tasted of honeyed citrus and rain-soaked cedar bark.
                </p>

                <p>
                    He approached the terracotta pot with a pair of silver pruning shears, his breath catching in his throat. To harvest a dream-leaf was a delicate alchemy—take too early, and the spirit essence dissolves into thin air; cut too late, and the botanical memory hardens into mundane wood.
                </p>

                <p>
                    A sudden draft swept through the glasshouse, causing the amber petals to hum in unison. The sound was melodic, like wind chimes echoing through a narrow mountain pass.
                </p>

                <blockquote className="border-l-2 border-[var(--accent3)] pl-4 my-4 italic text-base opacity-85">
                    &ldquo;The garden remembers what the waking world forgets,&rdquo; a soft voice chimed from the threshold. It was Elena, holding a tray of freshly boiled spring water in a cast-iron kettle.
                </blockquote>

                <p>
                    Julian nodded slowly, adjusting his spectacles as he clipped the outermost leaf. The moment steel met stem, the leaf dissolved into a shimmering droplet of golden liquid, catching the light like liquid topaz. He carefully guided the essence into an unglazed ceramic teapot waiting on the workbench.
                </p>

                <p>
                    As the boiling water poured over the droplet, the liquid bloomed into a deep, luminous teal. The steam rose in deliberate spirals, taking the shapes of forgotten valleys and soaring peaks before fading softly into the ceiling beams.
                </p>

                <p>The first brewing was complete. The true trial of the Spirit Garden had only just begun.</p>
            </div>

            <div className="mt-16 pt-8 border-t border-[var(--glass-border)] flex justify-between items-center gap-4">
                <Link href="/story-gallery/stories/spirit-garden/chapter-1" className="no-underline text-[var(--text)] opacity-80 hover:opacity-100 font-semibold text-[0.9rem]">
                    ← Chapter I: The Awakening Seedling
                </Link>
                <span className="text-xs opacity-50 uppercase tracking-widest text-right">End of Chapter II</span>
            </div>
        </main>
    );
}
