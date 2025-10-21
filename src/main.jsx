import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

import Layout from "./Layout.jsx"
import Home from "./pages/Home.jsx"
import Counter from "./pages/Counter.jsx"
import Settings from "./pages/Settings.jsx"
import Todo from "./pages/Todo.jsx"
import Calculator from "./pages/Calculator.jsx"
import SplashScreen from "./SplashScreen.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/counter", element: <Counter /> },
      { path: "/todo", element: <Todo /> },
      { path: "/calculator", element: <Calculator /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
])

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000) 
    return () => clearTimeout(timer)
  }, [])

  return loading ? <SplashScreen /> : <RouterProvider router={router} />
}

createRoot(document.getElementById("root")).render(<App />)
