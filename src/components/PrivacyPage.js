import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './PrivacyPage.css';

const PrivacyPage = ({ onGoHome, onStartChat, onGoPrivacy, onGoTerms }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentTheme, toggleTheme } = useTheme();

  return (
    <div className={`privacy-page ${currentTheme}`}>
      <header className="privacy-header">
        <button className="privacy-brand-btn" onClick={onGoHome}>
          <div className="landing-brand">
            <i className="fas fa-balance-scale"></i> LAWgic
          </div>
        </button>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`privacy-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button onClick={onGoHome} className="nav-link">Home</button>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </nav>
      </header>

      <main className="privacy-main">
        <div className="privacy-container">
          <div className="privacy-title-section">
            <div className="badge">Legal Information</div>
            <h1 className="privacy-title">Privacy <span className="highlight">Policy</span></h1>
            <p className="privacy-subtitle">
              Your data security and confidentiality are our highest priorities.
            </p>
          </div>

          <div className="privacy-content">
            <section className="privacy-section">
              <h2>1. Information We Collect</h2>
              <p>
                When you use LAWgic, we may collect information regarding your usage of the platform, including input queries, documents analyzed, and interaction metadata. We collect the minimum amount of information necessary to provide you with accurate legal reasoning and drafting services.
              </p>
            </section>

            <section className="privacy-section">
              <h2>2. How We Use Your Information</h2>
              <p>
                Your information is used solely to generate responses, legal drafts, and provide procedural guidance. We do not use your confidential case data or queries to train generalized language models without your explicit consent. Your data remains yours.
              </p>
            </section>

            <section className="privacy-section">
              <h2>3. Data Security & Encryption</h2>
              <p>
                We employ enterprise-grade encryption (TLS 1.3 in transit, AES-256 at rest) to secure all interactions. All data processing occurs in secure, isolated environments ensuring that attorney-client privilege and sensitive case details are rigorously protected.
              </p>
            </section>

            <section className="privacy-section">
              <h2>4. Third-Party Sharing</h2>
              <p>
                We do not sell, rent, or share your personal information or case data with third parties for marketing purposes. Data may be processed by trusted infrastructure providers strictly under confidentiality agreements that comply with applicable data protection laws.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="brand-col">
            <button className="footer-brand-btn" onClick={onGoHome}>
              <h3><i className="fas fa-balance-scale"></i> LAWgic</h3>
            </button>
            <p>Empowering the Indian Judiciary with intelligent logic systems.</p>
          </div>
          <div className="links-col">
            <h4>Projects</h4>
            <a href="https://plastecure.netlify.app/" target="_blank" rel="noopener noreferrer" className="link-btn">Plastecure</a>
            <a href="https://raptorai.netlify.app/" target="_blank" rel="noopener noreferrer" className="link-btn">Raptor</a>
          </div>
          <div className="links-col">
            <h4>Legal</h4>
            <button className="link-btn" onClick={onGoPrivacy}>Privacy Policy</button>
            <button className="link-btn" onClick={onGoTerms}>Terms of Service</button>
          </div>
        </div>
        <div className="disclaimer-bar">
          <p><strong>Disclaimer:</strong> LAWgic is an AI tool and does not constitute professional legal advice. Consult a qualified legal practitioner before making any legal decisions.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;