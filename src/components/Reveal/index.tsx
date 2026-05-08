import { useState, useEffect, useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  as?: string
  className?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function Reveal({ children, delay = 0, as: tag = 'div', className = '', onMouseEnter, onMouseLeave }: RevealProps) {
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
