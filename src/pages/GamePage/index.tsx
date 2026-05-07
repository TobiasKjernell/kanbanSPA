import { useState, useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

// ─── Reveal ──────────────────────────────────────────────────────────────────

interface RevealProps {
  children: React.ReactNode
  delay?: number
  as?: string
  className?: string
}

function Reveal({ children, delay = 0, as: tag = 'div', className = '' }: RevealProps) {
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
  return <Tag ref={ref} className={className} style={style}>{children}</Tag>
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
      <Link to="/" className="flex items-center gap-[14px] text-ink">
        <span className="text-accent inline-flex">
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
          <a href="/#about" className="nav-link">About</a>
          <a href="/#games" className="nav-link">Games</a>
          <a href="/#gallery" className="nav-link">Gallery</a>
          <a href="/#journal" className="nav-link">Journal</a>
        </div>
      </div>
      <Link to="/login" className="inline-flex items-center gap-[10px] px-[18px] py-[10px] border border-line-strong text-[11px] tracking-[0.24em] font-medium uppercase text-ink transition-[border-color,color] duration-[250ms] hover:border-accent hover:text-accent">
        <span className="w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_10px_var(--accent)] animate-pulse-dot"></span>
        Crew Login
      </Link>
    </nav>
  )
}

// ─── ProjectPlaceholder ──────────────────────────────────────────────────────

const PALETTES: Record<string, string[]> = {
  warm: ['#2a201a', '#3d2c20', '#5a3c28', '#8a6a45'],
  cool: ['#161b22', '#1d2530', '#2a3a4d', '#506b85'],
  paper: ['#1a1815', '#2c2820', '#403a2c', '#6a5e44'],
  deep: ['#0d0d10', '#181820', '#252535', '#3d3d54']
}

function ProjectPlaceholder({ tone, num, ratio = '16/10' }: { tone: string; num: string; ratio?: string }) {
  const p = PALETTES[tone] ?? PALETTES.warm
  return (
    <div className="relative w-full bg-bg-2 overflow-hidden border border-line" style={{ aspectRatio: ratio }}>
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <radialGradient id={`pg-${num}`} cx="35%" cy="40%" r="80%">
            <stop offset="0%" stopColor={p[3]} stopOpacity="0.9" />
            <stop offset="55%" stopColor={p[2]} stopOpacity="0.85" />
            <stop offset="100%" stopColor={p[0]} />
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill={`url(#pg-${num})`} />
        <rect x="0" y="270" width="600" height="130" fill={p[1]} opacity="0.55" />
        <circle cx="430" cy="160" r="60" fill="none" stroke={p[3]} strokeWidth="1" opacity="0.45" />
        <circle cx="430" cy="160" r="24" fill={p[3]} opacity="0.18" />
        <rect x="40" y="60" width="180" height="2" fill={p[3]} opacity="0.5" />
      </svg>
      <span className="absolute top-[14px] left-[14px] text-[10px] tracking-[0.32em] font-medium text-ink px-[10px] py-1 bg-[rgba(12,12,13,0.6)] backdrop-blur-[8px] border border-line">{num}</span>
    </div>
  )
}

// ─── Game data ───────────────────────────────────────────────────────────────

interface GameData {
  no: string
  title: string
  tagline: string
  intro: string
  status: string
  genre: string
  platform: string
  players: string
  releaseEta: string
  shotsTone: string
  longCopy: string[]
  facts: { head: string; text: string }[]
  otherId: string
  otherTitle: string
  otherNo: string
}

