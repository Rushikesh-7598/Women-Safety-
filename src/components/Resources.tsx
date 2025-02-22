import type React from "react"
import { motion } from "framer-motion"
import "./Resources.css"

const Resources: React.FC = () => {
  const handleEmergency = () => {
    alert("Emergency services contacted!")
  }

  const resources = [
    {
      name: "National Emergency Helpline",
      phone: "112",
      description: "24/7 Emergency Services",
    },
    {
      name: "Women's Helpline",
      phone: "1091",
      description: "24x7 Women's Helpline",
    },
    {
      name: "Domestic Violence Helpline",
      phone: "181",
      description: "Support for domestic violence victims",
    },
  ]

  return (
    <div className="resources-container">
      
      <section className="resources">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Resources
        </motion.h2>
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              className="resource-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              <h3>{resource.name}</h3>
              <p className="phone">{resource.phone}</p>
              <p className="description">{resource.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Resources

