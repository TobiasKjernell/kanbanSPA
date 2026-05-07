import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

// ─── Reveal ──────────────────────────────────────────────────────────────────

interface RevealProps {
  children: React.ReactNode
  delay?: number
  as?: string
  className?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

function Reveal({ children, delay = 0, as: tag = 'div', className = '', onMouseEnter, onMouseLeave }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh && rect.bottom > 0) {
      const id = setTimeout(() => setShown(true), 0)
      return () => clearTimeout(id)
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { setShown(true); obs.disconnect() } }),
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const style: React.CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 900ms cubic-bezier(.2,.6,.2,1) ${delay}ms, transform 900ms cubic-bezier(.2,.6,.2,1) ${delay}ms`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = tag as any
  return <Tag ref={ref} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</Tag>
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[var(--pad)] py-[14px] border-b border-transparent transition-[background,backdrop-filter,padding,border-color] duration-300 ${scrolled ? 'bg-[rgba(12,12,13,0.72)] backdrop-blur-[14px] border-b-line' : ''}`}>
      <Link to="/" className="flex items-center gap-[14px] text-ink" aria-label="Polarbear Sandbox Production" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
          <a href="#about" className="nav-link">About</a>
          <a href="#games" className="nav-link">Games</a>
          <a href="#gallery" className="nav-link">Gallery</a>
          <a href="#journal" className="nav-link">Journal</a>
        </div>
      </div>

      <Link to="/login" className="inline-flex items-center gap-[10px] px-[18px] py-[10px] border border-line-strong text-[11px] tracking-[0.24em] font-medium uppercase text-ink transition-[border-color,color] duration-[250ms] hover:border-accent hover:text-accent" aria-label="Crew Login">
        <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse-dot" aria-hidden="true"></span>
        Crew Login
      </Link>
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      setT((now - start) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <header className="relative min-h-screen flex items-center justify-center px-[var(--pad)] overflow-hidden isolate" id="top">
      <div className="absolute inset-0 -z-[2]" style={{ background: 'radial-gradient(ellipse at 50% 35%, #1a1814 0%, #0c0a08 55%, #050505 100%)' }}>
        <div style={{ width: '100%', height: '100%', background: 'rgba(12,12,13,0.95)' }} />
      </div>
      <div className="absolute inset-0 -z-[1] pointer-events-none" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(12,12,13,0.55) 0%, rgba(12,12,13,0) 28%, rgba(12,12,13,0) 65%, rgba(12,12,13,0.95) 100%), radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)' }}></div>

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
          <span className="w-[8px] h-[8px] rounded-full bg-accent inline-block transition-transform duration-[80ms] ease-linear" style={{ transform: `scale(${1 + Math.sin(t * 2) * 0.18})` }}></span>
          LIVE · IN&nbsp;THE&nbsp;SANDBOX
        </div>
      </div>

      <a href="#about" className="absolute bottom-[28px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[9.5px] tracking-[0.32em] font-medium text-ink-3 max-[720px]:hidden" aria-label="Scroll">
        <span>SCROLL</span>
        <span className="scroll-line w-px h-9 bg-gradient-to-b from-ink-4 to-transparent relative overflow-hidden"></span>
      </a>
    </header>
  )
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,160px)]" id="about">
      <Reveal as="div" className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-[40px]">
        <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">01</span>
        <span>About the studio</span>
      </Reveal>

      <div className="grid grid-cols-[1.05fr_1fr] gap-[clamp(40px,6vw,96px)] items-start max-[880px]:grid-cols-1">
        <Reveal as="h2" delay={80} className="font-light text-[clamp(32px,4.4vw,64px)] leading-[1.04] tracking-[-0.005em] m-0 text-ink">
          A small crew, building<br />
          <em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">in the margins</em> — together.
        </Reveal>

        <div>
          <Reveal as="p" delay={160} className="text-[15px] leading-[1.75] text-ink-2 m-0 mb-5 tracking-[0.015em] max-w-[52ch]">
            Our team is a group of developers from different game studios who have been
            creating games together in our free time for quite a while. A few times
            each year, whenever we can, we host our own game jams — just for fun.
          </Reveal>
          <Reveal as="p" delay={260} className="text-[15px] leading-[1.75] text-ink-2 m-0 mb-5 tracking-[0.015em] max-w-[52ch]">
            We all enjoy similar types of games, yet we come from diverse backgrounds
            within the games industry. Our long-term goal is to eventually build a
            full-time studio. Who knows. Follow our journey.
          </Reveal>

          <Reveal delay={360} className="mt-9 grid grid-cols-2 border-t border-line">
            {[
              { key: 'Founded', val: '— in spare hours' },
              { key: 'Crew', val: '3 across 2 studios' },
              { key: 'Jams', val: '3–4 per year' },
              { key: 'Status', val: 'Side-project — for now' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col gap-[6px] py-[18px] border-b border-line ${i % 2 === 0 ? 'pr-6 border-r' : 'pl-6'}`}>
                <span className="text-[10px] tracking-[0.28em] font-medium text-ink-3 uppercase">{item.key}</span>
                <span className="text-[14px] text-ink tracking-[0.02em]">{item.val}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

const GALLERY = [
  { game: 'NumOps', caption: 'Operator console — pre-alpha build', num: '001', tone: 'warm' },
  { game: 'SlotcarVR Racing', caption: 'Track 02, headset capture', num: '002', tone: 'cool' },
  { game: 'NumOps', caption: 'Module sketches, jam #14', num: '003', tone: 'paper' },
  { game: 'SlotcarVR Racing', caption: 'Pit lane, lighting study', num: '004', tone: 'deep' },
  { game: 'Studio', caption: 'Jam weekend, kitchen table', num: '005', tone: 'warm' },
  { game: 'NumOps', caption: 'Number-system explorations', num: '006', tone: 'paper' },
  { game: 'SlotcarVR Racing', caption: 'Cockpit shader test', num: '007', tone: 'cool' },
  { game: 'Studio', caption: 'Whiteboard, 2am', num: '008', tone: 'deep' }
]

const PALETTES: Record<string, string[]> = {
  warm: ['#2a201a', '#3d2c20', '#5a3c28', '#8a6a45'],
  cool: ['#161b22', '#1d2530', '#2a3a4d', '#506b85'],
  paper: ['#1a1815', '#2c2820', '#403a2c', '#6a5e44'],
  deep: ['#0d0d10', '#181820', '#252535', '#3d3d54']
}

function GalleryPlaceholder({ tone, num }: { tone: string; num: string }) {
  const p = PALETTES[tone] ?? PALETTES.warm
  return (
    <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" className="w-full h-full block transition-transform duration-[800ms] ease-[cubic-bezier(.2,.6,.2,1)]">
      <defs>
        <radialGradient id={`g-${num}`} cx="35%" cy="40%" r="80%">
          <stop offset="0%" stopColor={p[3]} stopOpacity="0.9" />
          <stop offset="55%" stopColor={p[2]} stopOpacity="0.85" />
          <stop offset="100%" stopColor={p[0]} />
        </radialGradient>
        <linearGradient id={`l-${num}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={p[0]} stopOpacity="0" />
          <stop offset="100%" stopColor={p[0]} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill={`url(#g-${num})`} />
      <rect x="0" y="540" width="600" height="260" fill={p[1]} opacity="0.55" />
      <rect x="40" y="120" width="220" height="2" fill={p[3]} opacity="0.5" />
      <rect x="40" y="140" width="80" height="2" fill={p[3]} opacity="0.35" />
      <circle cx="430" cy="260" r="90" fill="none" stroke={p[3]} strokeWidth="1" opacity="0.45" />
      <circle cx="430" cy="260" r="40" fill={p[3]} opacity="0.18" />
      <rect x="0" y="0" width="600" height="800" fill={`url(#l-${num})`} />
      <rect x="0" y="0" width="600" height="800" fill="black" opacity="0.04" />
    </svg>
  )
}

function Gallery() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  const onScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: 'smooth' })
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const max = el.scrollWidth - el.clientWidth
      const goingDown = e.deltaY > 0
      if ((goingDown && el.scrollLeft < max - 1) || (!goingDown && el.scrollLeft > 1)) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <section className="py-[clamp(80px,12vh,160px)]" id="gallery">
      <div className="max-w-[1440px] mx-auto px-[var(--pad)] grid grid-cols-[auto_1fr_auto] items-end gap-8 mb-14">
        <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase">
          <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">02</span>
          <span>From the cutting room</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="font-light text-[clamp(28px,3.6vw,52px)] leading-[1.05] m-0 text-right">
          Frames, sketches, captures.<br /><em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">Work, mid-flight.</em>
        </Reveal>
        <Reveal delay={160} className="flex gap-2">
          <button className="w-11 h-11 border border-line-strong inline-flex items-center justify-center text-ink-2 transition-all duration-[250ms] hover:border-accent hover:text-accent hover:-translate-y-0.5" onClick={() => scrollBy(-1)} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
          <button className="w-11 h-11 border border-line-strong inline-flex items-center justify-center text-ink-2 transition-all duration-[250ms] hover:border-accent hover:text-accent hover:-translate-y-0.5" onClick={() => scrollBy(1)} aria-label="Next">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </Reveal>
      </div>

      <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing" ref={scrollerRef} onScroll={onScroll}>
        <div className="flex gap-7 px-[var(--pad)] py-1 w-max">
          {GALLERY.map((g, i) => (
            <figure key={i} className="flex-none w-[clamp(280px,32vw,460px)] snap-start transition-transform duration-500 ease-[cubic-bezier(.2,.6,.2,1)] hover:-translate-y-[6px] group">
              <div className="relative aspect-[3/4] overflow-hidden border border-line">
                <GalleryPlaceholder tone={g.tone} num={g.num} />
                <span className="absolute top-[14px] left-[14px] text-[10px] tracking-[0.32em] font-medium text-ink px-[10px] py-1 bg-[rgba(12,12,13,0.6)] backdrop-blur-[8px] border border-line">{g.num}</span>
              </div>
              <figcaption className="flex flex-col gap-1 pt-[18px] pb-1">
                <span className="text-[10px] tracking-[0.32em] font-medium text-accent uppercase">{g.game}</span>
                <span className="text-[14px] text-ink-2 tracking-[0.02em]">{g.caption}</span>
              </figcaption>
            </figure>
          ))}
          <div className="flex-none w-[280px] flex items-center gap-[18px] text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase self-center">
            <span>End of gallery</span>
            <span className="flex-1 h-px bg-line"></span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-9 px-[var(--pad)] grid grid-cols-[1fr_auto] gap-[18px] items-center">
        <div className="h-px bg-line relative overflow-hidden">
          <div className="absolute inset-0 h-px bg-accent origin-left transition-transform duration-200" style={{ transform: `scaleX(${progress})` }}></div>
        </div>
        <span className="text-[10.5px] tracking-[0.28em] font-medium text-ink-3">
          {String(Math.round(progress * GALLERY.length)).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  )
}

