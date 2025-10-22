import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Draggable from "react-draggable"
import { FaCalculator, FaListAlt, FaHashtag, FaRegStickyNote, FaCalendarAlt } from "react-icons/fa"

export default function Home() {
  const navigate = useNavigate()

  const defaultApps = [
    { id: "counter", name: "Counter", icon: <FaHashtag />, link: "/counter" },
    { id: "todo", name: "Todo List", icon: <FaListAlt />, link: "/todo" },
    { id: "calculator", name: "Calculator", icon: <FaCalculator />, link: "/calculator" },
    { id: "notes", name: "Notes", icon: <FaRegStickyNote />, link: "/notes" }, 
    { id: "calendar", name: "Calendar", icon: <FaCalendarAlt />, link: "/calendar" },
  ]

  const [apps, setApps] = useState(defaultApps)
  const [positions, setPositions] = useState({})
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 })
  const [isEditable, setIsEditable] = useState(false)

  const clampPosition = (x, y) => {
    const iconWidth = 90
    const iconHeight = 100
    const maxX = window.innerWidth - iconWidth
    const maxY = window.innerHeight - iconHeight - 60 
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    }
  }

  useEffect(() => {
    const savedPositions = localStorage.getItem("iconPositions")
    const savedOrder = localStorage.getItem("iconOrder")

    if (savedPositions) {
      const parsed = JSON.parse(savedPositions)
      const clamped = {}
      Object.entries(parsed).forEach(([id, pos]) => {
        const safe = clampPosition(pos.x, pos.y)
        clamped[id] = safe
      })
      setPositions(clamped)
    }

    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder)
        const ordered = order.map((id) => defaultApps.find((a) => a.id === id)).filter(Boolean)
        setApps(ordered)
      } catch {
        setApps(defaultApps)
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setPositions((prev) => {
        const updated = {}
        for (const id in prev) {
          const safe = clampPosition(prev[id].x, prev[id].y)
          updated[id] = safe
        }
        localStorage.setItem("iconPositions", JSON.stringify(updated))
        return updated
      })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleStop = (e, data, appId) => {
    const safe = clampPosition(data.x, data.y)
    const newPositions = { ...positions, [appId]: safe }
    setPositions(newPositions)
    localStorage.setItem("iconPositions", JSON.stringify(newPositions))
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY })
  }

  const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0 })

  const handleSort = (type) => {
    if (type === "reset") {
      localStorage.removeItem("iconPositions")
      localStorage.removeItem("iconOrder")
      setPositions({})
      setApps(defaultApps)
      setContextMenu({ visible: false, x: 0, y: 0 })
      return
    }

    if (type === "toggleMove") {
      setIsEditable((prev) => !prev)
      setContextMenu({ visible: false, x: 0, y: 0 })
      return
    }

    const sorted = [...apps].sort((a, b) => a.name.localeCompare(b.name))
    const newPositions = {}
    sorted.forEach((app, i) => {
      const safe = clampPosition(100 + (i % 5) * 120, 100 + Math.floor(i / 5) * 120)
      newPositions[app.id] = safe
    })

    setApps(sorted)
    setPositions(newPositions)
    localStorage.setItem("iconPositions", JSON.stringify(newPositions))
    localStorage.setItem("iconOrder", JSON.stringify(sorted.map((a) => a.id)))
    setContextMenu({ visible: false, x: 0, y: 0 })
  }

  return (
    <div
      className="desktop position-relative w-100 h-100"
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      style={{ overflow: "hidden" }}
    >
      {apps.map((app, index) => {
        const nodeRef = useRef(null)
        const marginLeft = 20
        const marginTop = 80
        const spacing = 120
        const iconsPerRow = Math.floor(window.innerWidth / spacing) || 1
        const pos = positions[app.id] || clampPosition(
          marginLeft + (index % iconsPerRow) * spacing,
          marginTop + Math.floor(index / iconsPerRow) * spacing
        )

        const iconElement = (
          <div
            ref={nodeRef}
            className="desktop-icon text-center position-absolute"
            style={{
              cursor: isEditable ? "move" : "pointer",
              userSelect: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "90px",
            }}
            onClick={() => !isEditable && navigate(app.link)}
          >
            <div className="icon-circle d-flex justify-content-center align-items-center">
              {app.icon}
            </div>
            <div className="icon-label">{app.name}</div>
          </div>
        )

        return isEditable ? (
          <Draggable
            key={app.id}
            nodeRef={nodeRef}
            bounds="parent"
            position={pos}
            onStop={(e, data) => handleStop(e, data, app.id)}
          >
            {iconElement}
          </Draggable>
        ) : (
          <div key={app.id} style={{ position: "absolute", left: pos.x, top: pos.y }}>
            {iconElement}
          </div>
        )
      })}

      {contextMenu.visible && (
        <ul
          className="context-menu list-unstyled shadow rounded-2"
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            background: "rgba(30,30,30,0.95)",
            color: "white",
            padding: "8px 0",
            width: "200px",
            zIndex: 9999,
          }}
        >
          <li className="px-3 py-2 hover-item" onClick={() => handleSort("name")}>
            Sort by Name
          </li>
          <li className="px-3 py-2 hover-item" onClick={() => handleSort("reset")}>
            Reset Positions
          </li>
          <li className="px-3 py-2 hover-item" onClick={() => handleSort("toggleMove")}>
            {isEditable ? "Lock Icons" : "Rearrange Icons"}
          </li>
        </ul>
      )}
    </div>
  )
}
