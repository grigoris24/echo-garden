import { useState, useEffect } from "react"
import { FaTrash, FaPlus } from "react-icons/fa"
import { motion } from "framer-motion"

export default function Todo() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [draggedTask, setDraggedTask] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("tasks")
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    const task = { id: Date.now(), text: newTask.trim(), done: false }
    setTasks((prev) => [...prev, task])
    setNewTask("")
  }

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleDragStart = (task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e, overTask) => {
    e.preventDefault()
    if (draggedTask.id === overTask.id) return

    const updated = [...tasks]
    const fromIndex = updated.findIndex((t) => t.id === draggedTask.id)
    const toIndex = updated.findIndex((t) => t.id === overTask.id)
    updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, draggedTask)
    setTasks(updated)
  }

  const handleDrop = () => {
    setDraggedTask(null)
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <motion.div
        className="p-4 rounded-4 shadow-lg todo-window"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <h2 className="fw-bold mb-4 text-center">Todo List</h2>

        <form onSubmit={addTask} className="d-flex justify-content-center mb-4">
          <input
            type="text"
            className="form-control me-2 shadow-sm"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="btn btn-primary d-flex align-items-center gap-1">
            <FaPlus /> Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className="text-center text-muted">No tasks yet.</p>
        ) : (
          <ul className="list-group shadow-sm">
            {tasks.map((task) => (
              <li
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task)}
                onDragOver={(e) => handleDragOver(e, task)}
                onDrop={handleDrop}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  cursor: "grab",
                  userSelect: "none",
                  backgroundColor: draggedTask?.id === task.id ? "#f0f0f0" : "white",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  onClick={() => toggleTask(task.id)}
                  style={{
                    textDecoration: task.done ? "line-through" : "none",
                    color: task.done ? "gray" : "black",
                    cursor: "pointer",
                    flexGrow: 1,
                  }}
                >
                  {task.text}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  )
}
