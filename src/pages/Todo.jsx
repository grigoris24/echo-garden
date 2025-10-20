import { useState, useEffect } from "react"
import { FaTrash, FaPlus } from "react-icons/fa"

export default function Todo() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")

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
    setTasks([task, ...tasks])
    setNewTask("")
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">Todo List</h2>

      <form onSubmit={addTask} className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50 me-2 shadow-sm"
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
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span
                onClick={() => toggleTask(task.id)}
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                  color: task.done ? "gray" : "black",
                  cursor: "pointer",
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
    </div>
  )
}
