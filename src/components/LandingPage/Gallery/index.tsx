import { useState, useEffect, useRef, useCallback } from 'react'
import Reveal from '../../Reveal'
import { GalleryPlaceholder } from '../../Placeholder'

const ITEMS = [
  { game: 'NumOps',          caption: 'Operator console — pre-alpha build', num: '001', tone: 'warm' },
  { game: 'SlotcarVR Racing', caption: 'Track 02, headset capture',         num: '002', tone: 'cool' },
  { game: 'NumOps',          caption: 'Module sketches, jam #14',           num: '003', tone: 'paper' },
  { game: 'SlotcarVR Racing', caption: 'Pit lane, lighting study',          num: '004', tone: 'deep' },
  { game: 'Studio',          caption: 'Jam weekend, kitchen table',         num: '005', tone: 'warm' },
  { game: 'NumOps',          caption: 'Number-system explorations',         num: '006', tone: 'paper' },
  { game: 'SlotcarVR Racing', caption: 'Cockpit shader test',               num: '007', tone: 'cool' },
  { game: 'Studio',          caption: 'Whiteboard, 2am',                   num: '008', tone: 'deep' },
]

export default function Gallery() {
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
          Frames, sketches, captures.<br />
          <em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">Work, mid-flight.</em>
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

      <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar mx-5" ref={scrollerRef} onScroll={onScroll}>
        <div className="flex gap-7 px-[var(--pad)] py-1 w-max">
          {ITEMS.map((g, i) => (
            <figure key={i} className="flex-none w-[clamp(280px,32vw,460px)] snap-start transition-transform duration-500 ease-[cubic-bezier(.2,.6,.2,1)] hover:-translate-y-[6px]">
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

      {/* <div className="max-w-[1440px] mx-auto mt-9 px-[var(--pad)] grid grid-cols-[1fr_auto] gap-[18px] items-center">
        <div className="h-px bg-line relative overflow-hidden">
          <div className="absolute inset-0 h-px bg-accent origin-left transition-transform duration-0" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="text-[10.5px] tracking-[0.28em] font-medium text-ink-3">
          {String(Math.round(progress * ITEMS.length)).padStart(2, '0')} / {String(ITEMS.length).padStart(2, '0')}
        </span>
      </div> */}
    </section>
  )
}
