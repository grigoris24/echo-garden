import { useState } from "react"
import { motion } from "framer-motion"
import { FaPlus, FaMinus, FaRedo } from "react-icons/fa"

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="container py-5 text-center">
      <motion.h2
        className="mb-4 fw-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Counter
      </motion.h2>

      <motion.div
        key={count}
        className="display-1 mb-5 fw-semibold"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {count}
      </motion.div>

      <div className="d-flex justify-content-center gap-4">
        <button
          className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: "60px", height: "60px" }}
          onClick={() => setCount(count - 1)}
        >
          <FaMinus size={22} />
        </button>

        <button
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: "80px", height: "80px" }}
          onClick={() => setCount(count + 1)}
        >
          <FaPlus size={28} />
        </button>

        <button
          className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: "60px", height: "60px" }}
          onClick={() => setCount(0)}
        >
          <FaRedo size={20} />
        </button>
      </div>
    </div>
  )
}
