import { useOutletContext, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { FaPen } from "react-icons/fa"

export default function Settings() {
  const { radioUrl, setRadioUrl, wallpaper, setWallpaper } = useOutletContext()
  const [selectedStation, setSelectedStation] = useState("")
  const [weatherUnit, setWeatherUnit] = useState("metric")
  const [customWallpaper, setCustomWallpaper] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "")
  const [newName, setNewName] = useState("")
  const [showToast, setShowToast] = useState(false)

  const navigate = useNavigate()
  const WEATHER_API_KEY = "8170aa2f82fcbf0cefc5ce497f44dc2b"

  const stations = [
    { name: "Zeppelin 106.7", url: "https://radiostreaming.ert.gr/ert-zeppelin" },
    { name: "Red 96.3", url: "https://netradio.live24.gr/red9630" },
    { name: "Rebel 105.2", url: "https://netradio.live24.gr/rebel1052" },
    { name: "Rock 96.9", url: "https://az10.yesstreaming.net/radio/8060/radio.mp3" },
  ]

  const builtInWallpapers = [
    { name: "Aurora", url: `${import.meta.env.BASE_URL}wallpapers/aurora.jpg` },
    { name: "Mountains", url: `${import.meta.env.BASE_URL}wallpapers/mountains.jpg` },
    { name: "Abstract", url: `${import.meta.env.BASE_URL}wallpapers/abstract.jpg` },
    { name: "Night", url: `${import.meta.env.BASE_URL}wallpapers/night.jpg` },
  ]

  useEffect(() => {
    const savedUrl = localStorage.getItem("radioUrl")
    const savedWeatherUnit = localStorage.getItem("weatherUnit") || "metric"

    if (savedUrl) {
      setSelectedStation(savedUrl)
      setRadioUrl(savedUrl)
    } else {
      const defaultStation = stations[0].url
      setSelectedStation(defaultStation)
      setRadioUrl(defaultStation)
      localStorage.setItem("radioUrl", defaultStation)
    }

    localStorage.setItem("weatherApiKey", WEATHER_API_KEY)
    setWeatherUnit(savedWeatherUnit)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setRadioUrl(selectedStation)
    localStorage.setItem("radioUrl", selectedStation)
    localStorage.setItem("weatherApiKey", WEATHER_API_KEY)
    localStorage.setItem("weatherUnit", weatherUnit)
    window.dispatchEvent(new Event("manual-update"))
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

  const handleChangeName = (e) => {
    e.preventDefault()
    if (!newName.trim()) return

    localStorage.setItem("userName", newName)
    window.dispatchEvent(new Event("userNameUpdated")) 

    setUserName(newName)
    setNewName("")
    document.querySelector('[data-bs-dismiss="modal"]')?.click()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-start pt-5">
        <div className="settings-window p-4 rounded-4 shadow-lg w-100 position-relative" style={{ maxWidth: "900px" }}>
          
        <button
          type="button"
          className="btn-close custom-hover position-absolute top-0 start-0 m-3 p-2 shadow-sm"
          aria-label="Close"
          onClick={() => navigate("/")}
        ></button>



          <h2 className="mb-4 text-center">Settings</h2>

          <div className="position-absolute top-0 end-0 p-3 d-flex flex-row align-items-center gap-2">
            <p className="mb-0 small">
              <strong>{userName || "Not set"}</strong>
            </p>
            <button
              className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
              data-bs-toggle="modal"
              data-bs-target="#changeNameModal"
              style={{ width: "28px", height: "28px" }}
            >
              <FaPen size={12} />
            </button>
          </div>

          {showAlert && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              Settings saved successfully!
              <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold text-secondary">Select Radio Station</label>
              <select
                className="form-select"
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
              >
                {stations.map((station, index) => (
                  <option key={index} value={station.url}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <hr className="my-4" />

            <div className="mt-4">
              <label className="form-label fw-bold text-secondary">Temperature Unit</label>
              <select
                className="form-select"
                value={weatherUnit}
                onChange={(e) => setWeatherUnit(e.target.value)}
              >
                <option value="metric">Celsius (°C)</option>
                <option value="imperial">Fahrenheit (°F)</option>
              </select>
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
            <p className="mb-1">Version 0.0.8</p>
            <p className="mb-1">
              Created by <span className="fw-semibold">Grigoris Papadopoulos</span>
            </p>
            <p className="mb-0">
              © {new Date().getFullYear()} Echo Garden — All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="changeNameModal"
        tabIndex="-1"
        aria-labelledby="changeNameModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="changeNameModalLabel">
                Change Your Name
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleChangeName}>
              <div className="modal-body">
                <label className="form-label">Enter new name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showToast && (
        <div
          className="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-4 show"
          role="alert"
          style={{ zIndex: 2000 }}
        >
          <div className="d-flex">
            <div className="toast-body">Name updated successfully!</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      )}
    </>
  )
}
