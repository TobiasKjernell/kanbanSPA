import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[var(--pad)] py-[14px] border-b border-transparent transition-[background,backdrop-filter,padding,border-color] duration-300 ${scrolled ? 'bg-[rgba(12,12,13,0.72)] backdrop-blur-[14px] border-b-line' : ''}`}>
      <Link
        to="/"
        className="flex items-center gap-[14px] text-ink"
        aria-label="Polarbear Sandbox Production"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-accent inline-flex" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <circle cx="9.4" cy="9.4" r="1" fill="var(--bg)" />
          </svg>
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-semibold text-[14px] tracking-[0.18em]">POLARBEAR</span>
          <span className="font-normal text-[9.5px] tracking-[0.32em] text-ink-3 mt-1 max-[880px]:hidden">SANDBOX&nbsp;·&nbsp;PRODUCTION</span>
        </span>
      </Link>

      <div className="flex flex-col items-center gap-[7px]">
        <Reveal className="flex items-center gap-[14px] text-[9px] tracking-[0.40em] font-medium text-ink-3 uppercase max-[880px]:hidden">
          <span className="flex-none w-[clamp(24px,4vw,56px)] h-px bg-ink-4" aria-hidden="true"></span>
          <span>EST. — INDEPENDENT GAME STUDIO IN PROGRESS</span>
          <span className="flex-none w-[clamp(24px,4vw,56px)] h-px bg-ink-4" aria-hidden="true"></span>
        </Reveal>
        <div className="flex gap-[40px] text-[12px] tracking-[0.22em] font-medium text-ink-2 uppercase max-[880px]:hidden">
          <Link to="/#about" className="nav-link">About</Link>
          <Link to="/#games" className="nav-link">Games</Link>
          <Link to="/#gallery" className="nav-link">Gallery</Link>
          <Link to="/#journal" className="nav-link">Journal</Link>
        </div>
      </div>

      <Link
        to="/login"
        className="inline-flex items-center gap-[10px] px-[18px] py-[10px] border border-line-strong text-[11px] tracking-[0.24em] font-medium uppercase text-ink transition-[border-color,color] duration-[250ms] hover:border-accent hover:text-accent"
        aria-label="Crew Login"
      >
        <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse-dot" aria-hidden="true"></span>
        Crew Login
      </Link>
    </nav>
  )
}
