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
      <div className="toast-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="toast-icon">{getIcon()}</span>
          <span className="toast-message">{message}</span>
        </div>
        <button 
          className="toast-dismiss-btn" 
          onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.6, marginLeft: '10px', fontSize: '1.2em' }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
