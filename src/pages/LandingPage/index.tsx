import { useEffect } from 'react'
import Footer from '../../components/Footer'
import About from '../../components/LandingPage/About'
import Games from '../../components/LandingPage/Games'
import Hero from '../../components/LandingPage/Hero'
import Navbar from '../../components/Navbar'

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', '#c8a878')
    document.documentElement.style.setProperty('--bg', '#0c0c0d')
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        {/* <Gallery /> */}
        <Games />
        {/* <Journal /> */} 
      </main>
      <Footer />
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.06] mix-blend-overlay" aria-hidden="true" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
    </>
  )
}
