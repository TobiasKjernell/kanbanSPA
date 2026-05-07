import { useState, useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import '../../styles.css'
import '../../project.css'

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
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <Link to="/" className="nav__brand">
        <span className="nav__mark">
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
          <a href="/#about">About</a>
          <a href="/#games">Games</a>
          <a href="/#gallery">Gallery</a>
          <a href="/#journal">Journal</a>
        </div>
      </div>
      <Link to="/login" className="nav__login">
        <span className="nav__login-dot"></span>
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
    <div className="ph" style={{ aspectRatio: ratio }}>
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
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
      <span className="ph__num">{num}</span>
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
      <main className="proj">
        <header className="proj__hero">
          <div className="proj__hero-media">
            <ProjectPlaceholder tone={shotsTone} num="00" ratio="21/9" />
            <div className="proj__hero-vignette"></div>
          </div>
          <div className="proj__hero-inner">
            <Reveal className="proj__breadcrumb">
              <Link to="/">Studio</Link>
              <span>/</span>
              <a href="/#games">Games</a>
              <span>/</span>
              <span className="proj__breadcrumb-current">{title}</span>
            </Reveal>
            <Reveal delay={120} className="proj__no">{no}</Reveal>
            <Reveal delay={200} as="h1" className="proj__title">{title}</Reveal>
            <Reveal delay={320} className="proj__tagline">
              <em>{tagline}</em>
            </Reveal>
          </div>
        </header>

        <section className="proj__meta-strip">
          <div className="proj__meta-item">
            <span className="proj__meta-key">Status</span>
            <span className="proj__meta-val">{status}</span>
          </div>
          <div className="proj__meta-item">
            <span className="proj__meta-key">Genre</span>
            <span className="proj__meta-val">{genre}</span>
          </div>
          <div className="proj__meta-item">
            <span className="proj__meta-key">Platform</span>
            <span className="proj__meta-val">{platform}</span>
          </div>
          <div className="proj__meta-item">
            <span className="proj__meta-key">Players</span>
            <span className="proj__meta-val">{players}</span>
          </div>
          <div className="proj__meta-item">
            <span className="proj__meta-key">Release</span>
            <span className="proj__meta-val">{releaseEta}</span>
          </div>
        </section>

        <section className="proj__intro">
          <Reveal className="proj__label">
            <span className="num">01</span>
            <span>Premise</span>
          </Reveal>
          <Reveal as="p" delay={80} className="proj__lede">{intro}</Reveal>
          <div className="proj__body">
            {longCopy.map((para, i) => (
              <Reveal as="p" delay={i * 100} key={i}>{para}</Reveal>
            ))}
          </div>
        </section>

        <section className="proj__shots">
          <Reveal className="proj__label">
            <span className="num">02</span>
            <span>From the build</span>
          </Reveal>
          <div className="proj__shots-grid">
            <Reveal className="proj__shot proj__shot--big">
              <ProjectPlaceholder tone={shotsTone} num="01" ratio="16/10" />
              <figcaption>Frame 01 — Pre-alpha capture</figcaption>
            </Reveal>
            <Reveal delay={80} className="proj__shot">
              <ProjectPlaceholder tone={shotsTone} num="02" ratio="4/3" />
              <figcaption>Frame 02 — Detail study</figcaption>
            </Reveal>
            <Reveal delay={160} className="proj__shot">
              <ProjectPlaceholder tone={shotsTone} num="03" ratio="4/3" />
              <figcaption>Frame 03 — Lighting test</figcaption>
            </Reveal>
            <Reveal delay={240} className="proj__shot proj__shot--wide">
              <ProjectPlaceholder tone={shotsTone} num="04" ratio="21/9" />
              <figcaption>Frame 04 — Wide composition</figcaption>
            </Reveal>
          </div>
        </section>

        <section className="proj__facts">
          <Reveal className="proj__label">
            <span className="num">03</span>
            <span>Field notes</span>
          </Reveal>
          <ol className="proj__facts-list">
            {facts.map((f, i) => (
              <Reveal as="li" delay={i * 80} key={i} className="proj__fact">
                <span className="proj__fact-no">{String(i + 1).padStart(2, '0')}</span>
                <div className="proj__fact-body">
                  <span className="proj__fact-head">{f.head}</span>
                  <span className="proj__fact-text">{f.text}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="proj__cta-block">
          <Reveal as="h2" className="proj__cta-title">
            Want updates as<br /><em>{title}</em> takes shape?
          </Reveal>
          <Reveal delay={120} className="proj__cta-row">
            <a className="btn btn--primary" href="/#journal">
              <span>Read the journal</span>
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </a>
            <a className="btn btn--ghost" href="#wishlist">Wishlist (TBA)</a>
          </Reveal>
        </section>

        <section className="proj__next">
          <Link to={`/games/${otherId}`} className="proj__next-link">
            <div className="proj__next-meta">
              <span className="proj__next-label">Next project</span>
              <span className="proj__next-no">{otherNo}</span>
            </div>
            <span className="proj__next-title">{otherTitle}</span>
            <span className="proj__next-arrow">→</span>
          </Link>
        </section>
      </main>

      <footer className="foot">
        <div className="foot__top">
          <div className="foot__brand">
            <div className="foot__brand-mark">PSP</div>
            <div className="foot__brand-name">
              <span>Polarbear</span><span>Sandbox</span><span>Production</span>
            </div>
          </div>
          <div className="foot__cols">
            <div className="foot__col">
              <span className="foot__col-h">Studio</span>
              <a href="/#about">About</a>
              <a href="/#journal">Journal</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="foot__col">
              <span className="foot__col-h">Games</span>
              <Link to="/games/numops">NumOps</Link>
              <Link to="/games/slotcarvr">SlotcarVR Racing</Link>
            </div>
            <div className="foot__col">
              <span className="foot__col-h">Crew</span>
              <Link to="/login">Crew Login</Link>
            </div>
            <div className="foot__col">
              <span className="foot__col-h">Elsewhere</span>
              <a href="#x">Twitter / X</a>
              <a href="#bsky">Bluesky</a>
              <a href="#yt">YouTube</a>
            </div>
          </div>
        </div>
        <div className="foot__rule"></div>
        <div className="foot__bot">
          <span>© 2026 Polarbear Sandbox Production</span>
          <span className="foot__motto">— made in spare hours, on purpose.</span>
          <span>v0.1 · Helsinki / Remote</span>
        </div>
      </footer>

      <div className="grain" aria-hidden="true"></div>
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