// ─── Games ───────────────────────────────────────────────────────────────────

const GAMES = [
  {
    id: 'numops',
    no: 'I',
    title: 'NumOps',
    sub: 'A puzzle of operators and order.',
    body: 'A logic-puzzler about composing number systems with the right operations, in the right order. In development.',
    tags: ['Puzzle', 'Single-player', 'PC', 'In Development'],
    tone: 'warm'
  },
  {
    id: 'slotcarvr',
    no: 'II',
    title: 'SlotcarVR Racing',
    sub: 'Slot-car nostalgia, in room-scale.',
    body: 'A toy-shelf racing sim built for VR. Hand-painted tracks, hairline timing, and the smell of plastic — minus the smell.',
    tags: ['Racing', 'VR', 'Multiplayer', 'In Development'],
    tone: 'cool'
  }
]

function GameCard({ game, idx }: { game: typeof GAMES[0]; idx: number }) {
  const [hover, setHover] = useState(false)
  return (
    <Reveal
      as="article"
      delay={idx * 120}
      className={`border border-line bg-bg-2 flex flex-col transition-[border-color,transform] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:border-accent`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className={`w-full h-full transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.6,.2,1)] ${hover ? 'scale-[1.06]' : 'scale-100'}`}>
          <GalleryPlaceholder tone={game.tone} num={`g${idx}`} />
        </div>
        <span className="absolute top-[18px] right-[18px] text-[14px] tracking-[0.18em] font-medium text-accent border border-accent px-3 py-1.5 bg-[rgba(12,12,13,0.6)] backdrop-blur-[6px]">{game.no}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(12,12,13,0.5)] pointer-events-none"></div>
      </div>
      <div className="px-7 pt-7 pb-8 flex flex-col gap-[18px]">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-normal text-[clamp(24px,2.6vw,36px)] m-0 tracking-[0.005em]">{game.title}</h3>
          <span className="text-[12px] tracking-[0.22em] font-medium text-accent uppercase">{game.sub}</span>
        </div>
        <p className="text-[14px] leading-[1.7] text-ink-2 m-0 max-w-[48ch]">{game.body}</p>
        <div className="flex flex-wrap gap-1.5">
          {game.tags.map(t => (
            <span key={t} className="text-[10px] tracking-[0.22em] font-medium text-ink-3 uppercase border border-line px-[10px] py-[5px]">{t}</span>
          ))}
        </div>
        <Link replace className="inline-flex items-center gap-[10px] mt-1.5 text-[11px] tracking-[0.28em] font-medium uppercase text-ink pb-2 border-b border-line-strong self-start transition-[color,border-color,gap] duration-[250ms] hover:text-accent hover:border-accent hover:gap-4" to={`/games/${game.id}`}>
          <span>View project</span>
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
        </Link>
      </div>  
    </Reveal>
  )
}

