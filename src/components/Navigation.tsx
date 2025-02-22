// Navigation.tsx
import React from "react";
import { motion } from "framer-motion";
import "./Navigation.css";

type Route = "home" | "safety-tips" | "resources" | "forum" | "contact";

interface NavigationProps {
  setCurrentRoute: (route: Route) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setCurrentRoute }) => {
  return (
    <nav className="navigation">
      <ul>
        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("home");
            }}
          >
            Home
          </a>
        </motion.li>
        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="#safety-tips"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("safety-tips");
            }}
          >
            Safety Tips
          </a>
        </motion.li>
        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="#resources"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("resources");
            }}
          >
            Resources
          </a>
        </motion.li>
        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="#forum"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("forum");
            }}
          >
            Forum
          </a>
        </motion.li>
        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRoute("contact");
            }}
          >
            Contact
          </a>
        </motion.li>
      </ul>
    </nav>
  );
};

export default Navigation;
