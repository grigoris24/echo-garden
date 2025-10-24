import { useState, useEffect, useRef } from "react"
import { FaTrash, FaPlus } from "react-icons/fa"

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const titleInputRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem("notes")
    if (saved) setNotes(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      isNew: true,
    }
    setNotes([...notes, newNote]) 
    setSelectedNote(newNote)

    setTimeout(() => {
      titleInputRef.current?.focus()
    }, 50)
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id))
    if (selectedNote?.id === id) setSelectedNote(null)
  }

  const updateNote = (field, value) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNote.id ? { ...note, [field]: value, isNew: false } : note
      )
    )
    setSelectedNote((prev) => ({ ...prev, [field]: value, isNew: false }))
  }

  const handleTitleFocus = () => {
    if (selectedNote?.isNew && selectedNote.title === "Untitled Note") {
      updateNote("title", "")
    }
  }

  const handleDescriptionChange = (e) => {
    updateNote("content", e.target.value)
  }

  return (
    <div
      className="notes-window p-3 rounded shadow"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">My Notes</h4>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-2"
          onClick={addNote}
        >
          <FaPlus /> New Note
        </button>
      </div>

      <div className="d-flex" style={{ minHeight: "60vh" }}>
        <div
          className="border-end pe-2"
          style={{ width: "35%", overflowY: "auto" }}
        >
          {notes.length === 0 && <div className="text-muted">No notes yet</div>}
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-2 rounded mb-2 ${
                selectedNote?.id === note.id
                  ? "bg-primary text-white"
                  : "bg-light"
              }`}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => setSelectedNote(note)}
            >
              <span className="text-truncate" style={{ maxWidth: "80%" }}>
                {note.title || "Untitled"}
              </span>
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNote(note.id)
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
        </div>

        <div className="flex-grow-1 ps-3">
          {selectedNote ? (
            <>
              <input
                ref={titleInputRef}
                type="text"
                className="form-control mb-2"
                value={selectedNote.title}
                onFocus={handleTitleFocus}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="Note title..."
              />
              <textarea
                className="form-control"
                style={{ height: "55vh" }}
                value={selectedNote.content}
                onChange={handleDescriptionChange}
                placeholder="Write something..."
              />
            </>
          ) : (
            <div className="text-muted mt-5 text-center">
              Select or create a note to edit
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
