import { useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardPage from "./pages/DashboardPage"
import { QueryClientProvider } from "./providers/queryClient"
import LoginPage from "./pages/LoginPage"
import LandingPage from "./pages/LandingPage"
import GamePage from "./pages/GamePage"

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Element not yet in DOM (cross-page navigation) — wait for render
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [pathname, hash])
  return null
}

function App() {
  return (
    <>
      <QueryClientProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/games/:game" element={<GamePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
