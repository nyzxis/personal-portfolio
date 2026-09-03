import KineticGrid from "@/components/ui/kinetic-grid";

export default function KineticGridSection() {
  return (
    <section id="interactive" className="relative w-full overflow-hidden">
      <KineticGrid globalColor="default">
        <div className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center select-none py-20">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-sky-400 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            INTERACTIVE PLAYGROUND
          </span>

          <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl font-display uppercase">
            Move your cursor. <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-white bg-clip-text text-transparent">
              Click anywhere.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-sm md:text-base text-white/50 font-light tracking-wide leading-relaxed">
            A real-time kinetic physics grid that warps dynamically toward your pointer and emits reactive shockwave ripples on every click.
          </p>

          <div className="mt-10 flex items-center gap-3 text-xs tracking-widest text-white/40 uppercase">
            <span>[ WARP CURSOR ]</span>
            <span>•</span>
            <span>[ CLICK RIPPLE ]</span>
          </div>
        </div>
      </KineticGrid>
    </section>
  );
}
