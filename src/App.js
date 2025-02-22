import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header"
import Navigation from "./components/Navigation"
import Home from "./components/Home"
import SafetyTips from "./components/SafetyTips"
import Resources from "./components/Resources"
import Forum from "./components/Forum"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import EmergencyModal from "./components/EmergencyModal"
import "./App.css"

const App = () => {
  const [currentRoute, setCurrentRoute] = useState("home")
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDarkMode)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleEmergency = () => {
    setShowEmergencyModal(true)
  }

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case "home":
        return <Home />
      case "safety-tips":
        return <SafetyTips />
      case "resources":
        return <Resources />
      case "forum":
        return <Forum />
      case "contact":
        return <Contact />
      default:
        return <Home />
    }
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header />
      <Navigation onEmergency={handleEmergency} setCurrentRoute={setCurrentRoute} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentRoute()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer toggleDarkMode={toggleDarkMode} isDarkMode={darkMode} />
      <EmergencyModal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />
    </div>
  )
}

export default App

