import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 pt-20 pb-9 px-[var(--pad)] border-t border-line bg-bg">
      <div className="max-w-[1440px] mx-auto grid grid-cols-[1.2fr_2.5fr] gap-[clamp(40px,6vw,96px)] items-start max-[880px]:grid-cols-1">
        <div className="flex flex-col gap-6">
          <div className="text-[clamp(60px,9vw,120px)] font-light tracking-[-0.02em] leading-none text-accent italic [transform:skewX(-8deg)] inline-block">PSP</div>
          <div className="flex flex-col gap-1">
            {['Polarbear', 'Sandbox', 'Production'].map(w => (
              <span key={w} className="text-[12px] tracking-[0.32em] font-medium text-ink-2 uppercase">{w}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-8 max-[880px]:grid-cols-2 max-[880px]:gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Studio</span>
            <Link to="/#about" className="foot-link">About</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Games</span>
            <Link to="/games/numops" className="foot-link">NumOps</Link>
            <Link to="/games/slotcarvr" className="foot-link">SlotcarVR Racing</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Crew</span>
            <Link to="/login" className="foot-link">Crew Login</Link>
            <span className="foot-link">Careers (—)</span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Elsewhere</span>
            <a href="#bsky" className="foot-link">Steam</a>
            <a href="#yt" className="foot-link">Meta Store</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-14 h-px bg-line"></div>
      <div className="max-w-[1440px] mx-auto pt-6 flex justify-between items-center gap-6 flex-wrap text-[11px] tracking-[0.18em] font-medium text-ink-3 uppercase">
        <span>© 2026 Polarbear Sandbox Production</span>
        <span className="text-ink-2 italic tracking-[0.04em] normal-case text-[12px]">— made in spare hours, on purpose.</span>
        <span>v0.1 · Stockholm / Remote</span>
      </div>
    </footer>
  )
}
