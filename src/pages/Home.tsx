import { motion, useScroll, useSpring } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../sections/Hero'
import StopsMarquee from '../sections/StopsMarquee'
import BookingSection from '../booking/BookingSection'
import Features from '../sections/Features'
import Journey from '../sections/Journey'
import HowItWorks, { StatsBand } from '../sections/HowItWorks'
import MyTickets from '../sections/MyTickets'
import About from '../sections/About'
import Testimonials from '../sections/Testimonials'
import Contact, { CtaBand } from '../sections/Contact'
import { BUSINESS } from '../data/config'
import { WhatsAppIcon } from '../components/ui/icons'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-saffron via-amber to-leaf" />
}

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <StopsMarquee />
        <BookingSection />
        <Features />
        <Journey />
        <HowItWorks />
        <StatsBand />
        <MyTickets />
        <About />
        <Testimonials />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
      <motion.a
        href={`https://wa.me/${BUSINESS.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
        whileHover={{ scale: 1.1, rotate: -8 }}
        className="fixed right-4 bottom-24 z-30 grid size-14 place-items-center rounded-full bg-leaf text-white shadow-[0_15px_35px_-10px_rgba(23,166,90,0.8)] sm:right-6 sm:bottom-6"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-leaf/40 [animation-duration:2.5s]" />
        <WhatsAppIcon className="relative size-7" />
      </motion.a>
    </>
  )
}