const GAME_DATA: Record<string, GameData> = {
  numops: {
    no: 'PROJECT I',
    title: 'NumOps',
    tagline: 'Top-down math solver',
    intro: 'A mathematical game about solving problems at reload, practice your early stage math.',
    status: 'In development',
    genre: 'Top-down shooter',
    platform: 'Mobile / PC',
    players: 'Single-player',
    releaseEta: 'TBA · 2027',
    shotsTone: 'warm',
    longCopy: [
      'NumOps started as a jam prototype: a single screen, a handful of operator tiles, and a target number. We kept coming back to it. Three jams later, it has rules, a soundtrack, and a stubborn personality.',
      'Each puzzle is a small machine. You feed it numbers; you arrange operators; you press run. When it works, the screen exhales. When it doesn\'t, the puzzle quietly tells you which step gave up first — and then it\'s on you.',
      'We\'re building it for the kind of evening where you want to think, but gently. Forty-five minutes, a cup of something warm, and a problem that fits.'
    ],
    facts: [
      { head: 'Born in a 48-hour jam', text: 'Jam #11. The first prototype was a spreadsheet with a play button. We\'ve kept the spreadsheet energy and lost the spreadsheet.' },
      { head: 'Puzzles compose, like operators', text: 'Solutions to early puzzles become primitives in later ones. The further you go, the more your toolbox is something you built yourself.' },
      { head: 'No timer, no score', text: 'We don\'t believe in punishing thought. The only reward is the next puzzle, and the only score is the one you keep in your head.' },
      { head: 'Hand-tuned, not generated', text: 'Every puzzle is authored. We tried procgen for a week and it produced 4,000 puzzles with one good one in the pile. We\'d rather hand you the good one.' }
    ],
    otherId: 'slotcarvr',
    otherTitle: 'SlotcarVR Racing',
    otherNo: 'PROJECT II'
  },
  slotcarvr: {
    no: 'PROJECT II',
    title: 'SlotcarVR Racing',
    tagline: 'Slot-car nostalgia, in room-scale.',
    intro: 'A toy-shelf racing sim built for VR. Exciting tracks, hairline timing, challenge your friends!',
    status: 'In development',
    genre: 'Racing / VR',
    platform: 'Meta Quest · Standalone VR',
    players: '1–4 online',
    releaseEta: 'TBA · 2026',
    shotsTone: 'cool',
    longCopy: [
      'We grew up with these. The figure-eight tracks on the kitchen floor; the trigger that gave you exactly enough throttle to fly off the third corner. SlotcarVR is our love letter to that — and our quiet attempt to fix the parts the carpet always ruined.',
      'Tracks are dioramas. Each one is a tiny, lit world you can lean into and look around. Cars are scaled toys with real physics — light enough to lose in a corner, heavy enough that getting the line right feels like a thing.',
      'Multiplayer is split-screen reborn: two to four players around the same shelf, each with their own controller, all looking at the same plastic landscape from different angles.'
    ],
    facts: [
      { head: 'Built for the Quest, first', text: 'Standalone VR is the design constraint. If a track doesn\'t run at frame on the headset, it doesn\'t ship — full stop.' },
      { head: 'Hand-painted track skins', text: 'Every loop, hairpin and chicane is dressed by hand. The \'plastic with brushstrokes\' look is the goal, not an accident.' },
      { head: 'Hairline timing matters', text: 'Slot cars live or die in the last centimeter before the corner. We rebuilt the throttle model three times to get that millisecond right.' },
      { head: 'Local + online, same room', text: 'Up to four players can share a virtual shelf. Bring your own headset; pick your own car; argue over who gets the red one.' }
    ],
    otherId: 'numops',
    otherTitle: 'NumOps',
    otherNo: 'PROJECT I'
  }
}

// ─── ProjectPage ─────────────────────────────────────────────────────────────

