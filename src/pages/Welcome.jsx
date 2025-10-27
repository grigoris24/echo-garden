import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Welcome() {
  const [name, setName] = useState("")
  const [fadeOut, setFadeOut] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
  e.preventDefault()
  if (!name.trim()) return

  setFadeOut(true)

  setTimeout(() => {
    localStorage.setItem("userName", name)
    localStorage.setItem("hasVisited", "true")
    navigate("/")
    window.location.reload()
  }, 1000)
}


  return (
    <AnimatePresence>
  {!fadeOut && (
    <motion.div
      className="welcome-screen position-relative vh-100 text-center d-flex align-items-center justify-content-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}splashscreen.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>

      <motion.div
        className="position-relative px-3"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "20px",
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-white fs-3 fs-md-2">Welcome to Echo Garden!</h1>
        <p className="text-light mt-2 fs-6 fs-md-5">
          Let's get to know you before we start.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-3"
          style={{ maxWidth: 300, width: "100%", margin: "0 auto" }}
        >
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn btn-light w-100">
            Continue
          </button>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  )
}
