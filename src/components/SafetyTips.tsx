import type React from "react"
import { motion } from "framer-motion"
import "./SafetyTips.css"

const SafetyTips: React.FC = () => {
  const handleEmergency = () => {
    alert("Emergency services contacted!")
  }

  const tips = [
    "Always be aware of your surroundings",
    "Trust your instincts",
    "Keep your phone charged and with you",
    "Share your location with trusted friends",
    "Learn basic self-defense techniques",
    "Use well-lit routes when walking alone",
    "Have emergency contacts on speed dial",
  ]

  return (
    <div className="safety-tips-container">
      <section className="safety-tips">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Safety Tips
        </motion.h2>
        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {tips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              {tip}
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </div>
  )
}

export default SafetyTips

