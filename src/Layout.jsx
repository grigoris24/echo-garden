import { Outlet, NavLink } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { FaPlay, FaPause } from "react-icons/fa"

export default function Layout() {
  const [radioUrl, setRadioUrl] = useState("https://radiostreaming.ert.gr/ert-zeppelin")
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(new Date())
  const audioRef = useRef(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formattedDate = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })

  return (
    <div className="d-flex flex-column vh-100">
      <header className="bg-dark text-white px-4 py-2 d-flex justify-content-between align-items-center shadow-sm">
        <h2 style={{ fontFamily: "Bangle-Normal", letterSpacing: "1px" }} className="mb-0">
          Echo Garden
        </h2>

        <div className="d-flex align-items-center gap-4">
          <div className="text-end">
            <div style={{ fontSize: "0.9rem" }}>{formattedDate}</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{formattedTime}</div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <audio ref={audioRef} src={radioUrl} preload="none" />
            <button
              onClick={togglePlay}
              className="btn btn-primary btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px" }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </div>
      </header>

      <div className="d-flex flex-grow-1">
        <aside className="bg-dark text-white p-3 d-flex flex-column shadow-sm" style={{ width: "250px" }}>
          <nav className="nav flex-column mt-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link mb-2 ${isActive ? "active-link" : "text-white"}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/counter"
              className={({ isActive }) =>
                `nav-link mb-2 ${isActive ? "active-link" : "text-white"}`
              }
            >
              Counter
            </NavLink>

            <NavLink
              to="/todo"
              className={({ isActive }) =>
                `nav-link mb-2 ${isActive ? "active-link" : "text-white"}`
              }
            >
              Todo List
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `nav-link mb-2 ${isActive ? "active-link" : "text-white"}`
              }
            >
              Settings
            </NavLink>
          </nav>
        </aside>

        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet context={{ radioUrl, setRadioUrl }} />
        </main>
      </div>
    </div>
  )
}
