import { Link } from 'react-router-dom'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import Reveal from '../../Reveal'
import { ProjectPlaceholder } from '../../Placeholder'
import type { GameData } from '../data'

const META_KEYS = ['Status', 'Genre', 'Platform', 'Players', 'Release'] as const

function GalleryShot({ src, alt, tone, num, ratio }: { src?: string; alt: string; tone: string; num: string; ratio: string }) {
  if (src) {
    // Screenshots are captured at 16/9 — keep their native ratio instead of the placeholder's varied crops.
    return (
      <div className="relative w-full overflow-hidden border border-line" style={{ aspectRatio: '16/9' }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover block transition-[filter,transform] duration-[600ms] ease-[cubic-bezier(.2,.6,.2,1)] min-[881px]:grayscale-[70%] min-[881px]:sepia-[25%] min-[881px]:brightness-[0.65] min-[881px]:contrast-[1.05] min-[881px]:scale-[1.03] min-[881px]:group-hover:grayscale-0 min-[881px]:group-hover:sepia-0 min-[881px]:group-hover:brightness-100 min-[881px]:group-hover:contrast-100 min-[881px]:group-hover:scale-100"
        />
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-[600ms] ease-[cubic-bezier(.2,.6,.2,1)] opacity-0 min-[881px]:opacity-100 min-[881px]:group-hover:opacity-0" style={{ background: 'linear-gradient(160deg, rgba(12,12,13,0.35) 0%, rgba(200,168,120,0.22) 100%)', mixBlendMode: 'multiply' }} />
      </div>
    )
  }
  return <ProjectPlaceholder tone={tone} num={num} ratio={ratio} />
}

export default function ProjectPage({ no, title, tagline, intro, status, genre, platform, players, releaseEta, facts, longCopy, shotsTone, shots, otherId, otherTitle, otherNo, websiteUrl }: GameData) {
  const metaValues = [status, genre, platform, players, releaseEta]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <header className="relative min-h-[78vh] flex items-end px-[var(--pad)] pb-[clamp(40px,6vh,72px)] overflow-hidden isolate">
          <div className="absolute inset-0 -z-[2]">
            <ProjectPlaceholder tone={shotsTone} num="00" ratio="21/9" />
          </div>
          <div className="absolute inset-0 -z-[1] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(12,12,13,0.6) 0%, rgba(12,12,13,0.1) 30%, rgba(12,12,13,0.7) 75%, rgba(12,12,13,0.98) 100%), radial-gradient(ellipse at 30% 100%, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
          <div className="relative z-[1] max-w-[1440px] mx-auto w-full pt-[140px] pb-2 flex flex-col">
            <Reveal className="flex gap-3 items-center text-[10.5px] tracking-[0.28em] font-medium text-ink-3 uppercase mb-[clamp(20px,3vh,32px)]">
              <Link to="/" className="text-ink-3 transition-colors duration-[250ms] hover:text-accent">Studio</Link>
              <span>/</span>
              <Link to="/#games" className="text-ink-3 transition-colors duration-[250ms] hover:text-accent">Games</Link>
              <span>/</span>
              <span className="text-ink">{title}</span>
            </Reveal>
            <Reveal delay={120} className="text-[11px] tracking-[0.32em] font-medium text-accent uppercase mb-4">{no}</Reveal>
            <Reveal delay={200} as="h1" className="font-light text-[clamp(48px,8.5vw,140px)] leading-[0.95] tracking-[-0.012em] m-0 mb-8 text-ink break-words">{title}</Reveal>
            <Reveal delay={320} className="text-[clamp(16px,1.6vw,22px)] text-ink-2 max-w-[620px] tracking-[0.02em] leading-[1.5]">
              <em className="text-accent italic [transform:skewX(-8deg)] inline-block">{tagline}</em>
            </Reveal>
            {websiteUrl && (
              <Reveal delay={400} className="mt-8">
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[10px] px-[22px] py-[14px] text-[11px] tracking-[0.28em] font-medium uppercase border border-line-strong text-ink-2 transition-all duration-[280ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:text-ink hover:border-ink">Visit website</a>
              </Reveal>
            )}
          </div>
        </header>

        {/* Meta strip */}
        <section className="max-w-[1440px] mx-auto grid grid-cols-5 border-t border-b border-line max-[880px]:grid-cols-2">
          {META_KEYS.map((key, i) => (
            <div key={key} className={`p-6 flex flex-col gap-2 max-[880px]:p-[18px] max-[880px]:border-t max-[880px]:border-line ${i > 0 ? 'border-l border-line max-[880px]:odd:border-l-0' : ''}`}>
              <span className="text-[10px] tracking-[0.28em] font-medium text-ink-3 uppercase">{key}</span>
              <span className="text-[14px] text-ink tracking-[0.02em]">{metaValues[i]}</span>
            </div>
          ))}
        </section>

        {/* Intro */}
        <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,140px)] grid grid-cols-[1fr_1.5fr] gap-[clamp(40px,6vw,96px)] items-start max-[880px]:grid-cols-1" >
          <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-10 col-start-1">
            <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">01</span>
            <span>Premise</span>
          </Reveal>
          <Reveal as="p" delay={80} className="font-light text-[clamp(22px,2.4vw,34px)] leading-[1.3] m-0 text-ink tracking-[0.005em] min-[881px]:col-start-2 min-[881px]:row-start-1">{intro}</Reveal>
          <div className="mt-8 flex flex-col gap-4.5 min-[881px]:col-start-2">
            {longCopy.map((para, i) => (
              <Reveal as="p" delay={i * 100} key={i} className="text-[15px] leading-[1.75] text-ink-2 m-0 max-w-[58ch] tracking-[0.015em]">{para}</Reveal>
            ))}
          </div>
        </section>

        {/* Shots */}
        <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,140px)]">
          <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-10">
            <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">02</span>
            <span>From the game</span>
          </Reveal>
          <div className="grid grid-cols-[1.4fr_1fr] gap-5 max-[880px]:grid-cols-1">
            <Reveal className="group flex flex-col gap-3 row-span-2 max-[880px]:row-span-1">
              <GalleryShot src={shots?.[0]} alt={`${title} — pre-alpha capture`} tone={shotsTone} num="01" ratio="16/10" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 01</figcaption>
            </Reveal>
            <Reveal delay={80} className="group flex flex-col gap-3">
              <GalleryShot src={shots?.[1]} alt={`${title} — detail study`} tone={shotsTone} num="02" ratio="4/3" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 02</figcaption>
            </Reveal>
            <Reveal delay={160} className="group flex flex-col gap-3">
              <GalleryShot src={shots?.[2]} alt={`${title} — lighting test`} tone={shotsTone} num="03" ratio="4/3" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 03</figcaption>
            </Reveal>
            <Reveal delay={240} className="group flex flex-col gap-3 col-span-2 max-[880px]:col-span-1">
              <GalleryShot src={shots?.[3]} alt={`${title} — wide composition`} tone={shotsTone} num="04" ratio="21/9" />
              <figcaption className="text-[11px] tracking-[0.22em] font-medium text-ink-3 uppercase">Frame 04</figcaption>
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
      <Footer />
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.06] mix-blend-overlay" aria-hidden="true" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
    </>
  )
}
