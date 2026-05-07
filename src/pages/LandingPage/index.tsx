import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import '../../styles.css'

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
    if (rect.top < vh && rect.bottom > 0) { setShown(true); return }
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
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <Link to="/" className="nav__brand" aria-label="Polarbear Sandbox Production">
        <span className="nav__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <circle cx="9.4" cy="9.4" r="1" fill="var(--bg)" />
          </svg>
        </span>
        <span className="nav__wordmark">
          <span className="nav__wordmark-top">POLARBEAR</span>
          <span className="nav__wordmark-bottom">SANDBOX&nbsp;·&nbsp;PRODUCTION</span>
        </span>
      </Link>

      <div className="nav__center">
        <Reveal className="nav__eyebrow">
          <span className="line" aria-hidden="true"></span>
          <span>EST. — INDEPENDENT GAME STUDIO IN PROGRESS</span>
          <span className="line" aria-hidden="true"></span>
        </Reveal>
        <div className="nav__links">
          <a href="#about">About</a>
          <a href="#games">Games</a>
          <a href="#gallery">Gallery</a>
          <a href="#journal">Journal</a>
        </div>
      </div>

      <Link to="/login" className="nav__login" aria-label="Crew Login">
        <span className="nav__login-dot" aria-hidden="true"></span>
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
    <header className="hero" id="top">
      <div className="hero__media">
        {/* image-slot placeholder — replace with actual art */}
        <div style={{ width: '100%', height: '100%', background: 'rgba(12,12,13,0.95)' }} />
        <div className="hero__vignette" aria-hidden="true"></div>
      </div>

      <div className="hero__inner">
        <Reveal delay={120} as="h1" className="hero__title">
          <span className="hero__title-row">Polarbear</span>
          <span className="hero__title-row hero__title-row--italic">Sandbox</span>
          <span className="hero__title-row">Production</span>
        </Reveal>

        <Reveal delay={520} className="hero__quote">
          "We make games in the hours the world doesn't claim."
        </Reveal>

        <Reveal delay={680} className="hero__cta">
          <a href="#games" className="btn btn--primary">
            <span>Explore the Sandbox</span>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </a>
          <a href="#about" className="btn btn--ghost">About the crew</a>
        </Reveal>
      </div>

      <div className="hero__chrome" aria-hidden="true">
        <div className="hero__chrome-tr">VOL. 01 — JOURNAL</div>
        <div className="hero__chrome-bl">PSP / 2026 —</div>
        <div className="hero__chrome-br">
          <span className="hero__chrome-pulse" style={{ transform: `scale(${1 + Math.sin(t * 2) * 0.18})` }}></span>
          LIVE · IN&nbsp;THE&nbsp;SANDBOX
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="Scroll">
        <span>SCROLL</span>
        <span className="hero__scroll-line"></span>
      </a>
    </header>
  )
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="about" id="about">
      <Reveal as="div" className="about__label">
        <span className="num">01</span>
        <span>About the studio</span>
      </Reveal>

      <div className="about__grid">
        <Reveal as="h2" delay={80} className="about__head">
          A small crew, building<br />
          <em>in the margins</em> — together.
        </Reveal>

        <div className="about__body">
          <Reveal as="p" delay={160}>
            Our team is a group of developers from different game studios who have been
            creating games together in our free time for quite a while. A few times
            each year, whenever we can, we host our own game jams — just for fun.
          </Reveal>
          <Reveal as="p" delay={260}>
            We all enjoy similar types of games, yet we come from diverse backgrounds
            within the games industry. Our long-term goal is to eventually build a
            full-time studio. Who knows. Follow our journey.
          </Reveal>

          <Reveal delay={360} className="about__meta">
            <div className="about__meta-item">
              <span className="about__meta-key">Founded</span>
              <span className="about__meta-val">— in spare hours</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-key">Crew</span>
              <span className="about__meta-val">3 across 2 studios</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-key">Jams</span>
              <span className="about__meta-val">3–4 per year</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-key">Status</span>
              <span className="about__meta-val">Side-project — for now</span>
            </div>
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
    <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" className="gal__svg">
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
    <section className="gal" id="gallery">
      <div className="gal__head">
        <Reveal className="gal__label">
          <span className="num">02</span>
          <span>From the cutting room</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="gal__title">
          Frames, sketches, captures.<br /><em>Work, mid-flight.</em>
        </Reveal>
        <Reveal delay={160} className="gal__controls">
          <button className="gal__btn" onClick={() => scrollBy(-1)} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
          <button className="gal__btn" onClick={() => scrollBy(1)} aria-label="Next">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </Reveal>
      </div>

      <div className="gal__scroller" ref={scrollerRef} onScroll={onScroll}>
        <div className="gal__track">
          {GALLERY.map((g, i) => (
            <figure key={i} className="gal__card" style={{ '--i': i } as React.CSSProperties}>
              <div className="gal__media">
                <GalleryPlaceholder tone={g.tone} num={g.num} />
                <span className="gal__index">{g.num}</span>
              </div>
              <figcaption className="gal__cap">
                <span className="gal__cap-game">{g.game}</span>
                <span className="gal__cap-text">{g.caption}</span>
              </figcaption>
            </figure>
          ))}
          <div className="gal__end">
            <span>End of gallery</span>
            <span className="gal__end-line"></span>
          </div>
        </div>
      </div>

      <div className="gal__progress">
        <div className="gal__progress-bar" style={{ transform: `scaleX(${progress})` }}></div>
        <span className="gal__progress-num">{String(Math.round(progress * GALLERY.length)).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}</span>
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
      className={`game game--${game.tone} ${hover ? 'is-hover' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="game__media">
        <GalleryPlaceholder tone={game.tone} num={`g${idx}`} />
        <span className="game__no">{game.no}</span>
        <div className="game__media-overlay"></div>
      </div>
      <div className="game__body">
        <div className="game__head">
          <h3 className="game__title">{game.title}</h3>
          <span className="game__sub">{game.sub}</span>
        </div>
        <p className="game__copy">{game.body}</p>
        <div className="game__tags">
          {game.tags.map(t => <span key={t} className="game__tag">{t}</span>)}
        </div>
        <Link className="game__cta" to={`/games/${game.id}`}>
          <span>View project</span>
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
        </Link>
      </div>
    </Reveal>
  )
}

function Games() {
  return (
    <section className="games" id="games">
      <div className="games__head">
        <Reveal className="games__label">
          <span className="num">03</span>
          <span>The catalogue</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="games__title">
          Two games in motion.<br /><em>More, when we can.</em>
        </Reveal>
      </div>
      <div className="games__grid">
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
    <section className="journal" id="journal">
      <div className="journal__head">
        <Reveal className="journal__label">
          <span className="num">04</span>
          <span>From the journal</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="journal__title">
          Dispatches from the<br /><em>spare hours.</em>
        </Reveal>
        <Reveal delay={160} className="journal__more">
          <a href="#all">All entries →</a>
        </Reveal>
      </div>
      <ol className="journal__list">
        {JOURNAL.map((j, i) => (
          <Reveal as="li" delay={i * 80} key={i} className="journal__item">
            <a className="journal__row" href="#entry">
              <span className="journal__date">{j.date}</span>
              <span className="journal__kind">{j.kind}</span>
              <span className="journal__title-cell">{j.title}</span>
              <span className="journal__excerpt">{j.excerpt}</span>
              <span className="journal__arrow" aria-hidden="true">↗</span>
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
    <footer className="foot">
      <div className="foot__top">
        <div className="foot__brand">
          <div className="foot__brand-mark">PSP</div>
          <div className="foot__brand-name">
            <span>Polarbear</span>
            <span>Sandbox</span>
            <span>Production</span>
          </div>
        </div>
        <div className="foot__cols">
          <div className="foot__col">
            <span className="foot__col-h">Studio</span>
            <a href="#about">About</a>
            <a href="#journal">Journal</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="foot__col">
            <span className="foot__col-h">Games</span>
            <Link to="/games/numops">NumOps</Link>
            <Link to="/games/slotcarvr">SlotcarVR Racing</Link>
            <a href="#archive">Jam Archive</a>
          </div>
          <div className="foot__col">
            <span className="foot__col-h">Crew</span>
            <Link to="/login">Crew Login</Link>
            <a href="#careers">Careers (—)</a>
            <a href="#press">Press kit</a>
          </div>
          <div className="foot__col">
            <span className="foot__col-h">Elsewhere</span>
            <a href="#x">Twitter / X</a>
            <a href="#bsky">Bluesky</a>
            <a href="#yt">YouTube</a>
            <a href="#discord">Discord</a>
          </div>
        </div>
      </div>
      <div className="foot__rule"></div>
      <div className="foot__bot">
        <span>© 2026 Polarbear Sandbox Production</span>
        <span className="foot__motto">— made in spare hours, on purpose.</span>
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
      <div className="grain" aria-hidden="true"></div>
    </>
  )
}
