import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaTrash } from "react-icons/fa"

export default function Calculator() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("calcHistory")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("calcHistory", JSON.stringify(history))
  }, [history])

  const handleClick = (value) => setInput((prev) => prev + value)
  const handleClear = () => {
    setInput("")
    setResult("")
  }
  const handleDelete = () => setInput((prev) => prev.slice(0, -1))

  const handleCalculate = () => {
  try {
    const res = safeEvaluate(input)
    if (res === undefined || isNaN(res)) throw new Error()

    const rounded = Math.round((res + Number.EPSILON) * 1e9) / 1e9
    const cleaned = parseFloat(rounded.toFixed(9)).toString()

    setResult(cleaned)
    setHistory([{ expression: input, result: cleaned }, ...history.slice(0, 9)])
    setInput("")
  } catch {
    setResult("Error")
  }
}


  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("calcHistory")
  }

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ]

  const safeEvaluate = (expr) => {
    const sanitized = expr.replace(/[^0-9+\-*/().]/g, "") 

    const tokens = sanitized
      .replace(/([+\-*/()])/g, " $1 ")
      .trim()
      .split(/\s+/)

    const outputQueue = []
    const operatorStack = []

    const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 }
    const isOperator = (t) => ["+", "-", "*", "/"].includes(t)

    tokens.forEach((token) => {
      if (!isNaN(parseFloat(token))) {
        outputQueue.push(parseFloat(token))
      } else if (isOperator(token)) {
        while (
          operatorStack.length &&
          isOperator(operatorStack[operatorStack.length - 1]) &&
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
        ) {
          outputQueue.push(operatorStack.pop())
        }
        operatorStack.push(token)
      } else if (token === "(") {
        operatorStack.push(token)
      } else if (token === ")") {
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          outputQueue.push(operatorStack.pop())
        }
        operatorStack.pop()
      }
    })

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop())
    }

    const stack = []
    outputQueue.forEach((token) => {
      if (typeof token === "number") {
        stack.push(token)
      } else {
        const b = stack.pop()
        const a = stack.pop()
        switch (token) {
          case "+": stack.push(a + b); break
          case "-": stack.push(a - b); break
          case "*": stack.push(a * b); break
          case "/": stack.push(a / b); break
        }
      }
    })

    return stack.pop()
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <motion.div
        className="p-4 rounded-4 shadow-lg calculator-window"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "800px" }}
      >
        <h2 className="fw-bold mb-4 text-center">Calculator</h2>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="p-3 rounded-3 bg-white bg-opacity-75 shadow-sm h-100">
              <div className="form-control text-end mb-3 fs-4 bg-light-subtle border-0">
                {input || "0"}
              </div>
              <div className="text-end text-muted mb-2">{result}</div>

              <div className="d-grid gap-2">
                <div className="d-flex gap-2 mb-2">
                  <button className="btn btn-secondary flex-fill" onClick={handleClear}>C</button>
                  <button className="btn btn-secondary flex-fill" onClick={handleDelete}>DEL</button>
                </div>

                <div className="d-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                  {buttons.map((btn, i) => (
                    <button
                      key={i}
                      className={`btn ${btn === "=" ? "btn-primary" : "btn-outline-dark"}`}
                      onClick={() => (btn === "=" ? handleCalculate() : handleClick(btn))}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 rounded-3 bg-white bg-opacity-75 shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">History</h5>
                {history.length > 0 && (
                  <button className="btn btn-sm btn-outline-danger" onClick={clearHistory}>
                    <FaTrash />
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-muted">No calculations yet.</p>
              ) : (
                <ul className="list-group list-group-flush flex-grow-1 overflow-auto">
                  {history.map((h, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between bg-transparent border-0 border-bottom"
                    >
                      <span>{h.expression}</span>
                      <strong>{h.result}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