function Games() {
  return (
    <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,160px)]" id="games">
      <div className="mb-14">
        <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-10">
          <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">03</span>
          <span>The catalogue</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="font-light text-[clamp(32px,4.4vw,64px)] leading-[1.04] m-0">
          Two games in motion.<br /><em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">More, when we can.</em>
        </Reveal>
      </div>
      <div className="grid grid-cols-2 gap-7 max-[880px]:grid-cols-1">
        {GAMES.map((g, i) => <GameCard key={g.id} game={g} idx={i} />)}
      </div>
    </section>
  )
}

// ─── Journal ─────────────────────────────────────────────────────────────────

const JOURNAL = [
  {
    date: '26 / 04 / 26',
    kind: 'Devlog',
    title: 'Jam #14 — three days, one rule, no sleep',
    excerpt: 'Notes from the kitchen-table jam: what we shipped, what we cut, and the prototype that quietly became NumOps.'
  },
  {
    date: '12 / 03 / 26',
    kind: 'Field Notes',
    title: 'Slot cars and the geometry of nostalgia',
    excerpt: 'On rebuilding a childhood toy in VR — and why hairline timing matters more than horsepower.'
  },
  {
    date: '02 / 02 / 26',
    kind: 'Studio',
    title: 'On staying small (for now)',
    excerpt: 'Why we\'re building Polarbear Sandbox in the margins, and what it would take to go full-time.'
  }
]

