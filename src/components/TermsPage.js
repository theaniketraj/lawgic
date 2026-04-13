import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './TermsPage.css';

const TermsPage = ({ onGoHome, onStartChat, onGoPrivacy, onGoTerms }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentTheme, toggleTheme } = useTheme();

  return (
    <div className={`terms-page ${currentTheme}`}>
      <header className="terms-header">
        <button className="terms-brand-btn" onClick={onGoHome}>
          <div className="landing-brand">
            <i className="fas fa-balance-scale"></i> LAWgic
          </div>
        </button>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`terms-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button onClick={onGoHome} className="nav-link">Home</button>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </nav>
      </header>

      <main className="terms-main">
        <div className="terms-container">
          <div className="terms-title-section">
            <div className="badge">Legal Agreements</div>
            <h1 className="terms-title">Terms of <span className="highlight">Service</span></h1>
            <p className="terms-subtitle">
              Please read these terms carefully before accessing the LAWgic platform and services.
            </p>
          </div>

          <div className="terms-content">
            <section className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By creating an account, accessing, or utilizing the LAWgic services, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our services.
              </p>
            </section>

            <section className="terms-section">
              <h2>2. No Legal Advice Disclaimer</h2>
              <p>
                LAWgic is an Artificial Intelligence software application, not a law firm or a substitute for an attorney or law firm. All forms, documents, guidance, reasoning, and information provided are for informational and preparatory purposes. Our communications and the generations by LAWgic do not constitute professional legal advice and you should not rely on them as such. Use of the service does not create an attorney-client relationship. You must consult a qualified legal practitioner before acting on any generated drafts or legal reasoning.
              </p>
            </section>

            <section className="terms-section">
              <h2>3. User Responsibilities</h2>
              <p>
                You bear the sole responsibility for evaluating the accuracy, completeness, legality, and usefulness of all responses, guidance, and documents generated. You agree that you will not use LAWgic for any unlawful purpose, to harass any person, to violate the legal rights of any third party, or to misuse the Indian Judiciary systems.
              </p>
            </section>

            <section className="terms-section">
              <h2>4. Intellectual Property</h2>
              <p>
                The LAWgic platform, its proprietary AI models, its underlying codebase, UI/UX architecture, domain structures, and software are the exclusive intellectual property of its creators. The generated legal drafts and text output triggered by your specific prompts hold shared contextual rights dictated by applicable copyright laws, provided the usage remains strictly lawful.
              </p>
            </section>

            <section className="terms-section">
              <h2>5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, LAWgic and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, or data, resulting from the use or inability to use the platform, or the reliance on AI-generated procedural or case law data.
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

export default TermsPage;