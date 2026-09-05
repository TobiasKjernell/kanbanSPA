import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../../Reveal'
import { GalleryPlaceholder } from '../../Placeholder'

interface GameCardData {
  id: string
  no: string
  title: string
  sub: string
  body: string
  tags: string[]
  tone: string
  image?: string
}

const GAMES: GameCardData[] = [
  {
    id: 'numops',
    no: 'I',
    title: 'NumOps',
    sub: 'A math-based action game.',
    body: 'A action game about solving math problems to survive. In development.',
    tags: ['Single-player', 'PC', 'Mobile', 'In Development'],
    tone: 'warm',
    image: '/NumberOpsPicture/Image%20Sequence_001_0000.webp',
  },
  { 
    id: 'slotcarvr',  
    no: 'II',
    title: 'SlotcarVR Racing',
    sub: 'Slot-car nostalgia, in room-scale.',
    body: 'A toy-shelf racing sim built for VR. Hand-painted tracks, hairline timing, and the smell of plastic — minus the smell.',
    tags: ['Racing', 'VR', 'Multiplayer', 'In Development'],
    tone: 'cool',
  },
]

function GameCard({ game, idx }: { game: typeof GAMES[0]; idx: number }) {
  const [hover, setHover] = useState(false)
  return (
    <Reveal
      as="article"
      delay={idx * 120}
      className="border border-line bg-bg-2 flex flex-col transition-[border-color] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:border-accent"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`relative overflow-hidden ${game.image ? 'aspect-video' : 'aspect-16/10'}`}>
        <div className={`w-full h-full transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.6,.2,1)] ${hover ? 'scale-[1.06]' : 'scale-100'}`}>
          {game.image ? (
            <img src={game.image} alt={game.title} className="w-full h-full object-cover object-center block" />
          ) : (
            <GalleryPlaceholder tone={game.tone} num={`g${idx}`} />
          )}
        </div>
        <span className="absolute top-[18px] right-[18px] text-[14px] tracking-[0.18em] font-medium text-accent border border-accent px-3 py-1.5 bg-[rgba(12,12,13,0.6)] backdrop-blur-[6px]">{game.no}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(12,12,13,0.5)] pointer-events-none" />
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
        <Link to={`/games/${game.id}`} className="inline-flex items-center gap-[10px] mt-1.5 text-[11px] tracking-[0.28em] font-medium uppercase text-ink pb-2 border-b border-line-strong self-start transition-[color,border-color,gap] duration-[250ms] hover:text-accent hover:border-accent hover:gap-4">
          <span>View project</span>
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
        </Link>
      </div>
    </Reveal>
  )
}

export default function Games() {
  return (
    <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,160px)]" id="games">
      <div className="mb-14">
        <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase pb-[14px] border-b border-line mb-10">
          <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">03</span>
          <span>The catalogue</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="font-light text-[clamp(32px,4.4vw,64px)] leading-[1.04] m-0">
          Two games in motion.<br />
          <em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">More, when we can.</em>
        </Reveal>
      </div>
      <div className="grid grid-cols-2 gap-7 max-[880px]:grid-cols-1">
        {GAMES.map((g, i) => <GameCard key={g.id} game={g} idx={i} />)}
      </div>
    </section>
  )
}
