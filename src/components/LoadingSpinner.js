import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  text = null,
  inline = false,
}) => {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  };

  const colorClasses = {
    primary: "spinner-primary",
    secondary: "spinner-secondary",
    white: "spinner-white",
    accent: "spinner-accent",
  };

  return (
    <div className={`loading-spinner ${inline ? "inline" : ""}`}>
      <div
        className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      >
        <div className="spinner-inner"></div>
      </div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
