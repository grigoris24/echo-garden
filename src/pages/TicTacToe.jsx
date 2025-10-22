import { useState } from "react"
import { FaRedo, FaTimes, FaRegCircle } from "react-icons/fa"

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)

  const handleClick = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? "X" : "O"
    setBoard(newBoard)
    setIsXNext(!isXNext)
    checkWinner(newBoard)
  }

  const checkWinner = (b) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        setWinner(b[a])
        return
      }
    }
    if (b.every(Boolean)) setWinner("draw")
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
  }

  return (
    <div className="tic-tac-toe-window p-3 rounded shadow text-center" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h3 className="mb-3">Tic Tac Toe</h3>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gridTemplateRows: "repeat(3, 100px)",
          gap: "8px",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="cell d-flex justify-content-center align-items-center bg-light border border-dark rounded"
            style={{
              cursor: winner ? "default" : "pointer",
              fontSize: "2rem",
              color: cell === "X" ? "#dc3545" : "#0d6efd",
            }}
          >
            {cell === "X" ? <FaTimes /> : cell === "O" ? <FaRegCircle /> : ""}
          </div>
        ))}
      </div>

      <div className="mt-4">
        {winner ? (
          winner === "draw" ? (
            <h5 className="text-secondary">It’s a Draw!</h5>
          ) : (
            <h5 className="text-success">{winner} Wins!</h5>
          )
        ) : (
          <h6 className="text-muted">Turn: {isXNext ? "X" : "O"}</h6>
        )}
      </div>

      <button
        onClick={resetGame}
        className="btn btn-primary btn-sm mt-3 d-flex align-items-center gap-2 mx-auto"
      >
        <FaRedo /> Restart
      </button>
    </div>
  )
}
