import type React from "react"
import { motion } from "framer-motion"
import "./Forum.css"

const Forum: React.FC = () => {
  const handleEmergency = () => {
    alert("Emergency services contacted!")
  }

  return (
    <div className="forum-container">
      <section className="forum">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Community Forum
        </motion.h2>
        <div className="forum-content">
          <p>Connect with others and share experiences in a safe environment.</p>
          <motion.button className="join-forum-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Join Forum Discussion
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default Forum

