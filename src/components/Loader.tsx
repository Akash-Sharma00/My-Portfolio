import { motion } from 'framer-motion'

const NAME = 'AKASH SHARMA'

export default function Loader() {
  return (
    <motion.div
      className="loader"
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="loader-inner">
        <div className="loader-sig" aria-label={NAME}>
          {NAME.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={ch === ' ' ? '' : 'text-aurora'}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </div>
        <div className="loader-bar">
          <motion.i
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <motion.div
          className="loader-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ duration: 1.4, delay: 0.4 }}
        >
          Calibrating universe
        </motion.div>
      </div>
    </motion.div>
  )
}
