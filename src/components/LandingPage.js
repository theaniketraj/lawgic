import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './LandingPage.css';

const LandingPage = ({ onGoHome, onStartChat, onGoFAQ, onGoTeam, onGoAbout, onGoPrivacy, onGoTerms }) => {
  const { currentTheme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (action) => {
    setIsMobileMenuOpen(false);
    if (action) action();
  };

  return (
    <div className={`landing-page ${currentTheme}`}>
      <header className="landing-header">
        <button className="landing-brand-btn" onClick={onGoHome}>
          <div className="landing-brand">
            <i className="fas fa-balance-scale"></i> LAWgic
          </div>
        </button>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`landing-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#features" onClick={() => handleNavClick()}>Features</a>
          <button onClick={() => handleNavClick(onGoAbout)} className="nav-link">About</button>
          <button onClick={() => handleNavClick(onGoTeam)} className="nav-link">Team</button>
          <button onClick={() => handleNavClick(onGoFAQ)} className="nav-link">FAQ</button>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <div className="badge">Next-Gen AI Legal Tech</div>
            <h1 className="hero-title">
              Your Intelligent <span className="highlight">Legal Advisory</span> Partner
            </h1>
            <p className="hero-subtitle">
              LAWgic is an AI-powered legal reasoning engine designed to streamline case law research, drafting, and procedural guidance with exceptional accuracy and speed for legal professionals and individuals alike.
            </p>
            <div className="hero-cta">
              <button className="cta-btn primary-cta" onClick={onStartChat}>
                Start Consultation <i className="fas fa-arrow-right"></i>
              </button>
              <button onClick={onGoFAQ} className="cta-btn secondary-cta">
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glowing-circle"></div>
            <div className="glowing-circle circle-2"></div>
            <div className="abstract-ui">
              <div className="abstract-message ai">
                <i className="fas fa-balance-scale"></i>
                <div className="lines">
                  <div className="line long"></div>
                  <div className="line medium"></div>
                  <div className="line short"></div>
                </div>
              </div>
              <div className="abstract-message user">
                <i className="fas fa-user"></i>
                <div className="lines">
                  <div className="line medium"></div>
                  <div className="line short"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <h2 className="section-title">Capabilities</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-search"></i></div>
              <h3>Case Law Search</h3>
              <p>Instantly retrieve relevant Supreme Court judgments and precedents matching your distinct case context.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-file-contract"></i></div>
              <h3>Legal Drafting</h3>
              <p>Generate highly accurate first drafts of agreements, notices, and affidavits dynamically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-book"></i></div>
              <h3>BNS & Procedural Engine</h3>
              <p>Easily decode the transition from IPC to BNS and navigate complex legal procedures step-by-step.</p>
            </div>
          </div>
        </section>
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

export default LandingPage;
