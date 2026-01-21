import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "./WelcomeScreen.css";

const WelcomeScreen = ({ show }) => {
  const [showTagline, setShowTagline] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (show) {
      // Show tagline after a delay
      const timer = setTimeout(() => {
        setShowTagline(true);
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    } else {
      setShowTagline(false);
    }
  }, [show]);

  return (
    <div
      className="welcome-screen"
      style={{ background: theme.colors.welcomeBg }}
    >
      <div className="welcome-content">
        <h1 className="brand-title">
          <i className="fas fa-balance-scale" style={{ marginRight: '15px' }}></i>
          LAWGic
        </h1>
        <p className={`tagline ${showTagline ? "visible" : ""}`}>
          Legal Advisory Workflow using General Intelligence Chatbot
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
