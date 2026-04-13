import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './TeamPage.css';

const teamMembers = [
  {
    name: "Piyush Pratap Singh",
    role: "Project Lead",
    github: "https://github.com/piyushsingh67/",
    linkedin: "https://www.linkedin.com/in/piyushpratapsingh9124/",
    contributions: [
      "Worked on core architecture",
      "Designed the AI integration pipeline",
      "Managed the project schedule"
    ]
  },
  {
    name: "Aniket Raj",
    role: "Creative Lead",
    github: "https://github.com/theaniketraj/",
    linkedin: "https://www.linkedin.com/in/theaniketraj/",
    contributions: [
      "Built the React components",
      "Implemented responsive CSS layouts",
      "Ensured accessibility compliance"
    ]
  },
  {
    name: "Falguni Mathur",
    role: "Head of Development",
    github: "https://github.com/Falguni35/",
    linkedin: "https://www.linkedin.com/in/falguni-mathur/",
    contributions: [
      "Set up the Node.js server",
      "Created RESTful APIs",
      "Managed database schemas"
    ]
  },
  {
    name: "Shahbaz Ansari",
    role: "Data Trainer",
    github: "https://github.com/Shahbaz9832/",
    linkedin: "https://www.linkedin.com/in/shahbaz-ansari-dev/",
    contributions: [
      "Trained the initial models",
      "Fine-tuned NLP responses",
      "Evaluated model accuracy"
    ]
  },
  {
    name: "Souptik Roy",
    role: "UI/UX Designer",
    github: "https://github.com/Souptik-Roy/",
    linkedin: "https://www.linkedin.com/in/souptik-roy-95601926b/",
    contributions: [
      "Created wireframes in Figma",
      "Defined the color palette and typography",
      "Conducted user testing"
    ]
  }
];

const TeamPage = ({ onGoHome, onGoPrivacy, onGoTerms }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentTheme, toggleTheme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={`team-page ${currentTheme}`}>
      <header className="team-header">
        <button className="team-brand-btn" onClick={onGoHome}>
          <div className="landing-brand">
            <i className="fas fa-balance-scale"></i> LAWgic
          </div>
        </button>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`team-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button onClick={onGoHome} className="nav-link">Home</button>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </nav>
      </header>

      <main className="team-main">
        <div className="team-container split-layout">
          <div className="team-info-left">
            <div className="badge">The Minds Behind LAWgic</div>
            <h1 className="team-title">Meet Our <span className="highlight">Team</span></h1>
            <p className="team-subtitle">
              We are a group of 5 passionate students dedicated to bridging the gap between cutting-edge AI and the Indian Judiciary system.
            </p>
          </div>

          <div className="team-accordion-right">
            {teamMembers.map((member, index) => (
              <div key={index} className={`accordion-item ${expandedIndex === index ? 'expanded' : ''}`}>
                <button className="accordion-header" onClick={() => toggleAccordion(index)}>
                  <span className="member-name">{member.name}</span>
                  <i className={`fas fa-chevron-down accordion-icon ${expandedIndex === index ? 'rotated' : ''}`}></i>
                </button>
                <div className="accordion-body">
                  <div className="accordion-content">
                    <p className="team-role">{member.role}</p>
                    <div className="team-socials">
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="team-social-link" aria-label="GitHub">
                        <i className="fab fa-github"></i>
                      </a>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="team-social-link" aria-label="LinkedIn">
                        <i className="fab fa-linkedin"></i>
                      </a>
                    </div>
                    <ul className="team-contributions">
                      {member.contributions.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
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

export default TeamPage;
