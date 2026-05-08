import Reveal from '../../Reveal'

const ENTRIES = [
  {
    date: '26 / 04 / 26',
    kind: 'Devlog',
    title: 'Jam #14 — three days, one rule, no sleep',
    excerpt: 'Notes from the kitchen-table jam: what we shipped, what we cut, and the prototype that quietly became NumOps.',
  },
  {
    date: '12 / 03 / 26',
    kind: 'Field Notes',
    title: 'Slot cars and the geometry of nostalgia',
    excerpt: 'On rebuilding a childhood toy in VR — and why hairline timing matters more than horsepower.',
  },
  {
    date: '02 / 02 / 26',
    kind: 'Studio',
    title: 'On staying small (for now)',
    excerpt: "Why we're building Polarbear Sandbox in the margins, and what it would take to go full-time.",
  },
]

export default function Journal() {
  return (
    <section className="max-w-[1440px] mx-auto px-[var(--pad)] py-[clamp(80px,12vh,160px)]" id="journal">
      <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-end mb-12 max-[720px]:grid-cols-1">
        <Reveal className="inline-flex items-center text-[10.5px] tracking-[0.32em] font-medium text-ink-3 uppercase">
          <span className="font-medium text-[11px] tracking-[0.22em] text-accent mr-4 inline-block">04</span>
          <span>From the journal</span>
        </Reveal>
        <Reveal as="h2" delay={80} className="font-light text-[clamp(28px,3.6vw,52px)] leading-[1.05] m-0">
          Dispatches from the<br />
          <em className="italic text-accent font-extralight [transform:skewX(-9deg)] inline-block">spare hours.</em>
        </Reveal>
        <Reveal delay={160} className="text-[11px] tracking-[0.28em] font-medium uppercase">
          <a href="#all" className="text-ink-2 border-b border-line pb-1 transition-all duration-[250ms] hover:text-accent hover:border-accent">All entries →</a>
        </Reveal>
      </div>

      <ol className="list-none m-0 p-0 border-t border-line">
        {ENTRIES.map((j, i) => (
          <Reveal as="li" delay={i * 80} key={i} className="border-b border-line">
            <a className="journal-row grid grid-cols-[110px_130px_1fr_1.2fr_30px] gap-8 items-center py-7 transition-[padding] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)] hover:px-3 max-[1100px]:grid-cols-[90px_110px_1fr_24px] max-[720px]:grid-cols-[1fr_24px] max-[720px]:gap-3 max-[720px]:py-6" href="#entry">
              <span className="text-[10.5px] tracking-[0.28em] font-medium uppercase text-ink-3">{j.date}</span>
              <span className="text-[10.5px] tracking-[0.28em] font-medium uppercase text-accent max-[720px]:hidden">{j.kind}</span>
              <span className="text-[clamp(16px,1.5vw,20px)] text-ink tracking-[0.005em] font-normal">{j.title}</span>
              <span className="text-[13px] text-ink-2 leading-[1.55] max-[1100px]:hidden">{j.excerpt}</span>
              <span className="text-[16px] text-ink-3 text-right transition-[color,transform] duration-[350ms] ease-[cubic-bezier(.2,.6,.2,1)]" aria-hidden="true">↗</span>
            </a>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
