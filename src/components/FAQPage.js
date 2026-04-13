import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './FAQPage.css';

const FAQPage = ({ onGoHome, onStartChat, onGoPrivacy, onGoTerms }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentTheme, toggleTheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0); // first item open by default

  const faqs = [
    {
      question: "What is LAWgic?",
      answer: "LAWgic is an advanced AI-powered legal advisory and reasoning engine. It streamlines case law research, draft generation, and procedural legal guidance tailored to the Indian Judiciary system."
    },
    {
      question: "Does LAWgic provide legal advice?",
      answer: "No. LAWgic is an AI tool and its responses do not constitute professional legal advice or establish an attorney-client relationship. You should always consult a qualified legal practitioner before making any legal decisions."
    },
    {
      question: "How current is the case law database?",
      answer: "Our database is continuously updated with the latest Supreme Court and High Court judgments, ensuring you have near real-time access to the most prominent legal precedents."
    },
    {
      question: "Can LAWgic draft legal documents?",
      answer: "Yes, LAWgic can generate highly accurate first drafts of agreements, notices, affidavits, and other standard procedural documents based on the inputs you provide."
    },
    {
      question: "Is my data secure and confidential?",
      answer: "Absolutely. We employ enterprise-grade encryption for all interactions. Your chat context and generated documents are strictly confidential and are never used to train generalized models without direct consent."
    },
    {
      question: "How does the BNS & Procedural Engine work?",
      answer: "The procedural engine cross-references the old IPC sections with the new Bhartiya Nyaya Sanhita (BNS) providing side-by-side transition explanations, as well as step-by-step guidance for filing FIRs, RTIs, and Complaints."
    }
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`faq-page ${currentTheme}`}>
      {/* Header matching LandingPage style */}
      <header className="faq-header">
        <button className="faq-brand-btn" onClick={onGoHome}>
          <div className="landing-brand">
            <i className="fas fa-balance-scale"></i> LAWgic
          </div>
        </button>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`faq-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button onClick={onGoHome} className="nav-link">Home</button>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </nav>
      </header>

      <main className="faq-main">
        <div className="faq-container">
          <div className="faq-title-section">
            <div className="badge">Knowledge Base</div>
            <h1 className="faq-title">Frequently Asked <span className="highlight">Questions</span></h1>
            <p className="faq-subtitle">
              Everything you need to know about LAWgic and how it empowers your legal workflow.
            </p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleToggle(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <div className="faq-icon">
                    <i className={`fas fa-chevron-${activeIndex === index ? 'up' : 'down'}`}></i>
                  </div>
                </div>
                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-cta-section">
            <h3>Still have questions?</h3>
            <p>Our intelligent system is ready to assist you directly.</p>
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

export default FAQPage;