function ProjectPage({ no, title, tagline, intro, status, genre, platform, players, releaseEta,
  facts, longCopy, shotsTone, otherId, otherTitle, otherNo }: GameData) {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <header className="relative min-h-[78vh] flex items-end px-[var(--pad)] pb-[clamp(40px,6vh,72px)] overflow-hidden isolate">
          <div className="absolute inset-0 -z-[2]">
            <ProjectPlaceholder tone={shotsTone} num="00" ratio="21/9" />
          </div>
          <div className="absolute inset-0 -z-[1] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(12,12,13,0.6) 0%, rgba(12,12,13,0.1) 30%, rgba(12,12,13,0.7) 75%, rgba(12,12,13,0.98) 100%), radial-gradient(ellipse at 30% 100%, rgba(0,0,0,0.4) 0%, transparent 60%)' }}></div>
          <div className="relative z-[1] max-w-[1440px] mx-auto w-full pt-[140px] pb-2 flex flex-col">
            <Reveal className="flex gap-3 items-center text-[10.5px] tracking-[0.28em] font-medium text-ink-3 uppercase mb-[clamp(20px,3vh,32px)]">
              <Link to="/" className="text-ink-3 transition-colors duration-[250ms] hover:text-accent">Studio</Link>
              <span>/</span>
              <a href="/#games" className="text-ink-3 transition-colors duration-[250ms] hover:text-accent">Games</a>
              <span>/</span>
              <span className="text-ink">{title}</span>
            </Reveal>
            <Reveal delay={120} className="text-[11px] tracking-[0.32em] font-medium text-accent uppercase mb-4">{no}</Reveal>
            <Reveal delay={200} as="h1" className="font-light text-[clamp(48px,8.5vw,140px)] leading-[0.95] tracking-[-0.012em] m-0 mb-8 text-ink break-words">{title}</Reveal>
            <Reveal delay={320} className="text-[clamp(16px,1.6vw,22px)] text-ink-2 max-w-[620px] tracking-[0.02em] leading-[1.5]">
              <em className="text-accent italic [transform:skewX(-8deg)] inline-block">{tagline}</em>
            </Reveal>
          </div>
        </header>

        {/* Meta strip */}
        <section className="max-w-[1440px] mx-auto grid grid-cols-5 border-t border-b border-line max-[880px]:grid-cols-2">
          {[
            { key: 'Status', val: status },
            { key: 'Genre', val: genre },
            { key: 'Platform', val: platform },
            { key: 'Players', val: players },
            { key: 'Release', val: releaseEta },
          ].map((item, i) => (
            <div key={i} className={`p-6 flex flex-col gap-2 max-[880px]:p-[18px] max-[880px]:border-t max-[880px]:border-line ${i > 0 ? 'border-l border-line max-[880px]:odd:border-l-0' : ''}`}>
              <span className="text-[10px] tracking-[0.28em] font-medium text-ink-3 uppercase">{item.key}</span>
              <span className="text-[14px] text-ink tracking-[0.02em]">{item.val}</span>
            </div>
          ))}
        </section>

        {/* Intro */}
        <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,140px)] grid grid-cols-[1fr_1.5fr] gap-[clamp(40px,6vw,96px)] items-start max-[880px]:grid-cols-1">
          <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-10 col-start-1">
            <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">01</span>
            <span>Premise</span>
          </Reveal>
          <Reveal as="p" delay={80} className="font-light text-[clamp(22px,2.4vw,34px)] leading-[1.3] m-0 text-ink tracking-[0.005em] col-start-2 row-start-1">{intro}</Reveal>
          <div className="col-start-2 mt-8 flex flex-col gap-[18px]">
            {longCopy.map((para, i) => (
              <Reveal as="p" delay={i * 100} key={i} className="text-[15px] leading-[1.75] text-ink-2 m-0 max-w-[58ch] tracking-[0.015em]">{para}</Reveal>
            ))}
          </div>
        </section>

        {/* Shots */}
        <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,140px)]">
          <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-10">
            <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">02</span>
            <span>From the build</span>
          </Reveal>
          <div className="grid grid-cols-[1.4fr_1fr] gap-5 max-[880px]:grid-cols-1">
            <Reveal className="flex flex-col gap-3 row-span-2 max-[880px]:row-span-1">
              <ProjectPlaceholder tone={shotsTone} num="01" ratio="16/10" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 01 — Pre-alpha capture</figcaption>
            </Reveal>
            <Reveal delay={80} className="flex flex-col gap-3">
              <ProjectPlaceholder tone={shotsTone} num="02" ratio="4/3" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 02 — Detail study</figcaption>
            </Reveal>
            <Reveal delay={160} className="flex flex-col gap-3">
              <ProjectPlaceholder tone={shotsTone} num="03" ratio="4/3" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 03 — Lighting test</figcaption>
            </Reveal>
            <Reveal delay={240} className="flex flex-col gap-3 col-span-2 max-[880px]:col-span-1">
              <ProjectPlaceholder tone={shotsTone} num="04" ratio="21/9" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 04 — Wide composition</figcaption>
            </Reveal>
          </div>
        </section>

        {/* Facts */}
        <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,140px)]">
          <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-10">
            <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">03</span>
            <span>Field notes</span>
          </Reveal>
          <ol className="list-none m-0 p-0 border-t border-line">
            {facts.map((f, i) => (
              <Reveal as="li" delay={i * 80} key={i} className="grid grid-cols-[80px_1fr] gap-8 py-7 border-b border-line items-baseline">
                <span className="text-[11px] tracking-[0.28em] font-medium text-accent">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[clamp(16px,1.4vw,19px)] text-ink tracking-[0.01em]">{f.head}</span>
                  <span className="text-[14px] text-ink-2 leading-[1.65] max-w-[60ch]">{f.text}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,140px)] text-center flex flex-col items-center gap-8 border-t border-b border-line">
          <Reveal as="h2" className="font-light text-[clamp(32px,4.4vw,56px)] leading-[1.05] m-0">
            Want updates as<br /><em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">{title}</em> takes shape?
          </Reveal>
          <Reveal delay={120} className="flex gap-[14px] flex-wrap justify-center">
            <a className="inline-flex items-center gap-[10px] px-[22px] py-[14px] text-[11px] tracking-[0.28em] font-medium uppercase bg-accent text-bg border border-accent transition-all duration-[280ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:bg-transparent hover:text-accent hover:-translate-y-0.5" href="/#journal">
              <span>Read the journal</span>
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </a>
            <a className="inline-flex items-center gap-[10px] px-[22px] py-[14px] text-[11px] tracking-[0.28em] font-medium uppercase border border-line-strong text-ink-2 transition-all duration-[280ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:text-ink hover:border-ink" href="#wishlist">Wishlist (TBA)</a>
          </Reveal>
        </section>

        {/* Next project */}
        <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(60px,8vh,100px)]">
          <Link to={`/games/${otherId}`} className="group grid grid-cols-[auto_1fr_auto] gap-8 items-center py-8 border-t border-b border-line transition-[padding,border-color] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:px-4 hover:border-accent max-[720px]:grid-cols-[1fr_auto] max-[720px]:gap-4">
            <div className="flex flex-col gap-1.5 max-[720px]:flex-row max-[720px]:gap-4">
              <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase">Next project</span>
              <span className="text-[14px] tracking-[0.18em] text-accent">{otherNo}</span>
            </div>
            <span className="font-light text-[clamp(28px,3.6vw,48px)] text-ink tracking-[-0.005em]">{otherTitle}</span>
            <span className="text-[28px] text-ink-3 transition-[color,transform] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)] group-hover:text-accent group-hover:translate-x-2">→</span>
          </Link>
        </section>
      </main>

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
              <a href="/#about" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">About</a>
              <a href="/#journal" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Journal</a>
              <a href="#contact" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Contact</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Games</span>
              <Link to="/games/numops" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">NumOps</Link>
              <Link to="/games/slotcarvr" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">SlotcarVR Racing</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Crew</span>
              <Link to="/login" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Crew Login</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.32em] font-medium text-ink-3 uppercase mb-2">Elsewhere</span>
              <a href="#x" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Twitter / X</a>
              <a href="#bsky" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">Bluesky</a>
              <a href="#yt" className="text-[13px] text-ink-2 tracking-[0.02em] transition-[color,transform] duration-[250ms] hover:text-accent hover:translate-x-1 inline-block">YouTube</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto mt-14 h-px bg-line"></div>
        <div className="max-w-[1440px] mx-auto pt-6 flex justify-between items-center gap-6 flex-wrap text-[11px] tracking-[0.18em] font-medium text-ink-3 uppercase">
          <span>© 2026 Polarbear Sandbox Production</span>
          <span className="text-ink-2 italic tracking-[0.04em] normal-case text-[12px]">— made in spare hours, on purpose.</span>
          <span>v0.1 · Helsinki / Remote</span>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.06] mix-blend-overlay" aria-hidden="true" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}></div>
    </>
  )
}

// ─── GamePage ────────────────────────────────────────────────────────────────

export default function GamePage() {
  const { game } = useParams<{ game: string }>()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', '#c8a878')
    root.style.setProperty('--bg', '#0c0c0d')
  }, [])

  const data = game ? GAME_DATA[game] : undefined
  if (!data) return <Navigate to="/" replace />

  return <ProjectPage {...data} />
}
