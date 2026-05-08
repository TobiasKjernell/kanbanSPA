import Reveal from '../../Reveal'

const META = [
  { key: 'Founded', val: '— in spare hours' },
  { key: 'Crew',    val: '3 across 2 studios' },
  { key: 'Jams',    val: '3–4 per year' },
  { key: 'Status',  val: 'Side-project — for now' },
]

export default function About() {
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
            {META.map((item, i) => (
              <div key={item.key} className={`flex flex-col gap-[6px] py-[18px] border-b border-line ${i % 2 === 0 ? 'pr-6 border-r' : 'pl-6'}`}>
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
