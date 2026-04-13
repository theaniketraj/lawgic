import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './AboutPage.css';

const AboutPage = ({ onGoHome, onStartChat, onGoPrivacy, onGoTerms }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentTheme, toggleTheme } = useTheme();

  return (
    <div className={`about-page ${currentTheme}`}>
      <header className="about-header">
        <button className="about-brand-btn" onClick={onGoHome}>
          <div className="landing-brand">
            <i className="fas fa-balance-scale"></i> LAWgic
          </div>
        </button>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`about-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button onClick={onGoHome} className="nav-link">Home</button>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </nav>
      </header>

      <main className="about-main">
        <div className="about-container">
          <div className="about-title-section">
            <div className="badge">Our Vision</div>
            <h1 className="about-title">Why We Built <span className="highlight">LAWgic</span></h1>
            <p className="about-subtitle">
              Revolutionizing legal accessibility and empowering professionals through Artificial Intelligence.
            </p>
          </div>

          <div className="about-content">
            <section className="about-section">
              <h2>The Problem</h2>
              <p>
                The Indian Judiciary system is robust and vast, but navigating millions of case laws, understanding complex precedences, and manually drafting procedural documents is time-consuming and often overwhelming. Routine administrative tasks subtract from the valuable time lawyers could spend strategizing and advocating for their clients. For the average individual, the legal system can feel opaque and inaccessible.
              </p>
            </section>

            <section className="about-section">
              <h2>Our Solution</h2>
              <p>
                LAWgic employs state-of-the-art Natural Language Processing (NLP) designed explicitly around Indian legal terminology, penal codes (including the IPC to BNS transition), and standard procedures. By transforming thousands of hours of manual research into a streamlined, conversational interface, we provide an intelligent tool that instantly fetches relevant case law, generates precise first drafts, and offers straightforward analytical insights.
              </p>
            </section>

            <section className="about-section">
              <h2>Core Ethics</h2>
              <ul>
                <li><strong>Accuracy & Citations:</strong> Our models strictly reference established Supreme Court data to prevent AI hallucinations.</li>
                <li><strong>Privacy First:</strong> We believe in attorney-client privilege. Your inputs are encrypted and never persist beyond your session without your consent.</li>
                <li><strong>Empowerment, Not Replacement:</strong> LAWgic is built to assist, not replace, human legal expertise. The human lawyer maintains total command, enhanced by digital speed.</li>
              </ul>
            </section>
          </div>

          <div className="about-cta-section">
            <h3>Experience the future of legal tech</h3>
            <button className="cta-btn primary-cta" onClick={onStartChat}>
              Start Consultation <i className="fas fa-arrow-right"></i>
            </button>
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

export default AboutPage;