import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-8 lg:gap-[60px] px-4 pt-[112px] pb-14 sm:px-[30px] sm:pt-[140px] sm:pb-20">
            <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 p-[8px_18px] bg-[var(--card)] border border-[var(--glass-border)] rounded-full text-[0.85rem] font-semibold w-fit text-[var(--accent3)]">
                    <span>gArt • Stories • Imagination</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-[5.2rem] font-bold leading-[1.1] tracking-tight">
                    Every Cup Begins With A <span className="italic font-normal text-[var(--accent3)]"> Sketch </span>
                </h1>
                <p className="text-[1.15rem] opacity-85 max-w-[580px]">
                    A narrative tea experience inspired by artists, storytellers, and dreamers—Where every blend tells a unique story, hand-drawn and carefully curated to bring imagination straight to your cup.
                </p>
                <div className="flex gap-4 flex-wrap mt-2">
                    <Link href="/story-gallery" className="p-[14px_28px] bg-[var(--accent3)] text-[#FFFFFF] rounded-full font-bold no-underline transition shadow-[0_10px_25px_rgba(255,159,28,0.35)] hover:bg-[#e58a0f] hover:-translate-y-[2px]">
                        Explore Stories
                    </Link>
                    <Link href="/other-services" className="p-[14px_28px] bg-[var(--card)] border border-[var(--glass-border)] text-[var(--text)] rounded-full font-bold no-underline transition hover:border-[var(--accent3)] hover:-translate-y-[2px]">
                        Other Services
                    </Link>
                </div>
            </div>

            <div className="hidden lg:flex justify-center items-center relative">
                <div className="relative flex justify-center items-center p-5">
                    <div className="absolute w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(46,196,182,0.22)_0%,rgba(255,159,28,0.12)_60%,transparent_80%)] rounded-full z-0 animate-pulse"></div>
                    <img src="/sketchtea-logo.png" alt="Sketch Tea Logo" className="w-full max-w-[550px] h-auto object-contain relative z-1 drop-shadow-[0_20px_40px_rgba(17,75,70,0.2)]" />
                </div>
            </div>
        </div>
    );
}
