import { useState, useEffect } from "react"
import { FaPlus, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa"

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [notes, setNotes] = useState({})
  const [noteText, setNoteText] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("calendarNotes")
    if (saved) setNotes(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("calendarNotes", JSON.stringify(notes))
  }, [notes])

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const openDay = (day) => {
    const dateKey = `${year}-${month + 1}-${day}`
    setSelectedDate(dateKey)
    setNoteText(notes[dateKey] || "")
  }

  const saveNote = () => {
    if (!selectedDate) return
    const newNotes = { ...notes, [selectedDate]: noteText }
    setNotes(newNotes)
    setSelectedDate(null)
  }

  const deleteNote = () => {
    if (!selectedDate) return
    const newNotes = { ...notes }
    delete newNotes[selectedDate]
    setNotes(newNotes)
    setSelectedDate(null)
  }

  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
  const dateKey = `${year}-${month + 1}-${i}`
  const hasNote = Boolean(notes[dateKey])

  const today = new Date()
  const isToday =
    i === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  days.push(
    <div
      key={i}
      className={`calendar-day ${hasNote ? "has-note" : ""} ${isToday ? "today" : ""}`}
      onClick={() => openDay(i)}
    >
      <span>{i}</span>
    </div>
  )
}


  return (
  <>
    <div className="calendar-window p-3 rounded shadow" style={{ maxWidth: "900px", margin: "0 auto" }}>
     <div className="d-flex justify-content-between align-items-center mb-4">
  <button className="calendar-nav-btn" onClick={prevMonth} title="Previous Month">
    <FaChevronLeft />
  </button>

  <h4 className="m-0 text-center fw-semibold" style={{ textTransform: "capitalize" }}>
    {currentDate.toLocaleString("default", { month: "long" })} {year}
  </h4>

  <button className="calendar-nav-btn" onClick={nextMonth} title="Next Month">
    <FaChevronRight />
  </button>
</div>


      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-header">{d}</div>
        ))}
        {Array(firstDay.getDay())
          .fill(null)
          .map((_, i) => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
        {days}
      </div>
    </div>

    {selectedDate && (
      <div className="calendar-modal">
        <div className="calendar-modal-content">
          <h5>{selectedDate}</h5>
          <textarea
            className="form-control mb-2"
            rows="6"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note for this day..."
          />
          <div className="d-flex justify-content-between">
            <button className="btn btn-success btn-sm" onClick={saveNote}>
              <FaPlus /> Save
            </button>
            <button className="btn btn-danger btn-sm" onClick={deleteNote}>
              <FaTrash /> Delete
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDate(null)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)

}
