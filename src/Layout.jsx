import { Outlet, Link } from "react-router-dom"
import { useState, useRef } from "react"
import { FaPlay, FaPause } from "react-icons/fa"

export default function Layout() {
  const [radioUrl, setRadioUrl] = useState("https://radiostreaming.ert.gr/ert-zeppelin")
  const [isPlaying, setIsPlaying] = useState(false)
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

  return (
    <div className="d-flex flex-column vh-100">
      <header className="bg-dark text-white px-4 py-2 d-flex justify-content-between align-items-center shadow-sm">
        <h2
          style={{ fontFamily: "Bangle-Normal", letterSpacing: "1px" }}
          className="mb-0"
        >
          Echo Garden
        </h2>

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
      </header>

      <div className="d-flex flex-grow-1">
        <aside
          className="bg-dark text-white p-3 d-flex flex-column shadow-sm"
          style={{ width: "250px" }}
        >
          <nav className="nav flex-column mt-3">
            <Link to="/" className="nav-link text-white mb-2 hover-link">
              Home
            </Link>
            <Link to="/settings" className="nav-link text-white mb-2 hover-link">
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet context={{ radioUrl, setRadioUrl }} />
        </main>
      </div>
    </div>
  )
}
