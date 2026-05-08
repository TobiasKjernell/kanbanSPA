import { useState, useEffect } from 'react'
import Reveal from '../../Reveal'

export default function Hero() {
  const [t, setT] = useState(0)

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = (now: number) => { setT((now - start) / 1000); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <header className="relative min-h-screen flex items-center justify-center px-[var(--pad)] overflow-hidden isolate" id="top">
      <div className="absolute inset-0 -z-[2]" style={{ background: 'radial-gradient(ellipse at 50% 35%, #1a1814 0%, #0c0a08 55%, #050505 100%)' }}>
        <div style={{ width: '100%', height: '100%', background: 'rgba(12,12,13,0.95)' }} />
      </div>
      <div className="absolute inset-0 -z-[1] pointer-events-none" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(12,12,13,0.55) 0%, rgba(12,12,13,0) 28%, rgba(12,12,13,0) 65%, rgba(12,12,13,0.95) 100%), radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)' }} />

      <div className="relative text-center max-w-[1100px] w-full -mt-[2vh]">
        <Reveal delay={120} as="h1" className="font-light text-[clamp(60px,13vw,188px)] leading-[0.92] tracking-[-0.012em] m-0 text-ink">
          <span className="block">Polarbear</span>
          <span className="block italic font-extralight text-accent [transform:skewX(-9deg)]">Sandbox</span>
          <span className="block">Production</span>
        </Reveal>

        <Reveal delay={520} className="mt-[clamp(28px,5vh,52px)] mx-auto max-w-[540px] text-[clamp(13px,1.3vw,15px)] leading-[1.55] tracking-[0.04em] text-ink-2 italic">
          "We make games in the hours the world doesn't claim."
        </Reveal>

        <Reveal delay={680} className="mt-[clamp(28px,4.5vh,44px)] mb-[clamp(40px,7vh,80px)] flex gap-[14px] justify-center flex-wrap">
          <a href="#games" className="inline-flex items-center gap-[10px] px-[22px] py-[14px] text-[11px] tracking-[0.28em] font-medium uppercase bg-accent text-bg border border-accent transition-all duration-[280ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:bg-transparent hover:text-accent hover:-translate-y-0.5">
            <span>Explore the Sandbox</span>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </a>
          <a href="#about" className="inline-flex items-center gap-[10px] px-[22px] py-[14px] text-[11px] tracking-[0.28em] font-medium uppercase border border-line-strong text-ink-2 transition-all duration-[280ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:text-ink hover:border-ink">About the crew</a>
        </Reveal>
      </div>

      <div className="absolute top-[28px] bottom-[28px] left-[var(--pad)] right-[var(--pad)] pointer-events-none text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase z-[2]" aria-hidden="true">
        <div className="absolute top-[60px] right-0">VOL. 01 — JOURNAL</div>
        <div className="absolute bottom-[60px] left-0 max-[720px]:hidden">PSP / 2026 —</div>
        <div className="absolute bottom-[60px] right-0 flex items-center gap-[10px] max-[720px]:bottom-6">
          <span className="w-[8px] h-[8px] rounded-full bg-accent inline-block transition-transform duration-[80ms] ease-linear" style={{ transform: `scale(${1 + Math.sin(t * 2) * 0.18})` }} />
          LIVE · IN&nbsp;THE&nbsp;SANDBOX
        </div>
      </div>

      <a href="#about" className="absolute bottom-[28px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[9.5px] tracking-[0.32em] font-medium text-ink-3 max-[720px]:hidden" aria-label="Scroll">
        <span>SCROLL</span>
        <span className="scroll-line w-px h-9 bg-gradient-to-b from-ink-4 to-transparent relative overflow-hidden" />
      </a>
    </header>
  )
}
