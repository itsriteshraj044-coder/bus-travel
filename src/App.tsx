import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LangProvider } from './i18n/LangContext'
import { BookingProvider } from './booking/BookingContext'
import { SmoothScroll } from './components/layout/SmoothScroll'
import TicketModal from './booking/TicketModal'
import Home from './pages/Home'

// The admin panel is only for the operator, so keep it out of the public bundle.
const Admin = lazy(() => import('./pages/Admin'))

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    // Layout changes between routes; let pinned sections re-measure.
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(id)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <SmoothScroll>
          <BookingProvider>
            <RouteEffects />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<div className="min-h-svh bg-[#0F0824]" />}>
                    <Admin />
                  </Suspense>
                }
              />
              <Route path="*" element={<Home />} />
            </Routes>
            <TicketModal />
          </BookingProvider>
        </SmoothScroll>
      </BrowserRouter>
    </LangProvider>
  )
}
