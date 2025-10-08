import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "./Toast.css";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <i className="fas fa-check-circle"></i>;
      case "error":
        return <i className="fas fa-times-circle"></i>;
      case "warning":
        return <i className="fas fa-exclamation-triangle"></i>;
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };

  return (
    <div
      className={`toast ${type} ${isVisible ? "visible" : "hidden"}`}
      data-theme={theme.name}
    >
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
