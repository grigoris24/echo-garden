import { useOutletContext } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Settings() {
  const { radioUrl, setRadioUrl, wallpaper, setWallpaper } = useOutletContext()
  const [newUrl, setNewUrl] = useState(radioUrl)
  const [weatherApiKey, setWeatherApiKey] = useState("")
  const [customWallpaper, setCustomWallpaper] = useState(null)
  const [showAlert, setShowAlert] = useState(false)

  const builtInWallpapers = [
    { name: "Aurora", url: `${import.meta.env.BASE_URL}wallpapers/aurora.jpg` },
    { name: "Mountains", url: `${import.meta.env.BASE_URL}wallpapers/mountains.jpg` },
    { name: "Abstract", url: `${import.meta.env.BASE_URL}wallpapers/abstract.jpg` },
    { name: "Night", url: `${import.meta.env.BASE_URL}wallpapers/night.jpg` },
  ]

  useEffect(() => {
    const savedUrl = localStorage.getItem("radioUrl")
    const savedWeatherKey = localStorage.getItem("weatherApiKey")
    if (savedUrl) setNewUrl(savedUrl)
    if (savedWeatherKey) setWeatherApiKey(savedWeatherKey)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setRadioUrl(newUrl)
    localStorage.setItem("radioUrl", newUrl)
    localStorage.setItem("weatherApiKey", weatherApiKey)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleWallpaperSelect = (url) => {
    setCustomWallpaper(null)
    setWallpaper(url)
    localStorage.setItem("wallpaper", url)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setWallpaper(reader.result)
        setCustomWallpaper(reader.result)
        localStorage.setItem("wallpaper", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-start pt-5">
      <div className="settings-window p-4 rounded-4 shadow-lg w-100" style={{ maxWidth: "900px" }}>
        <h2 className="mb-4">Settings</h2>

        {showAlert && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            Settings saved successfully!
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAlert(false)}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold text-secondary">
              Web Radio Stream URL
            </label>
            <input
              type="text"
              className="form-control"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/stream.mp3"
            />
          </div>

          <hr className="my-4" />

          <div className="mb-4">
            <h5 className="text-muted mb-3">API Keys</h5>
            <label className="form-label">Weather API Key</label>
            <input
              type="text"
              className="form-control"
              value={weatherApiKey}
              onChange={(e) => setWeatherApiKey(e.target.value)}
              placeholder="Enter your OpenWeatherMap API key"
            />
            <small className="text-muted">
              Get a free key from{" "}
              <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">
                openweathermap.org
              </a>
            </small>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>

        <hr className="my-5" />

        <div className="mb-4">
          <h5 className="text-muted mb-3">Wallpaper</h5>
          <div className="row">
            {builtInWallpapers.map((wp, index) => (
              <div key={index} className="col-6 col-md-3 mb-3">
                <div
                  className={`wallpaper-preview ${wallpaper === wp.url ? "selected" : ""}`}
                  onClick={() => handleWallpaperSelect(wp.url)}
                  style={{
                    backgroundImage: `url(${wp.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    position: "relative",
                    boxShadow:
                      wallpaper === wp.url
                        ? "0 0 0 3px #0d6efd"
                        : "0 0 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      left: "8px",
                      color: "white",
                      textShadow: "1px 1px 3px black",
                      fontSize: "0.9rem",
                    }}
                  >
                    {wp.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <label className="form-label">Custom Wallpaper</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileUpload}
            />
            {customWallpaper && (
              <div className="mt-3">
                <img
                  src={customWallpaper}
                  alt="Custom Wallpaper Preview"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <hr className="my-5" />

        <div className="text-center text-muted small">
          <p className="mb-1 fw-semibold text-dark">Echo Garden</p>
          <p className="mb-1">Version 0.0.3</p>
          <p className="mb-1">Created by <span className="fw-semibold">Grigoris Papadopoulos</span></p>
          <p className="mb-0">
            © {new Date().getFullYear()} Echo Garden — All rights reserved.
          </p>
          <p className="mt-2">
            <a
              href="https://github.com/grigoris24/echo-garden"
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none text-primary"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
