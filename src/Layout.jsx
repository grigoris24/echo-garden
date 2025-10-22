import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import {
  FaPlay,
  FaPause,
  FaCog,
  FaCloudSun,
  FaExclamationTriangle,
  FaHome,
  FaListAlt,
  FaCalculator,
  FaHashtag,
  FaBars,
  FaTimes,
  FaRegStickyNote,
  FaCalendarAlt,
  FaGamepad,
} from "react-icons/fa"

export default function Layout() {
  const [radioUrl, setRadioUrl] = useState("https://radiostreaming.ert.gr/ert-zeppelin")
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(new Date())
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [wallpaper, setWallpaper] = useState(`${import.meta.env.BASE_URL}wallpapers/aurora.jpg`)
  const [menuOpen, setMenuOpen] = useState(false)
  const audioRef = useRef(null)
  const navigate = useNavigate()

  const togglePlay = () => {
    if (!audioRef.current) return
    isPlaying ? audioRef.current.pause() : audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formattedDate = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })

  useEffect(() => {
    const savedWallpaper = localStorage.getItem("wallpaper")
    if (savedWallpaper) {
      if (savedWallpaper.startsWith("/wallpapers/")) {
        setWallpaper(`${import.meta.env.BASE_URL}${savedWallpaper.slice(1)}`)
      } else {
        setWallpaper(savedWallpaper)
      }
    }
  }, [])

  useEffect(() => {
    const fetchWeatherData = () => {
      const apiKey = localStorage.getItem("weatherApiKey")

      if (!apiKey) {
        setError("no-key")
        setWeather(null)
        return
      }

      const fetchWeather = (url) => {
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (data.cod === 200 || data.cod === "200") {
              setWeather({
                temp: Math.round(data.main.temp),
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
                city: data.name,
              })
              setError(null)
            } else {
              setError("invalid")
              setWeather(null)
            }
          })
          .catch(() => {
            setError("failed")
            setWeather(null)
          })
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
            fetchWeather(url)
          },
          () => {
            const city = "Athens"
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            fetchWeather(url)
          }
        )
      } else {
        const city = "Athens"
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        fetchWeather(url)
      }
    }

    fetchWeatherData()

    const handleStorageChange = (e) => {
      if (e.key === "weatherApiKey" || e.type === "manual-update") {
        fetchWeatherData()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("manual-update", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("manual-update", handleStorageChange)
    }
  }, [])

  return (
    <div
      className="vh-100 d-flex flex-column bg-light"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <main className="flex-grow-1 overflow-auto p-3 text-dark">
        <Outlet context={{ radioUrl, setRadioUrl, wallpaper, setWallpaper }} />
      </main>

      <footer
        className="bg-dark text-white py-2 px-3 d-flex justify-content-between align-items-center shadow-lg"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "60px",
          zIndex: 10,
        }}
      >
        <div className="d-flex align-items-center gap-4">
          <button
            className="btn btn-outline-light d-lg-none"
            onClick={() => setMenuOpen(true)}
            style={{ border: "none", fontSize: "1.4rem" }}
          >
            <FaBars />
          </button>

          <div className="d-none d-lg-flex align-items-center gap-4">
            <NavLink to="/" end className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}>
              <FaHome />
              <span className="tooltip-text">Home</span>
            </NavLink>

            <NavLink to="/counter" className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}>
              <FaHashtag />
              <span className="tooltip-text">Counter</span>
            </NavLink>

            <NavLink to="/todo" className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}>
              <FaListAlt />
              <span className="tooltip-text">Todo List</span>
            </NavLink>

            <NavLink to="/calculator" className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}>
              <FaCalculator />
              <span className="tooltip-text">Calculator</span>
            </NavLink>

            <NavLink to="/notes" className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}>
              <FaRegStickyNote />
              <span className="tooltip-text">Notes</span>
            </NavLink>

            <NavLink to="/calendar" className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}>
              <FaCalendarAlt />
              <span className="tooltip-text">Calendar</span>
            </NavLink>

            <NavLink to="/tictactoe" className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}>
              <FaTimes />
              <span className="tooltip-text">Tic Tac Toe</span>
            </NavLink>

            <NavLink to="/snake" className={({ isActive }) => `taskbar-app ${isActive ? "active-app" : ""}`}> 
              <FaGamepad /> 
              <span className="tooltip-text">Snake</span> 
            </NavLink> 
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "38px", height: "38px" }}
            title="Settings"
          >
            <FaCog />
          </button>

          <audio ref={audioRef} src={radioUrl} preload="none" />
          <button
            onClick={togglePlay}
            className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "38px", height: "38px" }}
            title={isPlaying ? "Pause Radio" : "Play Radio"}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <div className="d-flex align-items-center gap-2">
            {error === "no-key" ? (
              <FaExclamationTriangle
                className="text-warning fs-4 pulse-warning"
                onClick={() => navigate("/settings")}
                style={{ cursor: "pointer" }}
                title="Connect Weather API"
              />
            ) : weather ? (
              <>
                <img
                  src={weather.icon}
                  alt="weather"
                  title={`${weather.city}: ${weather.temp}°C`}
                  style={{ width: "30px", height: "30px" }}
                />
                <span style={{ fontSize: "0.9rem" }}>{weather.temp}°C</span>
              </>
            ) : (
              <FaCloudSun className="text-secondary fs-4" />
            )}
          </div>

          <div className="text-end" title="Date & Time">
            <div style={{ fontSize: "0.8rem" }}>{formattedDate}</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{formattedTime}</div>
          </div>
        </div>
      </footer>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/counter" onClick={() => setMenuOpen(false)}>Counter</NavLink>
        <NavLink to="/todo" onClick={() => setMenuOpen(false)}>Todo List</NavLink>
        <NavLink to="/calculator" onClick={() => setMenuOpen(false)}>Calculator</NavLink>
        <NavLink to="/notes" onClick={() => setMenuOpen(false)}>Notes</NavLink>
        <NavLink to="/calendar" onClick={() => setMenuOpen(false)}>Calendar</NavLink>
        <NavLink to="/tictactoe" onClick={() => setMenuOpen(false)}>Tic Tac Toe</NavLink>
        <NavLink to="/snake" onClick={() => setMenuOpen(false)}>Snake</NavLink>
      </div>
    </div>
  )
}