function Journal() {
  return (
    <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,160px)]" id="journal">
      <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-end mb-12 max-[720px]:grid-cols-1">
        <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase">
          <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">04</span>
          <span>From the journal</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="font-light text-[clamp(28px,3.6vw,52px)] leading-[1.05] m-0">
          Dispatches from the<br /><em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">spare hours.</em>
        </Reveal>
        <Reveal delay={160} className="text-[11px] tracking-[0.28em] font-medium uppercase">
          <a href="#all" className="text-ink-2 border-b border-line pb-1 transition-all duration-[250ms] hover:text-accent hover:border-accent">All entries →</a>
        </Reveal>
      </div>
      <ol className="list-none m-0 p-0 border-t border-line">
        {JOURNAL.map((j, i) => (
          <Reveal as="li" delay={i * 80} key={i} className="border-b border-line">
            <a className="journal-row grid grid-cols-[110px_130px_1fr_1.2fr_30px] gap-8 items-center py-7 transition-[padding] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:px-3 max-[1100px]:grid-cols-[90px_110px_1fr_24px] max-[720px]:grid-cols-[1fr_24px] max-[720px]:gap-3 max-[720px]:py-6" href="#entry">
              <span className="text-[10.5px] tracking-[0.28em] font-medium uppercase text-ink-3">{j.date}</span>
              <span className="text-[10.5px] tracking-[0.28em] font-medium uppercase text-accent max-[720px]:hidden">{j.kind}</span>
              <span className="text-[clamp(16px,1.5vw,20px)] text-ink tracking-[0.005em] font-normal">{j.title}</span>
              <span className="text-[13px] text-ink-2 leading-[1.55] max-[1100px]:hidden">{j.excerpt}</span>
              <span className="text-[16px] text-ink-3 text-right transition-[color,transform] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)] group-hover:text-accent group-hover:translate-x-1" aria-hidden="true">↗</span>
            </a>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
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
            <a href="#about" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">About</a>
            <a href="#journal" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Journal</a>
            <a href="#contact" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Contact</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Games</span>
            <Link to="/games/numops" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">NumOps</Link>
            <Link to="/games/slotcarvr" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">SlotcarVR Racing</Link>
            <a href="#archive" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Jam Archive</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Crew</span>
            <Link to="/login" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Crew Login</Link>
            <a href="#careers" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Careers (—)</a>
            <a href="#press" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Press kit</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Elsewhere</span>
            <a href="#x" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Twitter / X</a>
            <a href="#bsky" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Bluesky</a>
            <a href="#yt" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">YouTube</a>
            <a href="#discord" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Discord</a>
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

// ─── LandingPage ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', '#c8a878')
    root.style.setProperty('--bg', '#0c0c0d')
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Games />
        <Journal />
      </main>
      <Footer />
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.06] mix-blend-overlay" aria-hidden="true" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}></div>
    </>
  )
}
