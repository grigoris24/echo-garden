import { useState, useEffect, useRef } from "react"
import { FaRedo, FaPlay } from "react-icons/fa"

export default function Snake() {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }])
  const [food, setFood] = useState({ x: 12, y: 12 })
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 })
  const [speed, setSpeed] = useState(150)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const boardSize = 20
  const intervalRef = useRef(null)

  const touchStart = useRef({ x: 0, y: 0 })
  const touchEnd = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const savedHigh = localStorage.getItem("snakeHighScore")
    if (savedHigh) setHighScore(Number(savedHigh))
  }, [])

  const getRandomPosition = () => ({
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  })

  const moveSnake = () => {
    setSnake((prev) => {
      const newSnake = [...prev]
      const head = {
        x: newSnake[0].x + nextDirection.x,
        y: newSnake[0].y + nextDirection.y,
      }

      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= boardSize ||
        head.y >= boardSize ||
        newSnake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        setIsGameOver(true)
        setIsRunning(false)

        if (score > highScore) {
          setHighScore(score)
          localStorage.setItem("snakeHighScore", score)
        }

        return prev
      }

      newSnake.unshift(head)
      setDirection(nextDirection)

      if (head.x === food.x && head.y === food.y) {
        setFood(getRandomPosition())
        setScore((s) => s + 1)
        if (speed > 60) setSpeed((sp) => sp - 5)
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }

  useEffect(() => {
    if (!isRunning || isGameOver) return
    intervalRef.current = setInterval(moveSnake, speed)
    return () => clearInterval(intervalRef.current)
  }, [nextDirection, speed, isRunning, isGameOver])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isRunning || isGameOver) return
      handleDirection(e.key)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [direction, isRunning, isGameOver, nextDirection])

  const handleDirection = (key) => {
    if (!isRunning || isGameOver) return
    let newDir = nextDirection
    switch (key) {
      case "ArrowUp":
        if (direction.y !== 1) newDir = { x: 0, y: -1 }
        break
      case "ArrowDown":
        if (direction.y !== -1) newDir = { x: 0, y: 1 }
        break
      case "ArrowLeft":
        if (direction.x !== 1) newDir = { x: -1, y: 0 }
        break
      case "ArrowRight":
        if (direction.x !== -1) newDir = { x: 1, y: 0 }
        break
      default:
        break
    }
    setNextDirection(newDir)
  }

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0]
    touchEnd.current = { x: touch.clientX, y: touch.clientY }

    const dx = touchEnd.current.x - touchStart.current.x
    const dy = touchEnd.current.y - touchStart.current.y

    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) handleDirection("ArrowRight")
      else handleDirection("ArrowLeft")
    } else {
      if (dy > 0) handleDirection("ArrowDown")
      else handleDirection("ArrowUp")
    }

    if ("vibrate" in navigator) navigator.vibrate(20)
  }

  const startGame = () => {
    setSnake([{ x: 8, y: 8 }])
    setFood({ x: 12, y: 12 })
    setDirection({ x: 1, y: 0 })
    setNextDirection({ x: 1, y: 0 })
    setSpeed(150)
    setScore(0)
    setIsGameOver(false)
    setIsRunning(true)
  }

  return (
    <div
      className="snake-window p-3 rounded shadow text-center"
      style={{
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto",
        background: "rgba(255,255,255,0.9)",
        borderRadius: "10px",
        userSelect: "none",
      }}
    >
      <h3 className="mb-3">Snake</h3>

      <div
        className="snake-board mx-auto"
        style={{
          width: "90%",
          maxWidth: "360px",
          aspectRatio: "1 / 1",
          background: "rgba(255,255,255,0.8)",
          border: "2px solid #222",
          display: "grid",
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          backgroundColor: "#f8f9fa",
          boxSizing: "border-box",
          margin: "0 auto",
          overflow: "hidden",
          touchAction: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, index) => {
          const x = index % boardSize
          const y = Math.floor(index / boardSize)
          const isSnake = snake.some((s) => s.x === x && s.y === y)
          const isHead = snake[0].x === x && snake[0].y === y
          const isFood = food.x === x && food.y === y
          return (
            <div
              key={index}
              style={{
                backgroundColor: isHead
                  ? "#0041c2"
                  : isSnake
                  ? "#0d6efd"
                  : isFood
                  ? "#dc3545"
                  : "#fff",
                transition: "background-color 0.1s",
              }}
            />
          )
        })}
      </div>

      <div className="mt-3">
        <h6>Use keyboard arrows or swipe screen</h6>
        <h5>Score: {score}</h5>
        <h6 className="text-muted">High Score: {highScore}</h6>
        {isGameOver && <div className="text-danger fw-bold mt-2">Game Over!</div>}
      </div>

      {!isRunning && !isGameOver && (
        <button
          onClick={startGame}
          className="btn btn-success btn-sm mt-3 d-flex align-items-center gap-2 mx-auto"
        >
          <FaPlay /> Start
        </button>
      )}

      {isGameOver && (
        <button
          onClick={startGame}
          className="btn btn-primary btn-sm mt-3 d-flex align-items-center gap-2 mx-auto"
        >
          <FaRedo /> Restart
        </button>
      )}
    </div>
  )
}
