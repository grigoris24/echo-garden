import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2000)
    const timer2 = setTimeout(() => setDone(true), 7000)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  if (done) return null

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: fadeOut ? 2 : 1, ease: "easeInOut" }}
    >
     <img
        src={`${import.meta.env.BASE_URL}splashscreen.png`}
        alt="Splash"
        className="splash-img"
    />

    </motion.div>
  )
}
