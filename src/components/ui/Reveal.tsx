import { motion, type HTMLMotionProps } from 'framer-motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
}

/** Fades and lifts its children into view once, when scrolled to. */
export default function Reveal({ delay = 0, y = 40, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
