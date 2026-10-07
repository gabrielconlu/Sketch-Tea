export default function CharactersPage() {
    return (
        <div className="max-w-[1200px] mx-auto px-4 pt-[112px] pb-14 sm:px-[30px] sm:pt-[140px] sm:pb-20 flex-1">
            <div className="text-center mb-[60px]">
                <h1 className="text-5xl lg:text-6xl font-bold mb-3">Characters of the Glasshouse</h1>
                <p className="max-w-[600px] mx-auto opacity-85 text-[1.1rem]">
                    Meet the botanical guardians, master architects, and inquiring minds tending to the ancient crystal flora high above the valley floor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-[30px]">
                {/* Character 1: Master Julian */}
                <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[24px] p-5 sm:p-[30px] text-center backdrop-blur-[10px] transition-transform duration-350 hover:-translate-y-2 hover:shadow-[var(--shadow)] flex flex-col justify-between">
                    <div>
                        <div className="w-[120px] h-[120px] mx-auto mb-5 rounded-full bg-[var(--paper2)] border-2 border-[var(--accent3)] flex items-center justify-center text-[3.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                            🌿
                        </div>
                        <h3 className="text-[2rem] font-bold mb-[6px]">Master Julian</h3>
                        <div className="text-[0.85rem] font-bold text-[var(--accent3)] uppercase tracking-[0.05em] mb-[14px]">Head Botanist & Alchemist</div>
                        <p className="text-[0.95rem] opacity-85 leading-relaxed">
                            Anchored at his cedar workbench inside the high-altitude glasshouse, Julian listens to the faint hum of bioluminescent amber shoots breaking through the frost.
                        </p>
                    </div>
                </div>

                {/* Character 2: Elena */}
                <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[24px] p-5 sm:p-[30px] text-center backdrop-blur-[10px] transition-transform duration-350 hover:-translate-y-2 hover:shadow-[var(--shadow)] flex flex-col justify-between">
                    <div>
                        <div className="w-[120px] h-[120px] mx-auto mb-5 rounded-full bg-[var(--paper2)] border-2 border-[var(--accent3)] flex items-center justify-center text-[3.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                            ✨
                        </div>
                        <h3 className="text-[2rem] font-bold mb-[6px]">Elena</h3>
                        <div className="text-[0.85rem] font-bold text-[var(--accent3)] uppercase tracking-[0.05em] mb-[14px]">Glasshouse Apprentice</div>
                        <p className="text-[0.95rem] opacity-85 leading-relaxed">
                            A sharp-eyed assistant specializing in crystal leaf resonance and temperature equilibrium. She aids Julian in harvesting the first fragile glowing leaves.
                        </p>
                    </div>
                </div>

                {/* Character 3: The Guardian Spirit */}
                <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[24px] p-5 sm:p-[30px] text-center backdrop-blur-[10px] transition-transform duration-350 hover:-translate-y-2 hover:shadow-[var(--shadow)] flex flex-col justify-between">
                    <div>
                        <div className="w-[120px] h-[120px] mx-auto mb-5 rounded-full bg-[var(--paper2)] border-2 border-[var(--accent3)] flex items-center justify-center text-[3.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                            🍃
                        </div>
                        <h3 className="text-[2rem] font-bold mb-[6px]">The Spirit of the Loam</h3>
                        <div className="text-[0.85rem] font-bold text-[var(--accent3)] uppercase tracking-[0.05em] mb-[14px]">Botanical Entity</div>
                        <p className="text-[0.95rem] opacity-85 leading-relaxed">
                            An ancient, formless presence woven into the mountain mist and damp slate, guiding the awakening seedlings through seasonal shifts and dormant cycles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}