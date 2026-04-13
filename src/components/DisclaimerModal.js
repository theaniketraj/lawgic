import React, { useState, useEffect } from 'react';
import './DisclaimerModal.css';

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem('disclaimerAccepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="disclaimer-overlay" aria-modal="true" role="dialog">
      <div className="disclaimer-modal">
        <div className="disclaimer-header">
          <i className="fas fa-gavel" aria-hidden="true"></i>
          <h2 className="law-heading">Legal Disclaimer</h2>
        </div>
        <div className="disclaimer-content">
          <p><strong>IMPORTANT: PLEASE READ CAREFULLY</strong></p>
          <p>
            This AI-powered Judiciary Consultancy Chatbot is designed for informational and educational purposes only.
          </p>
          <ul className="disclaimer-list">
            <li>
              <strong>Not Legal Advice:</strong> The information provided by this chatbot does not constitute professional legal advice, and it should not be treated as such.
            </li>
            <li>
              <strong>No Attorney-Client Relationship:</strong> Interacting with this chatbot does not create an attorney-client relationship.
            </li>
            <li>
              <strong>Accuracy:</strong> While we strive for accuracy, laws and regulations change frequently. Always verify details with a qualified legal professional.
            </li>
            <li>
              <strong>Limitation of Liability:</strong> We are not liable for any actions taken based on the information provided by this system.
            </li>
          </ul>
          <p className="disclaimer-footer-text">
            By clicking "I Agree & Enter", you acknowledge that you have read and understood this disclaimer.
          </p>
        </div>
        <button className="disclaimer-btn" onClick={handleAccept} aria-label="Accept Legal Disclaimer">
          I Agree & Enter
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;
