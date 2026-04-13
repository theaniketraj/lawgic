import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lawgic-cookie-consent');
    if (!consent) {
      // Show banner if no consent is found
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lawgic-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('lawgic-cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-content">
        <h4><i className="fas fa-cookie-bite"></i> Cookie Consent</h4>
        <p>
          We use cookies to improve your browsing experience, provide customized legal insights, and analyze our traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies.
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          Read our <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a> for more details.
        </p>
      </div>
      <div className="cookie-consent-actions">
        <button className="cookie-btn decline-btn" onClick={handleDecline}>Decline</button>
        <button className="cookie-btn accept-btn" onClick={handleAccept}>Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;