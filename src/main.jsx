import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

import Layout from "./Layout.jsx"
import Home from "./pages/Home.jsx"
import Counter from "./pages/Counter.jsx"
import Settings from "./pages/Settings.jsx"
import Todo from "./pages/Todo.jsx"
import Calculator from "./pages/Calculator.jsx"
import SplashScreen from "./SplashScreen.jsx"
import Notes from "./pages/Notes.jsx"
import Calendar from "./pages/Calendar.jsx"
import TicTacToe from "./pages/TicTacToe.jsx"
import Snake from "./pages/Snake.jsx"
import Welcome from "./pages/Welcome.jsx"

const router = createBrowserRouter(
  [
    { path: "/welcome", element: <Welcome /> },
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "counter", element: <Counter /> },
        { path: "todo", element: <Todo /> },
        { path: "calculator", element: <Calculator /> },
        { path: "notes", element: <Notes /> },
        { path: "settings", element: <Settings /> },
        { path: "calendar", element: <Calendar /> },
        { path: "tictactoe", element: <TicTacToe /> },
        { path: "snake", element: <Snake /> },
      ],
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_PATH || "/",
  }
)

function App() {
  const [loading, setLoading] = useState(true)
  const [firstVisit, setFirstVisit] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    setFirstVisit(!hasVisited)

    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <SplashScreen />

  if (!loading && firstVisit && window.location.pathname !== "/welcome") {
    return <Navigate to="/welcome" replace />
  }

  return <RouterProvider router={router} />
}

createRoot(document.getElementById("root")).render(<App />)
