import { useOutletContext } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Settings() {
  const { radioUrl, setRadioUrl } = useOutletContext()
  const [newUrl, setNewUrl] = useState(radioUrl)

  useEffect(() => {
    const savedUrl = localStorage.getItem("radioUrl")
    if (savedUrl) {
      setNewUrl(savedUrl)
      setRadioUrl(savedUrl)
    }
  }, [setRadioUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    setRadioUrl(newUrl)
    localStorage.setItem("radioUrl", newUrl)
    alert("Radio URL updated and saved!")
  }

  return (
    <div className="container">
      <h2 className="mb-4">Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Web Radio Stream URL</label>
          <input
            type="text"
            className="form-control"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com/stream.mp3"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  )
}
