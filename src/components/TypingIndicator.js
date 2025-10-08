import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import PropTypes from "prop-types";
import "./TypingIndicator.css";

const TypingIndicator = ({
  avatarUrl = null,
  showAvatar = true,
  animationType = "dots",
  size = "medium",
}) => {
  const { currentTheme } = useTheme();
  const [dots, setDots] = useState("");
  const [lipSyncPhase, setLipSyncPhase] = useState(0);

  // Animated dots for thinking text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Avatar lip sync animation
  useEffect(() => {
    if (showAvatar) {
      const interval = setInterval(() => {
        setLipSyncPhase((prev) => (prev + 1) % 3);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [showAvatar]);

  const renderDots = () => {
    return (
      <div className={`typing-dots typing-dots-${size}`}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  };

  const renderWave = () => {
    return (
      <div className={`typing-wave typing-wave-${size}`}>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
      </div>
    );
  };

  const renderPulse = () => {
    return (
      <div className={`typing-pulse typing-pulse-${size}`}>
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
      </div>
    );
  };

  const getAnimationComponent = () => {
    switch (animationType) {
      case "wave":
        return renderWave();
      case "pulse":
        return renderPulse();
      case "dots":
      default:
        return renderDots();
    }
  };

  return (
    <div
      className={`typing-indicator typing-indicator-${size} ${currentTheme}`}
    >
      {showAvatar && (
        <div className="typing-avatar-container">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="AI Avatar"
              className={`typing-avatar lip-sync-${lipSyncPhase}`}
            />
          ) : (
            <div
              className={`typing-avatar-placeholder lip-sync-${lipSyncPhase}`}
            >
              <i className="fas fa-robot"></i>
            </div>
          )}
          <div className="avatar-status-indicator">
            <div className="status-dot"></div>
          </div>
        </div>
      )}

      <div className="typing-content">
        <div className="typing-text">AI is thinking{dots}</div>

        <div className="typing-animation">{getAnimationComponent()}</div>

        <div className="typing-status">
          <i className="fas fa-brain"></i>
          <span>Processing your request</span>
        </div>
      </div>
    </div>
  );
};

TypingIndicator.propTypes = {
  avatarUrl: PropTypes.string,
  showAvatar: PropTypes.bool,
  animationType: PropTypes.oneOf(["dots", "wave", "pulse"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default TypingIndicator;
